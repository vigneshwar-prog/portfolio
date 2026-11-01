import { ArrowUpRight, Code2, Medal, Star, Workflow } from "lucide-react";
import { achievements } from "@/content/achievements";
import { Reveal, Section } from "@/components/ui/Section";

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden width={20} height={20} {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
    </svg>
  );
}

/** Per-award symbol and colour, keyed by title. */
const symbols: Record<string, { icon: React.ReactNode; tone: string }> = {
  "Automation Genie": { icon: <Workflow size={20} />, tone: "text-green border-green/30 bg-green/10" },
  "Rising Star": {
    icon: <Star size={20} fill="currentColor" className="drop-shadow-[0_0_6px_rgba(251,191,36,0.7)]" />,
    tone: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  },
  "Hackathon Winner": { icon: <Code2 size={20} />, tone: "text-cyan border-cyan/30 bg-cyan/10" },
  "Content Creator": { icon: <YoutubeIcon />, tone: "text-red-500 border-red-500/30 bg-red-500/10" },
};

/** Icon tile with a light sweep that passes over it every few seconds. */
function ShiningBadge({ title }: { title: string }) {
  const s = symbols[title] ?? symbols["Automation Genie"];
  return (
    <span className={`relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border ${s.tone}`}>
      {s.icon}
      <span aria-hidden className="cup-shine pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </span>
  );
}

export function Achievements() {
  return (
    <Section
      id="achievements"
      eyebrow="Recognition"
      title={
        <span className="inline-flex items-center gap-3">
          Awards
          <span className="relative inline-grid size-12 place-items-center overflow-hidden rounded-full border border-amber-400/40 bg-amber-400/10">
            <Medal aria-hidden size={26} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
            <span aria-hidden className="cup-shine pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </span>
        </span>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {achievements.map((a, i) => (
          <Reveal key={a.title} delay={i * 0.06} className="h-full">
            <div className="card flex h-full flex-col p-5 transition hover:border-line-strong">
              <div className="flex items-center justify-between">
                <ShiningBadge title={a.title} />
                <span className="font-mono text-xs text-muted">{a.issuer}</span>
              </div>
              <h3 className="mt-4 font-semibold">
                {a.title}
                {a.count && <span className="text-green"> · {a.count}×</span>}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{a.detail}</p>
              {a.link && (
                <a
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-500/10"
                >
                  Visit channel <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
