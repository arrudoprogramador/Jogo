"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type Player,
  type StorageShape,
  type AvatarEmoji,
  DAILY_BONUS,
  RESCUE_AMOUNT,
  RESCUE_COOLDOWN,
  START_BALANCE,
} from "@/lib/types";
import { sfx } from "@/lib/sound";

const STORAGE_KEY = "papagaiada_v1";

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function defaultState(): StorageShape {
  return { version: 1, players: [], activeId: null, muted: false };
}

function normalizePlayer(p: Player): Player {
  const stats = {
    plays: p.stats?.plays ?? 0,
    wins: p.stats?.wins ?? 0,
    bestWin: p.stats?.bestWin ?? 0,
    profit: p.stats?.profit ?? 0,
    streak: p.stats?.streak ?? 0,
    bestStreak: p.stats?.bestStreak ?? 0,
    bestMultiplier: p.stats?.bestMultiplier ?? 0,
  };
  return {
    ...p,
    name: typeof p.name === "string" ? p.name : "Jogador",
    avatar: p.avatar ?? "🦜",
    balance: typeof p.balance === "number" ? p.balance : START_BALANCE,
    createdAt: p.createdAt ?? 0,
    lastDaily: p.lastDaily ?? 0,
    lastRescue: p.lastRescue ?? 0,
    stats,
  };
}

function load(): StorageShape {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
const parsed = JSON.parse(raw) as StorageShape;
    if (parsed?.version === 1 && Array.isArray(parsed.players)) {
      return {
        ...parsed,
        players: parsed.players.map(normalizePlayer),
      };
    }
    return defaultState();
  } catch {
    return defaultState();
  }
}

export interface Toast {
  id: number;
  text: string;
  tone: "win" | "lose" | "info" | "bonus";
}

interface GameApi {
  data: StorageShape | null;
  ready: boolean;
  active: Player | null;
  muted: boolean;
  toast: Toast | null;
  login: (id: string) => void;
  logout: () => void;
  addPlayer: (name: string, avatar: AvatarEmoji) => Player;
  updatePlayer: (id: string, fn: (p: Player) => Player) => void;
  setMuted: (m: boolean) => void;
  claimDaily: () => boolean;
  claimRescue: () => void;
  pushToast: (text: string, tone?: Toast["tone"]) => void;
  playSfx: (name: keyof typeof sfx) => void;
}

const GameContext = createContext<GameApi | null>(null);

const EMPTY: StorageShape = {
  version: 1,
  muted: false,
  activeId: null,
  players: [],
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StorageShape | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    // Hydrate from localStorage only on the client (avoids SSR mismatch on reload).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(load());
  }, []);

  useEffect(() => {
    if (!data) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* quota / private mode */
    }
  }, [data]);

  const ready = data !== null;
  const active =
    (data ? data.players.find((p) => p.id === data.activeId) : null) ?? null;

  const playSfx = (name: keyof typeof sfx) => {
    if (data && !data.muted) sfx[name]();
  };

  const pushToast = (text: string, tone: Toast["tone"] = "info") => {
    const id = Date.now() + Math.random();
    setToast({ id, text, tone });
    window.setTimeout(() => {
      setToast((t) => (t?.id === id ? null : t));
    }, 3000);
  };

const api: GameApi = {
    data,
    ready,
    active,
    muted: data?.muted ?? false,
    toast,
login: (id) => setData((d) => ({ ...(d ?? EMPTY), activeId: id })),
    logout: () => setData((d) => ({ ...(d ?? EMPTY), activeId: null })),
    addPlayer: (name, avatar) => {
      const player: Player = {
        id: uid(),
        name: name.trim(),
        avatar,
        balance: START_BALANCE,
          createdAt: Date.now(),
        lastDaily: 0,
        lastRescue: 0,
        stats: { plays: 0, wins: 0, bestWin: 0, profit: 0, streak: 0, bestStreak: 0, bestMultiplier: 0 },
      };
setData((d) => {
        const base = d ?? EMPTY;
        return {
          ...base,
          players: [...base.players, player],
          activeId: player.id,
        };
      });
      return player;
    },
    updatePlayer: (id, fn) =>
      setData((d) => ({
        ...(d ?? EMPTY),
        players: (d ?? EMPTY).players.map((p) => (p.id === id ? fn(p) : p)),
      })),
    setMuted: (m) => setData((d) => ({ ...(d ?? EMPTY), muted: m })),
    claimDaily: () => {
      const today = new Date().toDateString();
      const playedToday =
        active && new Date(active.lastDaily).toDateString() === today;
      if (!active || playedToday) return false;
      api.updatePlayer(active.id, (p) => ({
        ...p,
        balance: p.balance + DAILY_BONUS,
          lastDaily: Date.now(),
      }));
      return true;
    },
claimRescue: () => {
      if (!active) return;
      api.updatePlayer(active.id, (p) => {
        const now = Date.now();
        if (now - p.lastRescue < RESCUE_COOLDOWN) return p;
        return { ...p, balance: p.balance + RESCUE_AMOUNT, lastRescue: now };
      });
    },
    playSfx,
    pushToast,
  };

  return <GameContext.Provider value={api}>{children}</GameContext.Provider>;
}

export function useGame(): GameApi {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

export function fmt(n: number): string {
  return n.toLocaleString("pt-BR");
}

export function isDailyAvailable(player: Player): boolean {
  return new Date(player.lastDaily).toDateString() !== new Date().toDateString();
}

export function rescueAvailable(player: Player): boolean {
  return Date.now() - player.lastRescue >= RESCUE_COOLDOWN;
}
