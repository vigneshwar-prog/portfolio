import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate, getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical writing on backend systems, RAG, MCP, automation and distributed systems.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-32 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-green">
        <span className="text-muted">{"// "}</span>Writing
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        Engineering <span className="font-serif font-normal italic">notes.</span>
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted">
        Articles on backend architecture, retrieval systems, MCP and automation.
      </p>
      {categories.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Categories">
          {categories.map((c) => (
            <li key={c} className="rounded-full border border-line px-3 py-1 text-sm text-muted">{c}</li>
          ))}
        </ul>
      )}

      {posts.length === 0 ? (
        <p className="mt-16 text-muted">No articles yet.</p>
      ) : (
        <ul className="mt-12 divide-y divide-line border-y border-line">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="group grid gap-2 py-7 sm:grid-cols-[140px_1fr_auto] sm:gap-8">
                <div className="font-mono text-xs text-muted">
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                  <p className="mt-1">{p.readingTime}</p>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-cyan">{p.category}</span>
                    {p.draft && (
                      <span className="rounded-full border border-violet/40 px-2 py-0.5 font-mono text-[10px] uppercase text-violet">
                        Sample draft
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight transition group-hover:text-green">{p.title}</h2>
                  <p className="mt-2 leading-relaxed text-muted">{p.summary}</p>
                </div>
                <ArrowUpRight className="hidden text-muted transition group-hover:text-fg sm:block" size={18} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
