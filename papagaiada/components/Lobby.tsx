"use client";

import { motion } from "framer-motion";
import { useGame, fmt, isDailyAvailable, rescueAvailable } from "@/lib/store";
import { CURRENCY, DAILY_BONUS, RESCUE_AMOUNT } from "@/lib/types";

export function Lobby({
  onRoulette,
  onSlots,
  onAviator,
  onProfile,
}: {
  onRoulette: () => void;
  onSlots: () => void;
  onAviator: () => void;
  onProfile: () => void;
}) {
  const { active, claimDaily, claimRescue, pushToast, playSfx } = useGame();
  if (!active) return null;

  const dailyOk = isDailyAvailable(active);
  const rescueOk = rescueAvailable(active);
  const broke = active.balance < 100;

  return (
    <>
      <div className="row" style={{ gap: 10, marginBottom: 20 }}>
        <button
          className="btn btn-gold"
          disabled={!dailyOk}
          onClick={() => {
            if (!dailyOk) {
              playSfx("no");
              return;
            }
            claimDaily();
            playSfx("bonus");
            pushToast(`+${fmt(DAILY_BONUS)} ${CURRENCY} de bônus diário!`, "bonus");
          }}
          title={dailyOk ? "Resgatar bônus" : "Já resgatado hoje"}
        >
          🎁 Bônus diário {dailyOk ? `+${fmt(DAILY_BONUS)}` : "✓"}
        </button>

        {broke ? (
          <button
            className="btn btn-blue"
            disabled={!rescueOk}
            onClick={() => {
              if (!rescueOk) {
                playSfx("no");
                return;
              }
              claimRescue();
              playSfx("bonus");
              pushToast(`Resgate de ${fmt(RESCUE_AMOUNT)} ${CURRENCY} liberado!`, "bonus");
            }}
          >
            🙏 Resgate {rescueOk ? `+${fmt(RESCUE_AMOUNT)}` : "⏳"}
          </button>
        ) : null}
      </div>

      <div className="section-title">
        <span className="dot" /> Jogos
      </div>
      <div className="game-grid">
        <motion.button
          className="game-card"
          whileHover={{ y: -4 }}
          onClick={() => {
            playSfx("chip");
            onRoulette();
          }}
        >
          <span className="icon">🎡</span>
          <h3>Roleta Europeia</h3>
          <p>
            Aposte em números, cores, pares ou dúzias. A roda gira de verdade e a bolinha decide.
            Pagamento de até 35x.
          </p>
          <span className="btn btn-primary btn-sm" style={{ alignSelf: "flex-start" }}>
            Jogar roleta
          </span>
        </motion.button>

        <motion.button
          className="game-card"
          whileHover={{ y: -4 }}
          onClick={() => {
            playSfx("chip");
            onSlots();
          }}
        >
          <span className="icon">🎰</span>
          <h3>Caça-Níqueis</h3>
          <p>
            Gire os 3 rolos e faça 3 símbolos iguais. Pay table de até <b>250x</b> com o
            jackpot 🦜7.
          </p>
          <span className="btn btn-gold btn-sm" style={{ alignSelf: "flex-start" }}>
            Jogar caça-níqueis
          </span>
        </motion.button>

        <motion.button
          className="game-card"
          whileHover={{ y: -4 }}
          onClick={() => {
            playSfx("chip");
            onAviator();
          }}
        >
          <span className="icon">✈️</span>
          <h3>Aviator</h3>
          <p>
            O multiplicador sobe a cada segundo enquanto o avião sobe. Sacar antes do
            <b> crash</b> e multiplicar sua aposta até 2500x.
          </p>
          <span className="btn btn-gold btn-sm" style={{ alignSelf: "flex-start" }}>
            Jogar aviator
          </span>
        </motion.button>
      </div>

      <motion.button
        className="panel"
        whileHover={{ y: -3 }}
        onClick={() => {
          playSfx("click");
          onProfile();
        }}
        style={{
          marginTop: 20,
          width: "100%",
          textAlign: "left",
          padding: 18,
          display: "flex",
          alignItems: "center",
          gap: 16,
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 40 }}>{active.avatar}</span>
        <span className="grow">
          <span style={{ fontWeight: 800, fontSize: 15 }}>{active.name}</span>
          <span className="tiny" style={{ display: "block", marginTop: 2 }}>
            {active.stats.plays} jogadas · {active.stats.wins} vitórias ·{" "}
            {fmt(active.stats.bestWin)} {CURRENCY} de melhor prêmio
          </span>
        </span>
        <span className="btn btn-ghost btn-sm">Ver perfil →</span>
      </motion.button>

      <p className="footer-note">
        Jogo fictício · nenhum valor real envolvido · +18
        <br />
        Progresso salvo automaticamente neste navegador · ranking local compartilhado só neste navegador
      </p>
    </>
  );
}