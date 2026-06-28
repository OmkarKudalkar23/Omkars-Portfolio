import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { omkar } from "@/lib/data";
import { GhostButton, TechPill, WidgetShell } from "./shared";

export function ProjectCaseStudy({ projectId }: { projectId?: string | null }) {
  const project = omkar.projects.find((p) => p.id === projectId) ?? omkar.projects[0];
  const accent = project.accent;

  return (
    <WidgetShell>
      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface" style={{ borderWidth: "0.5px" }}>
        {/* Hero */}
        <div className="relative p-6 sm:p-7">
          <div className="absolute left-0 top-6 h-12 w-1 rounded-r-full" style={{ background: accent }} />
          <p className="font-mono-tech text-[11px] text-text-muted">{project.date}</p>
          <h2 className="mt-1 font-display text-[34px] font-medium leading-tight tracking-tight text-text-primary">
            {project.name}
          </h2>
          <p className="mt-1 text-[15px] text-text-secondary">{project.tagline}</p>
        </div>

        <div className="space-y-6 px-6 pb-7 sm:px-7">
          {/* Problem */}
          <section className="border-l-2 pl-4" style={{ borderColor: accent }}>
            <h4 className="text-[12px] uppercase tracking-wide text-text-muted">The Problem</h4>
            <p className="mt-1.5 text-[15px] leading-relaxed text-text-secondary">{project.problem}</p>
          </section>

          {/* Solution */}
          <section>
            <h4 className="text-[12px] uppercase tracking-wide text-text-muted">The Solution</h4>
            <p className="mt-1.5 text-[15px] leading-relaxed text-text-secondary">{project.solution}</p>
          </section>

          {/* Tech stack */}
          <section>
            <h4 className="text-[12px] uppercase tracking-wide text-text-muted">Tech Stack</h4>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <TechPill key={t} label={t} accent={accent} />
              ))}
            </div>
          </section>

          {/* Architecture */}
          <section>
            <h4 className="text-[12px] uppercase tracking-wide text-text-muted">Architecture</h4>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {project.architecture.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span
                    className="font-mono-tech rounded-lg border px-2.5 py-1.5 text-[11px] text-text-secondary"
                    style={{ borderWidth: "0.5px", borderColor: "var(--border-default)", background: "rgba(255,255,255,0.03)" }}
                  >
                    {step}
                  </span>
                  {i < project.architecture.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-text-muted" />}
                </div>
              ))}
            </div>
          </section>

          {/* Metrics */}
          <section>
            <h4 className="text-[12px] uppercase tracking-wide text-text-muted">Key Metrics</h4>
            <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {project.metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-xl border border-border-subtle p-4"
                  style={{ borderWidth: "0.5px", background: "rgba(255,255,255,0.03)" }}
                >
                  <div className="text-[26px] font-medium leading-none" style={{ color: accent }}>
                    {m.value}
                  </div>
                  <div className="mt-1.5 text-[12px] text-text-muted">{m.label}</div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Links */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <GhostButton href={project.github}>
              <Github className="h-3.5 w-3.5" /> GitHub
            </GhostButton>
            {project.demo && (
              <GhostButton href={project.demo}>
                Live Demo <ArrowRight className="h-3.5 w-3.5" />
              </GhostButton>
            )}
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}
