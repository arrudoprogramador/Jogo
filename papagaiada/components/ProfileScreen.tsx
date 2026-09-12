"use client";

import { useState } from "react";
import { useGame, fmt } from "@/lib/store";
import { AVATARS, CURRENCY, type AvatarEmoji } from "@/lib/types";
import { BADGES, winRate } from "@/lib/badges";
import { Confirm } from "@/components/Confirm";

export function ProfileScreen() {
  const { active, data, updatePlayer, playSfx, pushToast } = useGame();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(active?.name ?? "");
  const [avatar, setAvatar] = useState<AvatarEmoji>(active?.avatar ?? "🦜");
  const [confirmingReset, setConfirmingReset] = useState(false);

  if (!active) return null;

  const players = [...(data?.players ?? [])].sort((a, b) => b.balance - a.balance);
  const rank = players.findIndex((p) => p.id === active.id) + 1;
  const s = active.stats;
  const rate = winRate(s);

  const startEdit = () => {
    setName(active.name);
    setAvatar(active.avatar);
    setEditing(true);
    playSfx("click");
  };

  const saveEdit = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      pushToast("O nome precisa ter pelo menos 2 letras.", "lose");
      return;
    }
    if (trimmed.length > 16) {
      pushToast("O nome pode ter no máximo 16 caracteres.", "lose");
      return;
    }
    updatePlayer(active.id, (p) => ({
      ...p,
      name: trimmed,
      avatar,
    }));
    setEditing(false);
    playSfx("click");
    pushToast("Perfil atualizado!", "win");
  };

  const resetStats = () => {
    updatePlayer(active.id, (p) => ({
      ...p,
      stats: { plays: 0, wins: 0, bestWin: 0, profit: 0, streak: 0, bestStreak: 0, bestMultiplier: 0 },
    }));
    setConfirmingReset(false);
    playSfx("click");
    pushToast("Estatísticas zeradas.", "info");
  };

  const stats: { label: string; value: string; tone?: "gold" | "green" | "red" }[] = [
    { label: "Jogadas", value: fmt(s.plays) },
    { label: "Vitórias", value: fmt(s.wins) },
    { label: "Taxa de vitória", value: `${(rate * 100).toFixed(0)}%` },
    { label: "Sequência atual", value: `${s.streak}` },
    { label: "Melhor sequência", value: `${s.bestStreak}` },
    { label: "Maior prêmio", value: fmt(s.bestWin), tone: "gold" },
    {
      label: "Melhor multiplicador",
      value: s.bestMultiplier > 0 ? `${s.bestMultiplier.toFixed(1)}x` : "—",
    },
    { label: "Saldo total", value: fmt(s.profit), tone: s.profit >= 0 ? "green" : "red" },
  ];

  const toneColor = (t?: "gold" | "green" | "red") =>
    t === "gold" ? "var(--gold)" : t === "green" ? "var(--green)" : t === "red" ? "var(--red)" : "var(--text)";

  return (
    <div className="flex-col" style={{ gap: 18 }}>
      <div className="panel" style={{ padding: 22 }}>
        <div className="profile-hero">
          <div className="profile-avatar">{editing ? avatar : active.avatar}</div>
          <div className="grow" style={{ minWidth: 180 }}>
            {editing ? (
              <input
                className="input"
                placeholder="Seu apelido"
                maxLength={16}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              />
            ) : (
              <>
                <div
                  style={{
                    fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                    fontWeight: 800,
                    fontSize: 24,
                  }}
                >
                  {active.name}
                  <span className="pill pill-gold" style={{ marginLeft: 8, fontSize: 12 }}>
                    #{rank}
                  </span>
                </div>
                <p className="tiny" style={{ marginTop: 4, marginBottom: 6 }}>
                  Jogando desde {new Date(active.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </>
            )}
            <div className="row" style={{ gap: 8, marginTop: editing ? 10 : 2 }}>
              {editing ? (
                <>
                  <button className="btn btn-primary btn-sm" onClick={saveEdit}>
                    💾 Salvar
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>
                    Cancelar
                  </button>
                </>
              ) : (
                <button className="btn btn-ghost btn-sm" onClick={startEdit}>
                  ✏️ Editar perfil
                </button>
              )}
            </div>
          </div>
          <div
            className="panel"
            style={{
              padding: "12px 18px",
              boxShadow: "none",
              background: "var(--bg2)",
              borderRadius: 14,
            }}
          >
            <div className="tiny">Saldo</div>
            <div style={{ fontWeight: 900, fontSize: 20, whiteSpace: "nowrap" }}>
              {fmt(active.balance)} <span className="cur-icon" style={{ fontSize: 16 }}>{CURRENCY}</span>
            </div>
          </div>
        </div>

        {editing ? (
          <div style={{ marginTop: 16 }}>
            <div className="section-title" style={{ marginBottom: 10 }}>
              <span className="dot" /> Escolha seu avatar
            </div>
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
        ) : null}
      </div>

      <div className="panel" style={{ padding: 22 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>
          <span className="dot" /> Estatísticas
        </div>
        <div className="stat-grid" style={{ marginTop: 12 }}>
          {stats.map((st) => (
            <div className="stat" key={st.label}>
              <div className="value" style={{ color: toneColor(st.tone) }}>
                {st.value}
              </div>
              <div className="label">{st.label}</div>
            </div>
          ))}
        </div>
        <div className="row" style={{ justifyContent: "flex-end", marginTop: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setConfirmingReset(true)}>
            🗑️ Zerar estatísticas
          </button>
        </div>
      </div>

      <div className="panel" style={{ padding: 22 }}>
        <div className="section-title" style={{ marginBottom: 16 }}>
          <span className="dot" /> Conquistas
        </div>
        <div className="badge-grid">
          {BADGES.map((b) => {
            const earned = b.earned(s, rank);
            return (
              <div key={b.id} className={"badge" + (earned ? " earned" : " locked")} title={b.desc}>
                <span className="b-icon">{b.icon}</span>
                <span className="b-name">{b.name}</span>
                <span className="b-desc">{b.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Confirm
        open={confirmingReset}
        title="Zerar estatísticas?"
        message="Isso apaga vitórias, sequências e prêmios deste jogador. O saldo e os badges não mudam."
        onConfirm={resetStats}
        onCancel={() => setConfirmingReset(false)}
      />
    </div>
  );
}