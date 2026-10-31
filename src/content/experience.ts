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
      "Built a hybrid RAG system over enterprise data (LangChain, Chroma) with metadata filtering, RRF reranking, an LLM router for multi-intent queries, LLM-as-judge evaluation and anti-hallucination guardrails.",
      "Built and self-hosted an OAuth-enabled MCP server (FastMCP) exposing Webex messaging, meeting scheduling and check-in summarization tools to LLM/agent clients.",
      "Developed and containerised a Django device-management platform with FastAPI internal services, SSH tunneling and session pooling — reducing manual execution effort by 80%.",
      "Designed an AI-powered workflow automating end-to-end testing — script generation, orchestration, log analysis and reporting — cutting manual effort by 60%+.",
      "Integrated CXTM, MongoDB and Splunk for automated KPI collection and dashboards.",
      "Built reusable, dynamic PCAP validation and verification keywords.",
      "Reviewed code, led design reviews, triaged production issues and maintained technical documentation.",
      "Worked across NX-OS, IOS-XE and IOS-XR on Nexus, Catalyst and ASR platforms, plus 5G core (SMF, UPF, AMF, PCF).",
      "Delivered for enterprise customers in Australia, the United States and railway infrastructure.",
    ],
    stack: ["Python", "LangChain", "Chroma", "FastMCP", "Django", "FastAPI", "Docker", "MongoDB", "Splunk"],
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
