# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters and hiring managers evaluating Omkar Kudalkar for AI / data-science internships. They land on the site in a short evaluation window, scan for proof of ability and wins, then decide whether to contact him.

## Product Purpose

A conversational portfolio: instead of reading a static CV, the visitor asks "Omkar AI" — an LLM chat grounded in his actual work — about projects, hackathon wins, research internships, and skills. Success is a recruiter leaving with a clear, evidence-backed picture of his capability and choosing to reach out.

## Positioning

"Ask anything" AI operating system instead of a portfolio — the site's mechanism is conversation: the visitor's question is answered from real, structured evidence of his work, rather than a one-directional pitch. The chat-first concept is core today but the product is open to a hybrid evolution where standard sections and case studies carry weight alongside the chat.

## Operating Context

- First-year B.Tech CSE (Data Science) student, DJSCE Mumbai, batch 2024–2028; CGPA 9.94; currently available for internships.
- Site entry is an animated intro, then a chat-first home page with a sidebar navigating to projects, experience, hackathons, skills, and contact.
- Project case-study pages exist for Nolan AI Studio and Finverse; all other content is driven from structured data in `src/lib/data.ts`.
- Visitors span desktop and mobile; evaluation sessions are typically short, so the first impression must land fast.

## Capabilities and Constraints

- Chat backed by a server API route (`src/routes/api/chat.ts`, Mistral via AI SDK) with suggested prompts, markdown rendering, and project deep-link actions.
- Routes: index, projects, projects/nolan-studio, projects/finverse, experience, hackathons, skills, contact, sitemap.
- Content lives in `src/lib/data.ts`: 3 featured projects, 6 experience entries, 6 hackathon placements, skills, differentiators, "surprise" facts. Projects have no live demos (`demo: null` for all) — only GitHub links.
- Experience entries for DJS Code AI, DJS S4DS, DJS SIGAI, and COGNIFYZ are real roles; the "(Placeholder)" labels in their data are leftover and should be cleaned up, not treated as placeholders.
- Stack: TanStack Start, React 19, Vite 8, Tailwind 4, TypeScript; heavy use of GSAP, Framer Motion, Three.js, and canvas visuals. Deployed via Lovable (nitro/Cloudflare Workers per `.wrangler/`).

## Brand Commitments

- Name: "Omkar AI — Conversational Portfolio".
- Positioning line: "A luxury AI operating system instead of a portfolio. Ask anything."
- Public identity handles: github.com/OmkarKudalkar23, linkedin.com/in/omkar-kudalkar, leetcode.com/u/djikstraster; email kudalkaromkar44@gmail.com.

## Evidence on Hand

- All portfolio content in `src/lib/data.ts`: 3 featured projects (Nolan AI Studio — 1st place DevHacks 2026, 1000+ participants; Finverse — 2nd runner-up Spectrum 2026; SignSync), 6 experiences including Research Intern at IIT Patna and Founders Office Intern at Hooman Labs (Apr 2026 – present), hackathon images (`/acewin.png`, `/devhackswin.png`, `/hackxcelearatewin.png`, `/spectrumwin.png`, `/rubixwin.png`).
- No testimonials, no project demo URLs, and no download-link resume on the site — future work must not fabricate these.

## Product Principles

1. Proof over claims — every assertion maps to a real artifact: metrics, wins, links, and deployments.
2. Conversation is the interface — answer the visitor's question directly instead of making them hunt.
3. Substance over seniority — a first-year showing research-grade depth (graph-RAG, computer vision, multi-agent systems).
4. Earn the short window — the site must convince within the first minutes of a recruiter's visit.
5. Honest content — only real roles, wins, and numbers; nothing invented.
