export const omkar = {
  name: "Omkar Kudalkar",
  email: "kudalkaromkar44@gmail.com",
  github: "https://github.com/OmkarKudalkar23",
  githubLabel: "github.com/OmkarKudalkar23",
  linkedin: "https://linkedin.com/in/omkar-kudalkar",
  linkedinLabel: "linkedin.com/in/omkar-kudalkar",
  leetcode: "https://leetcode.com/u/djikstraster",
  leetcodeLabel: "leetcode.com/u/djikstraster",
  college: "Dwarkadas Jivanlal Sanghvi College of Engineering",
  collegeShort: "DJSCE, Mumbai",
  degree: "B.Tech CSE (Data Science)",
  cgpa: 9.9425,
  batch: "2024 – 2028",
  location: "Mumbai, India",
  status: "Available Now",

  experience: [
    {
      company: "Hooman Labs",
      role: "Founders Office Intern",
      period: "Apr 2026 – Present",
      accent: "#4f8ef7",
      highlights: [
        "Built CRM integrations between HubSpot, Shopify, and the company's platform to automate customer onboarding and workflow management.",
        "Developed multi-agent voice systems for enterprise clients — GIVA, Careers360, Newton School, Man Matters — integrating CRM platforms, telephony, and LLM conversational workflows.",
      ],
      tech: ["LangGraph", "HubSpot API", "Shopify API", "n8n", "LLM"],
    },
    {
      company: "IIT Patna",
      role: "Research Intern",
      period: "Apr 2026 – Present",
      accent: "#3ecf8e",
      highlights: [
        "Built a multi-agent research paper analysis system using Neo4j + Google Scholar APIs for parsing, citation analysis, claim verification, and report generation.",
        "Designed a modular agent architecture: keyword extraction, argument mining, evidence grounding, and citation-gap detection coordinated by a central orchestrator.",
      ],
      tech: ["Neo4j", "LangGraph", "Python", "Google Scholar API"],
    },
  ],

  projects: [
    {
      id: "nolan",
      name: "Nolan AI Studio",
      tagline: "Graph-RAG powered multi-agent storytelling platform",
      accent: "#c084fc",
      date: "March 2026",
      problem:
        "Chunking-based RAG loses narrative context — character relationships and story entities get flattened into disconnected vectors, breaking long-form storytelling.",
      solution:
        "Replaced vector chunking with Graph-RAG on Neo4j, mapping characters and story entities as graph nodes. A multi-agent system handles AI comic generation, image visualization, and voice-agent narration, with intelligent orchestration cutting redundant calls.",
      tech: ["Neo4j", "Next.js", "LangChain", "MongoDB", "LangGraph"],
      architecture: ["Story Input", "Graph-RAG (Neo4j)", "Agent Orchestrator", "Comic + Voice + Image Agents", "Rendered Story"],
      metrics: [
        { value: "3×", label: "fewer API calls per session" },
        { value: "Graph-RAG", label: "vs chunking-based RAG" },
        { value: "1st Place", label: "DevHacks 2026" },
      ],
      github: "https://github.com/OmkarKudalkar23",
      demo: null,
    },
    {
      id: "finverse",
      name: "Finverse",
      tagline: "Offline-first financial literacy for rural India",
      accent: "#34d399",
      date: "February 2026",
      problem:
        "Rural communities face unreliable connectivity and low financial literacy — static content fails to engage and can't sync learning progress offline.",
      solution:
        "An offline-first platform with IndexedDB synchronization, IVR assistance, real-time government scheme updates, and community learning. 5+ gamified 3D modules turn financial education into an interactive experience.",
      tech: ["Next.js", "Three.js", "IndexedDB", "MongoDB", "GSAP"],
      architecture: ["Offline Client", "IndexedDB Sync", "3D Gamified Modules", "IVR + Scheme Feed", "MongoDB Cloud"],
      metrics: [
        { value: "500+", label: "rural users" },
        { value: "40%", label: "better lesson completion" },
        { value: "5+", label: "3D gamified modules" },
      ],
      github: "https://github.com/OmkarKudalkar23",
      demo: null,
    },
    {
      id: "signsync",
      name: "SignSync",
      tagline: "Real-time ISL/ASL translation with 3D avatars",
      accent: "#60a5fa",
      date: "February 2026",
      problem:
        "466M+ deaf and hard-of-hearing people are excluded from everyday digital communication — existing tools are slow, server-bound, and lack expressive sign rendering.",
      solution:
        "MediaPipe tracks 21 hand skeletal points with sub-2ms latency, converting gestures to synthesized speech and rendering signs via custom 3D avatars. A Chrome extension (SignTube) ships 641+ sign animations fully client-side, plus live meeting translation overlays.",
      tech: ["Next.js", "Python", "MediaPipe", "OpenCV", "LSTM", "Whisper"],
      architecture: ["Camera Input", "MediaPipe (21 points)", "LSTM Classifier", "Speech / 3D Avatar", "SignTube Extension"],
      metrics: [
        { value: "sub-2ms", label: "gesture detection latency" },
        { value: "641+", label: "pre-built sign animations" },
        { value: "466M+", label: "potential users served" },
      ],
      github: "https://github.com/OmkarKudalkar23",
      demo: null,
    },
  ],

  hackathons: [
    {
      place: 1,
      placeLabel: "1st Place",
      event: "DevHacks 2026",
      host: "Atharva Engineering College",
      participants: "1000+ participants",
      project: "Nolan AI Studio",
      accent: "#c084fc",
      tech: ["Graph-RAG", "Neo4j", "LangGraph"],
      detail: "Graph-RAG multi-agent storytelling with AI comic generation and voice review workflows.",
    },
    {
      place: 1,
      placeLabel: "1st Place",
      event: "HackXelerate 2026",
      host: "VJTI Mumbai",
      participants: "200+ teams",
      project: "AI Waste Management",
      accent: "#34d399",
      tech: ["OpenCV", "IoT", "Routing"],
      detail: "Smart waste platform using OpenCV detection and intelligent routing to the nearest sanitation worker.",
    },
    {
      place: 3,
      placeLabel: "2nd Runner Up",
      event: "Spectrum 2026",
      host: "Bhagubhai Diploma College",
      participants: "400+ teams · Fintech",
      project: "Finverse",
      accent: "#60a5fa",
      tech: ["IndexedDB", "IVR", "Next.js"],
      detail: "Offline-first financial literacy with IndexedDB sync, IVR assistance and gamified modules.",
    },
  ],

  skills: {
    languages: ["Python", "C++", "C", "Java", "JavaScript"],
    frontend: ["Next.js", "React.js", "Three.js", "Framer Motion", "Tailwind CSS"],
    backend: ["Node.js", "Express.js", "MongoDB", "Neo4j", "REST APIs"],
    ai: ["LangChain", "LangGraph", "MediaPipe", "OpenCV", "LSTM", "Whisper"],
    tools: ["Git", "GitHub", "Vercel", "n8n", "CI/CD"],
  },

  differentiators: [
    {
      title: "Production, not prototypes",
      proof: "Systems running for real users — 500+ rural learners, a published Chrome extension, enterprise voice agents.",
    },
    {
      title: "Research-grade depth",
      proof: "Multi-agent architectures with Neo4j graph reasoning at IIT Patna — not just calling an LLM API.",
    },
    {
      title: "Wins under pressure",
      proof: "Two 1st-place hackathon wins against 1000+ and 200+ team fields, plus a fintech podium.",
    },
    {
      title: "Full-stack range",
      proof: "From sub-2ms computer vision to Graph-RAG backends to 3D gamified frontends — end to end.",
    },
  ],

  surprises: [
    "SignSync tracks 21 hand skeletal points with sub-2ms latency — built to serve 466M+ deaf and hard-of-hearing users.",
    "Won DevHacks 2026 against 1000+ participants with a Graph-RAG storytelling engine.",
    "9.94 CGPA as a first-year — while shipping three production projects.",
    "Built SignTube: a Chrome extension with 641+ pre-built sign animations, fully client-side, zero server dependency.",
    "Two active research/industry internships at once — IIT Patna and Hooman Labs.",
  ],
};

export type Omkar = typeof omkar;
export const COMPONENT_NAMES = [
  "ProjectGallery",
  "ProjectCaseStudy",
  "ExperienceTimeline",
  "HackathonGallery",
  "SkillGraph",
  "ResumeViewer",
  "WhyHireMe",
  "ContactCard",
] as const;
export type ComponentName = (typeof COMPONENT_NAMES)[number];
