import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";
import { WidgetShell } from "./shared";

const CONFETTI = Array.from({ length: 14 }, (_, i) => i);
const COLORS = ["#4f8ef7", "#c084fc", "#3ecf8e", "#c9a96e", "#60a5fa"];

export function SurpriseMoment({ text }: { text: string }) {
  return (
    <WidgetShell>
      <div
        className="relative overflow-hidden rounded-2xl border border-border-default p-7 text-center"
        style={{
          borderWidth: "0.5px",
          background: "radial-gradient(ellipse 80% 80% at 50% 0%, rgba(79,142,247,0.12), var(--bg-surface))",
        }}
      >
        {CONFETTI.map((i) => (
          <motion.span
            key={i}
            className="absolute top-0 h-1.5 w-1.5 rounded-full"
            style={{ left: `${(i / CONFETTI.length) * 100}%`, background: COLORS[i % COLORS.length] }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 220, opacity: [0, 1, 0], rotate: 360 }}
            transition={{ duration: 1.8 + (i % 4) * 0.3, delay: (i % 5) * 0.1, ease: "easeIn" }}
          />
        ))}
        <Sparkle className="mx-auto h-5 w-5 text-accent-blue" />
        <p className="mx-auto mt-4 max-w-md font-display text-[22px] font-light leading-snug tracking-tight text-text-primary">
          {text}
        </p>
      </div>
    </WidgetShell>
  );
}
