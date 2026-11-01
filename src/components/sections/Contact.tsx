"use client";

import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Download, Loader2, Mail } from "lucide-react";
import { isPlaceholder, profile } from "@/content/profile";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icon";
import { Reveal, Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"name" | "subject" | "message", string[]>>;
type Status = { state: "idle" | "sending" | "sent" | "error"; message?: string };

const fields = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "subject", label: "Subject", type: "text", autoComplete: "off" },
] as const;

function ContactLink({ href, label, value, icon, download }: { href: string; label: string; value: string; icon: React.ReactNode; download?: boolean }) {
  const disabled = isPlaceholder(href);
  const inner = (
    <>
      <span className="grid size-10 place-items-center rounded-xl border border-line bg-bg text-muted transition group-hover:text-fg">{icon}</span>
      <span className="min-w-0">
        <span className="block text-xs text-muted">{label}</span>
        <span className="block truncate text-sm">{disabled ? "Coming soon" : value}</span>
      </span>
      {!disabled && <ArrowRight size={16} className="ml-auto text-muted transition group-hover:translate-x-0.5 group-hover:text-fg" />}
    </>
  );
  const cls = "group card flex items-center gap-4 p-4 transition hover:border-line-strong";
  if (disabled) return <div className={cn(cls, "opacity-60")}>{inner}</div>;
  return (
    <a
      href={href}
      className={cls}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
      {...(download ? { download: "" } : {})}
    >
      {inner}
    </a>
  );
}

export function Contact({ hasResume }: { hasResume: boolean }) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const startedAt = useRef(Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus({ state: "sending" });
    setErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startedAt: startedAt.current }),
      });
      const json = await res.json();
      if (json.ok) {
        setStatus({ state: "sent" });
        form.reset();
      } else {
        setErrors(json.fieldErrors ?? {});
        setStatus({ state: "error", message: json.error });
      }
    } catch {
      setStatus({ state: "error", message: "Network error. Please try again." });
    }
  }

  const input =
    "w-full rounded-xl border border-line bg-bg/60 px-4 py-3 text-sm outline-none transition placeholder:text-muted/60 focus:border-green/60 focus:ring-2 focus:ring-green/15";

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
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <Reveal className="space-y-3">
          <ContactLink href={isPlaceholder(profile.email) ? profile.email : `mailto:${profile.email}`} label="Email" value={profile.email} icon={<Mail size={18} />} />
          <ContactLink href={profile.linkedin} label="LinkedIn" value={profile.linkedin.replace(/^https?:\/\/(www\.)?/, "")} icon={<LinkedinIcon />} />
          <ContactLink href={profile.github} label="GitHub" value={profile.github.replace(/^https?:\/\/(www\.)?/, "")} icon={<GithubIcon />} />
          <ContactLink href={hasResume ? profile.resume : "[RESUME]"} label="Resume" value="Download PDF" icon={<Download size={18} />} download />
        </Reveal>

        <Reveal delay={0.08}>
          <form onSubmit={onSubmit} noValidate className="card p-6 sm:p-8">
            {status.state === "sent" ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center text-center" role="status">
                <CheckCircle2 size={40} className="text-green" />
                <p className="mt-4 text-xl font-semibold">Message sent</p>
                <p className="mt-2 text-muted">Thanks for reaching out — I&apos;ll reply soon.</p>
                <button type="button" onClick={() => setStatus({ state: "idle" })} className="mt-6 text-sm text-cyan underline underline-offset-4">
                  Send another
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  {fields.map((f) => (
                    <div key={f.name} className="sm:col-span-2">
                      <label htmlFor={f.name} className="mb-1.5 block text-sm">{f.label}</label>
                      <input
                        id={f.name}
                        name={f.name}
                        type={f.type}
                        autoComplete={f.autoComplete}
                        aria-invalid={!!errors[f.name]}
                        aria-describedby={errors[f.name] ? `${f.name}-error` : undefined}
                        className={cn(input, errors[f.name] && "border-red-500/60")}
                      />
                      {errors[f.name] && <p id={`${f.name}-error`} className="mt-1 text-xs text-red-500">{errors[f.name]![0]}</p>}
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="mb-1.5 block text-sm">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      className={cn(input, "resize-y", errors.message && "border-red-500/60")}
                    />
                    {errors.message && <p id="message-error" className="mt-1 text-xs text-red-500">{errors.message[0]}</p>}
                  </div>
                  {/* Honeypot: hidden from humans and screen readers */}
                  <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label htmlFor="website">Website</label>
                    <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </div>
                </div>
                <div className="mt-6 flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p role="alert" className={cn("text-sm", status.state === "error" ? "text-red-500" : "text-muted")}>
                    {status.state === "error" ? status.message : "I usually reply within a few days."}
                  </p>
                  <button
                    type="submit"
                    disabled={status.state === "sending"}
                    className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-2.5 text-sm font-medium text-bg transition hover:opacity-90 disabled:opacity-60"
                  >
                    {status.state === "sending" ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    {status.state === "sending" ? "Sending…" : "Send message"}
                  </button>
                </div>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
