export type Role = {
  company: string;
  title: string;
  period: string;
  /** Leave undefined if unknown — never guess. */
  location?: string;
  type: "Full-time" | "Internship";
  summary: string;
  highlights: string[];
  stack: string[];
  /** Optional logo path under /public/logos — falls back to initials. */
  logo?: string;
};

export const experience: Role[] = [
  {
    company: "Cisco",
    title: "Software Engineer",
    period: "Aug 2022 — Present",
    location: "Bangalore, India",
    type: "Full-time",
    summary:
      "Building AI-powered workflows, RAG pipelines, MCP integrations and automation platforms in production.",
    highlights: [
      "Built a hybrid RAG system (LangChain, Chroma) with RRF reranking, LLM routing and LLM-as-judge evaluation.",
      "Built and self-hosted an OAuth-secured MCP server exposing Webex tools to AI agents.",
      "Containerised a Django + FastAPI device-management platform — 80% less manual effort.",
      "Designed an AI workflow automating end-to-end testing — 60%+ less manual effort.",
    ],
    stack: ["Python", "LangChain", "Chroma", "FastMCP", "Django", "FastAPI", "Docker"],
  },
  {
    company: "Cisco",
    title: "Project Intern",
    period: "Jan 2022 — Aug 2022",
    location: "Bangalore, India",
    type: "Internship",
    summary: "Backend development and internal tooling.",
    highlights: [
      "Developed Django-based dashboards.",
      "Built a Webex chatbot that reported NSVT metrics.",
      "Worked on automation and backend services.",
    ],
    stack: ["Django", "Python", "Webex APIs"],
  },
  {
    company: "Zoho",
    title: "Software Development Intern",
    period: "Oct 2021 — Dec 2021",
    type: "Internship",
    summary: "Web application development on Zoho's stack.",
    highlights: ["Worked with Apache Tomcat.", "Built UI features with JavaScript, jQuery and Ember.js."],
    stack: ["JavaScript", "Ember.js", "jQuery", "Tomcat"],
  },
  {
    company: "Virtusa",
    title: "Software Engineering Intern",
    period: "Jun 2021 — Sep 2021",
    type: "Internship",
    summary: "Full-stack internal tooling.",
    highlights: [
      "Developed an internal stock management application.",
      "Implemented Google Authenticator-based two-factor authentication.",
      "Won the internal hackathon.",
    ],
    stack: ["Java", "Spring Boot", "React"],
  },
  {
    company: "PARO IT Pty Ltd",
    title: "Web Development Intern",
    period: "Mar 2021 — May 2021",
    type: "Internship",
    summary: "E-commerce web development.",
    highlights: ["Worked on WordPress-based e-commerce development."],
    stack: ["WordPress"],
  },
];
