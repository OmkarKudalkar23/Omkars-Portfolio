import { motion } from "framer-motion";

const PROMPTS = [
  "Show my projects",
  "What makes me different?",
  "Hackathon wins",
  "Surprise me",
];

export function SuggestedPrompts({ onPick }: { onPick: (text: string) => void }) {
  return (
    <motion.div
      className="flex flex-wrap gap-2 pt-5"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
    >
      {PROMPTS.map((p) => (
        <motion.button
          key={p}
          type="button"
          onClick={() => onPick(p)}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="rounded-full border border-border-default bg-glass px-4 py-2 text-sm text-text-secondary transition-all duration-150 hover:-translate-y-px hover:border-border-strong hover:bg-elevated hover:text-text-primary"
          style={{ borderWidth: "0.5px" }}
        >
          {p}
        </motion.button>
      ))}
    </motion.div>
  );
}
