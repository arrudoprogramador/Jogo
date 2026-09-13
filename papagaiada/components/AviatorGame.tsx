"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGame, fmt } from "@/lib/store";
import { CURRENCY, recordResult } from "@/lib/types";
import { CHIP_VALUES } from "@/lib/roulette";
import { TICK_MS, multAtElapsed, crashPoint, formatMult } from "@/lib/aviator";
import { Confetti } from "@/components/Confetti";

type Phase = "idle" | "flying" | "cashed" | "crashed";

export function AviatorGame() {
  const { active, updatePlayer, playSfx, pushToast } = useGame();

  const [phase, setPhase] = useState<Phase>("idle");
  const [bet, setBet] = useState(CHIP_VALUES[1]);
  const [mult, setMult] = useState(1);
  const [crashAt, setCrashAt] = useState<number | null>(null);
  const [cashedAt, setCashedAt] = useState<number | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [roundId, setRoundId] = useState(0);
  const startedAtRef = useRef(0);
  const timeoutsRef = useRef<number[]>([]);

  const resetToIdle = useCallback(() => {
    setPhase("idle");
    setCrashAt(null);
    setCashedAt(null);
    setMult(1);
  }, []);

  useEffect(() => {
    if (phase !== "flying" || crashAt == null || !active) return;

    const iv = window.setInterval(() => {
      const elapsed = (Date.now() - startedAtRef.current) / 1000;
      const m = multAtElapsed(elapsed);
      if (m >= crashAt) {
        setMult(crashAt);
        setPhase("crashed");
        updatePlayer(active.id, (p) => ({
          ...p,
          balance: p.balance - bet,
          stats: recordResult(p.stats, false, -bet, 0, bet),
        }));
        playSfx("lose");
        pushToast(`💥 CRASH a ${formatMult(crashAt)}. Aposta perdida.`, "lose");
        timeoutsRef.current.push(window.setTimeout(resetToIdle, 3000));
      } else {
        setMult(m);
      }
    }, TICK_MS);

    return () => window.clearInterval(iv);
  }, [phase, crashAt, active, bet, updatePlayer, playSfx, pushToast, resetToIdle]);

  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), []);

  if (!active) return null;

  const startRound = () => {
    if (phase !== "idle") return;
    if (bet > active.balance) {
      playSfx("no");
      pushToast("Saldo insuficiente.", "lose");
      return;
    }
    playSfx("spin");
    const crash = crashPoint();
    startedAtRef.current = Date.now();
    setCrashAt(crash);
    setMult(multAtElapsed(0));
    setCashedAt(null);
    setPhase("flying");
    setCelebrate(false);
    setRoundId((r) => r + 1);
  };

  const cashOut = () => {
    if (phase !== "flying") return;
    const m = Math.max(1, mult);
    const winAmount = m * bet;
    const net = winAmount - bet;
    setCashedAt(m);
    setPhase("cashed");
    updatePlayer(active.id, (p) => ({
      ...p,
      balance: p.balance + net,
      stats: recordResult(p.stats, true, net, winAmount, bet),
    }));
    setCelebrate(true);
    timeoutsRef.current.push(window.setTimeout(resetToIdle, 3000));
    if (m >= 10) {
      playSfx("jackpot");
      pushToast(`👑 Sacou a ${formatMult(m)}! +${fmt(net)} ${CURRENCY}!`, "win");
    } else {
      playSfx("win");
      pushToast(`✈️ Sacou a ${formatMult(m)}! +${fmt(net)} ${CURRENCY}`, "win");
    }
  };

  const progress =
    phase === "flying" && crashAt != null
      ? Math.min(Math.max((mult - 1) / (crashAt - 1), 0), 1)
      : phase === "cashed" && crashAt != null
        ? Math.min(Math.max((cashedAt! - 1) / (crashAt - 1), 0), 1)
        : phase === "crashed"
          ? 1
          : 0;

  const pEase = progress * progress;
  const planeX = 4 + 70 * pEase;
  const planeY = 82 - 74 * pEase;
  const planeRot = -6 + 14 * pEase;

  const flying = phase === "flying";

  return (
    <>
      {celebrate ? <Confetti /> : null}

      <div className="panel" style={{ padding: 18, maxWidth: 560 }}>
        <div className="row space-between" style={{ marginBottom: 12 }}>
          <div className="row" style={{ gap: 10 }}>
            <span className="chip-avatar" style={{ fontSize: 20 }}>✈️</span>
            <span
              style={{
                fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                fontWeight: 800,
                letterSpacing: "0.06em",
                fontSize: 16,
              }}
            >
              AVIATOR
            </span>
          </div>
          <div className="balance-pill" style={{ fontSize: 13 }}>
            <span className="cur-icon">{CURRENCY}</span>
            <span>{fmt(active.balance)}</span>
            <span className="cur-label">saldo</span>
          </div>
        </div>

        <div className="aviator-sky">
          <div
            className="aviator-plane"
            key={`${roundId}-${phase}`}
            style={{
              left: `${planeX}%`,
              top: `${planeY}%`,
              transform: `rotate(${planeRot}deg)`,
            }}
          >
            ✈️
          </div>

          <div className="aviator-hud">
            {phase === "flying" ? (
              <div className="aviator-mult" style={{ color: "var(--gold)" }}>
                {formatMult(mult)}
              </div>
            ) : phase === "cashed" && cashedAt != null ? (
              <div className="aviator-mult" style={{ color: "var(--green)" }}>
                {formatMult(cashedAt)}
              </div>
            ) : phase === "crashed" ? (
              <div className="aviator-mult crash" style={{ color: "var(--red)" }}>
                💥 CRASH
              </div>
            ) : (
              <div className="aviator-hint">
                O ⭐ multiplicador sobe enquanto o avião sobe.
                <br />
                Sacar antes do <span style={{ color: "var(--red)" }}>CRASH</span>.
              </div>
            )}

            {phase === "crashed" && crashAt != null ? (
              <span className="aviator-tag crash">
                o avião caiu a {formatMult(crashAt)}
              </span>
            ) : null}
            {phase === "cashed" && cashedAt != null ? (
              <span className="aviator-tag win">
                ✂️ sacou a {formatMult(cashedAt)} · +{fmt(cashedAt * bet - bet)} {CURRENCY}
              </span>
            ) : null}
          </div>
        </div>

        <div className="row" style={{ gap: 10, justifyContent: "center", marginTop: 14 }}>
          <span className="btn btn-ghost" style={{ pointerEvents: "none" }}>
            Ficha
          </span>
          <div className="chip-select">
            {CHIP_VALUES.map((v) => (
              <button
                key={v}
                className={"chip" + (bet === v ? " selected" : "")}
                disabled={flying}
                onClick={() => {
                  setBet(v);
                  playSfx("click");
                }}
              >
                {v}
              </button>
            ))}
          </div>

          <button className="btn btn-ghost btn-lg" onClick={cashOut} disabled={!flying}>
            💵 Sacar
          </button>

          <button
            className={"btn btn-gold btn-lg" + (flying ? " aviator-live" : "")}
            onClick={flying ? cashOut : startRound}
            disabled={phase === "cashed" || phase === "crashed"}
          >
            {phase === "idle"
              ? `▶️ Iniciar voo (${fmt(bet)} ${CURRENCY})`
              : phase === "flying"
                ? `Sacar ${formatMult(Math.max(1, mult))}`
                : phase === "cashed"
                  ? "✅ Voo concluído"
                  : "💥 Crashou"}
          </button>
        </div>

        <p className="tiny" style={{ textAlign: "center", marginTop: 10 }}>
          Saque antes do crash para ganhar a aposta × o multiplicador ·
          tudo fictício, sem dinheiro real · casa com ~3% de vantagem
        </p>
      </div>
    </>
  );
}