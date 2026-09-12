"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GameProvider, useGame } from "@/lib/store";
import { LoginScreen } from "@/components/LoginScreen";
import { Lobby } from "@/components/Lobby";
import { RouletteGame } from "@/components/RouletteGame";
import { SlotsGame } from "@/components/SlotsGame";
import { ProfileScreen } from "@/components/ProfileScreen";
import { NavBar, type NavRoute } from "@/components/NavBar";
import { RankingSidebar } from "@/components/RankingSidebar";
import { ToastOverlay } from "@/components/Toast";

function App() {
  const { active, logout, ready } = useGame();
  const [screen, setScreen] = useState<NavRoute>("lobby");
  const [rankOpen, setRankOpen] = useState(false);

  const go = (r: NavRoute) => {
    setScreen(r);
    setRankOpen(false);
  };

  if (!ready) {
    return (
      <div className="app-shell">
        <div className="center" style={{ minHeight: "70vh" }}>
          <div className="flex-col center" style={{ gap: 12 }}>
            <div className="floaty" style={{ fontSize: 54 }}>🦜</div>
            <div style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 800 }}>
              PAPAGAIADA
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!active) return <LoginScreen />;

  const inGame = screen === "roulette" || screen === "slots";

  return (
    <div className="app-shell">
      <NavBar
        route={screen}
        onNavigate={go}
        onLogout={() => {
          logout();
          go("lobby");
        }}
        onBack={inGame || screen === "profile" ? () => go("lobby") : undefined}
        onOpenRanking={() => setRankOpen(true)}
      />

      <div className="app-body">
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 20, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.99 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
            >
              {screen === "lobby" ? (
                <Lobby
                  onRoulette={() => go("roulette")}
                  onSlots={() => go("slots")}
                  onProfile={() => go("profile")}
                />
              ) : null}
              {screen === "roulette" ? <RouletteGame /> : null}
              {screen === "slots" ? <SlotsGame /> : null}
              {screen === "profile" ? <ProfileScreen /> : null}
            </motion.div>
          </AnimatePresence>
        </main>

        <RankingSidebar open={rankOpen} onClose={() => setRankOpen(false)} />
      </div>

      <ToastOverlay />
    </div>
  );
}

export default function Page() {
  return (
    <GameProvider>
      <App />
    </GameProvider>
  );
}