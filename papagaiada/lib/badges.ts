import type { PlayerStats } from "@/lib/types";

export interface Badge {
  id: string;
  icon: string;
  name: string;
  desc: string;
  earned: (stats: PlayerStats, rank?: number) => boolean;
}

export const BADGES: Badge[] = [
  {
    id: "bronze",
    icon: "🥉",
    name: "Bronze",
    desc: "100 vitórias",
    earned: (s) => s.wins >= 100,
  },
  {
    id: "precision",
    icon: "🎯",
    name: "Precisão",
    desc: "50+ jogadas e mais de 25% de vitórias",
    earned: (s) => s.plays >= 50 && s.wins / s.plays > 0.25,
  },
  {
    id: "streak",
    icon: "🔥",
    name: "Streak",
    desc: "5 vitórias seguidas",
    earned: (s) => s.bestStreak >= 5,
  },
  {
    id: "jackpot",
    icon: "💰",
    name: "Jackpot",
    desc: "Uma vitória de 4x ou mais da aposta",
    earned: (s) => s.bestMultiplier >= 4,
  },
  {
    id: "diamond",
    icon: "💎",
    name: "Diamante",
    desc: "Mais de 30% de taxa de vitória",
    earned: (s) => s.plays > 0 && s.wins / s.plays > 0.3,
  },
  {
    id: "vip",
    icon: "👑",
    name: "VIP",
    desc: "Número 1 no ranking local",
    earned: (_s, rank) => rank === 1,
  },
  {
    id: "legendary",
    icon: "🏅",
    name: "Lendário",
    desc: "1.000 vitórias",
    earned: (s) => s.wins >= 1000,
  },
];

export function winRate(stats: PlayerStats): number {
  if (stats.plays === 0) return 0;
  return stats.wins / stats.plays;
}