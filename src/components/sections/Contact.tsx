"use client";

import { useState } from "react";
import { Check, Copy, Download, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icon";
import { Reveal, Section } from "@/components/ui/Section";

function CopyCard({ label, value, href }: { label: string; value: string; href: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };
  return (
    <div className="card flex items-start justify-between gap-4 rounded-xl px-6 py-5">
      <div className="min-w-0">
        <p className="font-mono text-xs text-muted">{label}</p>
        <a href={href} className="mt-1.5 block truncate font-mono text-base transition hover:text-green sm:text-lg">
          {value}
        </a>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? `${label} copied` : `Copy ${label}`}
        title={copied ? "Copied" : "Copy"}
        className="shrink-0 rounded-md p-1.5 text-muted transition hover:bg-fg/5 hover:text-fg"
      >
        {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
      </button>
      <span aria-live="polite" className="sr-only">{copied ? `${label} copied to clipboard` : ""}</span>
    </div>
  );
}

const btn = "inline-flex items-center gap-2.5 rounded-lg px-5 py-3 font-mono text-sm font-medium transition active:scale-[0.98]";
const ghost = `${btn} border border-line-strong hover:border-fg/40 hover:bg-fg/5`;

export function Contact({ hasResume }: { hasResume: boolean }) {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title={
        <>
          Let&apos;s build something <span className="font-serif font-normal italic text-gradient">Useful.</span>
        </>
      }
      intro="Open to Software, Backend and AI Engineering roles."
    >
      <Reveal>
        <div className="max-w-xl">
          <CopyCard label="email" value={profile.email} href={`mailto:${profile.email}`} />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`mailto:${profile.email}`} className={`${btn} bg-green text-bg hover:opacity-90`}>
            <Mail size={18} /> Send email
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={ghost}>
            <LinkedinIcon /> LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className={ghost}>
            <GithubIcon /> GitHub
          </a>
          {hasResume && (
            <a href={profile.resume} download className={ghost}>
              <Download size={18} /> Resume
            </a>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
