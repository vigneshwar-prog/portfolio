import Link from "next/link";
import { cn } from "@/lib/utils";
import { isPlaceholder } from "@/content/profile";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  download?: boolean;
  label?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all active:scale-[0.98]";
const styles = {
  primary: "bg-fg text-bg hover:opacity-90",
  ghost: "border border-line-strong text-fg hover:bg-elev hover:border-fg/30",
};

/** Button-styled link. Placeholder hrefs render as disabled, so nothing is ever broken. */
export function ButtonLink({ href, children, variant = "primary", className, download, label }: Props) {
  if (isPlaceholder(href)) {
    return (
      <span aria-disabled title="Link not configured yet" className={cn(base, styles[variant], "cursor-not-allowed opacity-50", className)}>
        {children}
      </span>
    );
  }
  const external = /^https?:|^mailto:/.test(href);
  if (external || download) {
    return (
      <a
        href={href}
        aria-label={label}
        className={cn(base, styles[variant], className)}
        {...(download ? { download: "" } : {})}
        {...(external && href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} aria-label={label} className={cn(base, styles[variant], className)}>
      {children}
    </Link>
  );
}
