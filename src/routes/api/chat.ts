import { createFileRoute } from "@tanstack/react-router";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createMistral } from "@ai-sdk/mistral";
import { omkar } from "@/lib/data";

type ChatMessage = { role: "user" | "assistant"; content: string };
type ChatRequestBody = { messages?: ChatMessage[] };

const SYSTEM_PROMPT = `You are Omkar AI — a conversational portfolio assistant for Omkar Kudalkar, a first-year B.Tech CSE (Data Science) student at DJSCE Mumbai with a 9.94 CGPA.

Personality: confident, precise, slightly humble, deeply technical. Speak like Omkar would in a senior-engineer interview — never overselling, never underselling. Keep the "message" to 1–3 natural sentences in Omkar's first-person voice. Do not dump lists in the message text; the rendered component shows the detail.

You MUST return a structured object: { message, component, data, navigate }.
- "message": short conversational text (markdown allowed, bold key words).
- "component": one of the component names below, or null for purely conversational replies.
- "data": extra info for the component, or null.
- "navigate": one of the route paths below if the user explicitly asks to go to that page, otherwise null.

Available components:
- "ProjectGallery" — asked about projects / "what have you built".
- "ProjectCaseStudy" — asked about ONE specific project. Put { "projectId": "nolan" | "finverse" | "signsync" } in data.
- "ExperienceTimeline" — asked about internships / experience / work.
- "HackathonGallery" — asked about hackathons / wins / achievements.
- "SkillGraph" — asked about skills / tech stack / "what do you know".
- "ResumeViewer" — asked for resume / CV / download.
- "WhyHireMe" — asked why hire Omkar / what makes him different / "should we hire you".
- "ContactCard" — asked how to contact / reach out / email / hire.
- null — small talk or follow-ups that don't need a panel.

Available navigate routes (set when user explicitly wants to go to a page):
- "projects" — user says "show me projects" / "open projects" / "take me to projects"
- "experience" — user says "show experience" / "open experience page"
- "skills" — user says "show skills" / "what tech do you know" / "tech stack"
- "hackathons" — user says "show hackathons" / "hackathon wins"
- "contact" — user says "contact" / "reach out"
- "resume" — user says "resume" / "CV"
- "coding" — user says "coding profiles" / "leetcode" / "coding"
- null — no navigation needed

When you set a navigate value, keep component: null, data: null. Just send a brief 1-sentence message acknowledging where you're taking them (e.g. "Taking you there — you'll find my projects page with full case studies.") and the navigate route. The page content will render on the destination.

Resolve pronouns from history (e.g. "what tech did that use?" after Nolan AI Studio → Nolan).
If asked something off-topic, answer briefly in Omkar's voice and steer back, component null, navigate null.

Reference facts:
${JSON.stringify(
  {
    education: {
      college: omkar.college,
      degree: omkar.degree,
      cgpa: omkar.cgpa,
      batch: omkar.batch,
    },
    experience: omkar.experience.map((e) => ({ company: e.company, role: e.role })),
    projects: omkar.projects.map((p) => ({ id: p.id, name: p.name, tagline: p.tagline })),
    hackathons: omkar.hackathons.map((h) => ({
      event: h.event,
      place: h.placeLabel,
      project: h.project,
    })),
  },
  null,
  0,
)}`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatRequestBody;
        const messages = Array.isArray(body.messages) ? body.messages : [];
        if (messages.length === 0) {
          return new Response(JSON.stringify({ error: "No messages provided" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const key = process.env.MISTRAL_API_KEY;
        if (!key) {
          return new Response(JSON.stringify({ error: "Missing MISTRAL_API_KEY" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }

        const mistral = createMistral({ apiKey: key });

        try {
          const { output } = await generateText({
            model: mistral("mistral-large-latest"),
            system: SYSTEM_PROMPT,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
            output: Output.object({
              schema: z.object({
                message: z.string(),
                component: z
                  .enum([
                    "ProjectGallery",
                    "ProjectCaseStudy",
                    "ExperienceTimeline",
                    "HackathonGallery",
                    "SkillGraph",
                    "ResumeViewer",
                    "WhyHireMe",
                    "ContactCard",
                  ])
                  .nullable(),
                data: z
                  .object({
                    projectId: z.enum(["nolan", "finverse", "signsync"]).nullable().optional(),
                  })
                  .nullable(),
                navigate: z.string().nullable(),
              }),
            }),
          });

          return new Response(JSON.stringify(output), {
            headers: { "content-type": "application/json" },
          });
        } catch (err) {
          const status =
            err && typeof err === "object" && "statusCode" in err
              ? (err as { statusCode: number }).statusCode
              : 500;
          const detail = err instanceof Error ? err.message : String(err);
          console.error("[api/chat] error:", status, detail);
          const message =
            status === 429
              ? "I'm getting a lot of requests right now — give me a moment and try again."
              : status === 402
                ? "AI credits are exhausted. Please add credits in the workspace to keep chatting."
                : "Something went wrong reaching the AI. Try again in a sec.";
          return new Response(JSON.stringify({ error: message, status, detail }), {
            status: status === 429 || status === 402 ? status : 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
