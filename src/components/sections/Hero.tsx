"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Briefcase, Building2, Code2, Download, GraduationCap, MapPin, Trophy, X, type LucideIcon } from "lucide-react";
import { profile } from "@/content/profile";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SocialLinks } from "@/components/layout/Footer";
import { Terminal } from "./Terminal";
import { playTerminalClose, playTerminalOpen } from "@/lib/sfx";

function Portrait({ hasPortrait }: { hasPortrait: boolean }) {
  return (
    <div className="relative size-full">
      {/* rotating accent ring */}
      <div aria-hidden className="absolute -inset-px overflow-hidden rounded-[2rem]">
        <div className="absolute -inset-[60%] animate-[spin_14s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,var(--green)_60deg,transparent_120deg,transparent_180deg,var(--violet)_240deg,transparent_300deg)] opacity-60" />
      </div>
      <div className="relative size-full overflow-hidden rounded-[2rem] border border-line bg-elev">
        {hasPortrait ? (
          <Image src={profile.portrait} alt={`Portrait of ${profile.name}`} fill priority sizes="(max-width: 768px) 80vw, 300px" className="object-cover" />
        ) : (
          <div className="grid-bg grid size-full place-items-center">
            <p className="font-serif text-8xl italic text-fg/90">VB</p>
          </div>
        )}
        <div className="glass absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl border border-line px-4 py-3">
          <div>
            <p className="text-sm font-medium">{profile.designation}</p>
            <p className="text-xs text-muted">@ {profile.company}</p>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-green">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-green" />
            </span>
            building
          </span>
        </div>
      </div>
    </div>
  );
}

const stats: { value: string; label: string; title: string; icon: LucideIcon; tone: string }[] = [
  { value: profile.yearsExperience, title: "Experience", label: "years engineering", icon: Briefcase, tone: "text-green border-green/30 bg-green/10" },
  { value: "4", title: "Organisations", label: "Cisco · Zoho · Virtusa · PARO IT", icon: Building2, tone: "text-violet border-violet/30 bg-violet/10" },
  { value: "3×", title: "Award", label: "Automation Genie", icon: Trophy, tone: "text-amber-400 border-amber-400/30 bg-amber-400/10" },
];

/** Icon tile with a periodic light sweep (shared shine style from Awards). */
function ShineIcon({ icon: I, tone }: { icon: LucideIcon; tone: string }) {
  return (
    <span className={`relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl border ${tone}`}>
      <I size={18} aria-hidden />
      <span aria-hidden className="cup-shine pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </span>
  );
}

