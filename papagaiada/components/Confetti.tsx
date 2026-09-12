"use client";

import { useEffect, useState } from "react";

const COLORS = ["#d4af37", "#f1c860", "#e8b84a", "#b08a1e", "#ffffff", "#ff6b35", "#f5d060"];

interface Piece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  rot: number;
}

function makePieces(): Piece[] {
  return Array.from({ length: 70 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 1.6 + Math.random() * 1.6,
    size: 6 + Math.random() * 7,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rot: Math.random() * 360,
  }));
}

export function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    const id = window.setTimeout(() => setPieces(makePieces()), 0);
    return () => window.clearTimeout(id);
  }, []);

  if (pieces.length === 0) return null;

  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}