"use client";

import { useEffect, useState } from "react";
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

/** Stateless for now: count lives only in memory and resets on reload; unlimited clicks. */
export function LikeButton() {
  const [count, setCount] = useState(0);
  const [nudging, setNudging] = useState(false);
  const [glow, setGlow] = useState<{ id: number; times: number } | null>(null);
  const reduce = useReducedMotion();
  const liked = count > 0;

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

  function like() {
    setCount((c) => c + 1);
    setNudging(false);
    playLike();
  }

  const label = `Like this site (${count} likes)`;

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
        title={`♥ ${format(count)}`}
        className={cn(
          "relative flex h-9 items-center gap-1.5 overflow-hidden rounded-full border px-2.5 transition",
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
          key={liked ? count : `n${nudging}`}
          className="grid place-items-center"
          initial={reduce || (count === 0 && !nudging) ? false : { scale: 0.6 }}
          animate={nudging && !reduce ? { scale: [1, 1.3, 1, 1.25, 1] } : { scale: 1 }}
          transition={
            nudging && !reduce
              ? { duration: 1.1, ease: "easeInOut" }
              : { type: "spring", stiffness: 500, damping: 12 }
          }
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
        </motion.span>
        <span className="hidden min-w-[1ch] font-mono text-xs tabular-nums sm:inline">{format(count)}</span>
      </button>

    </div>
  );
}
