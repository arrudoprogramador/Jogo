"use client";

import { useGame, fmt } from "@/lib/store";
import { CURRENCY } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export function RankingSidebar({ open, onClose }: Props) {
  const { data, active } = useGame();
  if (!active) return null;

  const players = [...(data?.players ?? [])];
  const ranked = players.sort((a, b) => b.balance - a.balance).slice(0, 8);
  const meInTop = ranked.some((p) => p.id === active.id);
  const meRank = players.findIndex((p) => p.id === active.id) + 1;

  const rows = meInTop ? ranked : [...ranked, active];

  return (
    <>
      <div
        className={"rank-backdrop" + (open ? " show" : "")}
        onClick={onClose}
      />
      <aside className={"rank-sidebar panel" + (open ? " open" : "")}>
        <div className="row space-between" style={{ marginBottom: 4 }}>
          <div className="section-title" style={{ margin: 0 }}>
            <span className="dot" /> Ranking
          </div>
          <button
            className="btn btn-icon btn-ghost"
            title="Fechar ranking"
            onClick={onClose}
            style={{ width: 34, height: 34, fontSize: 16 }}
          >
            ✕
          </button>
        </div>
        <p className="tiny" style={{ marginBottom: 10 }}>
          Saldo em {CURRENCY} · ranking local deste navegador
        </p>

        {rows.length <= 1 ? (
          <p className="tiny" style={{ padding: "10px 2px", lineHeight: 1.5 }}>
            Ainda não há concorrentes. Crie outro jogador para disputar o topo.
          </p>
        ) : (
          <div className="rank-list">
            {rows.map((p, i) => {
              const pos = p.id === active.id ? (meInTop ? i + 1 : meRank) : i + 1;
              const isMe = p.id === active.id;
              return (
                <div key={p.id} className={"rank-row" + (isMe ? " you" : "")}>
                  {pos <= 3 ? (
                    <span className="medal">{MEDALS[pos - 1]}</span>
                  ) : (
                    <span className="rank-pos">{pos}</span>
                  )}
                  <span className="ranker-avatar">{p.avatar}</span>
                  <div className="grow">
                    <span className="rank-name">
                      {p.name} {isMe ? <span className="pill pill-green">você</span> : null}
                    </span>
                  </div>
                  <span className="rank-balance">
                    {fmt(p.balance)} <span className="cur-icon" style={{ fontSize: 12 }}>{CURRENCY}</span>
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <p className="tiny" style={{ marginTop: 12 }}>
          Em breve: ranking global compartilhado com o backend grátis (Supabase).
        </p>
      </aside>
    </>
  );
}