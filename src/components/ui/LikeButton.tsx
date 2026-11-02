"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { playLike } from "@/lib/sfx";

function format(n: number) {
  return n.toLocaleString("en-US"); // full number with commas, never shortened (1,000 · 10,000,000)
}

const FIRST_NUDGE_MS = 6000;
const NUDGE_EVERY_MS = 20000;
const NUDGE_SHOW_MS = 3500;
const FIRST_GLOW_MS = 1200; // first visit: glow 3 times shortly after load
const GLOW_EVERY_MS = 8000; // then a single glow every few seconds

const STORAGE_KEY = "site-liked";
const POLL_MS = 10000; // re-check the shared count while the tab is visible

/** Shared like count from /api/likes (Upstash Redis). One like per visitor; hidden if the API is unavailable. */
export function LikeButton() {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [pop, setPop] = useState(0);
  const [nudging, setNudging] = useState(false);
  const [glow, setGlow] = useState<{ id: number; times: number } | null>(null);
  const [bump, setBump] = useState(0); // someone else liked → small pulse
  const busyRef = useRef(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setLiked(true);
    } catch {}
    fetch("/api/likes")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { count: number }) => setCount(d.count))
      .catch(() => setUnavailable(true));
  }, []);

  // Live count: poll every POLL_MS while the tab is visible; check at once when it becomes visible again.
  // Likes never go down, so keep the higher number (a cached reply may lag right after our own like).
  useEffect(() => {
    if (unavailable) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const check = () => {
      if (busyRef.current || document.hidden) return;
      fetch("/api/likes")
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { count: number } | null) => {
          if (!d || busyRef.current) return;
          setCount((c) => {
            if (c !== null && d.count > c) {
              setBump((b) => b + 1);
              return d.count;
            }
            return c ?? d.count;
          });
        })
        .catch(() => {});
    };
    const start = () => {
      clearInterval(timer);
      if (!document.hidden) timer = setInterval(check, POLL_MS);
    };
    const onVisible = () => {
      if (!document.hidden) check();
      start();
    };
    start();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [unavailable]);

  // Now and then, shine the button and beat the heart — stops once the visitor has liked.
  useEffect(() => {
    if (liked) return setNudging(false);
    let hide: ReturnType<typeof setTimeout>;
    const show = () => {
      setNudging(true);
      hide = setTimeout(() => setNudging(false), NUDGE_SHOW_MS);
    };
    const first = setTimeout(show, FIRST_NUDGE_MS);
    const every = setInterval(show, NUDGE_EVERY_MS);
    return () => {
      clearTimeout(first);
      clearInterval(every);
      clearTimeout(hide);
    };
  }, [liked]);

  // Glow ring: 3 pulses on arrival, then one pulse every few seconds — until liked.
  useEffect(() => {
    if (liked || reduce) return setGlow(null);
    let id = 0;
    const first = setTimeout(() => setGlow({ id: ++id, times: 3 }), FIRST_GLOW_MS);
    const every = setInterval(() => setGlow({ id: ++id, times: 1 }), GLOW_EVERY_MS);
    return () => {
      clearTimeout(first);
      clearInterval(every);
    };
  }, [liked, reduce]);

  async function like() {
    if (liked || busy || count === null) return;
    const prev = count;
    setBusy(true);
    busyRef.current = true;
    setLiked(true);
    setCount(prev + 1);
    setPop((p) => p + 1);
    setNudging(false);
    playLike();
    try {
      const r = await fetch("/api/likes", { method: "POST" });
      if (!r.ok) throw new Error(String(r.status));
      const d: { count: number } = await r.json();
      setCount((c) => Math.max(c ?? 0, d.count));
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    } catch {
      setLiked(false);
      setCount(prev);
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  if (unavailable) return null;

  const shown = count === null ? "–" : format(count);
  const label = liked ? `You liked this site (${shown} likes)` : `Like this site (${shown} likes)`;

  return (
    <div className="relative">
      {glow && (
        <span
          key={glow.id}
          aria-hidden
          className="like-glow pointer-events-none absolute inset-0 rounded-full"
          style={{ animationIterationCount: glow.times }}
        />
      )}
      <button
        type="button"
        onClick={like}
        aria-pressed={liked}
        aria-label={label}
        title={`♥ ${shown}`}
        disabled={busy}
        className={cn(
          "relative flex h-9 disabled:cursor-wait items-center gap-1.5 overflow-hidden rounded-full border px-2.5 transition",
          liked ? "border-line text-[var(--red)]" : "text-muted hover:border-line-strong hover:text-fg",
          !liked && (nudging ? "border-[var(--red)]/60 text-[var(--red)]" : "border-line"),
        )}
      >
        {nudging && !reduce && (
          <span
            aria-hidden
            className="like-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-fg/25 to-transparent"
          />
        )}
        <motion.span
          key={liked ? `p${pop}b${bump}` : `n${nudging}b${bump}`}
          className="grid place-items-center"
          initial={reduce || (pop === 0 && bump === 0 && !nudging) ? false : { scale: 0.6 }}
          animate={nudging && !reduce ? { scale: [1, 1.3, 1, 1.25, 1] } : { scale: 1 }}
          transition={
            nudging && !reduce
              ? { duration: 1.1, ease: "easeInOut" }
              : { type: "spring", stiffness: 500, damping: 12 }
          }
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
        </motion.span>
        <span className="hidden overflow-hidden font-mono text-xs tabular-nums sm:inline-flex">
          <motion.span
            key={`c${bump}`}
            className="min-w-[1ch]"
            initial={reduce || bump === 0 ? false : { y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {shown}
          </motion.span>
        </span>
      </button>
    </div>
  );
}
