/**
 * Small synthesized UI sounds (Web Audio, no files).
 * Silent when the visitor has muted the site's audio toggle.
 */
let ctx: AudioContext | null = null;

function audio() {
  try {
    if (localStorage.getItem("ambient-muted") === "1") return null;
  } catch {}
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function beep(c: AudioContext, at: number, freq: number, dur: number, type: OscillatorType, vol: number, toFreq?: number) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, at);
  if (toFreq) o.frequency.exponentialRampToValueAtTime(toFreq, at + dur);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(vol, at + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g).connect(c.destination);
  o.start(at);
  o.stop(at + dur + 0.02);
}

/** Short burst of filtered noise — a mechanical key click. */
function click(c: AudioContext, at: number, vol = 0.12) {
  const len = Math.floor(c.sampleRate * 0.025);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 2500 + Math.random() * 1500;
  const g = c.createGain();
  g.gain.value = vol;
  src.connect(f).connect(g).connect(c.destination);
  src.start(at);
}

/** Terminal boot: rapid key clicks, data chirps, then a rising "access granted" tone. */
export function playTerminalOpen() {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + 0.01;
  for (let i = 0; i < 7; i++) click(c, t + i * 0.045 + Math.random() * 0.015);
  for (let i = 0; i < 6; i++) beep(c, t + 0.05 + i * 0.04, 900 + Math.random() * 1400, 0.03, "square", 0.025);
  beep(c, t + 0.34, 440, 0.12, "square", 0.05, 880);
  beep(c, t + 0.46, 1320, 0.16, "sine", 0.06);
}

/** Terminal shutdown: falling tone with a final click. */
export function playTerminalClose() {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + 0.01;
  beep(c, t, 880, 0.18, "square", 0.045, 220);
  beep(c, t + 0.12, 330, 0.14, "sine", 0.05, 110);
  click(c, t + 0.26, 0.1);
}
