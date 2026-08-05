import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FolderOpen,
  Briefcase,
  Trophy,
  Cpu,
  Mail,
  Download,
  ExternalLink,
  Github,
  X,
  Menu,
  Home,
  type LucideIcon,
} from "lucide-react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { omkar } from "@/lib/data";
import { canHover } from "@/lib/pointer";

/* ─── Types ─────────────────────────────────────────────── */
type NavId = "projects" | "experience" | "hackathons" | "skills" | "contact";
type PanelId = NavId | null;

interface SidebarProps {
  /** Only passed from the home page — enables panel slide-out mode */
  sendPrompt?: (text: string) => void;
}

/* ─── Nav items ──────────────────────────────────────────── */
const NAV: { id: NavId; icon: LucideIcon; label: string; path: string }[] = [
  { id: "projects", icon: FolderOpen, label: "Projects", path: "/projects" },
  { id: "experience", icon: Briefcase, label: "Experience", path: "/experience" },
  { id: "hackathons", icon: Trophy, label: "Hackathons", path: "/hackathons" },
  { id: "skills", icon: Cpu, label: "Skills", path: "/skills" },
  { id: "contact", icon: Mail, label: "Contact", path: "/contact" },
];

/* ─── Toast ──────────────────────────────────────────────── */
function Toast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            bottom: "max(100px, calc(var(--safe-bottom) + 100px))",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(15,15,16,0.96)",
            border: "0.5px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: "8px 16px",
            fontSize: 13,
            color: "#3ecf8e",
            zIndex: 9999,
            pointerEvents: "none",
            backdropFilter: "blur(20px)",
          }}
        >
          ✓ Copied to clipboard
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Panel header ───────────────────────────────────────── */
function PanelHeader({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 11,
          color: "#505058",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ width: 24, height: 1.5, background: "#4f8ef7", borderRadius: 2 }} />
    </div>
  );
}

