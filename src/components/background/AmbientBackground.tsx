import { motion } from "framer-motion";

const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export function AmbientBackground() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Layer 1 — gradient mesh base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 20%, rgba(79,142,247,0.06) 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 40% at 80% 80%, rgba(79,142,247,0.04) 0%, transparent 60%)," +
            "#080809",
        }}
      />

      {/* Layer 2 — floating orbs */}
      <div
        className="absolute"
        style={{
          width: 600,
          height: 600,
          top: "-8%",
          left: "-6%",
          background: "rgba(79,142,247,0.07)",
          filter: "blur(120px)",
          borderRadius: "50%",
          animation: "orb-float-a 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute"
        style={{
          width: 400,
          height: 400,
          bottom: "-6%",
          right: "-4%",
          background: "rgba(120,80,200,0.05)",
          filter: "blur(100px)",
          borderRadius: "50%",
          animation: "orb-float-b 16s ease-in-out infinite",
        }}
      />
      <div
        className="absolute"
        style={{
          width: 300,
          height: 300,
          top: "6%",
          right: "10%",
          background: "rgba(60,200,150,0.04)",
          filter: "blur(80px)",
          borderRadius: "50%",
          animation: "orb-float-c 20s ease-in-out infinite",
        }}
      />

      {/* Layer 3 — noise grain */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${NOISE}")`,
          opacity: 0.03,
          mixBlendMode: "overlay",
        }}
      />
    </motion.div>
  );
}
