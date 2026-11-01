import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { getProject, projects } from "@/content/projects";
import { FlowDiagram } from "@/components/diagrams/FlowDiagram";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { GithubIcon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Section";
import { accentText, cn } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: p.title, description: p.summary, url: `/projects/${p.slug}`, type: "article" },
  };
}

function Block({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <Reveal>
      <section className={`grid gap-4 border-t border-line py-12 md:gap-10 ${wide ? "" : "md:grid-cols-[220px_1fr]"}`}>
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{label}</h2>
        <div>{children}</div>
      </section>
    </Reveal>
  );
}

export default async function ProjectPage({ params }: Params) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const idx = projects.indexOf(p);
  const next = projects[(idx + 1) % projects.length];

  return (
    <article className="mx-auto max-w-5xl px-4 pb-24 pt-32 sm:px-6">
      <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-fg">
        <ArrowLeft size={14} /> All projects
      </Link>

      <header className="mt-10">
        <p className={cn("font-mono text-xs uppercase tracking-[0.2em]", accentText[p.accent])}>{p.kicker}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">{p.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">{p.summary}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">{p.kind} project</span>
          {p.github !== undefined && (
            <ButtonLink href={p.github} variant="ghost" className="py-1.5 text-xs">
              <GithubIcon width={14} height={14} /> {p.github.startsWith("[") ? "Repository coming soon" : "View repository"}
            </ButtonLink>
          )}
        </div>
        <ul className="mt-6 flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <li key={t} className="rounded-md bg-fg/[0.05] px-2 py-1 font-mono text-xs text-muted">{t}</li>
          ))}
        </ul>
        {p.metrics && (
          <dl className="mt-10 grid max-w-md grid-cols-2 gap-3">
            {p.metrics.map((m) => (
              <div key={m.label} className="card p-5">
                <dt className="sr-only">{m.label}</dt>
                <dd className={cn("text-3xl font-semibold", accentText[p.accent])}>{m.value}</dd>
                <dd className="mt-1 text-sm text-muted">{m.label}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      <div className="mt-16">
        <Block label="Problem">
          <p className="text-lg leading-relaxed">{p.problem}</p>
        </Block>
        <Block label="Solution">
          <p className="text-lg leading-relaxed">{p.solution}</p>
        </Block>
        <Block label="Architecture" wide>
          <FlowDiagram project={p} />
          <ul className="mt-6 space-y-3">
            {p.architecture.notes.map((n) => (
              <li key={n} className="flex gap-3 leading-relaxed text-muted">
                <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-cyan" /> {n}
              </li>
            ))}
          </ul>
        </Block>
        <Block label="Key decisions">
          <div className="grid gap-4">
            {p.decisions.map((d, i) => (
              <div key={d.title} className="card p-6">
                <p className="font-mono text-xs text-muted">Decision {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-lg font-semibold">{d.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{d.body}</p>
              </div>
            ))}
          </div>
        </Block>
        <Block label="Challenges & trade-offs">
          <ul className="space-y-3">
            {p.challenges.map((c) => (
              <li key={c} className="flex gap-3 leading-relaxed">
                <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-violet" /> {c}
              </li>
            ))}
          </ul>
        </Block>
        <Block label="Outcomes">
          <ul className="space-y-3">
            {p.outcomes.map((o) => (
              <li key={o} className="flex gap-3 leading-relaxed">
                <Check size={18} className="mt-0.5 shrink-0 text-green" aria-hidden /> {o}
              </li>
            ))}
          </ul>
        </Block>
      </div>

      <Link href={`/projects/${next.slug}`} className="card group mt-10 flex items-center justify-between p-6 transition hover:border-line-strong sm:p-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Next project</p>
          <p className="mt-2 text-xl font-semibold sm:text-2xl">{next.title}</p>
        </div>
        <ArrowRight className="text-muted transition group-hover:translate-x-1 group-hover:text-fg" />
      </Link>
    </article>
  );
}
