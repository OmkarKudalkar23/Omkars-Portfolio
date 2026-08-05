import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SUB =
  "Ask me anything about my projects, hackathons, internships, skills, or what makes me different.";

export function Greeting() {
  const greeting = "Hi, I'm Omkar AI.";
  const words = greeting.split(" ");
  const [shown, setShown] = useState(0);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduce) {
      setShown(words.length);
      return;
    }
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= words.length) clearInterval(t);
    }, 80);
    return () => clearInterval(t);
  }, [reduce, words.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <h1
        className="font-display text-[clamp(2rem,6vw,2.5rem)] font-light leading-tight text-text-primary"
        style={{ letterSpacing: "-0.02em" }}
      >
        {words.map((w, i) => (
          <span key={i} className="transition-opacity duration-300" style={{ opacity: i < shown ? 1 : 0 }}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-3 max-w-md text-[18px] leading-relaxed text-text-secondary"
      >
        {SUB}
      </motion.p>
    </motion.div>
  );
}
