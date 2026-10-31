/**
 * Featured projects. Each entry gets a case-study page at /projects/[slug].
 * `diagram` selects an architecture diagram from components/diagrams.
 */
export type Project = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  kind: "Professional" | "Personal" | "Concept";
  accent: "green" | "cyan" | "violet";
  tags: string[];
  github?: string; // leave as "[GITHUB_REPO_URL]" or undefined until public
  metrics?: { value: string; label: string }[];
  problem: string;
  solution: string;
  architecture: { flow: string[]; notes: string[] };
  decisions: { title: string; body: string }[];
  challenges: string[];
  outcomes: string[];
};

export const projects: Project[] = [
  {
    slug: "employee-rag-assistant",
    title: "Employee RAG Assistant",
    kicker: "Retrieval-Augmented Generation",
    summary:
      "Hybrid RAG over structured employee data — card-based chunking, semantic + metadata retrieval fused with RRF, query decomposition and LLM-as-judge evaluation.",
    kind: "Professional",
    accent: "violet",
    tags: ["Python", "LangChain", "Chroma", "all-MiniLM-L6-v2", "RRF", "LLM-as-judge", "Streamlit"],
    github: "[GITHUB_REPO_URL]",
    problem:
      "Employee information lived in Excel sheets. Finding answers like “who on the platform team knows Kubernetes and sits in Bangalore?” meant manual filtering across columns — and naive RAG over spreadsheet text returned fragments that mixed up different people.",
    solution:
      "A retrieval pipeline that turns each employee row into a self-contained ‘card’, embeds it with all-MiniLM-L6-v2 into Chroma, and answers through a hybrid retriever (semantic + metadata-filtered) fused with Reciprocal Rank Fusion. An LLM router decomposes multi-intent questions, in-session memory supports follow-ups, an LLM-as-judge loop scores answer quality, and guardrails reduce hallucination. It ships with a Streamlit UI on a local, Claude-compatible LLM gateway for privacy.",
    architecture: {
      flow: ["Excel source", "Card builder", "Chroma + metadata", "LLM router", "Hybrid retriever + RRF", "LLM answer + judge"],
      notes: [
        "Ingestion normalises columns and builds one document per employee with structured metadata.",
        "The router classifies a query as lookup, filter or open-ended and chooses retrieval accordingly.",
        "Reciprocal Rank Fusion merges semantic and metadata-filtered result lists without score calibration.",
        "An LLM-as-judge evaluation loop scores answers so retrieval changes can be measured, not guessed.",
      ],
    },
    decisions: [
      {
        title: "Card-based chunking over fixed-length chunks",
        body: "Fixed-length chunks split a single employee across chunks or merge two employees into one, so retrieved context attributes skills to the wrong person. A card keeps every field for one entity together — each retrieved unit is complete and unambiguous, and metadata maps 1:1 to the card.",
      },
      {
        title: "Hybrid retrieval",
        body: "Pure semantic search is weak on exact identifiers like names, IDs and team codes; pure keyword search misses paraphrases (“ML” vs “machine learning”). Combining both — with metadata filters for hard constraints like location — improved recall for exact and fuzzy queries alike.",
      },
      {
        title: "Local models for privacy",
        body: "all-MiniLM-L6-v2 is fast on CPU and good enough for short cards, and the LLM runs behind a local Claude-compatible gateway — employee data never leaves the environment.",
      },
    ],
    challenges: [
      "Choosing which columns belong in the embedded text versus metadata only.",
      "Decomposing multi-intent questions without losing context between sub-queries.",
      "Handling queries that mix hard filters with fuzzy intent.",
    ],
    outcomes: [
      "Answers that cite complete, correctly attributed employee records.",
      "Exact-match and natural-language queries handled by one interface.",
      "Measurable answer quality through LLM-as-judge evaluation.",
      "A reusable pattern for RAG over tabular data.",
    ],
  },
  {
    slug: "network-device-management",
    title: "Network Device Management Platform",
    kicker: "Backend · Concurrency",
    summary:
      "Containerised Django platform with FastAPI services for onboarding and monitoring network devices over pooled, persistent SSH sessions.",
    kind: "Professional",
    accent: "cyan",
    tags: ["Django", "FastAPI", "Docker", "Redis", "Celery", "SSH"],
    metrics: [{ value: "80%", label: "less manual execution effort" }],
    github: "[GITHUB_REPO_URL]",
    problem:
      "Engineers opened fresh SSH sessions for every check, quickly exhausting the limited VTY lines on devices and making monitoring slow and flaky.",
    solution:
      "A containerised Django application with FastAPI-based internal services that onboards devices from YAML, keeps persistent SSH sessions in a pool that respects per-device VTY limits, and runs connectivity probes and monitoring tasks through Celery workers coordinated via Redis.",
    architecture: {
      flow: ["Django app", "Redis", "Celery workers", "Network devices"],
      notes: [
        "Devices are declared in YAML and onboarded idempotently.",
        "A session pool reuses SSH connections and caps concurrent sessions per device.",
        "TCP connectivity probes run every 60 seconds and update device status.",
        "The original POC used SQLite and in-memory Python session storage; moving to Redis/database-backed session state is the planned production architecture.",
      ],
    },
    decisions: [
      {
        title: "Pool sessions instead of connect-per-command",
        body: "SSH handshakes are expensive and VTY lines are scarce. Reusing sessions cut latency and prevented lockouts.",
      },
      {
        title: "Per-device concurrency limits",
        body: "Each device has its own cap so one busy device can't starve others or exceed its VTY capacity.",
      },
      {
        title: "Celery + Redis for background work",
        body: "Monitoring and probes run outside the request cycle, keeping the UI responsive and making work horizontally scalable.",
      },
    ],
    challenges: [
      "In-memory sessions don't survive restarts or span multiple processes — the main reason for the planned Redis-backed design.",
      "Detecting and recycling stale SSH sessions cleanly.",
    ],
    outcomes: [
      "80% reduction in manual execution effort.",
      "Faster, more reliable device checks without exhausting VTY lines.",
      "A clear migration path from POC to a horizontally scalable architecture.",
    ],
  },
  {
    slug: "webex-mcp-integration",
    title: "Webex MCP Integration",
    kicker: "Model Context Protocol",
    summary:
      "Self-hosted, OAuth-secured MCP server that lets LLM agents and coding assistants message, schedule meetings and summarise check-ins on Webex.",
    kind: "Professional",
    accent: "green",
    tags: ["MCP", "FastMCP", "Python", "OAuth", "Webex APIs"],
    github: "[GITHUB_REPO_URL]",
    problem:
      "Routine communication tasks — notifying many people, scheduling meetings or follow-ups — pulled engineers out of their development workflow.",
    solution:
      "An MCP server built with FastMCP and OAuth-secured tool schemas, self-hosted on Cisco's internal IDE platform, exposing Webex messaging, meeting scheduling and check-in summarization so AI assistants and CLI agents can drive these workflows directly.",
    architecture: {
      flow: ["AI assistant / CLI", "MCP client", "FastMCP server", "Webex APIs"],
      notes: [
        "Tools: bulk and scheduled messages, meeting scheduling, check-in summarization and general Webex API access.",
        "OAuth secures tool access; credentials stay server-side in the MCP process.",
      ],
    },
    decisions: [
      {
        title: "MCP instead of a bespoke plugin",
        body: "One MCP server works across any MCP-capable assistant, avoiding per-tool integrations.",
      },
      {
        title: "Narrow, typed tools",
        body: "Small tools with explicit parameters are easier for models to call correctly and safer to approve.",
      },
    ],
    challenges: ["Designing tool descriptions that models interpret reliably.", "Guarding bulk actions against mistakes."],
    outcomes: ["Communication tasks completed without leaving the editor or terminal."],
  },
  {
    slug: "ai-network-monitoring",
    title: "AI-Assisted Network Monitoring",
    kicker: "Concept · Network operations",
    summary:
      "An engineering concept for an intelligent NetOps platform: health monitoring, golden-config comparison, deployment and rollback.",
    kind: "Concept",
    accent: "cyan",
    tags: ["Python", "SSH", "Django", "LLMs"],
    github: "[GITHUB_REPO_URL]",
    problem:
      "Operational tasks — checking health, backing up configs, spotting drift, rolling back changes — are repetitive and error-prone when done by hand across many devices.",
    solution:
      "A platform design combining SSH-based device access, CPU/memory monitoring, configuration backups, golden-config comparison, deployment and rollback, with an AI layer to summarise health and explain drift.",
    architecture: {
      flow: ["Operator / AI assistant", "Platform API", "Task workers", "Devices", "Config store"],
      notes: [
        "This is an engineering project and concept — not a deployed commercial product.",
        "Builds on the session pooling work from the Device Management Platform.",
      ],
    },
    decisions: [
      {
        title: "Golden configs as the source of truth",
        body: "Comparing running configs against approved templates makes drift visible and rollback deterministic.",
      },
      {
        title: "Humans approve changes",
        body: "AI proposes and explains; deployment and rollback stay behind explicit operator approval.",
      },
    ],
    challenges: ["Vendor-specific config formats.", "Safe rollback semantics."],
    outcomes: ["A blueprint for the next iteration of my device-management work."],
  },
  {
    slug: "cxtm-mongodb-splunk",
    title: "CXTM · MongoDB · Splunk Integration",
    kicker: "Automation · Observability",
    summary:
      "Automated KPI capture from test runs into MongoDB and Splunk dashboards using reusable Python and Robot Framework keywords.",
    kind: "Professional",
    accent: "green",
    tags: ["Python", "Robot Framework", "MongoDB", "Splunk", "CXTM"],
    metrics: [
      { value: "70%", label: "less manual reporting" },
      { value: "40%", label: "faster root-cause analysis" },
    ],
    problem:
      "KPIs from test executions were collected and reported manually, which was slow, inconsistent and made trends hard to see.",
    solution:
      "Dynamic, reusable Python and Robot Framework keywords capture KPIs during CXTM runs, store them in MongoDB and feed Splunk dashboards for reporting and analysis.",
    architecture: {
      flow: ["CXTM test runs", "Robot / Python keywords", "MongoDB", "Splunk dashboards"],
      notes: ["Keywords are parameterised so new KPIs can be added without new code paths."],
    },
    decisions: [
      {
        title: "Capture at the source",
        body: "Collecting KPIs inside test keywords removed a separate, error-prone reporting step.",
      },
      {
        title: "MongoDB for flexible KPI schemas",
        body: "Different tests emit different KPIs; a document store avoided constant migrations.",
      },
    ],
    challenges: ["Normalising KPIs from heterogeneous tests.", "Keeping keywords generic yet easy to use."],
    outcomes: ["70% reduction in manual reporting effort.", "40% faster root-cause analysis."],
  },
  {
    slug: "pcap-validation-automation",
    title: "PCAP Validation Automation",
    kicker: "Test automation",
    summary:
      "Reusable dynamic keywords that validate and verify packet captures, making network tests repeatable.",
    kind: "Professional",
    accent: "violet",
    tags: ["Python", "Robot Framework", "PCAP"],
    problem: "Packet-capture verification was manual and differed between engineers, hurting repeatability.",
    solution:
      "A library of dynamic Robot Framework / Python keywords that parse captures and assert protocol fields and sequences declaratively.",
    architecture: {
      flow: ["Test case", "PCAP keywords", "Capture parser", "Assertions & report"],
      notes: ["Keywords take expectations as parameters so one implementation serves many tests."],
    },
    decisions: [
      {
        title: "Declarative expectations",
        body: "Tests describe what should be in a capture rather than how to check it.",
      },
    ],
    challenges: ["Covering many protocols without bloating the keyword surface."],
    outcomes: ["More repeatable, faster network test validation."],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
