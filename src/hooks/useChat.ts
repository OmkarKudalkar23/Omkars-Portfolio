import { useCallback, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { omkar } from "@/lib/data";
import type { WidgetData } from "@/components/widgets/WidgetRenderer";

export type ChatRole = "user" | "assistant";
export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  component?: string | null;
  data?: WidgetData;
  status: "typing" | "streaming" | "done";
};

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const turnsRef = useRef(0);
  const nudgedRef = useRef(false);
  const surpriseIdx = useRef(0);

  const patch = useCallback((id: string, fields: Partial<ChatMessage>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...fields } : m)));
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

  const maybeNudge = useCallback(() => {
    turnsRef.current += 1;
    if (turnsRef.current >= 5 && !nudgedRef.current) {
      nudgedRef.current = true;
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: "You've been exploring for a while — feel free to reach out directly.",
          component: "ContactCard",
          data: null,
          status: "done",
        },
      ]);
    }
  }, []);

  const openProject = useCallback((id: string) => {
    const p = omkar.projects.find((x) => x.id === id);
    setMessages((prev) => [
      ...prev,
      {
        id: uid(),
        role: "assistant",
        content: `Here's the full breakdown of **${p?.name ?? "the project"}**.`,
        component: "ProjectCaseStudy",
        data: { projectId: id },
        status: "done",
      },
    ]);
  }, []);

  const send = useCallback(
    async (text: string) => {
      if (busy) return;
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: ChatMessage = { id: uid(), role: "user", content: trimmed, status: "done" };
      setMessages((prev) => [...prev, userMsg]);

      // /dev easter egg — bypass AI
      if (trimmed.toLowerCase() === "/dev") {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant",
            content: "",
            component: "DevPanel",
            data: null,
            status: "done",
          },
        ]);
        return;
      }

      setBusy(true);
      const assistantId = uid();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          component: null,
          data: null,
          status: "typing",
        },
      ]);

      // "Surprise me" — local random moment
      if (/surprise me/i.test(trimmed)) {
        await sleep(700);
        const pick = omkar.surprises[surpriseIdx.current % omkar.surprises.length];
        surpriseIdx.current += 1;
        await streamText(assistantId, "Here's something most people miss —");
        patch(assistantId, { component: "SurpriseMoment", data: { text: pick }, status: "done" });
        setBusy(false);
        maybeNudge();
        return;
      }

      try {
        const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
        await sleep(500 + Math.random() * 500);
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });
        const json = await res.json();

        if (!res.ok || json.error) {
          await streamText(assistantId, json.error ?? "Something went wrong. Try again in a sec.");
          patch(assistantId, { status: "done" });
          setBusy(false);
          return;
        }

        await streamText(assistantId, json.message ?? "");

        if (json.navigate && /^[a-z-]+$/.test(json.navigate)) {
          patch(assistantId, { component: null, data: null, status: "done" });
          setBusy(false);
          await sleep(800);
          navigate({ to: `/${json.navigate}` });
          return;
        }

        patch(assistantId, {
          component: json.component ?? null,
          data: json.data ?? null,
          status: "done",
        });
        setBusy(false);
        maybeNudge();
      } catch {
        await streamText(assistantId, "I couldn't reach the AI just now. Please try again.");
        patch(assistantId, { status: "done" });
        setBusy(false);
      }
    },
    [busy, messages, patch, streamText, maybeNudge],
  );

  return { messages, busy, send, openProject };
}
