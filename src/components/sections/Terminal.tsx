"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";

type Line = { kind: "in" | "out"; text: string };

const COMMANDS: Record<string, () => string> = {
  help: () => "Available: whoami, about, skills, projects, education, contact, clear",
  whoami: () => `${profile.name} — ${profile.designation} @ ${profile.company}, ${profile.location}\n${profile.intro}`,
  about: () => profile.about.join("\n\n"),
  skills: () => skillGroups.map((g) => `${g.title}: ${g.skills.map((s) => s.name).join(", ")}`).join("\n"),
  projects: () => projects.map((p) => `→ ${p.title}  (/projects/${p.slug})`).join("\n"),
  education: () => profile.education,
  contact: () => "Scroll to the contact section, or type `goto contact`.",
};

const SUGGESTED = ["whoami", "projects", "skills"];

export function Terminal({ height = "h-72", onClose, className = "" }: { height?: string; onClose?: () => void; className?: string }) {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: "Welcome! Try typing `whoami` and press Enter — or tap a command below." },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    setHistory((h) => [cmd, ...h]);
    setHIdx(-1);
    if (cmd === "clear") return setLines([]);
    if (cmd.startsWith("goto ")) {
      const id = cmd.slice(5).trim();
      const el = document.getElementById(id);
      setLines((l) => [...l, { kind: "in", text: cmd }, { kind: "out", text: el ? `Navigating to #${id}…` : `No section “${id}”.` }]);
      el?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const out = COMMANDS[cmd]?.() ?? `command not found: ${cmd}. Try \`help\`.`;
    setLines((l) => [...l, { kind: "in", text: cmd }, { kind: "out", text: out }]);
  };

  return (
    <div className={`card flex flex-col overflow-hidden font-mono text-[13px] ${className}`} onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        {onClose ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            aria-label="Close terminal"
            className="size-2.5 rounded-full bg-[#ff5f57] ring-offset-2 transition hover:scale-125"
          />
        ) : (
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        )}
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-muted">vigneshwar@portfolio: ~</span>
      </div>
      <div ref={bodyRef} className={`${height} min-h-0 overflow-y-auto px-4 py-4 leading-relaxed`} aria-live="polite">
        {lines.map((l, i) => (
          <pre key={i} className={`whitespace-pre-wrap break-words font-mono ${l.kind === "in" ? "text-fg" : "text-muted"}`}>
            {l.kind === "in" && <span className="text-green">❯ </span>}
            {l.text}
          </pre>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(value);
            setValue("");
          }}
          className="flex items-center"
        >
          <label htmlFor="term-input" className="text-green">❯&nbsp;</label>
          <input
            id="term-input"
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" && history.length) {
                e.preventDefault();
                const n = Math.min(hIdx + 1, history.length - 1);
                setHIdx(n); setValue(history[n]);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const n = hIdx - 1;
                setHIdx(Math.max(n, -1)); setValue(n >= 0 ? history[n] : "");
              }
            }}
            aria-label="Terminal command"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-fg caret-green outline-none"
          />
        </form>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        {SUGGESTED.map((c) => (
          <button
            key={c}
            type="button"
            onClick={(e) => { e.stopPropagation(); run(c); }}
            className="rounded-md border border-line px-2.5 py-1 text-xs text-muted transition hover:border-green/50 hover:text-fg"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
