"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGame, fmt } from "@/lib/store";
import { CURRENCY, recordResult } from "@/lib/types";
import { SYMBOL_H, buildReelStrip, spinSlots } from "@/lib/slots";
import { CHIP_VALUES } from "@/lib/roulette";
import { Confetti } from "@/components/Confetti";

const STRIP_LEN = 24;
const TARGET_INDEX = 6;
const FINAL_Y = (TARGET_INDEX - 1) * SYMBOL_H;

export function SlotsGame() {
  const { active, updatePlayer, playSfx, pushToast } = useGame();

  const [bet, setBet] = useState(CHIP_VALUES[2]);
  const [spinId, setSpinId] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [reels, setReels] = useState<string[][]>([
    buildReelStrip(weightedRandom(), STRIP_LEN).map((s) => s.icon),
    buildReelStrip(weightedRandom(), STRIP_LEN).map((s) => s.icon),
    buildReelStrip(weightedRandom(), STRIP_LEN).map((s) => s.icon),
  ]);
  const [result, setResult] = useState<{
    icons: string[];
    pays: number;
    jackpot: boolean;
  } | null>(null);
  const [jackpotAnim, setJackpotAnim] = useState(false);
  const timeouts = useRef<number[]>([]);

  if (!active) return null;

  const spin = () => {
    if (spinning) return;
    if (bet > active.balance) {
      playSfx("no");
      pushToast("Saldo insuficiente.", "lose");
      return;
    }

    const res = spinSlots();
    const pays = res.pays * bet;

    setReels(res.symbols.map((sym) => buildReelStrip(sym, STRIP_LEN).map((s) => s.icon)));
    updatePlayer(active.id, (p) => ({
      ...p,
      balance: p.balance - bet,
    }));
    setResult(null);
    setJackpotAnim(false);
    setSpinning(true);
    setSpinId((s) => s + 1);
    playSfx("spin");

    timeouts.current.forEach(clearTimeout);
    const done = window.setTimeout(() => {
      const won = res.pays > 0;
      updatePlayer(active.id, (p) => ({
        ...p,
        balance: p.balance + pays,
        stats: recordResult(p.stats, won, pays - bet, pays, bet),
      }));
      setResult({ icons: res.symbols.map((s) => s.icon), pays, jackpot: res.jackpot });
      setSpinning(false);

      if (res.jackpot) {
        setJackpotAnim(true);
        setCelebrate(true);
        playSfx("jackpot");
        pushToast(`🏆 JACKPOT! ${res.symbols.map((s) => s.icon).join("")} +${fmt(pays)} ${CURRENCY}!`, "win");
      } else if (won) {
        setCelebrate(true);
        playSfx("win");
        pushToast(`🎰 ${res.symbols.map((s) => s.icon).join(" ")} · +${fmt(pays)} ${CURRENCY}!`, "win");
      } else {
        playSfx("lose");
        pushToast(`Sem combinação. Tente de novo!`, "lose");
      }
    }, 3800);
    timeouts.current = [done];
    timeouts.current.push(window.setTimeout(() => setCelebrate(false), 3500));
  };

  return (
    <>
      {celebrate ? <Confetti /> : null}

      <div className="slots-machine">
        <div className="panel" style={{ padding: 18 }}>
          <div className="slots-frame">
            {jackpotAnim ? <div className="jackpot-glow" /> : null}
            <div className="row space-between" style={{ marginBottom: 12 }}>
              <div className="balance-pill" style={{ fontSize: 13 }}>
                <span className="cur-icon">{CURRENCY}</span>
                <span>{fmt(active.balance)}</span>
                <span className="cur-label">saldo</span>
              </div>
              <span style={{
                fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                fontWeight: 800,
                color: "var(--gold)",
                fontSize: 16,
                textShadow: "0 0 12px var(--gold-glow)",
              }}>
                7️⃣ JACKPOT ×250
              </span>
            </div>

            <div className="slots-reels">
              {reels.map((strip, i) => (
                <div className="reel-window" key={`${spinId}-${i}`}>
                  <div className="line-glow" />
                  <motion.div
                    className="reel-strip"
                    initial={{ y: 0 }}
                    animate={{ y: FINAL_Y }}
                    transition={{
                      duration: 2.0 + i * 0.6,
                      ease: [0.1, 0.7, 0.15, 1],
                      delay: i * 0.12,
                    }}
                  >
                    {strip.map((icon, j) => (
                      <div className="sym" key={j}>
                        {icon}
                      </div>
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {result ? (
            <motion.div
              key={`r-${spinId}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="center"
              style={{ marginTop: 14, gap: 12 }}
            >
              <span style={{ fontSize: 38 }}>{result.icons.join("  ")}</span>
              <span
                className="pill"
                style={{
                  background: result.pays > 0 ? "rgba(52, 211, 153, 0.18)" : "rgba(239, 68, 68, 0.18)",
                  color: result.pays > 0 ? "var(--green)" : "var(--red)",
                  border: `1px solid ${result.pays > 0 ? "rgba(52, 211, 153, 0.4)" : "rgba(239, 68, 68, 0.4)"}`,
                  fontSize: 16,
                  padding: "6px 16px",
                }}
              >
                {result.pays > 0 ? `+${fmt(result.pays)} ${CURRENCY}` : "Sem prêmio"}
              </span>
            </motion.div>
          ) : null}
        </div>

        <div className="row" style={{ gap: 10, justifyContent: "center" }}>
          <span className="btn btn-ghost" style={{ pointerEvents: "none" }}>
            Ficha
          </span>
          <div className="chip-select">
            {CHIP_VALUES.map((v) => (
              <button
                key={v}
                className={"chip" + (bet === v ? " selected" : "")}
                onClick={() => {
                  if (spinning) return;
                  setBet(v);
                  playSfx("click");
                }}
              >
                {v}
              </button>
            ))}
          </div>
          <button className="btn btn-gold btn-lg" onClick={spin} disabled={spinning}>
            {spinning ? "🎰 Girando..." : `🎰 Girar (${fmt(bet)} ${CURRENCY})`}
          </button>
        </div>

        <div className="slots-pays">
          {[
            { icon: "🥥", mult: "×8" },
            { icon: "🍒", mult: "×12" },
            { icon: "🍍", mult: "×20" },
            { icon: "🍀", mult: "×35" },
            { icon: "🦜", mult: "×70" },
            { icon: "7️⃣", mult: "×250" },
          ].map((s) => (
            <span className="pay-item" key={s.icon}>
              <span className="sym-icon">{s.icon}</span>{s.mult}
            </span>
          ))}
        </div>

        <p className="tiny" style={{ textAlign: "center" }}>
          3 símbolos iguais pagam o multiplicador × a aposta · tudo fictício, sem dinheiro real
        </p>
      </div>
    </>
  );
}

function weightedRandom() {
  return spinSlots().symbols[0];
}
