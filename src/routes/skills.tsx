import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { useLenis } from "lenis/react";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";

// ─── Types ───────────────────────────────────────────────────────────────────

type SkillCategory = "source" | "languages" | "frontend" | "backend" | "ai" | "tools" | "goal";

type SkillStop = {
  id: string;
  label: string;
  icao: string;
  lat: number;
  lng: number;
  category: SkillCategory;
  skill: string | null;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const skillStops: SkillStop[] = [
  {
    id: "mumbai",
    label: "ORIGIN",
    icao: "OMK",
    lat: 19.076,
    lng: 72.8777,
    category: "source",
    skill: null,
  },
  {
    id: "goa",
    label: "GOA",
    icao: "GOI",
    lat: 15.4909,
    lng: 73.8278,
    category: "languages",
    skill: "JavaScript",
  },
  {
    id: "mangaluru",
    label: "MANGALURU",
    icao: "IXE",
    lat: 12.9141,
    lng: 74.856,
    category: "languages",
    skill: "TypeScript",
  },
  {
    id: "kozhikode",
    label: "KOZHIKODE",
    icao: "CCJ",
    lat: 11.2588,
    lng: 75.7804,
    category: "languages",
    skill: "Python",
  },
  {
    id: "kochi",
    label: "KOCHI",
    icao: "COK",
    lat: 9.9312,
    lng: 76.2673,
    category: "languages",
    skill: "C++",
  },
  {
    id: "trivandrum",
    label: "TRIVANDRUM",
    icao: "TRV",
    lat: 8.5241,
    lng: 76.9366,
    category: "languages",
    skill: "Java",
  },
  {
    id: "kanyakumari",
    label: "KANYAKUMARI",
    icao: "KKM",
    lat: 8.0883,
    lng: 77.5385,
    category: "frontend",
    skill: "React",
  },
  {
    id: "madurai",
    label: "MADURAI",
    icao: "IXM",
    lat: 9.9252,
    lng: 78.1198,
    category: "frontend",
    skill: "Next.js",
  },
  {
    id: "trichy",
    label: "TIRUCHIRAPPALLI",
    icao: "TRZ",
    lat: 10.7905,
    lng: 78.7047,
    category: "frontend",
    skill: "Three.js",
  },
  {
    id: "chennai",
    label: "CHENNAI",
    icao: "MAA",
    lat: 13.0827,
    lng: 80.2707,
    category: "frontend",
    skill: "Framer Motion",
  },
  {
    id: "vizag",
    label: "VISAKHAPATNAM",
    icao: "VTZ",
    lat: 17.6868,
    lng: 83.2185,
    category: "frontend",
    skill: "Tailwind CSS",
  },
  {
    id: "bhubaneswar",
    label: "BHUBANESWAR",
    icao: "BBI",
    lat: 20.2961,
    lng: 85.8245,
    category: "backend",
    skill: "Node.js",
  },
  {
    id: "kolkata",
    label: "KOLKATA",
    icao: "CCU",
    lat: 22.5726,
    lng: 88.3639,
    category: "backend",
    skill: "Express.js",
  },
  {
    id: "guwahati",
    label: "GUWAHATI",
    icao: "GAU",
    lat: 26.1445,
    lng: 91.7362,
    category: "backend",
    skill: "MongoDB",
  },
  {
    id: "dibrugarh",
    label: "DIBRUGARH",
    icao: "DIB",
    lat: 27.4728,
    lng: 94.912,
    category: "backend",
    skill: "Neo4j",
  },
  {
    id: "itanagar",
    label: "ITANAGAR",
    icao: "HGI",
    lat: 27.0844,
    lng: 93.6053,
    category: "backend",
    skill: "REST APIs",
  },
  {
    id: "jorhat",
    label: "JORHAT",
    icao: "JRH",
    lat: 26.7496,
    lng: 94.2037,
    category: "ai",
    skill: "LangChain",
  },
  {
    id: "imphal",
    label: "IMPHAL",
    icao: "IMF",
    lat: 24.817,
    lng: 93.9368,
    category: "ai",
    skill: "LangGraph",
  },
  {
    id: "aizawl",
    label: "AIZAWL",
    icao: "AJL",
    lat: 23.7271,
    lng: 92.7176,
    category: "ai",
    skill: "OpenCV",
  },
  {
    id: "shillong",
    label: "SHILLONG",
    icao: "SHL",
    lat: 25.5788,
    lng: 91.8933,
    category: "ai",
    skill: "MediaPipe",
  },
  {
    id: "silchar",
    label: "SILCHAR",
    icao: "IXS",
    lat: 24.8333,
    lng: 92.7789,
    category: "ai",
    skill: "Whisper",
  },
  {
    id: "jammu",
    label: "JAMMU",
    icao: "IXJ",
    lat: 32.7266,
    lng: 74.857,
    category: "tools",
    skill: "Git",
  },
  {
    id: "ludhiana",
    label: "LUDHIANA",
    icao: "LUH",
    lat: 30.901,
    lng: 75.8573,
    category: "tools",
    skill: "GitHub",
  },
  {
    id: "jaipur",
    label: "JAIPUR",
    icao: "JAI",
    lat: 26.9124,
    lng: 75.7873,
    category: "tools",
    skill: "Vercel",
  },
  {
    id: "ahmedabad",
    label: "AHMEDABAD",
    icao: "AMD",
    lat: 23.0225,
    lng: 72.5714,
    category: "tools",
    skill: "n8n",
  },
  {
    id: "jamnagar",
    label: "JAMNAGAR",
    icao: "JGA",
    lat: 22.4707,
    lng: 70.0577,
    category: "tools",
    skill: "CI/CD",
  },
  {
    id: "nagpur",
    label: "DESTINATION",
    icao: "NAG",
    lat: 21.1458,
    lng: 79.0882,
    category: "goal",
    skill: null,
  },
];

const categoryColors: Record<SkillCategory, string> = {
  source: "#ef4444",
  languages: "#f59e0b",
  frontend: "#3b82f6",
  backend: "#10b981",
  ai: "#8b5cf6",
  tools: "#64748b",
  goal: "#22c55e",
};

const categoryLabels: Record<SkillCategory, string> = {
  source: "SOURCE",
  languages: "LANGUAGES",
  frontend: "FRONTEND",
  backend: "BACKEND",
  ai: "AI / ML",
  tools: "TOOLS",
  goal: "GOAL",
};

// ─── Skill Chart Component ────────────────────────────────────────────────────

function FlightPathChart({
  prefersReducedMotion,
  isMobile,
  scrollProg,
}: {
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
      center: [82.0, 22.0],
      zoom: 4.5,
      pitch: 45,
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
      skillStops.forEach((stop) => {
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

    const totalLegs = skillStops.length - 1;
    const progressVal = scrollProg * totalLegs;
    const currentLeg = Math.min(Math.floor(progressVal), totalLegs - 1);
    const legProgress = progressVal - currentLeg;

    if (scrollProg > 0.95) {
      mapInstance.easeTo({
        center: [82.0, 22.0],
        zoom: 4.3,
        pitch: 20,
        bearing: 0,
        duration: 300,
        easing: (t) => t,
      });
      return;
    }

    const fromCity = skillStops[currentLeg];
    const toCity = skillStops[currentLeg + 1];

    if (fromCity && toCity) {
      const currentLng = fromCity.lng + (toCity.lng - fromCity.lng) * legProgress;
      const currentLat = fromCity.lat + (toCity.lat - fromCity.lat) * legProgress;

      // Calculate bearing between fromCity and toCity
      const dLng = (toCity.lng - fromCity.lng) * (Math.PI / 180);
      const lat1 = fromCity.lat * (Math.PI / 180);
      const lat2 = toCity.lat * (Math.PI / 180);
      
      const y = Math.sin(dLng) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
      const bearing = (Math.atan2(y, x) * 180) / Math.PI;

      mapInstance.easeTo({
        center: [currentLng, currentLat],
        zoom: 6.5,
        pitch: 65,
        bearing: bearing,
        duration: 80,
        easing: (t) => t,
      });
    }
  }, [scrollProg, mapInstance, showAll]);

  // Calculate current active leg state
  const totalLegs = skillStops.length - 1;
  const progressVal = scrollProg * totalLegs;
  const currentLegIndex = Math.min(Math.floor(progressVal), totalLegs - 1);
  const currentLegProgress = progressVal - currentLegIndex;

  const currentLegString = useMemo(() => {
    if (showAll || scrollProg >= 0.99) return "N/A — COMPLETED";
    if (scrollProg === 0) return "AWAITING DEPARTURE";
    const fromCity = skillStops[currentLegIndex];
    const toCity = skillStops[currentLegIndex + 1];
    return `${fromCity.icao} → ${toCity.icao}`;
  }, [currentLegIndex, scrollProg, showAll]);

  // Calculate plane position in screen coordinates
  const planeState = useMemo(() => {
    if (Object.keys(pixelCoords).length === 0) return null;

    if (showAll || scrollProg >= 0.99) {
      const destPx = pixelCoords["nagpur"];
      return { x: destPx?.x ?? 0, y: destPx?.y ?? 0, angle: -8 };
    }

    const fromCity = skillStops[currentLegIndex];
    const toCity = skillStops[currentLegIndex + 1];
    const fromPx = pixelCoords[fromCity.id];
    const toPx = pixelCoords[toCity.id];

    if (!fromPx || !toPx) return null;

    const mx = (fromPx.x + toPx.x) / 2;
    const my = (fromPx.y + toPx.y) / 2;
    const dx = toPx.x - fromPx.x;
    const dy = toPx.y - fromPx.y;
    const cx = mx - dy * -0.3;
    const cy = my + dx * -0.3;

    const t = currentLegProgress;
    const x = (1 - t) * (1 - t) * fromPx.x + 2 * (1 - t) * t * cx + t * t * toPx.x;
    const y = (1 - t) * (1 - t) * fromPx.y + 2 * (1 - t) * t * cy + t * t * toPx.y;

    const vx = 2 * (1 - t) * (cx - fromPx.x) + 2 * t * (toPx.x - cx);
    const vy = 2 * (1 - t) * (cy - fromPx.y) + 2 * t * (toPx.y - cy);
    const angle = Math.atan2(vy, vx) * (180 / Math.PI) + 90;

    return { x, y, angle };
  }, [pixelCoords, currentLegIndex, currentLegProgress, scrollProg, showAll]);

  // Update plane trails position array
  useEffect(() => {
    if (!planeState || showAll) return;
    setTrailPositions((prev) => {
      const next = [{ x: planeState.x, y: planeState.y }, ...prev];
      return next.slice(0, 5);
    });
  }, [planeState, showAll]);

  const fmcProgressPercent = Math.round(scrollProg * 100);

  // Helper to render arcs
  const renderArcs = () => {
    if (Object.keys(pixelCoords).length === 0) return null;

    return skillStops.slice(0, -1).map((stop, i) => {
      const nextStop = skillStops[i + 1];
      const fromPx = pixelCoords[stop.id];
      const toPx = pixelCoords[nextStop.id];

      if (!fromPx || !toPx) return null;

      const mx = (fromPx.x + toPx.x) / 2;
      const my = (fromPx.y + toPx.y) / 2;
      const dx = toPx.x - fromPx.x;
      const dy = toPx.y - fromPx.y;
      const cx = mx - dy * -0.3;
      const cy = my + dx * -0.3;

      const d = `M ${fromPx.x} ${fromPx.y} Q ${cx} ${cy} ${toPx.x} ${toPx.y}`;

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

      const offsetVal = 2000 * (1 - legVisProg);

      return (
        <g key={`arc-${stop.id}-${nextStop.id}`}>
          <path d={d} fill="none" stroke="#060d1a" strokeWidth={8} strokeLinecap="round" />
          <path
            d={d}
            fill="none"
            stroke="rgba(59,130,246,0.6)"
            strokeWidth={2.5}
            strokeDasharray={2000}
            strokeDashoffset={offsetVal}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
          <path
            d={d}
            fill="none"
            stroke="rgba(147,197,253,0.35)"
            strokeWidth={1}
            strokeDasharray={2000}
            strokeDashoffset={offsetVal}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </g>
      );
    });
  };

  // Helper to render banner poles (SVG)
  const renderPoles = () => {
    if (Object.keys(pixelCoords).length === 0) return null;

    return skillStops.map((stop, i) => {
      if (!stop.skill) return null;
      const pos = pixelCoords[stop.id];
      if (!pos) return null;

      const arrived = showAll || scrollProg >= 0.99 || i <= currentLegIndex;
      const approaching = !arrived && i === currentLegIndex + 1;
      const visible = arrived || approaching;

      return (
        <line
          key={`pole-${stop.id}`}
          x1={pos.x}
          y1={pos.y}
          x2={pos.x}
          y2={pos.y - 28}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1}
          strokeDasharray={28}
          strokeDashoffset={visible ? 0 : 28}
          style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
        />
      );
    });
  };

  // Helper to render nodes
  const renderNodes = () => {
    if (Object.keys(pixelCoords).length === 0) return null;

    return skillStops.map((stop, i) => {
      const pos = pixelCoords[stop.id];
      if (!pos) return null;

      const arrivedAtStop = showAll || scrollProg >= 0.99 || i <= currentLegIndex;
      const opacity = arrivedAtStop ? 1 : 0;
      const scale = arrivedAtStop ? 1 : 0.3;

      if (stop.category === "source") {
        return (
          <g key={stop.id} transform={`translate(${pos.x},${pos.y})`}>
            <circle r={36} className="radar-ping" fill="none" stroke="#ef4444" strokeWidth={1.5} />
            <circle r={22} fill="#ef4444" opacity={0.15} />
            <circle r={8} fill="#ef4444" style={{ filter: "drop-shadow(0 0 8px #ef4444)" }} />
            <line x1={0} y1={-14} x2={0} y2={14} stroke="#ef4444" strokeWidth={1.5} />
            <line x1={-14} y1={0} x2={14} y2={0} stroke="#ef4444" strokeWidth={1.5} />
            <text
              y={32}
              textAnchor="middle"
              fill="#ef4444"
              fontSize={9}
              fontWeight={700}
              fontFamily="monospace"
            >
              OMK [MUMBAI]
            </text>
          </g>
        );
      }

      if (stop.category === "goal") {
        const destArrived = showAll || scrollProg >= 0.95;
        const color = destArrived ? "#22c55e" : "#484f58";
        return (
          <g key={stop.id} transform={`translate(${pos.x},${pos.y})`}>
            {destArrived && (
              <circle
                r={32}
                className="radar-ping-green"
                fill="none"
                stroke="#22c55e"
                strokeWidth={1.5}
              />
            )}
            <circle r={20} fill="#0a1628" stroke={color} strokeWidth={2} />
            <circle r={6} fill={color} />
            <text
              y={30}
              textAnchor="middle"
              fill={color}
              fontSize={9}
              fontWeight={700}
              fontFamily="monospace"
            >
              NAG [NAGPUR]
            </text>
          </g>
        );
      }

      const color = categoryColors[stop.category] ?? "#3b82f6";
      return (
        <g
          key={stop.id}
          transform={`translate(${pos.x},${pos.y})`}
          style={{
            opacity,
            transform: `scale(${scale})`,
            transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
          }}
        >
          <circle r={5} fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
          <text
            y={16}
            textAnchor="middle"
            fill={color}
            fontSize={7}
            fontWeight={600}
            fontFamily="monospace"
            opacity={0.8}
          >
            {stop.icao}
          </text>
        </g>
      );
    });
  };

  // Helper to render skill banners with clipPath unfurl
  const renderBanners = () => {
    if (Object.keys(pixelCoords).length === 0) return null;

    return skillStops.map((stop, i) => {
      if (!stop.skill) return null;
      const pos = pixelCoords[stop.id];
      if (!pos) return null;

      const arrived = showAll || scrollProg >= 0.99 || i <= currentLegIndex;
      const approaching = !arrived && i === currentLegIndex + 1 && currentLegProgress > 0.3;
      const revealed = arrived || approaching;
      const color = categoryColors[stop.category];

      return (
        <div
          key={`banner-${stop.id}`}
          style={{
            position: "absolute",
            left: `${pos.x}px`,
            top: `${pos.y - 50}px`,
            transform: "translateX(-50%) perspective(1000px) rotateX(15deg) rotateY(-10deg) translateZ(10px)",
            zIndex: 15,
            pointerEvents: "none",
            opacity: revealed ? 1 : 0,
            transformOrigin: "bottom center",
            transition: "opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
            ...(revealed
              ? {}
              : {
                  transform: "translateX(-50%) perspective(1000px) rotateX(60deg) rotateY(0deg) translateZ(0px) translateY(20px) scale(0.8)",
                }),
          }}
        >
          {/* Stem/pin connecting banner to the city */}
          <div
            style={{
              position: "absolute",
              bottom: "-20px",
              left: "50%",
              width: "1px",
              height: "20px",
              background: `linear-gradient(to top, transparent, ${color})`,
              transform: "translateX(-50%)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(6,13,26,0.95) 100%)",
              backdropFilter: "blur(12px)",
              border: `1px solid rgba(255,255,255,0.1)`,
              borderBottom: `2px solid ${color}`,
              borderRadius: "8px",
              padding: "6px 12px",
              fontFamily: "'Space Mono','JetBrains Mono',monospace",
              fontSize: 11,
              whiteSpace: "nowrap",
              boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 16px ${color}33 inset, 0 4px 12px ${color}22`,
            }}
          >
            <span
              style={{
                background: "rgba(255,255,255,0.05)",
                padding: "2px 6px",
                borderRadius: "4px",
                color: "rgba(255,255,255,0.5)",
                fontWeight: 600,
                fontSize: 9,
                letterSpacing: "0.5px"
              }}
            >
              {stop.icao}
            </span>
            <span
              style={{
                color: "#ffffff",
                fontWeight: 700,
                textShadow: `0 0 10px ${color}88`,
              }}
            >
              {stop.skill}
            </span>
          </div>
        </div>
      );
    });
  };

  const FMCPanel = (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: 16,
        zIndex: 30,
        background: "rgba(6,13,26,0.92)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(59,130,246,0.25)",
        padding: "12px 16px",
        fontFamily: "'Space Mono','JetBrains Mono',monospace",
        fontSize: 10,
        color: "rgba(59,130,246,0.85)",
        lineHeight: 1.9,
        minWidth: 270,
        boxShadow: "0 0 24px rgba(59,130,246,0.08)",
      }}
    >
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
      <div
        style={{
          color: "rgba(59,130,246,0.45)",
          marginBottom: 6,
          borderBottom: "1px solid rgba(59,130,246,0.15)",
          paddingBottom: 4,
          fontSize: 9,
        }}
      >
        ─ FLIGHT MANAGEMENT COMPUTER ────────
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: "2px 8px" }}>
        <span style={{ opacity: 0.55 }}>ORIGIN</span>
        <span style={{ color: "#ef4444" }}>OMK (MUMBAI, INDIA)</span>
        <span style={{ opacity: 0.55 }}>DESTINATION</span>
        <span style={{ color: "#22c55e" }}>NAG (NAGPUR, INDIA)</span>
        <span style={{ opacity: 0.55 }}>WAYPOINTS</span>
        <span style={{ color: "#e2e8f0" }}>25 CITIES</span>
        {!showAll && (
          <>
            <span style={{ opacity: 0.55 }}>EN ROUTE</span>
            <span style={{ color: "#93c5fd" }}>{currentLegString}</span>
            <span style={{ opacity: 0.55 }}>PROGRESS</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ display: "flex", gap: 1 }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 1,
                      background:
                        i < Math.round(fmcProgressPercent / 10)
                          ? "#3b82f6"
                          : "rgba(255,255,255,0.08)",
                    }}
                  />
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
          <span
            className="pulse-dot"
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: scrollProg >= 0.99 || showAll ? "#22c55e" : "#3b82f6",
              display: "inline-block",
            }}
          />
          <span style={{ color: scrollProg >= 0.99 || showAll ? "#22c55e" : "#3b82f6" }}>
            {scrollProg >= 0.99 || showAll
              ? "● DESTINATION REACHED"
              : scrollProg === 0
                ? "● AWAITING DEPARTURE"
                : "● EN ROUTE"}
          </span>
        </span>
      </div>
    </div>
  );

  return (
    <div
      ref={wrapRef}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
    >
      <div
        ref={mapContainerRef}
        style={{ position: "absolute", inset: 0, background: "#060d1a" }}
      />

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
        {renderPoles()}
        {renderNodes()}

        {!showAll &&
          trailPositions
            .slice(1)
            .map((pos, i) => (
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
          <img
            src="/plane-top-view.png"
            alt="Plane"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      )}

      {renderBanners()}

      {!showAll && scrollProg === 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 160,
            left: "16px",
            zIndex: 30,
            color: "rgba(255,255,255,0.4)",
            fontSize: 10,
            fontFamily: "'Space Mono',monospace",
            letterSpacing: "0.08em",
            animation: "atcPulse 2s ease-in-out infinite",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
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

  useEffect(() => {
    if (isMobile) setIsGraphView(false);
  }, [isMobile]);

  useLenis((lenis) => {
    if (showAll || !scrollRef.current) return;
    const rect = scrollRef.current.getBoundingClientRect();
    const totalScrollable = rect.height - window.innerHeight;
    const currentScrolled = -rect.top;
    const rawProg = Math.max(0, Math.min(1, currentScrolled / totalScrollable));
    setScrollProg(rawProg);
  });

  // Build grouped skill list
  const groupedSkills = useMemo(() => {
    const groups: Record<SkillCategory, { icao: string; skill: string }[]> = {
      source: [],
      languages: [],
      frontend: [],
      backend: [],
      ai: [],
      tools: [],
      goal: [],
    };
    skillStops.forEach((stop) => {
      if (stop.skill) {
        groups[stop.category].push({ icao: stop.icao, skill: stop.skill });
      }
    });
    return groups;
  }, []);

  const listCategories: SkillCategory[] = ["languages", "frontend", "backend", "ai", "tools"];

  return (
    <PageShell path="/skills">
      <div style={{ position: "relative", width: "100%", background: "#060d1a" }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            padding: "20px 64px 14px",
            background: "linear-gradient(to bottom, rgba(6,13,26,0.98) 80%, transparent)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 10,
                  color: "#484f58",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  marginBottom: 6,
                  fontFamily: "'Space Mono',monospace",
                }}
              >
                Navigation Chart / Technical Stack — maplibre
              </p>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 300,
                  color: "#e6edf3",
                  fontFamily: "Geist,system-ui,sans-serif",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                Flight path through <span style={{ color: "#3b82f6" }}>your stack</span>
              </h1>
            </div>
            <button
              onClick={() => setIsGraphView((v) => !v)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 4,
                padding: "8px 14px",
                color: "#8b949e",
                fontSize: 11,
                fontFamily: "'Space Mono',monospace",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
            >
              {isGraphView ? <EyeOff size={14} /> : <Eye size={14} />}
              {isGraphView ? "≡ List View" : "✈ Chart View"}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isGraphView ? (
            <motion.div
              key="chart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                ref={scrollRef}
                style={{
                  position: "relative",
                  width: "100%",
                  height: showAll ? "calc(100vh - 80px)" : "1500vh",
                }}
              >
                <div
                  style={{
                    position: showAll ? "relative" : "fixed",
                    top: showAll ? 0 : 80,
                    left: showAll ? 0 : 48,
                    right: 0,
                    bottom: 0,
                    height: showAll ? "100%" : "calc(100vh - 80px)",
                    overflow: "hidden",
                    zIndex: 1,
                  }}
                >
                  <FlightPathChart
                    prefersReducedMotion={prefersReducedMotion}
                    isMobile={isMobile}
                    scrollProg={scrollProg}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ padding: "40px 64px", maxWidth: 900, margin: "0 auto" }}>
                {listCategories.map((cat) => {
                  const items = groupedSkills[cat];
                  if (items.length === 0) return null;
                  const color = categoryColors[cat];
                  return (
                    <div key={cat} style={{ marginBottom: 36 }}>
                      <h3
                        style={{
                          fontSize: 10,
                          color,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          fontFamily: "'Space Mono',monospace",
                          marginBottom: 12,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span style={{ flex: 1, height: 1, background: `${color}33` }} />
                        {categoryLabels[cat]}
                        <span style={{ flex: 1, height: 1, background: `${color}33` }} />
                      </h3>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {items.map((item, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              background: "rgba(255,255,255,0.03)",
                              border: `1px solid ${color}44`,
                              borderRadius: 4,
                              padding: "10px 16px",
                              color: "#e6edf3",
                              fontSize: 12,
                              fontFamily: "'Space Mono',monospace",
                            }}
                          >
                            <span style={{ fontSize: 9, color, opacity: 0.8 }}>[{item.icao}]</span>
                            <span>{item.skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}

export const Route = createFileRoute("/skills")({ component: SkillsPage });
