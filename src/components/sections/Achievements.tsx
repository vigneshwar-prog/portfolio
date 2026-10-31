import { achievements } from "@/content/achievements";
import { Icon } from "@/components/ui/Icon";
import { Reveal, Section } from "@/components/ui/Section";

export function Achievements() {
  return (
    <Section id="achievements" eyebrow="Recognition" title="Awards and learning along the way.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {achievements.map((a, i) => (
          <Reveal key={a.title} delay={i * 0.06} className={i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}>
            <div className="card group relative flex h-full flex-col overflow-hidden p-6 transition hover:border-line-strong">
              <span className="grid size-10 place-items-center rounded-xl border border-line bg-bg">
                <Icon name={a.icon} size={18} className={i === 0 ? "text-green" : "text-cyan"} />
              </span>
              {a.count && (
                <div aria-hidden className="pointer-events-none absolute right-6 top-2 select-none font-serif text-[9rem] italic leading-none text-fg/[0.05]">
                  {a.count}×
                </div>
              )}
              <div className="mt-auto pt-10">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{a.issuer}</p>
                <h3 className={i === 0 ? "mt-2 text-2xl font-semibold tracking-tight sm:text-3xl" : "mt-2 font-semibold"}>
                  {a.title}
                  {a.count && <span className="text-green"> · {a.count}×</span>}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{a.detail}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
