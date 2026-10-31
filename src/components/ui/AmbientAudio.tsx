"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Soft generative ambient pad built with the Web Audio API — no audio file needed.
 * On by default, but browsers block sound until the visitor interacts, so it
 * starts on the first click / key press / touch / scroll. Mute choice is remembered.
 */
const KEY = "ambient-muted";
const VOLUME = 0.05;

// Slow, warm progression: Cmaj7 → Am9 → Fmaj7 → G6 (Hz)
const CHORDS = [
  [130.81, 196.0, 246.94, 329.63],
  [110.0, 164.81, 246.94, 261.63],
  [87.31, 174.61, 220.0, 329.63],
  [98.0, 146.83, 246.94, 329.63],
];
const CHORD_SECONDS = 8;

function createEngine() {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1100;
  filter.Q.value = 0.4;

  // Simple feedback delay for a spacious, reverb-like tail.
  const delay = ctx.createDelay(2);
  delay.delayTime.value = 0.45;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.35;
  const wet = ctx.createGain();
  wet.gain.value = 0.4;
  delay.connect(feedback).connect(delay);
  delay.connect(wet).connect(master);

  filter.connect(master);
  filter.connect(delay);
  master.connect(ctx.destination);

  // Gentle filter sweep so the pad breathes.
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.05;
  lfoGain.gain.value = 350;
  lfo.connect(lfoGain).connect(filter.frequency);
  lfo.start();

  let step = 0;
  const playChord = () => {
    const t = ctx.currentTime;
    for (const f of CHORDS[step % CHORDS.length]) {
      for (const detune of [-6, 6]) {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = f;
        osc.detune.value = detune;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.09, t + 3);
        g.gain.linearRampToValueAtTime(0.07, t + CHORD_SECONDS);
        g.gain.linearRampToValueAtTime(0, t + CHORD_SECONDS + 3.5);
        osc.connect(g).connect(filter);
        osc.start(t);
        osc.stop(t + CHORD_SECONDS + 4);
      }
    }
    // A soft, sparse high note now and then.
    if (step % 2 === 0) {
      const note = ctx.createOscillator();
      note.type = "sine";
      note.frequency.value = CHORDS[step % CHORDS.length][3] * 2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t + 2);
      g.gain.linearRampToValueAtTime(0.025, t + 2.5);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 6);
      note.connect(g).connect(filter);
      note.start(t + 2);
      note.stop(t + 6.5);
    }
    step++;
  };

  playChord();
  const timer = window.setInterval(playChord, CHORD_SECONDS * 1000);

  return {
    ctx,
    fade(to: number) {
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(to, t + 1.5);
    },
    stop() {
      window.clearInterval(timer);
      ctx.close();
    },
  };
}

export function AmbientAudio() {
  const engine = useRef<ReturnType<typeof createEngine> | null>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Restore saved preference.
  useEffect(() => {
    try {
      setMuted(localStorage.getItem(KEY) === "1");
    } catch {}
  }, []);

  const start = useCallback(() => {
    if (!engine.current) engine.current = createEngine();
    const { ctx } = engine.current;
    engine.current.fade(VOLUME);
    if (ctx.state === "running") setPlaying(true);
    else ctx.resume().then(() => setPlaying(ctx.state === "running")).catch(() => {});
  }, []);

  // Autoplay on first interaction. Only real "activation" gestures unlock audio
  // (scroll/wheel/touchstart don't), so keep listening until the context is running.
  useEffect(() => {
    if (muted) return;
    const events = ["pointerdown", "click", "keydown", "touchend"] as const;
    const cleanup = () => events.forEach((e) => window.removeEventListener(e, onGesture, true));
    function onGesture() {
      start();
      const ctx = engine.current?.ctx;
      if (ctx?.state === "running") cleanup();
      else ctx?.resume().then(() => ctx.state === "running" && cleanup()).catch(() => {});
    }
    events.forEach((e) => window.addEventListener(e, onGesture, true));
    return cleanup;
  }, [muted, start]);

  useEffect(() => () => engine.current?.stop(), []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    try {
      localStorage.setItem(KEY, next ? "1" : "0");
    } catch {}
    if (next) {
      engine.current?.fade(0);
      setPlaying(false);
    } else {
      start();
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={!muted}
      aria-label={muted ? "Unmute background music" : "Mute background music"}
      title={muted ? "Play ambient music" : "Mute ambient music"}
      className="relative grid size-9 place-items-center rounded-full border border-line text-muted transition hover:border-line-strong hover:text-fg"
    >
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} className={playing ? "text-green" : ""} />}
      {playing && !muted && (
        <span aria-hidden className="absolute -right-0.5 -top-0.5 flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-green" />
        </span>
      )}
    </button>
  );
}
