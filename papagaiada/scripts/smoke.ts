import {
  ROULETTE_ORDER,
  cellColor,
  computeReturn,
  betWins,
  spinWheel,
  SEG_WIDTH,
  buildWedges,
} from "../lib/roulette";
import { spinSlots, buildReelStrip, SLOT_SYMBOLS } from "../lib/slots";
import { crashPoint, multAtElapsed, crashTimeMs } from "../lib/aviator";

const failures = new Set<string>();
function check(cond: boolean, msg: string) {
  if (!cond) failures.add(msg);
}

// --- Roulette ---
const order = [...ROULETTE_ORDER];
check(order.length === 37, "roleta deve ter 37 números");
check(new Set(order).size === 37, "roleta não deve ter números repetidos");
check(order.every((n) => n >= 0 && n <= 36), "todos os números entre 0 e 36");
check(
  Array.from({ length: 37 }, (_, i) => i).every((n) => order.includes(n)),
  "tem todos os números 0..36",
);

check(cellColor(0) === "green", "0 é verde");
check(cellColor(1) === "red", "1 é vermelho");
check(cellColor(2) === "black", "2 é preto");

const redCount = order.filter((n) => cellColor(n) === "red").length;
const blackCount = order.filter((n) => cellColor(n) === "black").length;
check(redCount === 18 && blackCount === 18, `18 vermelhos e 18 pretos (${redCount}, ${blackCount})`);

check(betWins("s:17", 17), "aposta direta 17 vence no 17");
check(!betWins("s:17", 18), "aposta direta 17 perde no 18");
check(computeReturn({ "s:17": 100 }, 17) === 3600, "straight paga 35:1 (100→3600)");
check(computeReturn({ "s:17": 100 }, 18) === 0, "straight perde");
check(computeReturn({ "c:red": 100 }, 14) === 200, "vermelho paga 1:1");
check(computeReturn({ "c:red": 100 }, 15) === 0, "vermelho perde no preto");
check(computeReturn({ "c:black": 100 }, 0) === 0, "preto perde no zero");
check(betWins("even", 16) && !betWins("even", 15), "par/ímpar");
check(betWins("even", 0) === false, "zero não é par");
check(betWins("low", 18) && !betWins("low", 19), "baixo 1-18");
check(betWins("d:2", 24) && !betWins("d:2", 25), "dúzias");
check(computeReturn({ "d:1": 100 }, 5) === 300, "dúzia paga 2:1");
check(
  computeReturn({ "c:red": 50, "s:14": 10 }, 14) === 50 * 2 + 10 * 36,
  "apostas múltiplas acumulam",
);

for (let i = 0; i < 1000; i++) {
  const w = spinWheel();
  check(w >= 0 && w <= 36, "spin fora do range");
}

const wedges = buildWedges();
check(wedges.length === 37, "37 wedges");
check(Math.abs(wedges.length * SEG_WIDTH - 360) < 0.001, "ângulo total 360");

// --- Slots ---
let totalRet = 0;
const N = 300000;
const lenBad = { count: 0 };
for (let i = 0; i < N; i++) {
  const r = spinSlots();
  if (r.symbols.length !== 3) lenBad.count++;
  const mult = SLOT_SYMBOLS.find((s) => s.id === r.symbols[0].id)?.mult ?? 0;
  totalRet += r.pays;
  const allEqual = r.symbols.every((s) => s.id === r.symbols[0].id);
  check(
    (allEqual && r.pays === mult) || (!allEqual && r.pays === 0),
    `pays inconsistente (${JSON.stringify(r.symbols.map((s) => s.id))}, pays=${r.pays})`,
  );
}
check(lenBad.count === 0, `3 símbolos por giro (falhouem ${lenBad.count})`);

const rtp = totalRet / N;
console.log(`RTP slots (${N} giros): ${(rtp * 100).toFixed(2)}%`);
check(rtp > 0.4 && rtp < 1.1, `RTP dentro do esperado (${rtp.toFixed(3)})`);

for (const sym of SLOT_SYMBOLS) {
  const strip = buildReelStrip(sym, 24);
  check(strip.length === 24, `strip 24 (${sym.id})`);
  check(strip[6].id === sym.id, `alvo ${sym.id} no centro`);
}

// --- Aviator (crash) ---
let avTotalReturn = 0;
let avMinMult = Infinity;
let avMaxMult = 0;
const AV_N = 300000;
const CASHOUT = 2.0;
for (let i = 0; i < AV_N; i++) {
  const m = crashPoint();
  if (m < avMinMult) avMinMult = m;
  if (m > avMaxMult) avMaxMult = m;
  avTotalReturn += m > CASHOUT ? CASHOUT : 0;
}
check(avMinMult >= 1, `multiplicador mínimo >= 1 (${avMinMult})`);
check(avMaxMult <= 5000, `multiplicador máximo respeita cap (${avMaxMult})`);
const avRtp = avTotalReturn / AV_N;
console.log(`RTP aviator (${AV_N} rondas, saque fixo ${CASHOUT}x): ${(avRtp * 100).toFixed(2)}%`);
check(avRtp > 0.9 && avRtp < 1.04, `RTP aviator ~97% (${avRtp.toFixed(3)})`);

const probe = crashPoint();
check(crashTimeMs(2) > 0, "crashTimeMs positivo");
check(Math.abs(multAtElapsed(0) - 1) < 1e-9, "mult começa em 1x");
check(multAtElapsed(8.4) > 2, "mult sobe com o tempo");
check(multAtElapsed(0) <= probe && probe <= 5000, "crashPoint no range");

if (failures.size === 0) {
  console.log("✓ TODOS OS TESTES PASSARAM");
  process.exit(0);
}
console.error(`✗ ${failures.size} teste(s) falharam:`);
for (const f of failures) console.error(`  - ${f}`);
process.exit(1);