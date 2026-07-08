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
            whileHover={{ 
              y: -2,
              borderColor: p.id === 'nolan' ? `${p.accent}80` : 'rgba(255,255,255,0.15)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
            }}
            className="group flex flex-col rounded-2xl p-6 text-left"
            style={{ 
              background: '#0d0d0d',
              border: `1px solid ${p.id === 'nolan' ? `${p.accent}30` : 'rgba(255,255,255,0.08)'}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease'
            }}
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
