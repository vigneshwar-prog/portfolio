"use client";

import { useEffect, useRef, useState } from "react";
import { Download, NotebookPen, SquareTerminal } from "lucide-react";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";

type Line = { kind: "in" | "out"; text: string };

const COMMANDS: Record<string, () => string> = {
  help: () => "Available: whoami, about, ls, skills, projects, education, contact, notes, download, clear",
  whoami: () => `${profile.name} — ${profile.designation} @ ${profile.company}, ${profile.location}\n${profile.intro}`,
  about: () => profile.about.join("\n\n"),
  skills: () => skillGroups.map((g) => `${g.title}: ${g.skills.map((s) => s.name).join(", ")}`).join("\n"),
  projects: () => projects.map((p) => `→ ${p.title}  (/projects/${p.slug})`).join("\n"),
  ls: () => projects.map((p) => `${p.slug}/`).join("\n"),
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
  const [mode, setMode] = useState<"terminal" | "notes">("terminal");
  const [notes, setNotes] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const switchMode = (m: "terminal" | "notes") => {
    setMode(m);
    requestAnimationFrame(() => (m === "notes" ? notesRef.current : inputRef.current)?.focus({ preventScroll: true }));
  };

  /** Save whatever the current tab shows as a .txt file. */
  const download = () => {
    const text =
      mode === "notes"
        ? notes
        : lines.map((l) => (l.kind === "in" ? `❯ ${l.text}` : l.text)).join("\n");
    const blob = new Blob([text.endsWith("\n") ? text : text + "\n"], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "notes" ? "notes.txt" : "terminal.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  // Take keyboard focus as soon as the terminal opens, so visitors can type immediately.
  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
    return () => window.clearTimeout(t);
  }, []);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    setHistory((h) => [cmd, ...h]);
    setHIdx(-1);
    if (cmd === "clear") return setLines([]);
    if (cmd === "notes") {
      setLines((l) => [...l, { kind: "in", text: cmd }, { kind: "out", text: "Opening notes…" }]);
      return switchMode("notes");
    }
    if (cmd === "download") {
      setLines((l) => [...l, { kind: "in", text: cmd }, { kind: "out", text: "Downloading terminal.txt…" }]);
      return setTimeout(download, 0);
    }
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
    <div className={`card flex flex-col overflow-hidden font-mono text-[13px] ${className}`} onClick={() => (mode === "notes" ? notesRef.current : inputRef.current)?.focus({ preventScroll: true })}>
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
        <span className="ml-3 text-xs text-muted">{mode === "notes" ? "vigneshwar@portfolio: ~/notes.txt" : "vigneshwar@portfolio: ~"}</span>
      </div>
      {mode === "notes" ? (
        <textarea
          id="term-notes"
          ref={notesRef}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Jot anything down here — it stays while you switch tabs. Use ⬇ to save it as notes.txt."
          aria-label="Notes"
          spellCheck={false}
          className={`${height} min-h-0 w-full resize-none bg-transparent px-4 py-4 font-mono leading-relaxed text-fg caret-green outline-none placeholder:text-muted/60`}
        />
      ) : (
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
          {/* Real input is transparent; a mirrored span + block cursor draws what you see. */}
          <span className="relative flex flex-1 items-center">
            <span aria-hidden className="pointer-events-none whitespace-pre text-fg">{value}</span>
            <span aria-hidden className="term-cursor pointer-events-none ml-px inline-block h-[1.15em] w-[0.6em] bg-green" />
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
            className="absolute inset-0 w-full bg-transparent text-transparent caret-transparent outline-none focus:outline-none focus-visible:outline-none"
          />
          </span>
        </form>
      </div>
      )}
      <div className="flex items-center gap-2 border-t border-line px-3 py-2.5">
        {/* Mode tabs */}
        <div role="tablist" aria-label="Mode" className="flex shrink-0 rounded-lg border border-line p-0.5">
          {([
            ["terminal", SquareTerminal],
            ["notes", NotebookPen],
          ] as const).map(([m, I]) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={(e) => { e.stopPropagation(); switchMode(m); }}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition ${
                mode === m ? "bg-green/15 text-green" : "text-muted hover:text-fg"
              }`}
            >
              <I size={13} aria-hidden /> {m}
            </button>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto">
        {mode === "terminal" && SUGGESTED.map((c) => (
          <button
            key={c}
            type="button"
            onClick={(e) => { e.stopPropagation(); run(c); }}
            className="shrink-0 rounded-md border border-line px-2.5 py-1 text-xs text-muted transition hover:border-green/50 hover:text-fg"
          >
            {c}
          </button>
        ))}
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); download(); }}
          aria-label={mode === "notes" ? "Download notes as .txt" : "Download terminal output as .txt"}
          title={mode === "notes" ? "Download notes.txt" : "Download terminal.txt"}
          className="ml-auto grid size-8 shrink-0 place-items-center rounded-lg border border-green/40 text-green transition hover:bg-green/10"
        >
          <Download size={15} />
        </button>
      </div>
    </div>
  );
}
