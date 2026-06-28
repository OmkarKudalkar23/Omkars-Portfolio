import { motion } from "framer-motion";

export function TechPill({ label, accent }: { label: string; accent?: string }) {
  return (
    <span
      className="font-mono-tech rounded-full border px-2.5 py-1 text-[11px] text-text-secondary"
      style={{
        borderWidth: "0.5px",
        borderColor: accent ? `${accent}33` : "var(--border-default)",
        background: accent ? `${accent}14` : "rgba(255,255,255,0.03)",
        color: accent ? accent : undefined,
      }}
    >
      {label}
    </span>
  );
}

export function WidgetShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

export function GhostButton({
  href,
  children,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const cls =
    "inline-flex items-center gap-1.5 rounded-lg border border-border-default bg-transparent px-3.5 py-2 text-[13px] text-text-secondary transition-all duration-150 hover:border-border-strong hover:bg-elevated hover:text-text-primary";
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={{ borderWidth: "0.5px" }}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} style={{ borderWidth: "0.5px" }}>
      {children}
    </button>
  );
}
