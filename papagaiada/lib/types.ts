export type AvatarEmoji =
  | "🦜"
  | "🐦"
  | "🦚"
  | "🐧"
  | "🦆"
  | "🦉"
  | "🐤"
  | "🦅"
  | "🐨"
  | "🦁"
  | "🐸"
  | "🐙";

export interface PlayerStats {
  plays: number;
  wins: number;
  bestWin: number;
  profit: number;
  streak: number;
  bestStreak: number;
  bestMultiplier: number;
}

export function recordResult(
  prev: PlayerStats,
  won: boolean,
  net: number,
  winAmount: number,
  bet: number,
): PlayerStats {
  const streak = won ? prev.streak + 1 : 0;
  return {
    plays: prev.plays + 1,
    wins: prev.wins + (won ? 1 : 0),
    bestWin: Math.max(prev.bestWin, winAmount),
    profit: prev.profit + net,
    streak,
    bestStreak: Math.max(prev.bestStreak, streak),
    bestMultiplier:
      bet > 0 ? Math.max(prev.bestMultiplier, winAmount / bet) : prev.bestMultiplier,
  };
}

export interface Player {
  id: string;
  name: string;
  avatar: AvatarEmoji;
  balance: number;
  createdAt: number;
  lastDaily: number;
  lastRescue: number;
  stats: PlayerStats;
}

export interface StorageShape {
  version: 1;
  players: Player[];
  activeId: string | null;
  muted: boolean;
}

export const AVATARS: AvatarEmoji[] = [
  "🦜",
  "🐦",
  "🦚",
  "🐧",
  "🦆",
  "🦉",
  "🐤",
  "🦅",
  "🐨",
  "🦁",
  "🐸",
  "🐙",
];

export const START_BALANCE = 1000;
export const DAILY_BONUS = 500;
export const RESCUE_AMOUNT = 250;
export const RESCUE_COOLDOWN = 5 * 60 * 1000;

export const CURRENCY_SHORT = "penas";
export const CURRENCY = "🪶";