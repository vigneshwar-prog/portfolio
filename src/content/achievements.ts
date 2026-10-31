export type Achievement = { title: string; issuer: string; detail: string; icon: string; count?: number };

// No dates or credential IDs are listed — add them only when you have them.
export const achievements: Achievement[] = [
  {
    title: "Automation Genie Award",
    issuer: "Cisco",
    detail: "Recognised across multiple quarters for reusable automation built with best coding practices and delivered on time for customers.",
    icon: "Sparkles",
    count: 3,
  },
  {
    title: "Rising Star",
    issuer: "Cisco",
    detail: "Recognition for impact and growth as an early-career engineer.",
    icon: "Star",
  },
  {
    title: "Hackathon Winner",
    issuer: "Virtusa",
    detail: "Won the internal hackathon during my software engineering internship.",
    icon: "Trophy",
  },
  {
    title: "Coursera Specializations",
    issuer: "Coursera",
    detail: "AI-Tech Practitioner, Python Specialization, and Machine Learning / Deep Learning Specialization.",
    icon: "GraduationCap",
  },
  {
    title: "Content Creator · InfiTamil",
    issuer: "YouTube",
    detail: "Technical tutorials and coding challenges for the learning community.",
    icon: "Sparkles",
  },
];
