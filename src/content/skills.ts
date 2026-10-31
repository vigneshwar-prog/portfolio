/**
 * Skill levels keep claims honest:
 *  - professional: used in paid work
 *  - hands-on: used in personal / internship projects
 *  - exploring: actively learning
 */
export type SkillLevel = "professional" | "hands-on" | "exploring";
export type Skill = { name: string; level: SkillLevel };
export type SkillGroup = { title: string; icon: string; blurb: string; skills: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    icon: "Code2",
    blurb: "Python is my primary language.",
    skills: [
      { name: "Python", level: "professional" },
      { name: "SQL", level: "professional" },
      { name: "C / C++", level: "hands-on" },
      { name: "JavaScript", level: "hands-on" },
      { name: "Java", level: "hands-on" },
    ],
  },
  {
    title: "Backend",
    icon: "Server",
    blurb: "APIs, data stores and asynchronous workers.",
    skills: [
      { name: "Django", level: "professional" },
      { name: "FastAPI", level: "professional" },
      { name: "Flask", level: "professional" },
      { name: "REST APIs", level: "professional" },
      { name: "MongoDB", level: "professional" },
      { name: "MySQL", level: "hands-on" },
      { name: "OAuth2", level: "professional" },
      { name: "Redis", level: "hands-on" },
      { name: "Spring Boot", level: "hands-on" },
      { name: "Kafka", level: "exploring" },
    ],
  },
  {
    title: "AI & Intelligent Apps",
    icon: "BrainCircuit",
    blurb: "Retrieval pipelines and LLM-powered tooling.",
    skills: [
      { name: "RAG", level: "professional" },
      { name: "LangChain", level: "professional" },
      { name: "Model Context Protocol", level: "professional" },
      { name: "LLM integrations", level: "professional" },
      { name: "Chroma", level: "professional" },
      { name: "Embeddings", level: "professional" },
      { name: "Hybrid retrieval", level: "professional" },
      { name: "Prompt engineering", level: "professional" },
      { name: "LangSmith", level: "hands-on" },
      { name: "LangGraph", level: "hands-on" },
      { name: "Pinecone", level: "hands-on" },
      { name: "Streamlit", level: "hands-on" },
      { name: "Agentic AI", level: "exploring" },
    ],
  },
  {
    title: "DevOps & Infrastructure",
    icon: "Container",
    blurb: "Shipping and running services.",
    skills: [
      { name: "Linux", level: "professional" },
      { name: "Git", level: "professional" },
      { name: "Docker", level: "professional" },
      { name: "CI/CD", level: "professional" },
      { name: "Kubernetes", level: "hands-on" },
      { name: "Celery", level: "hands-on" },
      { name: "pandas / NumPy", level: "hands-on" },
    ],
  },
  {
    title: "Automation & Observability",
    icon: "Workflow",
    blurb: "Test frameworks, telemetry and validation at scale.",
    skills: [
      { name: "Robot Framework", level: "professional" },
      { name: "Selenium", level: "professional" },
      { name: "Splunk", level: "professional" },
      { name: "CXTM", level: "professional" },
      { name: "Network automation", level: "professional" },
      { name: "PCAP validation", level: "professional" },
    ],
  },
];

export const levelLabel: Record<SkillLevel, string> = {
  professional: "Professional",
  "hands-on": "Hands-on projects",
  exploring: "Exploring",
};
