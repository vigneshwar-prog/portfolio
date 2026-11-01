import { profile } from "@/content/profile";
import { Reveal, Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { Terminal } from "./Terminal";

const stats = [
  { value: profile.yearsExperience, label: "years engineering" },
  { value: "4", label: "organisations" },
  { value: "3×", label: "Automation Genie" },
];

export function About() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title={
        <>
          An engineer who likes the <span className="font-serif font-normal italic">whole system</span> — from the API to the infrastructure underneath.
        </>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr]">
        <Reveal>
          <div className="space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            {profile.about.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="card px-4 py-5">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl font-semibold tracking-tight sm:text-3xl">{s.value}</dd>
                <dd className="mt-1 text-xs text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted">Interests</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {profile.interests.map((i) => (
              <li key={i.label} className="flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm transition hover:border-line-strong">
                <Icon name={i.icon} size={14} className="text-cyan" />
                {i.label}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted">{profile.education}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <Terminal />
        </Reveal>
      </div>
    </Section>
  );
}
