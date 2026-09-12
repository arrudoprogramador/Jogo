"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGame, fmt } from "@/lib/store";
import { AVATARS, CURRENCY, type AvatarEmoji } from "@/lib/types";

export function LoginScreen() {
  const { data, login, addPlayer, playSfx } = useGame();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<AvatarEmoji>("🦜");
  const [error, setError] = useState("");

  const existing = data?.players ?? [];

  const submit = () => {
    if (name.trim().length < 2) {
      setError("Digite um nome com pelo menos 2 letras.");
      return;
    }
    if (name.trim().length > 16) {
      setError("O nome pode ter no máximo 16 caracteres.");
      return;
    }
    playSfx("click");
    addPlayer(name, avatar);
  };

  return (
    <div className="app-shell">
      <div className="center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="panel flex-col"
          style={{ maxWidth: 480, width: "100%", padding: 28, gap: 18, marginTop: 12 }}
        >
          <div className="center flex-col" style={{ textAlign: "center", gap: 6 }}>
            <div className="floaty" style={{ fontSize: 64, lineHeight: 1 }}>
              🦜
            </div>
            <h1 style={{ fontSize: 30 }}>
              PAPA<span style={{ color: "var(--gold)" }}>GAIADA</span>
            </h1>
            <p style={{ fontSize: 12, letterSpacing: 3, color: "var(--gold)", fontWeight: 700 }}>
              CASINO PREMIUM · 100% FICTÍCIO
            </p>
            <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.5 }}>
              O cassino mais bagunçado da internet. Comece com {fmt(1000)}{" "}
              {CURRENCY} penas e não use dinheiro de verdade!
            </p>
          </div>

          {existing.length > 0 ? (
            <div>
              <div className="section-title" style={{ marginBottom: 10 }}>
                <span className="dot" /> Seus jogadores
              </div>
              <div className="flex-col" style={{ gap: 8 }}>
                {existing.map((p) => (
                  <button
                    key={p.id}
                    className="btn btn-ghost space-between"
                    style={{ justifyContent: "space-between" }}
                    onClick={() => {
                      playSfx("chip");
                      login(p.id);
                    }}
                  >
                    <span>
                      {p.avatar} {p.name}
                    </span>
                    <span className="muted" style={{ fontWeight: 800 }}>
                      {fmt(p.balance)} {CURRENCY}
                    </span>
                  </button>
                ))}
              </div>
              <div className="center" style={{ margin: "14px 0 4px" }}>
                <span className="tiny" style={{ textTransform: "uppercase", letterSpacing: 1 }}>
                  ─── ou crie um novo ───
                </span>
              </div>
            </div>
          ) : (
            <div className="center flex-col" style={{ gap: 8 }}>
              <span className="tiny" style={{ textTransform: "uppercase", letterSpacing: 1 }}>
                Crie seu primeiro jogador
              </span>
            </div>
          )}

          <div className="flex-col" style={{ gap: 10 }}>
            <input
              className="input"
              placeholder="Seu apelido"
              maxLength={16}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <div className="center">
              <div className="avatar-grid">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    className={"avatar-btn" + (avatar === a ? " selected" : "")}
                    onClick={() => {
                      setAvatar(a);
                      playSfx("click");
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            {error ? <p style={{ color: "var(--red)", fontSize: 13.5 }}>{error}</p> : null}
            <button className="btn btn-primary btn-lg" onClick={submit}>
              🎰 Entrar no Cassino
            </button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export function Footer() {
  return (
    <p className="footer-note">
      Jogo fictício · nenhum valor real envolvido · +18
      <br />
      Saldo salvo automaticamente neste navegador
    </p>
  );
}