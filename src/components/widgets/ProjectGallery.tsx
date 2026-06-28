import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { omkar } from "@/lib/data";
import { TechPill, WidgetShell } from "./shared";

export function ProjectGallery({ onOpenProject }: { onOpenProject?: (id: string) => void }) {
  return (
    <WidgetShell>
      <motion.div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {omkar.projects.map((p) => (
          <motion.button
            key={p.id}
            type="button"
            onClick={() => onOpenProject?.(p.id)}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="group flex flex-col rounded-2xl border border-border-subtle bg-surface p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-border-default hover:bg-elevated hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            style={{ borderWidth: "0.5px" }}
          >
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.accent, boxShadow: `0 0 12px ${p.accent}99` }} />
              <h3 className="font-display text-[20px] font-medium tracking-tight text-text-primary">{p.name}</h3>
            </div>
            <p className="mt-2 line-clamp-2 text-[15px] text-text-secondary">{p.tagline}</p>
            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <div className="flex flex-wrap gap-1.5">
                {p.tech.slice(0, 3).map((t) => (
                  <TechPill key={t} label={t} />
                ))}
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-text-muted transition-colors group-hover:text-text-primary" />
            </div>
          </motion.button>
        ))}
      </motion.div>
    </WidgetShell>
  );
}
