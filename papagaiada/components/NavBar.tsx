"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/lib/store";
import { BalancePill } from "@/components/Balance";

export type NavRoute = "lobby" | "roulette" | "slots" | "aviator" | "profile";

interface Props {
  route: NavRoute;
  onNavigate: (r: NavRoute) => void;
  onLogout: () => void;
  onBack?: () => void;
  onOpenRanking: () => void;
}

const DIRECT_NAV: { id: NavRoute; label: string }[] = [
  { id: "lobby", label: "Início" },
  { id: "roulette", label: "Roleta" },
  { id: "slots", label: "Caça-Níqueis" },
  { id: "aviator", label: "Aviator" },
  { id: "profile", label: "Perfil" },
];

const brand = () => (
  <span className="logo-text">
    VEGAS<span className="accent"> PRIME</span>
  </span>
);

export function NavBar({ route, onNavigate, onLogout, onBack, onOpenRanking }: Props) {
  const { active, muted, setMuted, playSfx } = useGame();
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  const go = (r: NavRoute) => {
    close();
    playSfx("click");
    onNavigate(r);
  };

  return (
    <header className="navbar">
      {onBack ? (
        <button className="btn btn-icon btn-ghost" onClick={onBack} title="Voltar">
          ←
        </button>
      ) : null}
      <div className="logo">
        <span className="logo-emoji">🦜</span>
        {brand()}
      </div>

      <nav className="nav-menu">
        {DIRECT_NAV.map((item) => (
          <button
            key={item.id}
            className={"nav-link" + (route === item.id ? " active" : "")}
            onClick={() => go(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="navbar-right">
        <button
          className="btn btn-ghost btn-sm rank-toggle"
          title="Ranking"
          onClick={() => {
            playSfx("click");
            onOpenRanking();
          }}
        >
          🏆 Ranking
        </button>

        {active ? <BalancePill /> : null}

        <button
          className="btn btn-icon btn-ghost sound-toggle"
          title={muted ? "Ativar som" : "Silenciar"}
          onClick={() => {
            setMuted(!muted);
            if (muted) playSfx("click");
          }}
        >
          {muted ? "🔇" : "🔊"}
        </button>

        <div className="avatar-menu">
          {menuOpen ? (
            <div className="dropdown-backdrop" onClick={close} />
          ) : null}
          <button
            className={"user-chip" + (menuOpen ? " open" : "")}
            title="Trocar jogador"
            onClick={() => {
              setMenuOpen((o) => !o);
              playSfx("click");
            }}
          >
            <span className="chip-avatar">{active?.avatar}</span>
            <span className="chip-name">{active?.name}</span>
            <span className="chip-chev">▾</span>
          </button>

          <AnimatePresence>
            {menuOpen ? (
              <motion.div
                className="dropdown"
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
              >
                <button
                  className={"dropdown-item" + (route === "profile" ? " active" : "")}
                  onClick={() => go("profile")}
                  title="Perfil"
                >
                  👤 Perfil
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    close();
                    playSfx("click");
                    onOpenRanking();
                  }}
                  title="Ranking"
                >
                  🏆 Ranking
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    playSfx("click");
                    setMuted(!muted);
                  }}
                  title={muted ? "Ativar som" : "Silenciar"}
                >
                  {muted ? "🔇 Som" : "🔊 Som"}
                </button>
                <button
                  className="dropdown-item danger"
                  onClick={() => {
                    close();
                    playSfx("click");
                    onLogout();
                  }}
                  title="Sair"
                >
                  🚪 Sair
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}