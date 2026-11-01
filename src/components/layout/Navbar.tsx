"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { nav, profile } from "@/content/profile";
import { cn } from "@/lib/utils";
import { AmbientAudio } from "@/components/ui/AmbientAudio";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = resolvedTheme !== "light";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={mounted ? `Switch to ${dark ? "light" : "dark"} theme` : "Toggle theme"}
      className="grid size-9 place-items-center rounded-full border border-line text-muted transition hover:border-line-strong hover:text-fg"
    >
      {mounted ? dark ? <Sun size={16} /> : <Moon size={16} /> : <span className="size-4" />}
    </button>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the nav item for the section in view (or /blog route).
  const pathname = usePathname();
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    if (pathname.startsWith("/blog")) return setActive("/blog");
    if (pathname !== "/") return setActive("");
    const ids = nav.filter((n) => n.href.startsWith("/#")).map((n) => n.href.slice(2));
    const onScroll = () => {
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = `/#${id}`;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        "border-b border-line bg-bg/90 backdrop-blur-xl", scrolled && "shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-bg">
        Skip to content
      </a>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Link href="/" className="group flex items-center gap-3 font-mono" onClick={() => setOpen(false)} aria-label="Home">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-3 rounded-full bg-[#ec6a5e]" />
            <span className="size-3 rounded-full bg-[#f4c84f]" />
            <span className="size-3 rounded-full bg-[#5fd3a0]" />
          </span>
          <span className="text-base text-fg/85 transition group-hover:text-fg">
            ~/{profile.name.toLowerCase().replace(/\s+/g, ".")}
          </span>
        </Link>

        <ul className="hidden items-center gap-1 font-mono md:flex">
          {nav.map((item, i) => {
            const isActive = active === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm lowercase transition",
                    isActive ? "bg-green/15 text-green" : "text-muted hover:bg-fg/5 hover:text-fg",
                  )}
                >
                  <span className={isActive ? "text-green" : "text-muted/70"}>{String(i + 1).padStart(2, "0")}</span> {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <AmbientAudio />
          <ThemeToggle />
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full border border-line md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden px-4 md:hidden"
          >
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-t border-line py-4 font-mono text-lg lowercase text-muted transition hover:text-fg"
                >
                  <span className="text-green">{String(nav.indexOf(item) + 1).padStart(2, "0")}</span> {item.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
