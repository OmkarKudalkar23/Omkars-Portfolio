import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { useLenis } from "lenis/react";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";

// ─── Types ───────────────────────────────────────────────────────────────────

type StopType = "source" | "waypoint" | "destination";

type FlightStop = {
  id: string;
  city: string;
  icao: string;
  lat: number;
  lng: number;
  label: string;
  type: StopType;
  skills: string[];
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const flightRoute: FlightStop[] = [
  {
    id: "origin",
    city: "Mumbai",
    icao: "OMK",
    lat: 19.0760, lng: 72.8777,
    label: "OMKAR",
    type: "source",
    skills: [],
  },
  {
    id: "bengaluru",
    city: "Bengaluru",
    icao: "BLR",
    lat: 12.9716, lng: 77.5946,
    label: "AI / ML",
    type: "waypoint",
    skills: ["LangChain", "LangGraph", "MediaPipe", "OpenCV", "LSTM", "Whisper"],
  },
  {
    id: "hyderabad",
    city: "Hyderabad",
    icao: "HYD",
    lat: 17.3850, lng: 78.4867,
    label: "BACKEND",
    type: "waypoint",
    skills: ["Node.js", "Express.js", "MongoDB", "Neo4j", "REST APIs"],
  },
  {
    id: "pune",
    city: "Pune",
    icao: "PNQ",
    lat: 18.5204, lng: 73.8567,
    label: "FRONTEND",
    type: "waypoint",
    skills: ["React.js", "Next.js", "Three.js", "Framer Motion", "Tailwind CSS"],
  },
  {
    id: "delhi",
    city: "New Delhi",
    icao: "DEL",
    lat: 28.6139, lng: 77.2090,
    label: "TOOLS",
    type: "waypoint",
    skills: ["Git", "GitHub", "Vercel", "n8n", "CI/CD"],
  },
  {
    id: "chennai",
    city: "Chennai",
    icao: "MAA",
    lat: 13.0827, lng: 80.2707,
    label: "LANGUAGES",
    type: "waypoint",
    skills: ["Python", "JavaScript", "C++", "Java"],
  },
  {
    id: "destination",
    city: "Next Role",
    icao: "NXT",
    lat: 12.2958, lng: 76.6394, // Mysuru
    label: "NEXT ROLE",
    type: "destination",
    skills: [],
  },
];

const categoryColors: Record<string, string> = {
  bengaluru:   "#8b5cf6", // purple — AI
  hyderabad:   "#10b981", // green — Backend
  pune:        "#3b82f6", // blue — Frontend
  delhi:       "#64748b", // slate — Tools
  chennai:     "#f59e0b", // amber — Languages
  destination: "#22c55e", // green — Next Role
};

// ─── Skill Chart Component ────────────────────────────────────────────────────

function FlightPathChart({ prefersReducedMotion, isMobile, scrollProg }: {
  prefersReducedMotion: boolean;
  isMobile: boolean;
  scrollProg: number;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const [pixelCoords, setPixelCoords] = useState<Record<string, { x: number; y: number }>>({});
  const [trailPositions, setTrailPositions] = useState<{ x: number; y: number }[]>([]);

  const showAll = prefersReducedMotion || isMobile;

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [82.0, 22.0], // Center of India
      zoom: 4.5,            // India fills viewport nicely
      pitch: 20,            // slight 3D tilt
      bearing: 0,
      interactive: false,
      attributionControl: false,
    });

    map.on("load", () => {
      setMapInstance(map);
    });

    return () => {
      map.remove();
    };
  }, []);

  // Update pixel mappings on map move / resize
  useEffect(() => {
    if (!mapInstance) return;

    const updatePixels = () => {
      const coords: Record<string, { x: number; y: number }> = {};
      flightRoute.forEach(stop => {
        const px = mapInstance.project([stop.lng, stop.lat]);
        coords[stop.id] = { x: px.x, y: px.y };
      });
      setPixelCoords(coords);
    };

    updatePixels();
    mapInstance.on("move", updatePixels);
    mapInstance.on("resize", updatePixels);

    return () => {
      mapInstance.off("move", updatePixels);
      mapInstance.off("resize", updatePixels);
    };
  }, [mapInstance]);

  // Smoothly pan camera to track current plane position
  useEffect(() => {
    if (!mapInstance || showAll) return;

    const totalLegs = flightRoute.length - 1;
    const progressVal = scrollProg * totalLegs;
    const currentLeg = Math.min(Math.floor(progressVal), totalLegs - 1);
    const legProgress = progressVal - currentLeg;

    const fromCity = flightRoute[currentLeg];
    const toCity = flightRoute[currentLeg + 1];

    if (fromCity && toCity) {
      const currentLng = fromCity.lng + (toCity.lng - fromCity.lng) * legProgress;
      const currentLat = fromCity.lat + (toCity.lat - fromCity.lat) * legProgress;

      mapInstance.easeTo({
        center: [currentLng, currentLat],
        zoom: scrollProg > 0.95 ? 4.2 : 5.0,
        duration: 80,
        easing: t => t,
      });
    }
  }, [scrollProg, mapInstance, showAll]);

  // Calculate current active leg state
  const totalLegs = flightRoute.length - 1;
  const progressVal = scrollProg * totalLegs;
  const currentLegIndex = Math.min(Math.floor(progressVal), totalLegs - 1);
  const currentLegProgress = progressVal - currentLegIndex;

  const currentLegString = useMemo(() => {
    if (showAll || scrollProg >= 0.99) return "N/A — COMPLETED";
    if (scrollProg === 0) return "AWAITING DEPARTURE";
    const fromCity = flightRoute[currentLegIndex];
    const toCity = flightRoute[currentLegIndex + 1];
    return `${fromCity.icao} → ${toCity.icao}`;
  }, [currentLegIndex, scrollProg, showAll]);

  // Calculate plane position in screen coordinates
  const planeState = useMemo(() => {
    if (Object.keys(pixelCoords).length === 0) return null;

    if (showAll || scrollProg >= 0.99) {
      // Park at Mysuru (destination)
      const destPx = pixelCoords["destination"];
      return { x: destPx?.x ?? 0, y: destPx?.y ?? 0, angle: -8 };
    }

    const fromCity = flightRoute[currentLegIndex];
    const toCity = flightRoute[currentLegIndex + 1];
    const fromPx = pixelCoords[fromCity.id];
    const toPx = pixelCoords[toCity.id];

    if (!fromPx || !toPx) return null;

    // Midpoint & curve control points
    const mx = (fromPx.x + toPx.x) / 2;
    const my = (fromPx.y + toPx.y) / 2;
    const dx = toPx.x - fromPx.x;
    const dy = toPx.y - fromPx.y;
    const cx = mx - dy * (-0.3);
    const cy = my + dx * (-0.3);

    // Quadratic bezier position
    const t = currentLegProgress;
    const x = (1 - t) * (1 - t) * fromPx.x + 2 * (1 - t) * t * cx + t * t * toPx.x;
    const y = (1 - t) * (1 - t) * fromPx.y + 2 * (1 - t) * t * cy + t * t * toPx.y;

    // Tangent derivative vector for auto-rotation
    const vx = 2 * (1 - t) * (cx - fromPx.x) + 2 * t * (toPx.x - cx);
    const vy = 2 * (1 - t) * (cy - fromPx.y) + 2 * t * (toPx.y - cy);
    // Since the top-view image points UP, we add 90 degrees offset to align it with math vectors (pointing right)
    const angle = Math.atan2(vy, vx) * (180 / Math.PI) + 90;

    return { x, y, angle };
  }, [pixelCoords, currentLegIndex, currentLegProgress, scrollProg, showAll]);

  // Update plane trails position array
  useEffect(() => {
    if (!planeState || showAll) return;
    setTrailPositions(prev => {
      const next = [{ x: planeState.x, y: planeState.y }, ...prev];
      return next.slice(0, 5);
    });
  }, [planeState, showAll]);

  const fmcProgressPercent = Math.round(scrollProg * 100);

  // Helper to render arcs
  const renderArcs = () => {
    if (Object.keys(pixelCoords).length === 0) return null;

    return flightRoute.slice(0, -1).map((stop, i) => {
      const nextStop = flightRoute[i + 1];
      const fromPx = pixelCoords[stop.id];
      const toPx = pixelCoords[nextStop.id];

      if (!fromPx || !toPx) return null;

      const mx = (fromPx.x + toPx.x) / 2;
      const my = (fromPx.y + toPx.y) / 2;
      const dx = toPx.x - fromPx.x;
      const dy = toPx.y - fromPx.y;
      const cx = mx - dy * (-0.3);
      const cy = my + dx * (-0.3);

      const d = `M ${fromPx.x} ${fromPx.y} Q ${cx} ${cy} ${toPx.x} ${toPx.y}`;

      // Calculate path visibility offset
      let legVisProg = 0;
      if (showAll || scrollProg >= 0.99) {
        legVisProg = 1.0;
      } else if (scrollProg > 0) {
        if (i < currentLegIndex) {
          legVisProg = 1.0;
        } else if (i === currentLegIndex) {
          legVisProg = currentLegProgress;
        }
      }

      // We use 2000 as large default path offset multiplier
      const offsetVal = 2000 * (1 - legVisProg);

      return (
        <g key={`arc-${stop.id}-${nextStop.id}`}>
          {/* Casing */}
          <path d={d} fill="none" stroke="#060d1a" strokeWidth={10} strokeLinecap="round" />
          {/* Dashed background corridor */}
          <path d={d} fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth={3} strokeDasharray="8 5" />
          {/* Highlight drawing layer */}
          <path
            d={d}
            fill="none"
            stroke={scrollProg > 0.01 ? "rgba(147,197,253,0.7)" : "rgba(147,197,253,0.1)"}
            strokeWidth={1.5}
            strokeDasharray={2000}
            strokeDashoffset={offsetVal}
            style={{ transition: "stroke-dashoffset 0.05s linear, stroke 0.3s" }}
          />
        </g>
      );
    });
  };

  // Helper to render nodes
  const renderNodes = () => {
    if (Object.keys(pixelCoords).length === 0) return null;

    return flightRoute.map((stop, i) => {
      const pos = pixelCoords[stop.id];
      if (!pos) return null;

      const arrivedAtStop = showAll || scrollProg >= 0.99 || i <= currentLegIndex;
      const opacity = arrivedAtStop ? 1 : 0;
      const scale = arrivedAtStop ? 1 : 0.3;

      if (stop.type === "source") {
        return (
          <g key={stop.id} transform={`translate(${pos.x},${pos.y})`}>
            {/* Pulsing radar ping */}
            <circle r={36} className="radar-ping" fill="none" stroke="#ef4444" strokeWidth={1.5} />
            <circle r={22} fill="#ef4444" opacity={0.15} />
            <circle r={8} fill="#ef4444" style={{ filter: "drop-shadow(0 0 8px #ef4444)" }} />
            {/* Crosshair ticks */}
            <line x1={0} y1={-14} x2={0} y2={14} stroke="#ef4444" strokeWidth={1.5} />
            <line x1={-14} y1={0} x2={14} y2={0} stroke="#ef4444" strokeWidth={1.5} />
            <text y={32} textAnchor="middle" fill="#ef4444" fontSize={9} fontWeight={700} fontFamily="monospace">
              OMK [MUMBAI]
            </text>
          </g>
        );
      }

      if (stop.type === "destination") {
        const destArrived = showAll || scrollProg >= 0.98;
        const color = destArrived ? "#22c55e" : "#484f58";
        return (
          <g key={stop.id} transform={`translate(${pos.x},${pos.y})`}>
            {destArrived && (
              <circle r={32} className="radar-ping-green" fill="none" stroke="#22c55e" strokeWidth={1.5} />
            )}
            <circle r={20} fill="#0a1628" stroke={color} strokeWidth={2} />
            <circle r={6} fill={color} />
            <text y={30} textAnchor="middle" fill={color} fontSize={9} fontWeight={700} fontFamily="monospace">
              NXT [NEXT ROLE]
            </text>
          </g>
        );
      }

      // Waypoint city nodes
      const color = categoryColors[stop.id] ?? "#3b82f6";
      return (
        <g
          key={stop.id}
          transform={`translate(${pos.x},${pos.y})`}
          style={{ opacity, transform: `scale(${scale})`, transition: "opacity 0.4s ease-out, transform 0.4s ease-out" }}
        >
          <circle r={16} fill="#0a1628" stroke={color} strokeWidth={1.8} />
          <circle r={4} fill={color} />
          {/* Waypoint crosshairs */}
          <line x1={0} y1={-8} x2={0} y2={-16} stroke={color} strokeWidth={1} />
          <line x1={0} y1={8} x2={0} y2={16} stroke={color} strokeWidth={1} />
          <line x1={-8} y1={0} x2={-16} y2={0} stroke={color} strokeWidth={1} />
          <line x1={8} y1={0} x2={16} y2={0} stroke={color} strokeWidth={1} />
          <text y={26} textAnchor="middle" fill="#ffffff" fontSize={8} fontWeight={600} fontFamily="monospace">
            {stop.icao}
          </text>
        </g>
      );
    });
  };

  // Helper to render skills panels next to stops
  const renderSkillsPanels = () => {
    if (Object.keys(pixelCoords).length === 0) return null;

    return flightRoute.map((stop, i) => {
      if (stop.skills.length === 0) return null;
      const pos = pixelCoords[stop.id];
      if (!pos) return null;

      const arrivedAtStop = showAll || scrollProg >= 0.99 || i <= currentLegIndex;
      const showPanel = showAll || scrollProg >= 0.95 || i === currentLegIndex;
      
      const opacity = showPanel && arrivedAtStop ? 1 : 0;
      const translateY = showPanel ? 0 : 20;

      return (
        <div
          key={`panel-${stop.id}`}
          id={`skills-panel-${stop.id}`}
          style={{
            position: "absolute",
            left: `${pos.x + 30}px`,
            top: `${pos.y - 65}px`,
            background: "rgba(6,13,26,0.92)",
            border: `1px solid ${categoryColors[stop.id]}55`,
            borderRadius: "12px",
            padding: "12px 16px",
            backdropFilter: "blur(12px)",
            minWidth: "180px",
            opacity,
            transform: `translateY(${translateY}px) scale(${showPanel ? 1.0 : 0.95})`,
            transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          {/* City header */}
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
            {stop.icao} — {stop.city.toUpperCase()}
          </div>

          {/* Category label */}
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: categoryColors[stop.id], fontWeight: 700, marginBottom: 8, letterSpacing: "0.05em" }}>
            {stop.label}
          </div>

          {/* Skill chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {stop.skills.map((skill, index) => (
              <span
                key={index}
                style={{
                  background: `${categoryColors[stop.id]}15`,
                  border: `1px solid ${categoryColors[stop.id]}40`,
                  borderRadius: 6,
                  padding: "2px 8px",
                  fontSize: 10,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      );
    });
  };

  const FMCPanel = (
    <div style={{
      position: "absolute", bottom: 16, left: 16, zIndex: 30,
      background: "rgba(6,13,26,0.92)", backdropFilter: "blur(16px)",
      border: "1px solid rgba(59,130,246,0.25)", padding: "12px 16px",
      fontFamily: "'Space Mono','JetBrains Mono',monospace", fontSize: 10,
      color: "rgba(59,130,246,0.85)", lineHeight: 1.9, minWidth: 270,
      boxShadow: "0 0 24px rgba(59,130,246,0.08)",
    }}>
      <style>{`
        @keyframes atcPulse { 0%,100%{opacity:1}50%{opacity:.3} }
        @keyframes radarPing {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .pulse-dot { animation: atcPulse 1.5s ease-in-out infinite; }
        .radar-ping {
          transform-origin: center center;
          animation: radarPing 2.0s infinite linear;
        }
        .radar-ping-green {
          transform-origin: center center;
          animation: radarPing 1.6s infinite linear;
        }
      `}</style>
      <div style={{ color: "rgba(59,130,246,0.45)", marginBottom: 6, borderBottom: "1px solid rgba(59,130,246,0.15)", paddingBottom: 4, fontSize: 9 }}>
        ─ FLIGHT MANAGEMENT COMPUTER ────────
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: "2px 8px" }}>
        <span style={{ opacity: 0.55 }}>ORIGIN</span>
        <span style={{ color: "#ef4444" }}>OMK (MUMBAI, INDIA)</span>
        <span style={{ opacity: 0.55 }}>DESTINATION</span>
        <span style={{ color: "#22c55e" }}>NXT (NEXT ROLE)</span>
        <span style={{ opacity: 0.55 }}>WAYPOINTS</span>
        <span style={{ color: "#e2e8f0" }}>5 CITIES</span>
        {!showAll && (
          <>
            <span style={{ opacity: 0.55 }}>EN ROUTE</span>
            <span style={{ color: "#93c5fd" }}>{currentLegString}</span>
            <span style={{ opacity: 0.55 }}>PROGRESS</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ display: "flex", gap: 1 }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} style={{ width: 8, height: 8, borderRadius: 1, background: i < Math.round(fmcProgressPercent / 10) ? "#3b82f6" : "rgba(255,255,255,0.08)" }} />
                ))}
              </span>
              <span style={{ color: "#3b82f6" }}>{fmcProgressPercent}%</span>
            </span>
            <span style={{ opacity: 0.55 }}>ETE</span>
            <span style={{ color: "#e2e8f0" }}>
              {scrollProg >= 0.99 ? "ARRIVED" : "SCROLL TO CONTINUE ↓"}
            </span>
          </>
        )}
        <span style={{ opacity: 0.55 }}>STATUS</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: scrollProg >= 0.99 || showAll ? "#22c55e" : "#3b82f6", display: "inline-block" }} />
          <span style={{ color: scrollProg >= 0.99 || showAll ? "#22c55e" : "#3b82f6" }}>
            {scrollProg >= 0.99 || showAll ? "● DESTINATION REACHED" : scrollProg === 0 ? "● AWAITING DEPARTURE" : "● EN ROUTE"}
          </span>
        </span>
      </div>
    </div>
  );

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Maplibre container div */}
      <div ref={mapContainerRef} style={{ position: "absolute", inset: 0, background: "#060d1a" }} />

      {/* SVG Path Layer Overlay */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        {renderArcs()}
        {renderNodes()}

        {/* Trail dots */}
        {!showAll && trailPositions.slice(1).map((pos, i) => (
          <circle
            key={i}
            cx={pos.x}
            cy={pos.y}
            r={i === 0 ? 3.5 : i === 1 ? 2.5 : 1.5}
            fill="#4f8ef7"
            opacity={0.5 - i * 0.12}
            style={{ transformOrigin: "center center", filter: "drop-shadow(0 0 4px #4f8ef7)" }}
          />
        ))}
      </svg>

      {/* Real Plane Asset - PNG from public folder */}
      {planeState && (
        <div
          style={{
            position: "absolute",
            left: `${planeState.x}px`,
            top: `${planeState.y}px`,
            transform: `translate(-50%, -50%) rotate(${planeState.angle}deg)`,
            transformOrigin: "center center",
            width: "60px",
            height: "60px",
            pointerEvents: "none",
            zIndex: 10,
            transition: "transform 0.03s linear",
            filter: "drop-shadow(0 0 6px rgba(79,142,247,0.5))",
          }}
        >
          <img src="/plane-top-view.png" alt="Plane" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
      )}

      {/* Floating skill panels overlay */}
      {renderSkillsPanels()}

      {/* Scroll hint */}
      {!showAll && scrollProg === 0 && (
        <div style={{
          position: "absolute", bottom: 160, left: "16px",
          zIndex: 30, color: "rgba(255,255,255,0.4)", fontSize: 10,
          fontFamily: "'Space Mono',monospace", letterSpacing: "0.08em",
          animation: "atcPulse 2s ease-in-out infinite",
          pointerEvents: "none", whiteSpace: "nowrap",
        }}>
          SCROLL TO BEGIN JOURNEY ↓
        </div>
      )}

      {FMCPanel}
    </div>
  );
}

// ─── Skills Reveal Page ───────────────────────────────────────────────────────

function SkillsPage() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isGraphView, setIsGraphView] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProg, setScrollProg] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const showAll = prefersReducedMotion || isMobile;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => { if (isMobile) setIsGraphView(false); }, [isMobile]);

  // Hook up Lenis scroll tracking directly in parent page content
  useLenis((lenis) => {
    if (showAll || !scrollRef.current) return;
    const rect = scrollRef.current.getBoundingClientRect();
    const totalScrollable = rect.height - window.innerHeight;
    const currentScrolled = -rect.top;
    const rawProg = Math.max(0, Math.min(1, currentScrolled / totalScrollable));
    setScrollProg(rawProg);
  });

  return (
    <PageShell path="/skills">
      <div style={{ position: "relative", width: "100%", background: "#060d1a" }}>
        {/* Sticky header */}
        <div style={{
          position: "sticky", top: 0, zIndex: 100,
          padding: "20px 64px 14px",
          background: "linear-gradient(to bottom, rgba(6,13,26,0.98) 80%, transparent)",
          backdropFilter: "blur(8px)",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: 10, color: "#484f58", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6, fontFamily: "'Space Mono',monospace" }}>
                Navigation Chart / Technical Stack — maplibre
              </p>
              <h1 style={{ fontSize: 28, fontWeight: 300, color: "#e6edf3", fontFamily: "Geist,system-ui,sans-serif", letterSpacing: "-0.03em", lineHeight: 1.2, margin: 0 }}>
                Flight path through <span style={{ color: "#3b82f6" }}>your stack</span>
              </h1>
            </div>
            <button
              onClick={() => setIsGraphView(v => !v)}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "8px 14px", color: "#8b949e", fontSize: 11, fontFamily: "'Space Mono',monospace", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            >
              {isGraphView ? <EyeOff size={14} /> : <Eye size={14} />}
              {isGraphView ? "≡ List View" : "✈ Chart View"}
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isGraphView ? (
            <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {/* Outer scroll height container */}
              <div ref={scrollRef} style={{ position: "relative", width: "100%", height: showAll ? "calc(100vh - 80px)" : "400vh" }}>
                <div style={{
                  position: showAll ? "relative" : "fixed",
                  top: showAll ? 0 : 80,
                  left: showAll ? 0 : 48,
                  right: 0,
                  bottom: 0,
                  height: showAll ? "100%" : "calc(100vh - 80px)",
                  overflow: "hidden",
                  zIndex: 1
                }}>
                  <FlightPathChart
                    prefersReducedMotion={prefersReducedMotion}
                    isMobile={isMobile}
                    scrollProg={scrollProg}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {/* Fallback to simple skill listing */}
              <div style={{ padding: "40px 64px", maxWidth: 900, margin: "0 auto" }}>
                {flightRoute.filter(stop => stop.skills.length > 0).map(stop => (
                  <div key={stop.id} style={{ marginBottom: 36 }}>
                    <h3 style={{ fontSize: 10, color: categoryColors[stop.id], textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "'Space Mono',monospace", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ flex: 1, height: 1, background: `${categoryColors[stop.id]}33` }} />{stop.label}<span style={{ flex: 1, height: 1, background: `${categoryColors[stop.id]}33` }} />
                    </h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {stop.skills.map((skill, index) => (
                        <div key={index} style={{
                          display: "flex", alignItems: "center", gap: 8,
                          background: "rgba(255,255,255,0.03)",
                          border: `1px solid ${categoryColors[stop.id]}44`,
                          borderRadius: 4, padding: "10px 16px", color: "#e6edf3",
                          fontSize: 12, fontFamily: "'Space Mono',monospace"
                        }}>
                          <span style={{ fontSize: 9, color: categoryColors[stop.id], opacity: 0.8 }}>[{stop.icao}]</span>
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}

export const Route = createFileRoute("/skills")({ component: SkillsPage });
