/**
 * Engineering Lab — add a new object to `labItems` to publish a new entry.
 * NOTE: entries not backed by a featured project are starter suggestions —
 * edit or delete them so this list reflects what you are actually doing.
 */
export type LabStatus = "Exploring" | "Building" | "Completed";
export type LabCategory =
  | "AI Agents"
  | "Model Context Protocol"
  | "RAG Applications"
  | "Backend Architecture"
  | "Distributed Systems"
  | "Developer Productivity"
  | "Automation";

export type LabItem = {
  name: string;
  category: LabCategory;
  description: string;
  status: LabStatus;
  stack: string[];
  github?: string;
};

export const labCategories: LabCategory[] = [
  "AI Agents",
  "Model Context Protocol",
  "RAG Applications",
  "Backend Architecture",
  "Distributed Systems",
  "Developer Productivity",
  "Automation",
];

export const labItems: LabItem[] = [
  {
    name: "Employee RAG Assistant",
    category: "RAG Applications",
    description:
      "Card-based chunking, hybrid retrieval and reranking over structured employee data.",
    status: "Completed",
    stack: ["Python", "ChromaDB", "MiniLM", "LLM routing"],
  },
  {
    name: "Webex MCP Server",
    category: "Model Context Protocol",
    description: "Exposing Webex messaging and meetings as MCP tools for AI coding assistants.",
    status: "Completed",
    stack: ["Python", "FastMCP", "Webex APIs"],
  },
  {
    name: "Agentic network operations",
    category: "AI Agents",
    description:
      "Exploring tool-using agents that can inspect device health and propose configuration fixes with human approval.",
    status: "Exploring",
    stack: ["Python", "MCP", "LLMs"],
  },
  {
    name: "Device session pool",
    category: "Distributed Systems",
    description:
      "Moving SSH session state from in-process memory to Redis-coordinated Celery workers.",
    status: "Building",
    stack: ["Django", "Redis", "Celery"],
  },
  {
    name: "Golden-config drift checker",
    category: "Automation",
    description: "Diffing running configs against golden templates with rollback support.",
    status: "Building",
    stack: ["Python", "SSH", "Django"],
  },
  {
    name: "Backend patterns notebook",
    category: "Backend Architecture",
    description:
      "Small reference implementations of queues, idempotent APIs, caching and rate limiting.",
    status: "Exploring",
    stack: ["Python", "PostgreSQL", "Redis"],
  },
  {
    name: "CLI productivity toolkit",
    category: "Developer Productivity",
    description: "Scripts and MCP tools that remove repetitive steps from daily engineering work.",
    status: "Building",
    stack: ["Python", "MCP", "Shell"],
  },
];
