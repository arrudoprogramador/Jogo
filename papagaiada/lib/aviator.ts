/**
 * Lógica do jogo Aviator (crash-style), 100% fictício.
 *
 * O multiplicador sobe com o tempo e "crasha" em um ponto aleatório M.
 * Quem saca antes do crash ganha aposta x multiplicador atual. A casa
 * fica com ~3% de vantagem: P(M > c) = houseEdge / c, então para qualquer
 * pressuposto de saque fixo c o retorno esperado é ~houseEdge (97%).
 */

export const TICK_MS = 100;
export const MULT_PER_SEC = 0.12;
export const MAX_MULT = 5000;

export function crashPoint(houseEdge = 0.03): number {
  const u = Math.random();
  if (u <= 0) return 1;
  return Math.min(MAX_MULT, Math.max(1, (1 - houseEdge) / u));
}

export function crashTimeMs(crashAt: number): number {
  return ((crashAt - 1) / MULT_PER_SEC) * 1000;
}

export function multAtElapsed(elapsedSec: number): number {
  return 1 + elapsedSec * MULT_PER_SEC;
}

export function formatMult(m: number): string {
  return `${m.toFixed(2)}x`;
}