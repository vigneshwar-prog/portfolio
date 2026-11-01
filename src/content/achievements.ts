export type Achievement = { title: string; issuer: string; detail: string; icon: string; count?: number; link?: string };

// No dates or credential IDs are listed — add them only when you have them.
export const achievements: Achievement[] = [
  {
    title: "Automation Genie",
    issuer: "Cisco",
    detail: "Recognised across multiple quarters for reusable, well-engineered automation delivered on time for customers.",
    icon: "Sparkles",
    count: 3,
  },
  {
    title: "Rising Star",
    issuer: "Cisco",
    detail: "Recognised for early-career impact and fast growth as an engineer.",
    icon: "Star",
  },
  {
    title: "Hackathon Winner",
    issuer: "Virtusa",
    detail: "Won the internal hackathon during my software engineering internship.",
    icon: "Trophy",
  },
  {
    title: "Content Creator",
    issuer: "YouTube · InfiTamil",
    detail: "Publishing technical tutorials and coding challenges for the Tamil learning community.",
    icon: "Sparkles",
    link: "https://www.youtube.com/@InFiTamil",
  },
];
