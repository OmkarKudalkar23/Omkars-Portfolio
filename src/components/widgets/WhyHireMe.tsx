import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Cpu, FlaskConical, Layers, Trophy } from "lucide-react";
import { omkar } from "@/lib/data";
import { WidgetShell } from "./shared";

function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1200;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

const STATS = [
  { to: 9.94, decimals: 2, label: "CGPA" },
  { to: 2, decimals: 0, label: "Hackathon Wins" },
  { to: 2, decimals: 0, label: "Active Internships" },
  { to: 3, decimals: 0, label: "Production Projects" },
];

const ICONS = [Cpu, FlaskConical, Trophy, Layers];

export function WhyHireMe() {
  return (
    <WidgetShell>
      <div className="space-y-6">
        <h2 className="font-display text-[28px] font-light leading-snug tracking-tight text-text-primary">
          First-year student. Two research internships. Two hackathon wins.
        </h2>

        {/* Counters */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border-subtle bg-surface p-4 text-center"
              style={{ borderWidth: "0.5px" }}
            >
              <div className={s.label === "Hackathon Wins" ? "text-[28px] font-medium text-gold" : "text-[28px] font-medium text-text-primary"}>
                <Counter to={s.to} decimals={s.decimals} />
              </div>
              <div className="mt-1 text-[12px] text-text-muted">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Differentiators 2x2 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {omkar.differentiators.map((d, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl border border-border-subtle bg-surface p-5"
                style={{ borderWidth: "0.5px" }}
              >
                <Icon className={d.title.includes("Wins") ? "h-4 w-4 text-gold" : "h-4 w-4 text-text-muted"} />
                <h3 className="mt-3 text-[15px] font-medium text-text-primary">{d.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-text-secondary">{d.proof}</p>
              </motion.div>
            );
          })}
        </div>

        <p className="text-[15px] italic text-text-secondary">
          Most CS freshers have projects. Omkar has systems running in production.
        </p>
      </div>
    </WidgetShell>
  );
}
