"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, type Transition } from "framer-motion";
import { useGame, fmt } from "@/lib/store";
import { CURRENCY, recordResult } from "@/lib/types";
import {
  buildWedges,
  cellColor,
  CHIP_VALUES,
  computeReturn,
  nextWheelRotation,
  randomBallAngle,
  spinWheel,
  type Bets,
  type BetKey,
  type BetZonePos,
  zoneToKey,
} from "@/lib/roulette";
import { Confetti } from "@/components/Confetti";

const SPIN_DURATION = 10;

export function RouletteGame() {
  const { active, updatePlayer, playSfx, pushToast } = useGame();
  const wedges = useMemo(() => buildWedges(), []);

  const [bets, setBets] = useState<Bets>({});
  const [chip, setChip] = useState(CHIP_VALUES[1]);
  const [spinning, setSpinning] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [result, setResult] = useState<number | null>(null);
  const [winNumber, setWinNumber] = useState<number | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [rot, setRot] = useState(0);
  const [ballRot, setBallRot] = useState(0);
  const [ballLanded, setBallLanded] = useState(false);
  const rotRef = useRef(0);
  const ballRef = useRef(0);
  const timeouts = useRef<number[]>([]);

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  if (!active) return null;

  const totalBet = Object.values(bets)
    .filter((v): v is number => typeof v === "number")
    .reduce((a, b) => a + b, 0);
  const usableBalance = spinning ? active.balance : active.balance - totalBet;

  const placeBet = (zone: BetZonePos) => {
    if (spinning) return;
    const key = zoneToKey(zone);
    const next = totalBet + chip;
    if (next > active.balance) {
      playSfx("no");
      pushToast("Saldo insuficiente para essa aposta.", "lose");
      return;
    }
    setBets((b) => ({ ...b, [key]: (b[key] || 0) + chip }));
    playSfx("chip");
  };

  const clearBets = () => {
    if (spinning) return;
    setBets({});
    playSfx("click");
  };

  const spin = () => {
    if (spinning) return;
    if (totalBet <= 0) {
      playSfx("no");
      pushToast("Coloque uma aposta antes de girar.", "lose");
      return;
    }
    if (totalBet > active.balance) {
      playSfx("no");
      pushToast("Saldo insuficiente.", "lose");
      return;
    }

    const win = spinWheel();
    const currentBets = { ...bets } as Bets;
    const stake = totalBet!;
    const target = nextWheelRotation(rotRef.current, win);
    rotRef.current = target;

    const ballTarget = -randomBallAngle();
    ballRef.current = ballTarget;

    const ret = computeReturn(currentBets, win);
    const profit = ret - stake;
    const won = ret > 0;

    // Assenta o resultado 100% no início: se sair da tela ou recarregar no
    // meio da animação, o saldo e as estatísticas já estão corretos.
    updatePlayer(active.id, (p) => ({
      ...p,
      balance: p.balance - stake + ret,
      stats: recordResult(p.stats, won, profit, ret, stake),
    }));
    setBets({});
    setResult(null);
    setWinNumber(null);
    setSpinning(true);
    setBallLanded(false);
    setRot(target);
    setBallRot(ballTarget);
    playSfx("spin");

    const tickTimes = [5200, 5800, 6500, 7300, 8200, 9100, 9600];
    tickTimes.forEach((t) => {
      timeouts.current.push(window.setTimeout(() => playSfx("tick"), t));
    });

    timeouts.current.push(
      window.setTimeout(() => setBallLanded(true), 9300),
    );

    timeouts.current.push(
      window.setTimeout(() => {
        setResult(win);
        setWinNumber(win);
        setHistory((h) => [win, ...h].slice(0, 14));
        setSpinning(false);

        if (ret > 0) {
          playSfx(ret >= stake * 10 ? "jackpot" : "win");
          setCelebrate(true);
          timeouts.current.push(window.setTimeout(() => setCelebrate(false), 3200));
          pushToast(
            `🎡 Roleta: ${win} ${colorName(win)} · +${fmt(ret)} ${CURRENCY}!`,
            "win",
          );
        } else {
          playSfx("lose");
          pushToast(
            `Roleta: ${win} ${colorName(win)}. Nenhuma aposta premiada.`,
            "lose",
          );
        }

        timeouts.current.push(
          window.setTimeout(() => setBallLanded(false), 1600),
        );
        timeouts.current.push(
          window.setTimeout(() => setWinNumber(null), 4000),
        );
      }, (SPIN_DURATION + 0.2) * 1000),
    );
  };

  const colorName = (n: number) =>
    n === 0 ? "ZERO" : cellColor(n) === "red" ? "VERMELHO" : "PRETO";

const wheelTransition: Transition = spinning
  ? { duration: SPIN_DURATION, ease: [0.15, 0.75, 0.2, 1] }
  : { duration: 0 };

const ballTransition: Transition = spinning
  ? { duration: SPIN_DURATION, ease: [0.4, 0, 0.2, 1] }
  : { duration: 0.3 };

  return (
    <>
      {celebrate ? <Confetti /> : null}

      <div className="roulette-layout">
        <div className="flex-col" style={{ gap: 14 }}>
          <div
            className={`wheel-wrap panel ${spinning ? "spinning" : ""}`}
            style={{ padding: 18 }}
          >
            <div className="wheel-box">
              <div className="wheel-marker" />
              <svg className="wheel-svg" viewBox="0 0 400 400">
                <motion.g
                  animate={{ rotate: rot }}
                  style={{ transformOrigin: "200px 200px" }}
                  transition={wheelTransition}
                >
                  {wedges.map((w) => (
                    <g key={w.number}>
                      <path
                        d={w.path}
                        fill={w.colorHex}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth={0.5}
                      />
                      <text
                        x={w.labelX}
                        y={w.labelY}
                        fontSize="13"
                        fontWeight="800"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#fff"
                        transform={`rotate(${w.labelDeg} ${w.labelX} ${w.labelY})`}
                      >
                        {w.number}
                      </text>
                    </g>
                  ))}
                </motion.g>
                <circle
                  cx="200"
                  cy="200"
                  r="200"
                  fill="none"
                  stroke="var(--border2)"
                  strokeWidth="10"
                />
              </svg>
              <motion.div
                className="wheel-ball"
                animate={{
                  rotate: ballRot,
                  y: ballLanded ? [0, -5, 2, -2, 0] : 0,
                }}
                transition={
                  ballLanded
                    ? { duration: 0.5, ease: "easeInOut" }
                    : ballTransition
                }
              >
                <div className="wheel-ball-dot" />
              </motion.div>
              <div className="wheel-center">🦜</div>
            </div>

            {result !== null ? (
              <div className="result-banner pop-in">
                <span
                  className={
                    "pill " +
                    (cellColor(result) === "red"
                      ? "pill-red"
                      : cellColor(result) === "green"
                        ? "pill-green"
                        : "pill-black")
                  }
                >
                  {result} · {colorName(result)}
                </span>
              </div>
            ) : (
              <div className="result-banner muted" style={{ fontSize: 17 }}>
                {spinning
                  ? "🔴 A bola gira..."
                  : "Clique nos números e na mesa para apostar"}
              </div>
            )}

            {history.length > 0 ? (
              <div className="history-strip">
                {history.map((n, i) => (
                  <span
                    key={`${n}-${i}`}
                    className="hist-ball"
                    style={{
                      background:
                        cellColor(n) === "red"
                          ? "#dc2626"
                          : cellColor(n) === "green"
                            ? "#16a34a"
                            : "#1e293b",
                      color:
                        cellColor(n) === "black" ? "#e2e8f0" : "#fff",
                      border:
                        i === 0
                          ? "2px solid var(--gold)"
                          : "2px solid rgba(255,255,255,0.15)",
                      animationDelay: `${i * 40}ms`,
                    }}
                  >
                    {n}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="bet-area">
          <div className="row space-between" style={{ flexWrap: "nowrap" }}>
            <div className="flex-col" style={{ gap: 6 }}>
              <div className="balance-pill" style={{ fontSize: 13 }}>
                <span className="cur-icon">{CURRENCY}</span>
                <span>{fmt(usableBalance)}</span>
                <span className="cur-label">saldo</span>
              </div>
              {totalBet > 0 ? (
                <div className="tiny">
                  Apostado: {fmt(totalBet)} {CURRENCY}
                </div>
              ) : null}
            </div>

            <div className="flex-col" style={{ gap: 6 }}>
              <div className="tiny" style={{ textAlign: "right" }}>
                Valor da ficha
              </div>
              <div className="chip-select">
                {CHIP_VALUES.map((v) => (
                  <button
                    key={v}
                    className={"chip" + (chip === v ? " selected" : "")}
                    onClick={() => {
                      if (spinning) return;
                      setChip(v);
                      playSfx("click");
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bet-panel">
            <h4>Apostas externas · pagam 1x a 2x</h4>
            <div className="row" style={{ gap: 8 }}>
              <button
                className={`bet-zone zone-red ${bets["c:red"] ? "has-bet" : ""}`}
                onClick={() => placeBet({ kind: "color", color: "red" })}
              >
                <span>Vermelho</span>
                <BetStack bets={bets} k="c:red" />
              </button>
              <button
                className={`bet-zone zone-black ${bets["c:black"] ? "has-bet" : ""}`}
                onClick={() => placeBet({ kind: "color", color: "black" })}
              >
                <span>Preto</span>
                <BetStack bets={bets} k="c:black" />
              </button>
              <button
                className={`bet-zone zone-green ${bets["c:green"] ? "has-bet" : ""}`}
                onClick={() => placeBet({ kind: "color", color: "green" })}
              >
                <span>Zero 0</span>
                <BetStack bets={bets} k="c:green" />
              </button>
            </div>
            <div className="row" style={{ gap: 8, marginTop: 8 }}>
              <button
                className={`bet-zone zone-outside ${bets["low"] ? "has-bet" : ""}`}
                onClick={() => placeBet({ kind: "low" })}
              >
                <span>1–18</span>
                <BetStack bets={bets} k="low" />
              </button>
              <button
                className={`bet-zone zone-outside ${bets["even"] ? "has-bet" : ""}`}
                onClick={() => placeBet({ kind: "even" })}
              >
                <span>Par</span>
                <BetStack bets={bets} k="even" />
              </button>
              <button
                className={`bet-zone zone-outside ${bets["odd"] ? "has-bet" : ""}`}
                onClick={() => placeBet({ kind: "odd" })}
              >
                <span>Ímpar</span>
                <BetStack bets={bets} k="odd" />
              </button>
              <button
                className={`bet-zone zone-outside ${bets["high"] ? "has-bet" : ""}`}
                onClick={() => placeBet({ kind: "high" })}
              >
                <span>19–36</span>
                <BetStack bets={bets} k="high" />
              </button>
            </div>
            <div className="row" style={{ gap: 8, marginTop: 8 }}>
              {([1, 2, 3] as const).map((d) => (
                <button
                  key={d}
                  className={`bet-zone zone-outside ${bets[`d:${d}`] ? "has-bet" : ""}`}
                  onClick={() => placeBet({ kind: "dozen", n: d })}
                >
                  <span>{["1–12", "13–24", "25–36"][d - 1]}</span>
                  <BetStack bets={bets} k={`d:${d}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="bet-panel">
            <h4>Números · paga 35x</h4>
            <div className="row" style={{ gap: 8, alignItems: "stretch" }}>
              <button
                className={`bet-zone zone-green ${bets["s:0"] ? "has-bet" : ""}`}
                style={{ flex: "0 0 58px" }}
                onClick={() => placeBet({ kind: "number", n: 0 })}
              >
                <span>0</span>
                <BetStack bets={bets} k="s:0" />
              </button>
              <div className="num-grid grow" style={{ flex: 1 }}>
                {Array.from({ length: 36 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    className={
                      "num-cell " +
                      (cellColor(n) === "red" ? "zone-red" : "zone-black") +
                      (winNumber === n ? " win-highlight" : "")
                    }
                    onClick={() => placeBet({ kind: "number", n })}
                  >
                    <span>{n}</span>
                    <BetStack bets={bets} k={`s:${n}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="row" style={{ gap: 10 }}>
            <button
              className="btn btn-ghost"
              onClick={clearBets}
              disabled={spinning || totalBet === 0}
            >
              ✕ Limpar apostas
            </button>
            <button
              className="btn btn-gold btn-lg grow"
              onClick={spin}
              disabled={spinning || totalBet === 0}
            >
              {spinning
                ? "🔴 Girando..."
                : totalBet > 0
                  ? `🎡 Girar (${fmt(totalBet)} ${CURRENCY})`
                  : "🎡 Girar"}
            </button>
          </div>

          <p className="tiny">
            Roleta europeia (1 zero) · retorno teórico de{" "}
            <b>97,3%</b> · tudo fictício, sem dinheiro real
          </p>
        </div>
      </div>
    </>
  );
}

function BetStack({
  bets,
  k,
}: {
  bets: Bets;
  k: BetKey;
}) {
  const amt = bets[k] || 0;
  if (!amt) return null;
  return (
    <span className="stack">
      <span className="mini-chip">{amt}</span>
    </span>
  );
}
