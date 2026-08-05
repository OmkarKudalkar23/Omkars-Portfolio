import { useState, useRef, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, ArrowUp } from "lucide-react";
import { canHover } from "@/lib/pointer";

/* ─── Types ──────────────────────────────────────────────── */
type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status: "done" | "typing" | "streaming";
};

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ─── Per-route config ───────────────────────────────────── */
const GREETINGS: Record<string, string> = {
  "/projects": "Which project do you want to dig into — Nolan AI, Finverse, or SignSync?",
  "/experience": "Ask me anything about my work at Hooman Labs or IIT Patna.",
  "/hackathons": "Two firsts, one runner-up — what do you want to know?",
  "/skills": "Ask about any specific tech or how I've applied it in production.",
  "/contact": "I'll help you reach Omkar — what would you like to know first?",
};

const CONTEXT_SEEDS: Record<string, string> = {
  "/projects":
    "The user is viewing Omkar's Projects page. Focus answers on his three main projects: Nolan AI Studio, Finverse, and SignSync.",
  "/experience":
    "The user is viewing Omkar's Experience page. Focus answers on his internships at Hooman Labs and IIT Patna.",
  "/hackathons":
    "The user is viewing Omkar's Hackathons page. Focus answers on his hackathon wins: DevHacks 2026, HackXelerate 2026, and Spectrum 2026.",
  "/skills":
    "The user is viewing Omkar's Skills page. Focus answers on his tech stack and how he's applied skills in production.",
  "/contact":
    "The user is viewing Omkar's Contact page. Help them understand how to reach Omkar and what he's available for.",
};

const SECTION_LABELS: Record<string, string> = {
  "/projects": "projects",
  "/experience": "experience",
  "/hackathons": "hackathons",
  "/skills": "skills",
  "/contact": "contact",
};

