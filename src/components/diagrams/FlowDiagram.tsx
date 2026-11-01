import { Fragment } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { Project } from "@/content/projects";

/**
 * Architecture flow built from real HTML (not a scaled SVG), so labels stay
 * readable at any width: a row of steps on wide screens, a vertical stack on phones.
 */
export function FlowDiagram({ project }: { project: Project }) {
  const steps = project.architecture.flow;
  const accent = `var(--${project.accent})`;

  return (
    <figure className="card p-5 sm:p-6" aria-label={`Architecture: ${steps.join(" to ")}`}>
      <ol className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-stretch lg:gap-2">
        {steps.map((s, i) => {
          const edge = i === 0 || i === steps.length - 1;
          return (
            <Fragment key={s}>
              <li
                className="flex items-center gap-3 rounded-xl border bg-bg px-4 py-3 lg:min-w-0 lg:flex-1 lg:flex-col lg:items-start lg:gap-1"
                style={{ borderColor: edge ? accent : "var(--line-strong)" }}
              >
                <span className="font-mono text-xs" style={{ color: accent }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-base font-medium leading-snug">{s}</span>
              </li>
              {i < steps.length - 1 && (
                <li aria-hidden className="flex shrink-0 items-center justify-center" style={{ color: accent }}>
                  <ArrowDown size={18} className="lg:hidden" />
                  <ArrowRight size={18} className="hidden lg:block" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </figure>
  );
}
