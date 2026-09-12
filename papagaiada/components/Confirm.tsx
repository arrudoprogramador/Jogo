"use client";

import { AnimatePresence, motion } from "framer-motion";

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function Confirm({ open, title, message, onConfirm, onCancel }: Props) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            className="modal"
            role="dialog"
            initial={{ x: "-50%", y: "-50%", opacity: 0, scale: 0.95 }}
            animate={{ x: "-50%", y: "-50%", opacity: 1, scale: 1 }}
            exit={{ x: "-50%", y: "-50%", opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
          >
            <h3 style={{ marginBottom: 8 }}>{title}</h3>
            <p className="muted" style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 18 }}>
              {message}
            </p>
            <div className="row" style={{ gap: 8, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost btn-sm" onClick={onCancel}>
                Cancelar
              </button>
              <button className="btn btn-red btn-sm" onClick={onConfirm}>
                Confirmar
              </button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}