export function Hero({ hasPortrait, hasResume }: { hasPortrait: boolean; hasResume: boolean }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  // Keep the terminal mounted until the flip-back finishes so the back face isn't empty mid-turn.
  const [mounted, setMounted] = useState(false);
  const toggle = (next = !open) => {
    if (next === open) return;
    (next ? playTerminalOpen : playTerminalClose)();
    if (next) setMounted(true);
    setOpen(next);
  };
  const fade = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section id="about" className="relative overflow-hidden pt-16">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--green)_14%,transparent),transparent)] blur-2xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 md:py-20">
        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[minmax(0,1fr)_560px]">
          <div className="min-w-0">
            <motion.p {...fade(0)} className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-elev/60 px-3 py-1.5 font-mono text-xs text-muted">
              <MapPin size={12} className="text-green" /> {profile.location}
              <span className="text-line-strong">|</span>
              Currently at <span className="text-fg">{profile.company}</span>
            </motion.p>

            <motion.div {...fade(1)} className="flex flex-wrap items-center gap-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{profile.name}</h1>
              {/* Terminal launcher */}
              <button
                type="button"
                onClick={() => toggle()}
                aria-expanded={open}
                aria-label={open ? "Close interactive terminal" : "Open interactive terminal"}
                className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-4 py-2 font-mono text-sm transition hover:scale-105 ${
                  open
                    ? "border-red-500/60 bg-red-500/10 text-red-400 shadow-[0_0_18px_rgba(239,68,68,0.4)] hover:border-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.65)]"
                    : "border-green/50 bg-green/10 text-green shadow-[0_0_18px_rgba(62,230,154,0.35)] hover:border-green hover:shadow-[0_0_30px_rgba(62,230,154,0.6)]"
                }`}
              >
                {!open && <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-green/50 [animation-duration:2.4s]" />}
                <Code2 size={16} strokeWidth={2.4} />
                {open ? "close ›_" : "try me ›_"}
                <span aria-hidden className="cup-shine pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </button>
            </motion.div>
            <motion.p {...fade(2)} className="mt-3 font-mono text-sm text-muted">
              {profile.tagline}
            </motion.p>

            <motion.p {...fade(3)} className="mt-6 text-2xl font-semibold leading-tight tracking-tight text-balance sm:text-3xl">
              {profile.headline[0]}{" "}
              <span className="font-serif font-normal italic text-gradient">{profile.headline[1]}</span>
            </motion.p>

            <motion.p {...fade(3)} className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {profile.intro}
            </motion.p>

            <motion.div {...fade(4)} className="mt-7 flex flex-wrap items-center gap-3">
              <ButtonLink href="/#projects">
                View Projects <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href={hasResume ? profile.resume : "[RESUME]"} variant="ghost" download>
                <Download size={16} /> Resume
              </ButtonLink>
              <SocialLinks />
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full [perspective:1600px]"
          >
            {/* 3D flip card: photo on the front, terminal on the back */}
            <motion.div
              animate={{ rotateY: open ? 180 : 0, scale: open ? [1, 0.9, 1] : [1.0001, 0.9, 1], width: open ? 560 : 340 }}
              onAnimationComplete={() => !open && setMounted(false)}
              transition={{
                rotateY: reduce ? { duration: 0 } : { duration: 0.9, ease: [0.65, 0, 0.35, 1] },
                scale: reduce ? { duration: 0 } : { duration: 0.9, times: [0, 0.5, 1], ease: "easeInOut" },
                width: reduce ? { duration: 0 } : { duration: 0.9, ease: [0.65, 0, 0.35, 1] },
              }}
              initial={false}
              className="relative mx-auto h-[425px] max-w-full [transform-style:preserve-3d] lg:mr-0"
            >
              <div
                aria-hidden={open}
                className={`absolute inset-0 [backface-visibility:hidden] ${open ? "pointer-events-none" : ""}`}
              >
                <Portrait hasPortrait={hasPortrait} />
              </div>
              <div
                aria-hidden={!open}
                className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] ${open ? "" : "pointer-events-none"}`}
              >
                {mounted && (
                  <div className="relative size-full">
                    <Terminal height="flex-1" className="size-full rounded-[2rem] shadow-[0_0_40px_rgba(62,230,154,0.18)]" onClose={() => toggle(false)} />
                    <button
                      type="button"
                      onClick={() => toggle(false)}
                      aria-label="Close terminal"
                      className="absolute right-4 top-2.5 rounded-md p-1 text-muted transition hover:bg-fg/5 hover:text-fg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Quick facts + education */}
        <motion.dl {...fade(5)} className="mt-12 grid grid-cols-3 gap-3 md:grid-cols-[1fr_1fr_1fr_2fr]">
          {stats.map((s) => (
            <div key={s.title} className="card flex flex-col gap-3 px-4 py-5 sm:flex-row sm:items-start sm:gap-4 sm:px-5">
              <ShineIcon icon={s.icon} tone={s.tone} />
              <div className="min-w-0">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{s.title}</dt>
                <dd className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{s.value}</dd>
                <dd className="mt-0.5 text-xs text-muted">{s.label}</dd>
              </div>
            </div>
          ))}
          <div className="card col-span-3 flex items-start gap-4 px-5 py-5 md:col-span-1">
            <ShineIcon icon={GraduationCap} tone="text-cyan border-cyan/30 bg-cyan/10" />
            <div className="min-w-0">
              <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Education</dt>
              <dd className="mt-1 font-semibold">{profile.school.degree}</dd>
              <dd className="text-sm text-muted">{profile.school.college}</dd>
              <dd className="mt-1 font-mono text-xs text-muted">
                {profile.school.years} · <span className="text-green">{profile.school.score}</span>
              </dd>
            </div>
          </div>
        </motion.dl>
      </div>
    </section>
  );
}
