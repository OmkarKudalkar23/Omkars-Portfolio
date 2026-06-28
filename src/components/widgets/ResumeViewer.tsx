import { Copy, Download, Github, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { omkar } from "@/lib/data";
import { GhostButton, TechPill, WidgetShell } from "./shared";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="font-mono-tech text-[11px] uppercase tracking-wider text-accent-blue">{title}</h4>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export function ResumeViewer() {
  return (
    <WidgetShell>
      <div className="rounded-2xl border border-border-subtle bg-surface p-6 sm:p-7" style={{ borderWidth: "0.5px" }}>
        {/* Action bar */}
        <div className="flex flex-wrap gap-2 border-b border-border-subtle pb-5" style={{ borderBottomWidth: "0.5px" }}>
          <GhostButton href={omkar.linkedin}>
            <Download className="h-3.5 w-3.5" /> Download PDF
          </GhostButton>
          <GhostButton
            onClick={() => {
              navigator.clipboard?.writeText(omkar.email);
              toast.success("Email copied");
            }}
          >
            <Copy className="h-3.5 w-3.5" /> Copy Email
          </GhostButton>
          <GhostButton href={omkar.linkedin}>
            <Linkedin className="h-3.5 w-3.5" /> LinkedIn
          </GhostButton>
          <GhostButton href={omkar.github}>
            <Github className="h-3.5 w-3.5" /> GitHub
          </GhostButton>
        </div>

        <div className="space-y-6 pt-6">
          <div>
            <h2 className="font-display text-[28px] font-medium tracking-tight text-text-primary">{omkar.name}</h2>
            <p className="text-[14px] text-text-secondary">
              {omkar.degree} · {omkar.collegeShort}
            </p>
          </div>

          <Section title="Education">
            <p className="text-[15px] text-text-primary">{omkar.college}</p>
            <p className="text-[13px] text-text-muted">
              {omkar.degree} · {omkar.batch} · CGPA {omkar.cgpa}
            </p>
          </Section>

          <Section title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {[
                ...omkar.skills.languages,
                ...omkar.skills.frontend,
                ...omkar.skills.backend,
                ...omkar.skills.ai,
                ...omkar.skills.tools,
              ].map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>
          </Section>

          <Section title="Experience">
            <div className="space-y-3">
              {omkar.experience.map((e) => (
                <div key={e.company}>
                  <p className="text-[15px] font-medium text-text-primary">
                    {e.company} — <span className="text-text-secondary">{e.role}</span>
                  </p>
                  <p className="font-mono-tech text-[12px] text-text-muted">{e.period}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Projects">
            <div className="space-y-2">
              {omkar.projects.map((p) => (
                <p key={p.id} className="text-[15px] text-text-secondary">
                  <span className="font-medium text-text-primary">{p.name}</span> — {p.tagline}
                </p>
              ))}
            </div>
          </Section>

          <Section title="Achievements">
            <div className="space-y-1.5">
              {omkar.hackathons.map((h) => (
                <p key={h.event} className="text-[15px] text-text-secondary">
                  <span style={{ color: h.place === 1 ? "var(--gold)" : "var(--text-primary)" }}>{h.placeLabel}</span> —{" "}
                  {h.event} ({h.participants})
                </p>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </WidgetShell>
  );
}
