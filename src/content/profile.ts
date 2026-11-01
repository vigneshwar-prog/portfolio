/**
 * Central profile config. Replace every value wrapped in [BRACKETS]
 * before publishing — see PLACEHOLDERS.md.
 */
export const isPlaceholder = (v?: string) => !v || /^\[.*\]$/.test(v);

export const profile = {
  name: "Vigneshwar B",
  shortName: "Vigneshwar",
  role: "Software Engineer",
  tagline: "Software Engineer · Backend · AI & Automation · Distributed Systems",
  headline: ["Building intelligent systems.", "Engineering scalable solutions."],
  intro:
    "I'm a software engineer passionate about backend systems, AI-powered applications and automation. I enjoy turning complex engineering problems into practical, scalable solutions.",
  location: "Bangalore, India",
  company: "Cisco",
  designation: "Software Engineer",
  yearsExperience: "4+",
  education: "B.Tech, Information Technology · Sri Sairam Engineering College · 2018–2022 · CGPA 8.88/10",
  email: "vigneshwar.work.ai@gmail.com",
  linkedin: "https://linkedin.com/in/vigneshwar-prog/",
  github: "https://github.com/vigneshwar-prog",
  resume: "/resume.pdf",
  portrait: "/images/profile.jpg",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  about: [
    "I started in web development and full-stack internships, then joined Cisco, where I build Python services, AI-powered workflows and automation platforms used in production — from hybrid RAG systems and MCP servers to a containerised device-management platform.",
    "I care about the engineering around the model: retrieval quality, evaluation, guardrails and clean APIs. I also review code, lead design reviews and publish technical tutorials on my YouTube channel, InfiTamil.",
  ],
  interests: [
    { label: "Backend architecture", icon: "Server" },
    { label: "Retrieval & LLM apps", icon: "BrainCircuit" },
    { label: "Developer tooling", icon: "Wrench" },
    { label: "Distributed systems", icon: "Network" },
    { label: "Automation", icon: "Workflow" },
  ],
};

export const nav = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];
