let audioCtx: AudioContext | null = null;

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType = "sine",
  vol = 0.2,
  freqEnd?: number,
  delay = 0,
) {
  const c = ctx();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  click() {
    tone(700, 0.08, "triangle", 0.12, 520);
  },
  chip() {
    tone(920, 0.07, "triangle", 0.16, 700);
    tone(1240, 0.09, "sine", 0.1, undefined, 0.05);
  },
  no() {
    tone(220, 0.16, "sawtooth", 0.1, 160);
  },
  tick() {
    tone(2200, 0.03, "square", 0.05, 1800);
    tone(1600, 0.04, "triangle", 0.06, 1200, 0.005);
  },
  spin() {
    tone(300, 0.14, "triangle", 0.05, 120, 0);
    tone(420, 0.14, "triangle", 0.05, 160, 0.12);
    tone(540, 0.14, "triangle", 0.05, 200, 0.24);
    tone(660, 0.14, "triangle", 0.05, 240, 0.36);
    tone(600, 0.1, "triangle", 0.04, 220, 0.5);
    tone(520, 0.1, "triangle", 0.04, 180, 0.62);
  },
  win() {
    const notes = [523, 659, 784, 1046, 784, 1046, 1318];
    notes.forEach((n, i) => tone(n, 0.22, "triangle", 0.16, undefined, i * 0.13));
    tone(1568, 0.6, "sine", 0.12, undefined, 0.95);
    tone(2093, 0.5, "sine", 0.08, undefined, 1.05);
  },
  jackpot() {
    const notes = [523, 659, 784, 1046, 784, 1046, 1318, 1568, 1318, 1568, 2093];
    notes.forEach((n, i) => tone(n, 0.22, "square", 0.1, undefined, i * 0.12));
    tone(2093, 1.2, "sine", 0.14, undefined, 1.3);
    tone(2637, 1.4, "sine", 0.12, undefined, 1.5);
    for (let i = 0; i < 12; i++) {
      tone(1400 + Math.random() * 1600, 0.1, "triangle", 0.06, undefined, 1.4 + i * 0.09);
    }
  },
  lose() {
    tone(330, 0.22, "sine", 0.13, 240);
    tone(220, 0.3, "sine", 0.12, 150, 0.18);
  },
  bonus() {
    tone(660, 0.12, "triangle", 0.15, undefined, 0);
    tone(880, 0.12, "triangle", 0.15, undefined, 0.12);
    tone(1100, 0.2, "triangle", 0.15, undefined, 0.24);
  },
};