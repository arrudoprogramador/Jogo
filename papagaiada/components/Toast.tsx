"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/lib/store";

const TONE = {
  win: { icon: "💰", accent: "var(--green)", border: "rgba(16,185,129,0.45)" },
  lose: { icon: "😅", accent: "var(--red)", border: "rgba(239,68,68,0.45)" },
  bonus: { icon: "🎁", accent: "var(--gold)", border: "rgba(212,175,55,0.45)" },
  info: { icon: "🔔", accent: "var(--text3)", border: "var(--border2)" },
} as const;

export function ToastOverlay() {
  const { toast } = useGame();
  const t = toast ? TONE[toast.tone] : null;
  return (
    <AnimatePresence>
      {toast && t ? (
        <motion.div
          key={toast.id}
          className="toast"
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          style={{ borderLeftColor: t.accent }}
        >
          <span style={{ fontSize: 18 }}>{t.icon}</span>
          <span>{toast.text}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}