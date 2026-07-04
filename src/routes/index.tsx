import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { IntroAnimation } from "@/components/animations/IntroAnimation";
import { Greeting } from "@/components/chat/Greeting";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Lightfall } from "@/components/ui/Lightfall";
import { AirplaneLandingIntro } from "@/components/animations/AirplaneLandingIntro";

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
  const [isMounted, setIsMounted] = useState(false);
  const [hasFinishedIntro, setHasFinishedIntro] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const handleIntroFinish = () => {
    setHasFinishedIntro(true);
  };

  if (!hasFinishedIntro) {
    return <AirplaneLandingIntro onFinish={handleIntroFinish} />;
  }

  return (
    <div className="relative min-h-screen">
      <IntroAnimation />
      
      {isMounted && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <Lightfall
            colors={['#4f8ef7', '#7850c8', '#3ecf8e']}
            backgroundColor="#080809"
            speed={0.25}
            streakCount={4}
            streakWidth={0.8}
            streakLength={1.3}
            glow={0.7}
            density={0.45}
            twinkle={0.5}
            zoom={2.2}
            backgroundGlow={0.5}
            opacity={0.4}
            mouseInteraction={true}
            mouseStrength={0.7}
            mouseRadius={1.1}
          />
        </div>
      )}

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

