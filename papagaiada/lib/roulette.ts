export const ROULETTE_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const REDS = new Set([
  32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3,
]);

export type CellColor = "red" | "black" | "green";

export function cellColor(n: number): CellColor {
  if (n === 0) return "green";
  return REDS.has(n) ? "red" : "black";
}

export const SEG_WIDTH = 360 / ROULETTE_ORDER.length;

export interface Wedge {
  index: number;
  number: number;
  color: CellColor;
  colorHex: string;
  path: string;
  labelX: number;
  labelY: number;
  labelDeg: number;
}

const CX = 200;
const CY = 200;
const R = 185;

function polar(deg: number, radius: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

function wedgePath(startDeg: number, endDeg: number) {
  const s = polar(startDeg, R);
  const e = polar(endDeg, R);
  const large = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${CX} ${CY} L ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)} Z`;
}

const COLOR_HEX: Record<CellColor, string> = {
  red: "#e63946",
  black: "#1d2b40",
  green: "#1a9e5a",
};

export function buildWedges(): Wedge[] {
  return ROULETTE_ORDER.map((number, index) => {
    const center = index * SEG_WIDTH - 90 + SEG_WIDTH / 2;
    const color = cellColor(number);
    const labelRadius = R * 0.62;
    const p = polar(center, labelRadius);
    return {
      index,
      number,
      color,
      colorHex: COLOR_HEX[color],
      path: wedgePath(index * SEG_WIDTH - 90, (index + 1) * SEG_WIDTH - 90),
      labelX: p.x,
      labelY: p.y,
      labelDeg: center + 90,
    };
  });
}

export type BetKey =
  | `s:${number}`
  | "c:red"
  | "c:black"
  | "c:green"
  | `d:${1 | 2 | 3}`
  | "low"
  | "high"
  | "even"
  | "odd";

export type Bets = Partial<Record<BetKey, number>>;

export const BET_META: Record<string, { label: string; odds: number }> = {
  "c:red": { label: "Vermelho", odds: 1 },
  "c:black": { label: "Preto", odds: 1 },
  "c:green": { label: "Zero", odds: 35 },
  low: { label: "1–18", odds: 1 },
  high: { label: "19–36", odds: 1 },
  even: { label: "Par", odds: 1 },
  odd: { label: "Ímpar", odds: 1 },
  "d:1": { label: "1ª dúzia", odds: 2 },
  "d:2": { label: "2ª dúzia", odds: 2 },
  "d:3": { label: "3ª dúzia", odds: 2 },
};

export function betLabel(key: BetKey): string {
  if (key.startsWith("s:")) return `Número ${key.slice(2)}`;
  return BET_META[key]?.label ?? key;
}

export function betOdds(key: BetKey): number {
  if (key.startsWith("s:")) return 35;
  return BET_META[key]?.odds ?? 1;
}

export function betWins(key: BetKey, number: number): boolean {
  if (key.startsWith("s:")) return Number(key.slice(2)) === number;
  switch (key) {
    case "c:red":
      return cellColor(number) === "red";
    case "c:black":
      return cellColor(number) === "black";
    case "c:green":
      return number === 0;
    case "low":
      return number >= 1 && number <= 18;
    case "high":
      return number >= 19 && number <= 36;
    case "even":
      return number !== 0 && number % 2 === 0;
    case "odd":
      return number % 2 === 1;
    case "d:1":
      return number >= 1 && number <= 12;
    case "d:2":
      return number >= 13 && number <= 24;
    case "d:3":
      return number >= 25 && number <= 36;
  }
  return false;
}

export function computeReturn(bets: Bets, number: number): number {
  let ret = 0;
  for (const [key, amount] of Object.entries(bets) as [BetKey, number][]) {
    if (betWins(key, number)) {
      ret += amount * (betOdds(key) + 1);
    }
  }
  return ret;
}

export type BetZonePos =
  | { kind: "color"; color: CellColor }
  | { kind: "dozen"; n: 1 | 2 | 3 }
  | { kind: "low" }
  | { kind: "high" }
  | { kind: "even" }
  | { kind: "odd" }
  | { kind: "number"; n: number };

export function zoneToKey(zone: BetZonePos): BetKey {
  switch (zone.kind) {
    case "color":
      return `c:${zone.color}` as BetKey;
    case "dozen":
      return `d:${zone.n}` as BetKey;
    case "number":
      return `s:${zone.n}` as BetKey;
    default:
      return zone.kind as BetKey;
  }
}

export const CHIP_VALUES = [25, 50, 100, 500];

export function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

export function randomBallAngle(): number {
  return (4 + Math.floor(Math.random() * 4)) * 360;
}

export function spinWheel(): number {
  return ROULETTE_ORDER[randomInt(ROULETTE_ORDER.length)];
}

export function nextWheelRotation(prevRotation: number, winningNumber: number): number {
  const wedges = buildWedges();
  const index = wedges.findIndex((w) => w.number === winningNumber);
  const center = index * SEG_WIDTH - 90 + SEG_WIDTH / 2;
  const jitter = (Math.random() - 0.5) * SEG_WIDTH;
  const base = Math.ceil(prevRotation / 360) * 360;
  const turns = 5 + Math.floor(Math.random() * 3);
  return base + turns * 360 - center + jitter;
}