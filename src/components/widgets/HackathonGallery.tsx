import { motion } from "framer-motion";
import { omkar } from "@/lib/data";
import { TechPill, WidgetShell } from "./shared";

export function HackathonGallery() {
  return (
    <WidgetShell>
      <motion.div
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {omkar.hackathons.map((h) => {
          const isWin = h.place === 1;
          return (
            <motion.div
              key={h.event}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="relative flex flex-col rounded-2xl bg-surface p-5"
              style={{
                border: "0.5px solid var(--border-subtle)",
                ...(isWin
                  ? {
                      backgroundImage:
                        "linear-gradient(var(--bg-surface), var(--bg-surface)), linear-gradient(120deg, #c9a96e55, transparent 40%, transparent 60%, #c9a96e55)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                      backgroundSize: "100% 100%, 200% 100%",
                      border: "0.5px solid transparent",
                      animation: "gold-shimmer 3s linear infinite",
                    }
                  : {}),
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[22px]">🏆</span>
                <span
                  className="font-mono-tech rounded-full px-2 py-0.5 text-[11px]"
                  style={{
                    color: isWin ? "var(--gold)" : "var(--text-secondary)",
                    background: isWin ? "rgba(201,169,110,0.12)" : "rgba(255,255,255,0.04)",
                    border: `0.5px solid ${isWin ? "rgba(201,169,110,0.3)" : "var(--border-default)"}`,
                  }}
                >
                  {h.placeLabel}
                </span>
              </div>
              <h3 className="mt-3 text-[16px] font-medium text-text-primary">{h.event}</h3>
              <p className="mt-0.5 text-[13px] text-text-muted">
                {h.host} · {h.participants}
              </p>
              <p className="mt-2 text-[14px] font-medium" style={{ color: h.accent }}>
                {h.project}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {h.tech.map((t) => (
                  <TechPill key={t} label={t} />
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </WidgetShell>
  );
}
