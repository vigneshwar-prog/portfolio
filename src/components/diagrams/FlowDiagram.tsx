import type { Project } from "@/content/projects";

/** Generic architecture diagram rendered from a project's `architecture.flow`. */
export function FlowDiagram({ project }: { project: Project }) {
  const steps = project.architecture.flow;
  const accent = `var(--${project.accent})`;
  const boxW = 150, boxH = 54, gap = 46;
  const W = steps.length * boxW + (steps.length - 1) * gap + 40;
  const H = 130;

  return (
    <figure className="card overflow-x-auto p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[640px]" role="img" aria-label={`Architecture: ${steps.join(" to ")}`}>
        <defs>
          <marker id={`arrow-${project.slug}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={accent} />
          </marker>
        </defs>
        {steps.map((s, i) => {
          const x = 20 + i * (boxW + gap);
          const y = (H - boxH) / 2;
          return (
            <g key={s}>
              {i < steps.length - 1 && (
                <line
                  x1={x + boxW} y1={H / 2} x2={x + boxW + gap - 3} y2={H / 2}
                  stroke={accent} strokeWidth={1.4} strokeDasharray="4 4"
                  markerEnd={`url(#arrow-${project.slug})`}
                >
                  <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
                </line>
              )}
              <rect x={x} y={y} width={boxW} height={boxH} rx={12} fill="var(--bg)" stroke={i === 0 || i === steps.length - 1 ? accent : "var(--line-strong)"} />
              <text x={x + boxW / 2} y={y + 22} textAnchor="middle" fontSize="10" fill="var(--muted)" fontFamily="var(--font-mono)">
                {String(i + 1).padStart(2, "0")}
              </text>
              <text x={x + boxW / 2} y={y + 39} textAnchor="middle" fontSize="12.5" fontWeight={500} fill="var(--fg)">
                {s}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