/* ─── Component ──────────────────────────────────────────── */
export function ContextualChat({ path }: { path: string }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Msg[]>([]);

  const greeting = GREETINGS[path] ?? "Ask me anything!";
  const contextSeed = CONTEXT_SEEDS[path] ?? "";
  const sectionLabel = SECTION_LABELS[path] ?? "this section";

  const setMsgs = (updater: Msg[] | ((prev: Msg[]) => Msg[])) => {
    setMessages((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      messagesRef.current = next;
      return next;
    });
  };

  const patch = useCallback((id: string, fields: Partial<Msg>) => {
    setMsgs((prev) => prev.map((m) => (m.id === id ? { ...m, ...fields } : m)));
    // scroll
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
  }, []);

  const streamText = useCallback(
    async (id: string, full: string) => {
      const words = full.split(" ");
      let acc = "";
      patch(id, { status: "streaming", content: "" });
      for (let i = 0; i < words.length; i++) {
        acc += (i === 0 ? "" : " ") + words[i];
        patch(id, { content: acc });
        await sleep(28);
      }
    },
    [patch],
  );

  const send = useCallback(
    async (text: string) => {
      if (busy || !text.trim()) return;
      const userMsg: Msg = {
        id: uid(),
        role: "user",
        content: text.trim(),
        status: "done",
      };
      setMsgs((prev) => [...prev, userMsg]);
      setValue("");
      if (inputRef.current) inputRef.current.style.height = "auto";
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);

      setBusy(true);
      const assistantId = uid();
      setMsgs((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          status: "typing",
        },
      ]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);

      try {
        // Build history from visible messages + new user msg
        const visible = messagesRef.current.filter((m) => m.id !== assistantId);
        const visibleHistory = visible.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        // Prime context with seed at start (hidden from UI)
        const apiMessages = contextSeed
          ? [
              { role: "user" as const, content: contextSeed },
              {
                role: "assistant" as const,
                content: "Understood. I'll focus my answers on this page's context.",
              },
              ...visibleHistory,
            ]
          : visibleHistory;

        await sleep(350 + Math.random() * 300);
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });
        const json = await res.json();

        if (!res.ok || json.error) {
          await streamText(assistantId, json.error ?? "Something went wrong. Try again.");
        } else {
          await streamText(assistantId, json.message ?? "");

          if (json.navigate) {
            patch(assistantId, { status: "done" });
            setBusy(false);
            await sleep(600);
            navigate({ to: `/${json.navigate}` });
            return;
          }
        }
        patch(assistantId, { status: "done" });
      } catch {
        await streamText(assistantId, "Couldn't reach the AI right now. Please try again.");
        patch(assistantId, { status: "done" });
      }
      setBusy(false);
    },
    [busy, contextSeed, patch, streamText],
  );

  return (
    <>
      {/* ── Floating toggle button ─────────────────────────── */}
      <motion.button
        id="contextual-chat-btn"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed",
          bottom: "max(24px, calc(var(--safe-bottom) + 24px))",
          right: 16,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "#4f8ef7",
          boxShadow: "0 4px 24px rgba(79,142,247,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          border: "none",
          zIndex: 120,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ display: "flex" }}
            >
              <X size={20} color="#080809" strokeWidth={2} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ display: "flex" }}
            >
              <MessageCircle size={20} color="#080809" strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat window ───────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            style={{
              position: "fixed",
              bottom: "max(92px, calc(var(--safe-bottom) + 92px))",
              right: 16,
              width: "min(380px, calc(100vw - 32px))",
              height: "min(480px, calc(100dvh - 128px))",
              background: "rgba(8,8,9,0.97)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "0.5px solid rgba(255,255,255,0.10)",
              borderRadius: 20,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
              zIndex: 110,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "0.5px solid rgba(255,255,255,0.07)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <div
                  className="dot-pulse-green"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#3ecf8e",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#f2f2f3",
                    whiteSpace: "nowrap",
                  }}
                >
                  Omkar AI
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "#505058",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  · Ask about {sectionLabel}
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                style={{
                  background: "none",
                  border: "none",
                  color: "#505058",
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 6,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!canHover) return;
                  e.currentTarget.style.color = "#f2f2f3";
                }}
                onMouseLeave={(e) => {
                  if (!canHover) return;
                  e.currentTarget.style.color = "#505058";
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {/* Static greeting */}
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "rgba(255,255,255,0.04)",
                  border: "0.5px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px 14px 14px 4px",
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "#f2f2f3",
                  lineHeight: 1.55,
                  maxWidth: "88%",
                }}
              >
                {greeting}
              </div>

              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    background:
                      m.role === "user" ? "rgba(79,142,247,0.15)" : "rgba(255,255,255,0.04)",
                    border:
                      m.role === "user"
                        ? "0.5px solid rgba(79,142,247,0.25)"
                        : "0.5px solid rgba(255,255,255,0.08)",
                    borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    padding: "10px 14px",
                    fontSize: 13,
                    color: "#f2f2f3",
                    lineHeight: 1.55,
                    maxWidth: "88%",
                  }}
                >
                  {m.status === "typing" ? (
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        alignItems: "center",
                        padding: "3px 0",
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: "#a0a0a8",
                            animation: `typing-bounce 1.2s ${i * 0.2}s ease-in-out infinite`,
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: "10px 12px",
                borderTop: "0.5px solid rgba(255,255,255,0.07)",
                display: "flex",
                gap: 8,
                alignItems: "flex-end",
                flexShrink: 0,
              }}
            >
              <textarea
                ref={inputRef}
                value={value}
                rows={1}
                disabled={busy}
                placeholder="Ask anything…"
                onChange={(e) => {
                  setValue(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 80)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(value);
                  }
                }}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.04)",
                  border: "0.5px solid rgba(255,255,255,0.09)",
                  borderRadius: 12,
                  padding: "8px 12px",
                  fontSize: 13,
                  color: "#f2f2f3",
                  resize: "none",
                  outline: "none",
                  fontFamily: "Inter, system-ui, sans-serif",
                  lineHeight: 1.5,
                  maxHeight: 80,
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() => send(value)}
                  disabled={busy || !value.trim()}
                  aria-label="Send message"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "transparent",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    opacity: busy || !value.trim() ? 0.3 : 1,
                    transition: "opacity 0.15s",
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#4f8ef7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ArrowUp size={14} color="#080809" strokeWidth={2.5} />
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
