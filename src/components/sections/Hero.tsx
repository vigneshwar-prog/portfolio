"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download, MapPin, MessageSquare } from "lucide-react";
import { profile } from "@/content/profile";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SocialLinks } from "@/components/layout/Footer";

function Portrait({ hasPortrait }: { hasPortrait: boolean }) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[340px]">
      {/* rotating accent ring */}
      <div aria-hidden className="absolute -inset-px overflow-hidden rounded-[2rem]">
        <div className="absolute -inset-[60%] animate-[spin_14s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,var(--green)_60deg,transparent_120deg,transparent_180deg,var(--violet)_240deg,transparent_300deg)] opacity-60" />
      </div>
      <div className="relative size-full overflow-hidden rounded-[2rem] border border-line bg-elev">
        {hasPortrait ? (
          <Image
            src={profile.portrait}
            alt={`Portrait of ${profile.name}`}
            fill
            priority
            sizes="(max-width: 768px) 80vw, 340px"
            className="object-cover"
          />
        ) : (
          <div className="grid-bg grid size-full place-items-center">
            <div className="text-center">
              <p className="font-serif text-8xl italic text-fg/90">VB</p>
              <p className="mt-3 font-mono text-[11px] text-muted">add public/images/profile.jpg</p>
            </div>
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

export function Hero({ hasPortrait, hasResume }: { hasPortrait: boolean; hasResume: boolean }) {
  const reduce = useReducedMotion();
  const fade = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-16">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--green)_14%,transparent),transparent)] blur-2xl" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 py-16 sm:px-6 md:grid-cols-[1.35fr_1fr] md:py-24">
        <div>
          <motion.p {...fade(0)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-elev/60 px-3 py-1.5 font-mono text-xs text-muted">
            <MapPin size={12} className="text-green" /> {profile.location}
            <span className="text-line-strong">|</span>
            Currently at <span className="text-fg">{profile.company}</span>
          </motion.p>

          <motion.h1 {...fade(1)} className="font-mono text-sm uppercase tracking-[0.35em] text-muted">
            {profile.name}
          </motion.h1>

          <motion.p {...fade(2)} className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {profile.headline[0]}{" "}
            <span className="font-serif font-normal italic text-gradient">{profile.headline[1]}</span>
          </motion.p>

          <motion.p {...fade(3)} className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {profile.intro}
          </motion.p>

          <motion.ul {...fade(4)} className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
            {["Backend", "AI & RAG", "MCP", "Automation", "Distributed Systems"].map((t) => (
              <li key={t} className="rounded-md border border-line px-2.5 py-1 text-muted">
                {t}
              </li>
            ))}
          </motion.ul>

          <motion.div {...fade(5)} className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/#projects">
              View Projects <ArrowRight size={16} />
            </ButtonLink>
            <ButtonLink href={hasResume ? profile.resume : "[RESUME]"} variant="ghost" download>
              <Download size={16} /> Download Resume
            </ButtonLink>
            <ButtonLink href="/#contact" variant="ghost">
              <MessageSquare size={16} /> Let&apos;s Connect
            </ButtonLink>
          </motion.div>
          <motion.div {...fade(6)} className="mt-6">
            <SocialLinks />
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <Portrait hasPortrait={hasPortrait} />
        </motion.div>
      </div>
    </section>
  );
}
