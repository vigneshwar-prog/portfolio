import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  draft: boolean;
  readingTime: string;
};

export type Post = PostMeta & { content: string };

function readPost(file: string): Post {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: file.replace(/\.mdx?$/, ""),
    title: String(data.title ?? "Untitled"),
    summary: String(data.summary ?? ""),
    date: String(data.date ?? ""),
    category: String(data.category ?? "General"),
    draft: Boolean(data.draft),
    readingTime: readingTime(content).text,
    content,
  };
}

/** All posts, newest first. Drop a .mdx file into src/content/blog to add one. */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(readPost)
    .map(({ content, ...meta }) => (void content, meta))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | undefined {
  const file = ["mdx", "md"].map((ext) => `${slug}.${ext}`).find((f) => fs.existsSync(path.join(BLOG_DIR, f)));
  return file ? readPost(file) : undefined;
}

export const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "";
