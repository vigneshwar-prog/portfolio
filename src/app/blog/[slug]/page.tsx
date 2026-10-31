import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { formatDate, getAllPosts, getPost } from "@/lib/blog";

type Params = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => getAllPosts().map((p) => ({ slug: p.slug }));
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.summary, type: "article", publishedTime: post.date },
    // Drafts stay out of search results.
    robots: post.draft ? { index: false, follow: true } : undefined,
  };
}

export default async function PostPage({ params }: Params) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-fg">
        <ArrowLeft size={14} /> All articles
      </Link>
      <header className="mt-10 border-b border-line pb-10">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
          <span className="uppercase tracking-[0.16em] text-cyan">{post.category}</span>
          <span>·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
          {post.draft && (
            <span className="rounded-full border border-violet/40 px-2 py-0.5 uppercase text-violet">Sample draft</span>
          )}
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{post.title}</h1>
        <p className="mt-5 text-lg text-muted">{post.summary}</p>
      </header>
      <div className="prose mt-10">
        <MDXRemote source={post.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </div>
    </article>
  );
}
