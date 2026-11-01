import { achievements } from "@/content/achievements";
import { Icon } from "@/components/ui/Icon";
import { Reveal, Section } from "@/components/ui/Section";

export function Achievements() {
  return (
    <Section id="achievements" eyebrow="Recognition" title="Awards & learning">
      <Reveal>
        <ul className="card divide-y divide-line">
          {achievements.map((a) => (
            <li key={a.title} className="flex items-center gap-4 px-5 py-4">
              <Icon name={a.icon} size={18} className="shrink-0 text-green" />
              <span className="font-medium">
                {a.title}
                {a.count && <span className="text-green"> · {a.count}×</span>}
              </span>
              <span className="ml-auto shrink-0 font-mono text-xs text-muted">{a.issuer}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
