export interface SlotSymbol {
  id: string;
  icon: string;
  mult: number;
  weight: number;
  glow?: boolean;
}

export const SLOT_SYMBOLS: SlotSymbol[] = [
  { id: "coconut", icon: "🥥", mult: 8, weight: 5 },
  { id: "cherry", icon: "🍒", mult: 12, weight: 4 },
  { id: "pineapple", icon: "🍍", mult: 20, weight: 3 },
  { id: "clover", icon: "🍀", mult: 35, weight: 2, glow: true },
  { id: "parrot", icon: "🦜", mult: 70, weight: 1.1, glow: true },
  { id: "seven", icon: "7️⃣", mult: 250, weight: 0.7, glow: true },
];

export const SLOT_SYMBOL_BY_ID: Record<string, SlotSymbol> = Object.fromEntries(
  SLOT_SYMBOLS.map((s) => [s.id, s]),
);

const TOTAL_WEIGHT = SLOT_SYMBOLS.reduce((a, s) => a + s.weight, 0);

function randomSymbol(): SlotSymbol {
  let roll = Math.random() * TOTAL_WEIGHT;
  for (const sym of SLOT_SYMBOLS) {
    roll -= sym.weight;
    if (roll <= 0) return sym;
  }
  return SLOT_SYMBOLS[0];
}

export interface SlotSpinResult {
  symbols: SlotSymbol[];
  pays: number; // return multiplier on bet (0 = lose)
  jackpot: boolean;
}

export function spinSlots(): SlotSpinResult {
  const symbols = Array.from({ length: 3 }, () => randomSymbol());
  const first = symbols[0];
  const match = symbols.every((s) => s.id === first.id);
  const pays = match ? first.mult : 0;
  return { symbols, pays, jackpot: match && first.id === "seven" };
}

export function buildReelStrip(target: SlotSymbol, length = 12): SlotSymbol[] {
  const targetIndex = 6;
  const strip: SlotSymbol[] = [];
  for (let i = 0; i < length; i++) {
    if (i === targetIndex) {
      strip.push(target);
    } else if (i === targetIndex - 1 || i === targetIndex + 1) {
      strip.push(Math.random() < 0.45 ? target : randomSymbol());
    } else {
      strip.push(randomSymbol());
    }
  }
  return strip;
}

export const SYMBOL_H = 72;