import { Github, Linkedin, Mail } from "lucide-react";
import { omkar } from "@/lib/data";
import { GhostButton, WidgetShell } from "./shared";

export function ContactCard() {
  return (
    <WidgetShell>
      <div
        className="mx-auto max-w-md rounded-2xl border border-border-default bg-surface p-7 text-center"
        style={{ borderWidth: "0.5px", boxShadow: "0 8px 40px rgba(0,0,0,0.45)" }}
      >
        <h2 className="font-display text-[24px] font-medium tracking-tight text-text-primary">{omkar.name}</h2>
        <p className="mt-1 text-[14px] text-text-secondary">{omkar.degree} · DJSCE</p>
        <p className="mt-1 flex items-center justify-center gap-2 text-[13px] text-text-muted">
          {omkar.location} ·{" "}
          <span className="inline-flex items-center gap-1.5 text-success">
            <span className="dot-pulse-green h-2 w-2 rounded-full bg-success" />
            {omkar.status}
          </span>
        </p>

        <div className="my-5 space-y-1.5 font-mono-tech text-[13px] text-text-secondary">
          <p>{omkar.email}</p>
          <p>{omkar.githubLabel}</p>
          <p>{omkar.linkedinLabel}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          <GhostButton href={`mailto:${omkar.email}`}>
            <Mail className="h-3.5 w-3.5" /> Send Email
          </GhostButton>
          <GhostButton href={omkar.linkedin}>
            <Linkedin className="h-3.5 w-3.5" /> LinkedIn
          </GhostButton>
          <GhostButton href={omkar.github}>
            <Github className="h-3.5 w-3.5" /> GitHub
          </GhostButton>
        </div>
      </div>
    </WidgetShell>
  );
}
