import Link from "next/link";
import { Mail } from "lucide-react";
import { isPlaceholder, nav, profile } from "@/content/profile";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icon";

export function SocialLinks({ className = "" }: { className?: string }) {
  const links = [
    { href: profile.github, label: "GitHub", icon: <GithubIcon /> },
    { href: profile.linkedin, label: "LinkedIn", icon: <LinkedinIcon /> },
    { href: isPlaceholder(profile.email) ? profile.email : `mailto:${profile.email}`, label: "Email", icon: <Mail size={18} /> },
  ].filter((l) => !isPlaceholder(l.href));

  if (!links.length) return null;
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            aria-label={l.label}
            {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            className="grid size-10 place-items-center rounded-full border border-line text-muted transition hover:border-line-strong hover:text-fg"
          >
            {l.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium">{profile.name}</p>
          <p className="mt-1 text-sm text-muted">{profile.tagline}</p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          {nav.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="transition hover:text-fg">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <SocialLinks />
      </div>
      <p className="pb-10 text-center font-mono text-xs text-muted">
        © {new Date().getFullYear()} {profile.name}
      </p>
    </footer>
  );
}
