import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { AmbientBackground } from "@/components/background/AmbientBackground";
import { IntroAnimation } from "@/components/animations/IntroAnimation";
import { Greeting } from "@/components/chat/Greeting";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { Sidebar } from "@/components/sidebar/Sidebar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Omkar AI — Conversational Portfolio" },
      {
        name: "description",
        content:
          "Ask Omkar AI about projects, hackathon wins, research internships and skills — a conversational portfolio for Omkar Kudalkar.",
      },
      { property: "og:title", content: "Omkar AI — Conversational Portfolio" },
      {
        property: "og:description",
        content: "A luxury AI operating system instead of a portfolio. Ask anything.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { messages, busy, send, openProject } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="relative min-h-screen">
      <IntroAnimation />
      <AmbientBackground />

      {/* Sidebar — fixed, sits outside the centered column */}
      <Sidebar sendPrompt={send} />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[760px] flex-col px-5">
        <div className="flex-1 pt-[14vh]">
          <Greeting />
          {messages.length === 0 && <SuggestedPrompts onPick={send} />}

          <div className="mt-10 space-y-8 pb-4">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} onOpenProject={openProject} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        <ChatInput onSend={send} disabled={busy} />
      </main>
    </div>
  );
}
