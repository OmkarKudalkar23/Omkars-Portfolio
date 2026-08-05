import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ContextualChat } from "@/components/chat/ContextualChat";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

interface PageShellProps {
  children: ReactNode;
  /** The current route path e.g. "/projects" — used to seed ContextualChat */
  path: string;
}

/**
 * Shared shell for all sub-routes (/projects, /experience, etc.).
 * Renders:
 *  - Fixed icon rail (Sidebar, navigate-mode — no sendPrompt)
 *  - Main content area (marginLeft: 48px, full height)
 *  - Contextual chat bubble (bottom-right)
 */
export function PageShell({ children, path }: PageShellProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080809",
        position: "relative",
      }}
    >
      {/* Icon rail — navigate mode (no sendPrompt) */}
      <Sidebar />

      {/* Page content */}
      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="page-shell-main"
      >
        {children}
      </motion.main>

      {/* Floating contextual chat */}
      <ContextualChat path={path} />
    </div>
  );
}
