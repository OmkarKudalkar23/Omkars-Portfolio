import { motion } from "framer-motion";
import { omkar } from "@/lib/data";
import { TechPill, WidgetShell } from "./shared";

export function ExperienceTimeline() {
  return (
    <WidgetShell>
      <div className="relative pl-7">
        <div className="absolute bottom-2 left-[5px] top-2 w-px bg-border-subtle" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          className="space-y-7"
        >
          {omkar.experience.map((e) => (
            <motion.div
              key={e.company}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="relative"
            >
              <span
                className="dot-pulse absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full"
                style={{ background: e.accent }}
              />
              <h3 className="text-[17px] font-medium text-text-primary">{e.company}</h3>
              <p className="font-mono-tech mt-0.5 text-[13px] text-text-muted">
                {e.role} · {e.period}
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {e.highlights.map((h) => (
                  <li key={h} className="flex gap-2 text-[15px] leading-relaxed text-text-secondary">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: e.accent }} />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.tech.map((t) => (
                  <TechPill key={t} label={t} />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </WidgetShell>
  );
}
