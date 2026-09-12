"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { useGame, fmt } from "@/lib/store";
import { CURRENCY, CURRENCY_SHORT } from "@/lib/types";

export function BalancePill({ big = false }: { big?: boolean }) {
  const { active } = useGame();
  const [disp, setDisp] = useState(active?.balance ?? 0);
  const shown = useRef(active?.balance ?? 0);

  useEffect(() => {
    if (!active) return;
    const from = shown.current;
    shown.current = active.balance;
    if (from === active.balance) {
      setDisp(active.balance);
      return;
    }
    const controls = animate(from, active.balance, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setDisp(Math.round(v)),
    });
    return () => controls.stop();
  }, [active?.balance, active]);

  if (!active) return null;

  return (
    <motion.div
      className={"balance-pill" + (big ? " btn-lg" : "")}
      data-balance={active.balance}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      style={{ fontSize: big ? 20 : undefined }}
    >
      <span className="cur-icon">{CURRENCY}</span>
      <motion.span
        key={active.balance}
        initial={{ scale: 1.18 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 20 }}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {fmt(disp)}
      </motion.span>
      <span className="cur-label">{CURRENCY_SHORT}</span>
    </motion.div>
  );
}