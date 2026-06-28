import { useEffect, useRef, useState } from "react";
import { omkar } from "@/lib/data";
import { WidgetShell } from "./shared";

type Node = {
  label: string;
  cluster: string;
  color: string;
  bx: number; // base x (0-1)
  by: number; // base y (0-1)
  r: number;
  phase: number;
  speed: number;
  drift: number;
};

const CLUSTERS: { key: keyof typeof omkar.skills; label: string; color: string }[] = [
  { key: "languages", label: "Languages", color: "#4f8ef7" },
  { key: "frontend", label: "Frontend", color: "#c084fc" },
  { key: "backend", label: "Backend", color: "#3ecf8e" },
  { key: "ai", label: "AI / ML", color: "#f59e0b" },
  { key: "tools", label: "Tools", color: "#60a5fa" },
];

const USAGE: Record<string, string> = {
  Neo4j: "Nolan AI Studio, IIT Patna Research",
  "Next.js": "Nolan, Finverse, SignSync",
  LangGraph: "Hooman Labs, IIT Patna",
  MediaPipe: "SignSync",
  OpenCV: "SignSync, HackXelerate",
  "Three.js": "Finverse",
  Python: "SignSync, IIT Patna",
  LangChain: "Nolan AI Studio",
};

function buildNodes(): Node[] {
  const nodes: Node[] = [];
  CLUSTERS.forEach((c, ci) => {
    const items = omkar.skills[c.key];
    const clusterAngle = (ci / CLUSTERS.length) * Math.PI * 2 - Math.PI / 2;
    const clusterRadius = 0.34;
    const cx = 0.5 + Math.cos(clusterAngle) * clusterRadius;
    const cy = 0.5 + Math.sin(clusterAngle) * clusterRadius;
    items.forEach((label, ni) => {
      const spread = (ni - (items.length - 1) / 2) * 0.5;
      const a = clusterAngle + spread * 0.32;
      const rr = clusterRadius + 0.13 + (ni % 2) * 0.04;
      nodes.push({
        label,
        cluster: c.label,
        color: c.color,
        bx: 0.5 + Math.cos(a) * rr * 0.92,
        by: 0.5 + Math.sin(a) * rr * 0.92,
        r: 4.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.6,
        drift: 6 + Math.random() * 8,
      });
      // store cluster anchor on first item
      if (ni === 0) {
        nodes[nodes.length - 1] = { ...nodes[nodes.length - 1] };
      }
    });
  });
  return nodes;
}

export function SkillGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; cluster: string } | null>(null);
  const hoverRef = useRef<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nodes = buildNodes();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let W = 0;
    let H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      W = wrap.clientWidth;
      H = 360;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const pos = (n: Node, t: number) => ({
      x: n.bx * W + (reduce ? 0 : Math.cos(t * n.speed + n.phase) * n.drift),
      y: n.by * H + (reduce ? 0 : Math.sin(t * n.speed + n.phase) * n.drift),
    });

    let mouse = { x: -999, y: -999 };
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouse = { x: -999, y: -999 };
      hoverRef.current = null;
      setTooltip(null);
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    const render = (time: number) => {
      const t = time / 1000;
      ctx.clearRect(0, 0, W, H);
      const cx = 0.5 * W;
      const cy = 0.5 * H;

      // determine hover
      let hovered: { n: Node; x: number; y: number } | null = null;
      for (const n of nodes) {
        const p = pos(n, t);
        if (Math.hypot(p.x - mouse.x, p.y - mouse.y) < 14) {
          hovered = { n, x: p.x, y: p.y };
          break;
        }
      }
      hoverRef.current = hovered ? hovered.n.label : null;

      // lines center -> node
      for (const n of nodes) {
        const p = pos(n, t);
        const dim = hovered && hovered.n.label !== n.label;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(255,255,255,${dim ? 0.02 : 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // nodes
      for (const n of nodes) {
        const p = pos(n, t);
        const dim = hovered && hovered.n.label !== n.label;
        const isHover = hovered && hovered.n.label === n.label;
        ctx.globalAlpha = dim ? 0.3 : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, isHover ? n.r + 2 : n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        if (isHover) {
          ctx.shadowColor = n.color;
          ctx.shadowBlur = 16;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
        // label
        ctx.globalAlpha = dim ? 0.2 : 0.85;
        ctx.fillStyle = "#a0a0a8";
        ctx.font = "11px 'Geist Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(n.label, p.x, p.y + n.r + 13);
      }
      ctx.globalAlpha = 1;

      // center node
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#4f8ef7";
      ctx.shadowColor = "#4f8ef7";
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#f2f2f3";
      ctx.font = "500 13px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Omkar", cx, cy);
      ctx.textBaseline = "alphabetic";

      if (hovered) {
        setTooltip({
          x: hovered.x,
          y: hovered.y,
          label: hovered.n.label,
          cluster: USAGE[hovered.n.label] ? `Used in: ${USAGE[hovered.n.label]}` : hovered.n.cluster,
        });
      } else if (hoverRef.current === null) {
        setTooltip((prev) => (prev ? null : prev));
      }

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <WidgetShell>
      <div
        ref={wrapRef}
        className="relative overflow-hidden rounded-2xl border border-border-subtle bg-surface"
        style={{ borderWidth: "0.5px" }}
      >
        <canvas ref={canvasRef} className="block" />
        {tooltip && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border-default bg-elevated px-2.5 py-1.5 text-[12px] text-text-primary shadow-lg"
            style={{ left: tooltip.x, top: tooltip.y - 14, borderWidth: "0.5px" }}
          >
            <div className="font-medium">{tooltip.label}</div>
            <div className="text-[11px] text-text-muted">{tooltip.cluster}</div>
          </div>
        )}
        <div className="flex flex-wrap gap-3 border-t border-border-subtle px-4 py-2.5" style={{ borderTopWidth: "0.5px" }}>
          {CLUSTERS.map((c) => (
            <span key={c.key} className="flex items-center gap-1.5 text-[11px] text-text-muted">
              <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </WidgetShell>
  );
}