/* ─── Projects panel ─────────────────────────────────────── */
function ProjectsPanel({
  sendPrompt,
  closePanel,
}: {
  sendPrompt: (t: string) => void;
  closePanel: () => void;
}) {
  return (
    <>
      <PanelHeader label="Projects" />
      {omkar.projects.map((p) => (
        <div
          key={p.id}
          onClick={() => {
            sendPrompt(`Tell me about ${p.name}`);
            closePanel();
          }}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.07)",
            borderRadius: 12,
            padding: 14,
            cursor: "pointer",
            marginBottom: 8,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (!canHover) return;
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            e.currentTarget.style.transform = "translateX(3px)";
          }}
          onMouseLeave={(e) => {
            if (!canHover) return;
            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: p.accent,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 14, fontWeight: 500, color: "#f2f2f3" }}>{p.name}</span>
          </div>
          <div style={{ fontSize: 12, color: "#a0a0a8", lineHeight: 1.5 }}>{p.tagline}</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
            {p.tech.slice(0, 3).map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 10,
                  fontFamily: "Geist Mono, ui-monospace, monospace",
                  color: "#505058",
                  background: "rgba(255,255,255,0.04)",
                  border: "0.5px solid rgba(255,255,255,0.08)",
                  borderRadius: 4,
                  padding: "2px 6px",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

/* ─── Experience panel ───────────────────────────────────── */
function ExperiencePanel({
  sendPrompt,
  closePanel,
}: {
  sendPrompt: (t: string) => void;
  closePanel: () => void;
}) {
  return (
    <>
      <PanelHeader label="Experience" />
      <div style={{ position: "relative", paddingLeft: 20 }}>
        <div
          style={{
            position: "absolute",
            left: 6,
            top: 0,
            bottom: 0,
            width: 1,
            background: "rgba(255,255,255,0.08)",
          }}
        />
        {omkar.experience.map((exp, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              marginBottom: 20,
              cursor: "pointer",
              transition: "opacity 0.15s ease",
            }}
            onClick={() => {
              sendPrompt(`Tell me about your ${exp.company} internship`);
              closePanel();
            }}
            onMouseEnter={(e) => {
              if (!canHover) return;
              e.currentTarget.style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              if (!canHover) return;
              e.currentTarget.style.opacity = "1";
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -17,
                top: 4,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#4f8ef7",
                boxShadow: "0 0 8px rgba(79,142,247,0.5)",
              }}
            />
            <div style={{ fontSize: 13, fontWeight: 500, color: "#f2f2f3" }}>{exp.company}</div>
            <div
              style={{
                fontSize: 11,
                color: "#505058",
                fontFamily: "Geist Mono, ui-monospace, monospace",
                margin: "2px 0 6px",
              }}
            >
              {exp.role} · {exp.period}
            </div>
            <div style={{ fontSize: 12, color: "#a0a0a8", lineHeight: 1.5 }}>
              {exp.highlights[0]?.slice(0, 80)}…
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── Hackathons panel ───────────────────────────────────── */
function HackathonsPanel({
  sendPrompt,
  closePanel,
}: {
  sendPrompt: (t: string) => void;
  closePanel: () => void;
}) {
  return (
    <>
      <PanelHeader label="Hackathons" />
      {omkar.hackathons.map((h, i) => (
        <div
          key={i}
          onClick={() => {
            sendPrompt(`Tell me about ${h.event}`);
            closePanel();
          }}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: `0.5px solid ${h.place === 1 ? "rgba(201,169,110,0.3)" : "rgba(255,255,255,0.07)"}`,
            borderRadius: 12,
            padding: 14,
            marginBottom: 8,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (!canHover) return;
            e.currentTarget.style.background = "rgba(255,255,255,0.055)";
            e.currentTarget.style.transform = "translateX(3px)";
          }}
          onMouseLeave={(e) => {
            if (!canHover) return;
            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: "#f2f2f3" }}>{h.event}</span>
            <span
              style={{
                fontSize: 10,
                color: h.place === 1 ? "#c9a96e" : "#a0a0a8",
                fontFamily: "Geist Mono, ui-monospace, monospace",
              }}
            >
              {h.place === 1 ? "🏆 1st" : h.place === 2 ? "🥈 2nd" : "🥉 3rd"}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "#505058" }}>
            {h.host} · {h.participants}
          </div>
          <div style={{ fontSize: 12, color: "#a0a0a8", marginTop: 4 }}>{h.project}</div>
        </div>
      ))}
    </>
  );
}

/* ─── Skills panel ───────────────────────────────────────── */
function SkillsPanel({
  sendPrompt,
  closePanel,
}: {
  sendPrompt: (t: string) => void;
  closePanel: () => void;
}) {
  return (
    <>
      <PanelHeader label="Skills" />
      {Object.entries(omkar.skills).map(([category, items]) => (
        <div key={category} style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 10,
              color: "#505058",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {category}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {items.map((skill) => (
              <span
                key={skill}
                onClick={() => {
                  sendPrompt(`Tell me about your ${skill} experience`);
                  closePanel();
                }}
                style={{
                  fontSize: 11,
                  fontFamily: "Geist Mono, ui-monospace, monospace",
                  color: "#a0a0a8",
                  background: "rgba(255,255,255,0.04)",
                  border: "0.5px solid rgba(255,255,255,0.08)",
                  borderRadius: 6,
                  padding: "3px 8px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!canHover) return;
                  e.currentTarget.style.color = "#4f8ef7";
                  e.currentTarget.style.background = "rgba(79,142,247,0.08)";
                  e.currentTarget.style.borderColor = "rgba(79,142,247,0.3)";
                }}
                onMouseLeave={(e) => {
                  if (!canHover) return;
                  e.currentTarget.style.color = "#a0a0a8";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

/* ─── Action buttons (Resume + Contact panels) ───────────── */
function ActionButtons({ onCopy }: { onCopy: () => void }) {
  const actions = [
    {
      icon: <Download size={14} />,
      label: "Download PDF",
      action: () => window.open("/resume.pdf"),
    },
    { icon: <Mail size={14} />, label: "Copy Email", action: onCopy },
    {
      icon: <ExternalLink size={14} />,
      label: "Open LinkedIn",
      action: () => window.open("https://linkedin.com/in/omkar-kudalkar"),
    },
    {
      icon: <Github size={14} />,
      label: "Open GitHub",
      action: () => window.open("https://github.com/OmkarKudalkar23"),
    },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {actions.map((item, i) => (
        <button
          key={i}
          onClick={item.action}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            padding: "12px 14px",
            color: "#a0a0a8",
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.15s ease",
            textAlign: "left",
            width: "100%",
          }}
          onMouseEnter={(e) => {
            if (!canHover) return;
            e.currentTarget.style.background = "rgba(255,255,255,0.07)";
            e.currentTarget.style.color = "#f2f2f3";
          }}
          onMouseLeave={(e) => {
            if (!canHover) return;
            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            e.currentTarget.style.color = "#a0a0a8";
          }}
        >
          {item.icon} {item.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Contact panel ──────────────────────────────────────── */
function ContactPanel({ onCopy }: { onCopy: () => void }) {
  return (
    <>
      <PanelHeader label="Contact" />
      <div style={{ textAlign: "center", paddingTop: 8, marginBottom: 20 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(79,142,247,0.1)",
            border: "0.5px solid rgba(79,142,247,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 600, color: "#4f8ef7" }}>OK</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "#f2f2f3", marginBottom: 2 }}>
          Omkar Kudalkar
        </div>
        <div style={{ fontSize: 12, color: "#505058", marginBottom: 16 }}>
          Mumbai · Available Now
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginBottom: 20,
          }}
        >
          <div
            className="dot-pulse-green"
            style={{ width: 6, height: 6, borderRadius: "50%", background: "#3ecf8e" }}
          />
          <span style={{ fontSize: 12, color: "#3ecf8e" }}>Open to opportunities</span>
        </div>
      </div>
      <ActionButtons onCopy={onCopy} />
    </>
  );
}

/* ─── Panel content router ───────────────────────────────── */
function PanelContent({
  panel,
  sendPrompt,
  closePanel,
  onCopy,
}: {
  panel: NavId;
  sendPrompt: (t: string) => void;
  closePanel: () => void;
  onCopy: () => void;
}) {
  switch (panel) {
    case "projects":
      return <ProjectsPanel sendPrompt={sendPrompt} closePanel={closePanel} />;
    case "experience":
      return <ExperiencePanel sendPrompt={sendPrompt} closePanel={closePanel} />;
    case "hackathons":
      return <HackathonsPanel sendPrompt={sendPrompt} closePanel={closePanel} />;
    case "skills":
      return <SkillsPanel sendPrompt={sendPrompt} closePanel={closePanel} />;
    case "contact":
      return <ContactPanel onCopy={onCopy} />;
  }
}

/* ─── Main Sidebar ───────────────────────────────────────── */
export function Sidebar({ sendPrompt }: SidebarProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isHomePage = pathname === "/";

  const [activePanel, setActivePanel] = useState<PanelId>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<NavId>("projects");
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closePanel = () => setActivePanel(null);

  const copyEmail = () => {
    navigator.clipboard.writeText("kudalkaromkar44@gmail.com").catch(() => {});
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 2000);
  };

  const handleIconClick = (id: NavId) => {
    navigate({ to: `/${id}` });
  };

  const getIsActive = (id: NavId) => {
    return pathname === `/${id}`;
  };

  // Close panel on outside click (home only)
  useEffect(() => {
    if (!isHomePage) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest(".sidebar-rail") && !target.closest(".sidebar-panel")) {
        closePanel();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isHomePage]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePanel();
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Close panel on route change
  useEffect(() => {
    closePanel();
  }, [pathname]);

  return (
    <>
      {/* ── Desktop icon rail ──────────────────────────────── */}
      <div
        className="sidebar-rail"
        style={{
          position: "fixed",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: 48,
          background: "rgba(255,255,255,0.03)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: "0 14px 14px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          padding: "8px 0",
          zIndex: 100,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Home button */}
        <div
          onClick={() => navigate({ to: "/" })}
          title="Home"
          style={{
            width: 40,
            height: 36,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isHomePage ? "#4f8ef7" : "rgba(255,255,255,0.25)",
            cursor: "pointer",
            transition: "all 0.15s ease",
            marginBottom: 4,
            position: "relative",
          }}
          onMouseEnter={(e) => {
            if (!canHover) return;
            e.currentTarget.style.color = "#4f8ef7";
            e.currentTarget.style.background = "rgba(79,142,247,0.08)";
          }}
          onMouseLeave={(e) => {
            if (!canHover) return;
            e.currentTarget.style.color = isHomePage ? "#4f8ef7" : "rgba(255,255,255,0.25)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <Home size={15} strokeWidth={1.8} />
          {/* Tooltip */}
          <div
            className="rail-tooltip"
            style={{
              position: "absolute",
              left: 52,
              background: "rgba(15,15,16,0.95)",
              border: "0.5px solid rgba(255,255,255,0.10)",
              borderRadius: 8,
              padding: "5px 10px",
              fontSize: 12,
              color: "#f2f2f3",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              opacity: 0,
              transform: "translateX(-4px)",
              transition: "all 0.15s ease",
              zIndex: 200,
            }}
          >
            Home
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 20,
            height: "0.5px",
            background: "rgba(255,255,255,0.08)",
            marginBottom: 4,
          }}
        />

        {/* Nav icons */}
        {NAV.map(({ id, icon: Icon, label }) => {
          const isActive = getIsActive(id);
          return (
            <div
              key={id}
              onClick={() => handleIconClick(id)}
              title={label}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isActive ? "#4f8ef7" : "rgba(255,255,255,0.35)",
                background: isActive ? "rgba(79,142,247,0.10)" : "transparent",
                cursor: "pointer",
                transition: "all 0.15s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!canHover) return;
                if (!isActive) {
                  e.currentTarget.style.color = "#4f8ef7";
                  e.currentTarget.style.background = "rgba(79,142,247,0.10)";
                }
                const t = e.currentTarget.querySelector<HTMLElement>(".rail-tooltip");
                if (t) {
                  t.style.opacity = "1";
                  t.style.transform = "translateX(0)";
                }
              }}
              onMouseLeave={(e) => {
                if (!canHover) return;
                if (!isActive) {
                  e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                  e.currentTarget.style.background = "transparent";
                }
                const t = e.currentTarget.querySelector<HTMLElement>(".rail-tooltip");
                if (t) {
                  t.style.opacity = "0";
                  t.style.transform = "translateX(-4px)";
                }
              }}
            >
              {/* Active left border indicator */}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "20%",
                    height: "60%",
                    width: 2,
                    background: "#4f8ef7",
                    borderRadius: "0 2px 2px 0",
                  }}
                />
              )}
              <Icon size={17} strokeWidth={1.8} />
              {/* Tooltip */}
              <div
                className="rail-tooltip"
                style={{
                  position: "absolute",
                  left: 52,
                  background: "rgba(15,15,16,0.95)",
                  border: "0.5px solid rgba(255,255,255,0.10)",
                  borderRadius: 8,
                  padding: "5px 10px",
                  fontSize: 12,
                  color: "#f2f2f3",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  opacity: 0,
                  transform: "translateX(-4px)",
                  transition: "all 0.15s ease",
                  zIndex: 200,
                }}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Desktop slide-out panel (home only) ───────────── */}
      {isHomePage && sendPrompt && (
        <AnimatePresence>
          {activePanel && (
            <motion.div
              className="sidebar-panel"
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: "fixed",
                left: 48,
                top: 0,
                width: 280,
                height: "100vh",
                background: "rgba(8,8,9,0.93)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                borderRight: "0.5px solid rgba(255,255,255,0.07)",
                zIndex: 99,
                overflowY: "auto",
                padding: "24px 16px",
              }}
            >
              <button
                onClick={closePanel}
                aria-label="Close panel"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 12,
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.04)",
                  border: "0.5px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#505058",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!canHover) return;
                  e.currentTarget.style.color = "#f2f2f3";
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  if (!canHover) return;
                  e.currentTarget.style.color = "#505058";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
              >
                <X size={13} />
              </button>
              <PanelContent
                panel={activePanel}
                sendPrompt={sendPrompt}
                closePanel={closePanel}
                onCopy={copyEmail}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── Mobile floating Menu button ───────────────────── */}
      <button
        id="sidebar-mobile-trigger"
        aria-label="Open navigation"
        onClick={() => setMobileOpen(true)}
        className="mobile-menu-btn"
          style={{
            position: "fixed",
            bottom: "max(90px, calc(var(--safe-bottom) + 90px))",
            right: 16,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(79,142,247,0.12)",
            border: "0.5px solid rgba(79,142,247,0.3)",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 120,
            backdropFilter: "blur(12px)",
            color: "#4f8ef7",
            transition: "all 0.15s ease",
          }}
      >
        <Menu size={18} />
      </button>

      {/* ── Mobile bottom sheet ───────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 130 }}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                height: "70vh",
                background: "rgba(8,8,9,0.97)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                borderTop: "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: "20px 20px 0 0",
                zIndex: 140,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 4,
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: 2,
                  margin: "12px auto 0",
                }}
              />
              {/* Tab bar */}
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  overflowX: "auto",
                  padding: "12px 12px 0",
                  flexShrink: 0,
                  scrollbarWidth: "none",
                  WebkitMaskImage: "linear-gradient(to right, black calc(100% - 28px), transparent 100%)",
                  maskImage: "linear-gradient(to right, black calc(100% - 28px), transparent 100%)",
                }}
              >
                {NAV.map(({ id, icon: Icon, label }) => {
                  const isActive = pathname === `/${id}`;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        navigate({ to: `/${id}` });
                        setMobileOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "7px 12px",
                        borderRadius: 8,
                        border: `0.5px solid ${isActive ? "rgba(79,142,247,0.4)" : "rgba(255,255,255,0.07)"}`,
                        background: isActive ? "rgba(79,142,247,0.1)" : "rgba(255,255,255,0.03)",
                        color: isActive ? "#4f8ef7" : "#a0a0a8",
                        fontSize: 12,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        transition: "all 0.15s ease",
                      }}
                    >
                      <Icon size={13} />
                      {label}
                    </button>
                  );
                })}
              </div>
              <div
                style={{
                  height: "0.5px",
                  background: "rgba(255,255,255,0.07)",
                  margin: "12px 0 0",
                  flexShrink: 0,
                }}
              />
              {/* Panel content (links) */}
              <div style={{ flex: 1, overflowY: "auto", padding: `16px 16px max(32px, var(--safe-bottom))` }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {NAV.map(({ id, icon: Icon, label, path }) => (
                    <button
                      key={id}
                      onClick={() => {
                        navigate({ to: path });
                        setMobileOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 16px",
                        borderRadius: 12,
                        border: `0.5px solid ${pathname === path ? "rgba(79,142,247,0.3)" : "rgba(255,255,255,0.07)"}`,
                        background:
                          pathname === path ? "rgba(79,142,247,0.08)" : "rgba(255,255,255,0.03)",
                        color: pathname === path ? "#4f8ef7" : "#a0a0a8",
                        fontSize: 14,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        textAlign: "left",
                      }}
                    >
                      <Icon size={16} strokeWidth={1.8} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Toast visible={toastVisible} />

      <style>{`
        @media (max-width: 767px) {
          .sidebar-rail { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 768px) {
          .mobile-menu-btn { display: none !important; }
        }
        .sidebar-rail .rail-tooltip { pointer-events: none; }
        .sidebar-rail div:hover .rail-tooltip { opacity: 1 !important; transform: translateX(0) !important; }
      `}</style>
    </>
  );
}
