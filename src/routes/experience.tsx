import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { omkar } from "@/lib/data";
import { useEffect, useRef, useState, useId, useCallback } from "react";
import { ArrowRight, Cloud, CloudRain, CloudSnow, Sun, ExternalLink } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/experience")({ component: ExperiencePage });

// ═══════════════════════════════════════════════════════════════════════════════
// SVG Assets — Flat-style inline illustrations
// ═══════════════════════════════════════════════════════════════════════════════

function AirplaneSVG({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 500 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: "100%", height: "100%", ...style }}
    >
      {/* Fuselage */}
      <path
        className="plane-fuselage"
        d="M55 95 C55 68 78 52 120 48 L390 48 C430 48 460 62 468 82 L468 102 C468 122 438 135 400 135 L120 135 C78 135 55 120 55 95Z"
        fill="#C8CDD6"
      />
      {/* Fuselage belly shadow */}
      <path
        d="M65 105 C65 105 80 135 120 135 L400 135 C438 135 468 122 468 102 L468 108 C468 126 438 138 400 138 L120 138 C78 138 58 122 62 105Z"
        fill="#A8ADB8"
        opacity="0.5"
      />

      {/* Cockpit windshield */}
      <path
        d="M430 55 C448 52 466 62 468 80 L450 80 C448 68 442 58 430 57Z"
        fill="#1A2840"
        opacity="0.85"
      />
      {/* Windshield glare */}
      <path
        d="M438 58 C446 56 454 60 456 68 L448 68 C447 63 444 59 438 58Z"
        fill="#3A6090"
        opacity="0.4"
      />

      {/* Passenger windows */}
      <g opacity="0.65">
        {[370, 348, 326, 304, 282, 260, 238, 216, 194].map((x, i) => (
          <rect key={i} x={x} y="70" width="12" height="9" rx="3.5" fill="#1E2D42" />
        ))}
      </g>

      {/* Main wing (swept, below fuselage) */}
      <path d="M230 128 L130 188 L155 188 L310 132Z" fill="#B0B5BF" />
      {/* Wing highlight */}
      <path d="M240 128 L200 148 L310 132Z" fill="#C8CDD6" opacity="0.5" />

      {/* Vertical tail fin */}
      <path d="M78 48 L50 8 L68 8 L102 48Z" fill="#B0B5BF" />
      {/* Tail fin accent */}
      <path d="M60 28 L68 8 L74 8 L66 28Z" fill="#4F8EF7" opacity="0.6" />

      {/* Horizontal stabilizer */}
      <path d="M70 125 L32 152 L50 152 L100 130Z" fill="#B0B5BF" />

      {/* Engine pod (under wing) */}
      <ellipse cx="240" cy="152" rx="30" ry="13" fill="#9DA2AB" />
      <ellipse cx="240" cy="152" rx="26" ry="10" fill="#8A8F98" />
      <ellipse cx="268" cy="152" rx="4" ry="9" fill="#6B7080" />

      {/* Blue accent stripe along fuselage */}
      <rect x="60" y="90" width="406" height="5" rx="2.5" fill="#4F8EF7" />

      {/* Door outline */}
      <rect
        x="408"
        y="62"
        width="10"
        height="26"
        rx="3"
        fill="none"
        stroke="#A8ADB8"
        strokeWidth="0.8"
        opacity="0.5"
      />

      {/* Pulsing red navigation light on vertical tail fin */}
      <circle
        cx="68"
        cy="8"
        r="4"
        fill="#ff4d4d"
        style={{
          animation: "nav-light-pulse 1.2s infinite alternate",
          filter: "drop-shadow(0 0 4px #ff4d4d)",
        }}
      />

      {/* Pulsing green navigation light on main wingtip */}
      <circle
        cx="130"
        cy="188"
        r="4"
        fill="#3ecf8e"
        style={{
          animation: "nav-light-pulse 1.2s infinite alternate 0.6s",
          filter: "drop-shadow(0 0 4px #3ecf8e)",
        }}
      />

      {/* Engine heat shimmer glow */}
      <ellipse
        cx="230"
        cy="152"
        rx="10"
        ry="12"
        fill="#ffb03a"
        style={{
          opacity: 0.15,
          filter: "blur(3px)",
          animation: "engine-shimmer 0.15s infinite alternate",
        }}
      />
    </svg>
  );
}

function CloudShape({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const id = useId().replace(/:/g, "");
  const filterId = `cloud-blur-${id}`;
  const gradId = `cloud-grad-${id}`;

  return (
    <svg
      className={className}
      viewBox="0 0 280 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: "100%", height: "100%", overflow: "visible", ...style }}
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
        </filter>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          {/* Top highlight (warmer/brighter) */}
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          {/* Bottom shadow (cooler/dimmer) */}
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <g filter={`url(#${filterId})`}>
        {/* Core ellipses (brighter, more opaque) */}
        <ellipse cx="140" cy="65" rx="70" ry="38" fill={`url(#${gradId})`} opacity="1" />
        <ellipse
          cx="105"
          cy="55"
          rx="60"
          ry="35"
          fill={`url(#${gradId})`}
          opacity="0.8"
          transform="rotate(-4 105 55)"
        />
        <ellipse
          cx="185"
          cy="60"
          rx="55"
          ry="32"
          fill={`url(#${gradId})`}
          opacity="0.85"
          transform="rotate(3 185 60)"
        />

        {/* Outer/Edge ellipses (dimmer, more irregular) */}
        <ellipse
          cx="60"
          cy="75"
          rx="45"
          ry="22"
          fill={`url(#${gradId})`}
          opacity="0.4"
          transform="rotate(-8 60 75)"
        />
        <ellipse
          cx="225"
          cy="70"
          rx="40"
          ry="20"
          fill={`url(#${gradId})`}
          opacity="0.35"
          transform="rotate(6 225 70)"
        />
        <ellipse cx="150" cy="40" rx="35" ry="22" fill={`url(#${gradId})`} opacity="0.5" />
        <ellipse
          cx="90"
          cy="85"
          rx="40"
          ry="18"
          fill={`url(#${gradId})`}
          opacity="0.3"
          transform="rotate(-2 90 85)"
        />
        <ellipse
          cx="190"
          cy="80"
          rx="35"
          ry="16"
          fill={`url(#${gradId})`}
          opacity="0.25"
          transform="rotate(4 190 80)"
        />
      </g>
    </svg>
  );
}

function AirportHillsScenerySVG({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 1000 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ width: "100%", height: "100%", ...style }}
    >
      {/* Layer 1: Distant hills (lightest navy tone) */}
      <path
        d="M0,120 L0,85 C150,55 250,95 400,65 C550,35 650,75 800,45 C900,30 950,50 1000,35 L1000,120 Z"
        fill="#1a2744"
        opacity="0.6"
      />

      {/* Layer 2: Mid-ground hills (medium navy tone) */}
      <path
        d="M0,120 L0,95 C120,75 220,105 350,85 C480,65 580,95 720,70 C850,55 920,80 1000,65 L1000,120 Z"
        fill="#141f37"
        opacity="0.8"
      />

      {/* Layer 3: Near hills (darkest tone, grounding at the bottom runway horizon line) */}
      <path
        d="M0,120 L0,108 C100,95 180,115 300,102 C420,89 520,110 650,95 C780,80 880,105 1000,92 L1000,120 Z"
        fill="#0f1729"
      />
    </svg>
  );
}

function BirdSVG({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: "100%", height: "100%", overflow: "visible", ...style }}
    >
      <g
        style={{
          transformOrigin: "center",
          animation: "bird-flap 0.6s infinite alternate ease-in-out",
        }}
      >
        <path
          d="M2,12 Q8,6 12,12 Q16,6 22,12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

function AirportSceneSVG({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 1400 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      style={{ width: "100%", height: "100%", ...style }}
    >
      {/* === DISTANT CITY SKYLINE SILHOUETTE (left side) === */}
      <g opacity="0.3">
        <rect x="30" y="60" width="20" height="120" fill="#1a2744" />
        <rect x="52" y="40" width="16" height="140" fill="#1a2744" />
        <rect x="70" y="50" width="24" height="130" fill="#1a2744" />
        <rect x="96" y="25" width="18" height="155" fill="#1a2744" />
        <rect x="116" y="45" width="14" height="135" fill="#1a2744" />
        <rect x="132" y="55" width="22" height="125" fill="#1a2744" />
        <rect x="156" y="70" width="12" height="110" fill="#1a2744" />
        <rect x="170" y="35" width="20" height="145" fill="#1a2744" />
        {/* antennas */}
        <rect x="100" y="15" width="2" height="18" fill="#1a2744" />
        <rect x="62" y="32" width="2" height="12" fill="#1a2744" />
        {/* warm lit windows */}
        <rect x="36" y="80" width="4" height="3" fill="rgba(255,220,100,0.45)" />
        <rect x="56" y="62" width="4" height="3" fill="rgba(255,220,100,0.4)" />
        <rect x="99" y="45" width="4" height="3" fill="rgba(100,180,255,0.4)" />
        <rect x="74" y="68" width="4" height="3" fill="rgba(255,220,100,0.35)" />
        <rect x="174" y="55" width="4" height="3" fill="rgba(255,220,100,0.4)" />
      </g>

      {/* === CONTROL TOWER (center-right) === */}
      {/* Tower shaft */}
      <rect x="900" y="10" width="22" height="170" rx="2" fill="#0f1c35" />
      {/* Tower cab (glass box at top) */}
      <rect x="886" y="4" width="50" height="28" rx="3" fill="#162240" />
      <rect
        x="888"
        y="6"
        width="46"
        height="24"
        rx="2"
        fill="#1a2e50"
        stroke="rgba(100,160,255,0.3)"
        strokeWidth="1"
      />
      {/* Glass reflections */}
      <rect x="890" y="8" width="5" height="20" rx="1" fill="rgba(120,180,255,0.18)" />
      <rect x="897" y="8" width="3" height="20" rx="1" fill="rgba(120,180,255,0.08)" />
      {/* Rotating beacon on top */}
      <circle
        cx="911"
        cy="3"
        r="4"
        fill="#ffcc00"
        style={{
          animation: "nav-light-pulse 0.8s infinite alternate",
          filter: "drop-shadow(0 0 6px #ffcc00)",
        }}
      />
      {/* Support struts */}
      <line x1="902" y1="170" x2="895" y2="32" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <line x1="918" y1="170" x2="925" y2="32" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

      {/* === AIRPORT TERMINAL BUILDING (right side) === */}
      {/* Main terminal body */}
      <rect x="970" y="80" width="380" height="100" rx="4" fill="#0d1a30" />
      {/* Upper glass wall (curtain wall) */}
      <rect
        x="975"
        y="62"
        width="370"
        height="28"
        rx="3"
        fill="#0f2040"
        stroke="rgba(100,150,255,0.15)"
        strokeWidth="1"
      />
      {/* Window row - upper level */}
      {[985, 1010, 1035, 1060, 1085, 1110, 1135, 1160, 1185, 1210, 1235, 1260, 1290, 1315].map(
        (x, i) => (
          <g key={i}>
            <rect
              x={x}
              y={67}
              width={14}
              height={18}
              rx="2"
              fill={i % 3 === 0 ? "rgba(255,220,120,0.4)" : "rgba(80,130,220,0.22)"}
            />
            {i % 3 === 0 && (
              <rect
                x={x}
                y={67}
                width={14}
                height={18}
                rx="2"
                fill="none"
                stroke="rgba(255,220,100,0.2)"
                strokeWidth="0.5"
              />
            )}
          </g>
        ),
      )}
      {/* Lower door/window panels */}
      {[985, 1015, 1048, 1085, 1125, 1165, 1205, 1248, 1290].map((x, i) => (
        <rect
          key={i}
          x={x}
          y={100}
          width={22}
          height={44}
          rx="2"
          fill={i % 2 === 0 ? "rgba(255,220,120,0.1)" : "rgba(80,130,220,0.07)"}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
        />
      ))}
      {/* Jetbridge arms */}
      <line
        x1="1010"
        y1="180"
        x2="975"
        y2="180"
        stroke="rgba(255,255,255,0.09)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1="1080"
        y1="180"
        x2="1045"
        y2="180"
        stroke="rgba(255,255,255,0.09)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Roof cornice */}
      <rect x="966" y="57" width="388" height="7" rx="2" fill="#0c1628" />
      {/* Airline stripe */}
      <rect x="980" y="148" width="360" height="5" rx="2" fill="rgba(79,142,247,0.3)" />

      {/* === PARKED AIRCRAFT SILHOUETTE at gate === */}
      <g transform="translate(980, 172) scale(0.22)">
        <path
          d="M30 40 C30 28 42 20 60 18 L200 18 C220 18 235 26 235 38 L235 52 C235 62 220 68 200 68 L60 68 C42 68 30 58 30 46Z"
          fill="#1a2540"
        />
        <path d="M115 62 L70 92 L84 92 L150 66Z" fill="#141e32" />
        <path d="M40 18 L24 2 L36 2 L52 18Z" fill="#141e32" />
        <rect x="36" y="38" width="196" height="3" rx="1" fill="rgba(79,142,247,0.45)" />
      </g>

      {/* === APPROACH LIGHT TOWERS (left foreground) === */}
      {[220, 280, 340, 400, 460, 520, 580].map((x, i) => (
        <g key={i}>
          <line x1={x} y1="180" x2={x} y2="155" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
          <circle
            cx={x}
            cy={153}
            r="2.5"
            fill="rgba(255,255,255,0.65)"
            style={{
              animation: `nav-light-pulse ${0.9 + i * 0.1}s ${i * 0.08}s infinite alternate`,
            }}
          />
        </g>
      ))}

      {/* === TAXIWAY SIGN BOARDS (foreground) === */}
      <rect
        x="700"
        y="155"
        width="55"
        height="18"
        rx="2"
        fill="#1a0a00"
        stroke="rgba(255,160,0,0.6)"
        strokeWidth="1"
      />
      <rect x="702" y="157" width="51" height="14" rx="1" fill="rgba(255,140,0,0.1)" />
      <rect x="706" y="161" width="18" height="2" rx="1" fill="rgba(255,160,0,0.7)" />
      <rect x="728" y="161" width="14" height="2" rx="1" fill="rgba(255,160,0,0.7)" />
      <rect
        x="760"
        y="155"
        width="40"
        height="18"
        rx="2"
        fill="#1a0008"
        stroke="rgba(220,60,60,0.6)"
        strokeWidth="1"
      />
      <rect x="766" y="159" width="12" height="10" rx="1" fill="rgba(220,60,60,0.4)" />
      <rect x="781" y="159" width="12" height="10" rx="1" fill="rgba(220,60,60,0.4)" />
    </svg>
  );
}

// ── Parallax cloud speed multipliers so near clouds move faster than far ones ──
// Cloud layout data: parallax layers of 10 clouds
const CLOUD_DATA = [
  { top: "8%", size: 320, opacity: 0.12, speed: 16, startAt: 34, drift: -2200 }, // Big, close
  { top: "25%", size: 180, opacity: 0.06, speed: 24, startAt: 37, drift: -1400 },
  { top: "55%", size: 400, opacity: 0.14, speed: 12, startAt: 39, drift: -2600 }, // Very big, close
  { top: "38%", size: 240, opacity: 0.08, speed: 20, startAt: 41, drift: -1700 },
  { top: "68%", size: 140, opacity: 0.05, speed: 28, startAt: 38, drift: -1200 },
  { top: "15%", size: 200, opacity: 0.07, speed: 22, startAt: 43, drift: -1500 },
  { top: "48%", size: 280, opacity: 0.09, speed: 18, startAt: 40, drift: -1900 },
  { top: "75%", size: 100, opacity: 0.03, speed: 34, startAt: 36, drift: -1000 }, // Small, far
  // Sparse cruise-phase clouds
  { top: "12%", size: 260, opacity: 0.05, speed: 22, startAt: 55, drift: -1600 },
  { top: "82%", size: 120, opacity: 0.02, speed: 40, startAt: 62, drift: -1100 },
];

// Parallax speed factor per cloud — index maps to CLOUD_DATA (larger = closer/faster)
const CLOUD_PARALLAX_FACTOR = [1.6, 1.0, 2.0, 1.3, 0.8, 1.1, 1.5, 0.6, 1.0, 0.5];

// ── Season configuration per experience card (index matches omkar.experience) ──
// 0-2: DJS clubs → Rainy (stormy blue-gray)
// 3: Cognifyz → Winter (ice blue-white)
// 4-5: Hooman Labs + IIT Patna → Summer (warm golden blue)
const SEASON_SKY = {
  rainy: {
    top: "#0d1a2e",
    mid: "#111d30",
    bot: "#0a1220",
    label: "Rainy Season",
    labelColor: "#7ba7d4",
  },
  winter: {
    top: "#0e1e38",
    mid: "#152845",
    bot: "#0d1a2e",
    label: "Winter",
    labelColor: "#a8c4e0",
  },
  summer: {
    top: "#4da8da",
    mid: "#87ceeb",
    bot: "#fceabb",
    label: "Summer",
    labelColor: "#f4c26b",
  },
} as const;

// Card reveal timing: [cableStart, cardStart] per experience index
const CARD_TIMING = [
  [62, 65], // DJS Code AI  (rainy)
  [84, 87], // DJS S4DS     (rainy)
  [106, 109], // DJS SIGAI    (rainy)
  [130, 133], // COGNIFYZ     (winter)
  [155, 158], // Hooman Labs  (summer)
  [178, 181], // IIT Patna    (summer)
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// Preserved Components — Agent Pipeline SVG + Flow Diagram
// ═══════════════════════════════════════════════════════════════════════════════

/** Static version of the IIT Patna agent pipeline for use inside expandable cards */
function AgentPipelineSVG() {
  const stages = [
    "Paper Input",
    "Keyword Extraction",
    "Argument Mining",
    "Citation Gap Detection",
    "Report Output",
  ];
  const boxW = 170;
  const boxH = 26;
  const svgW = 190;
  const gap = 14;
  const startY = 10;
  const totalH = stages.length * boxH + (stages.length - 1) * gap + 20;

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
      <svg
        viewBox={`0 0 ${svgW} ${totalH}`}
        width={svgW}
        height={totalH}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {stages.map((label, i) => {
          const y = startY + i * (boxH + gap);
          const arrowY = y + boxH;
          const arrowMidY = arrowY + gap / 2;
          return (
            <g key={i}>
              <rect
                x={(svgW - boxW) / 2}
                y={y}
                width={boxW}
                height={boxH}
                rx="6"
                fill="rgba(62,207,142,0.06)"
                stroke="rgba(62,207,142,0.25)"
              />
              <text
                x={svgW / 2}
                y={y + boxH / 2 + 3.5}
                textAnchor="middle"
                fill="#3ecf8e"
                fontSize="9"
                fontFamily="'Geist Mono', monospace"
              >
                {label}
              </text>
              {i < stages.length - 1 && (
                <g>
                  <line
                    x1={svgW / 2}
                    y1={arrowY}
                    x2={svgW / 2}
                    y2={arrowMidY + gap / 2 - 4}
                    stroke="rgba(62,207,142,0.6)"
                    strokeWidth="1.5"
                  />
                  <polygon
                    points={`${svgW / 2},${arrowMidY + gap / 2} ${svgW / 2 - 4},${arrowMidY + gap / 2 - 5} ${svgW / 2 + 4},${arrowMidY + gap / 2 - 5}`}
                    fill="rgba(62,207,142,0.8)"
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Hooman Labs impact flow diagram */
function ImpactFlowDiagram() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
      {["CRM Systems", "Voice Agent", "Enterprise Clients"].map((label, li) => (
        <div key={li} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              background: "rgba(79,142,247,0.06)",
              border: "0.5px solid rgba(79,142,247,0.15)",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 12,
              color: "#4f8ef7",
              fontFamily: "'Geist Mono', monospace",
            }}
          >
            {label}
          </span>
          {li < 2 && <span style={{ color: "#505058", fontSize: 13 }}>→</span>}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Experience Card Components
// ═══════════════════════════════════════════════════════════════════════════════

function HangingExperienceCard({
  exp,
  index,
  isExpanded,
  onToggle,
  isHovered,
}: {
  exp: (typeof omkar.experience)[0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  isHovered: boolean;
}) {
  return (
    <div
      className="exp-hanging-card"
      role="article"
      aria-label={`${exp.company} — ${exp.role}`}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      style={{
        cursor: "pointer",
        borderColor: isHovered ? `${exp.accent}66` : "rgba(255,255,255,0.22)",
        boxShadow: isHovered
          ? `0 2px 0 rgba(255, 255, 255, 0.08) inset, 0 16px 56px rgba(0, 0, 0, 0.55), 0 0 20px ${exp.accent}25`
          : undefined,
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {/* Header: badge + company */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        {exp.company === "Hooman Labs" || exp.company === "IIT Patna" ? (
          <img
            src={exp.company === "Hooman Labs" ? "/hooman_labs.jpg" : "/IIT Patna.png"}
            alt=""
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              objectFit: "cover",
              border: `1px solid ${exp.accent}33`,
              background: "#0a0a0a",
            }}
          />
        ) : (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: `${exp.accent}18`,
              border: `1px solid ${exp.accent}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 600,
              color: exp.accent,
              fontFamily: "'Geist Mono', monospace",
              flexShrink: 0,
            }}
          >
            {exp.company.slice(0, 2).toUpperCase()}
          </div>
        )}
        <span
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: exp.accent,
            fontFamily: "'Geist', sans-serif",
          }}
        >
          {exp.company}
        </span>
      </div>

      {/* Role */}
      <div
        style={{
          fontSize: 13,
          fontFamily: "'Geist Mono', monospace",
          color: "#b0b0b8",
          marginBottom: 6,
        }}
      >
        {exp.role}
      </div>

      {/* Date range pill */}
      <span
        style={{
          display: "inline-block",
          background: `${exp.accent}14`,
          border: `0.5px solid ${exp.accent}33`,
          borderRadius: 4,
          padding: "2px 8px",
          fontSize: 11,
          color: exp.accent,
          fontFamily: "'Geist Mono', monospace",
        }}
      >
        {exp.period}
      </span>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "14px 0" }} />

      {/* WHAT I BUILT */}
      <p
        style={{
          fontSize: 10,
          color: "#909098",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 10,
          fontFamily: "'Geist Mono', monospace",
          margin: "0 0 10px",
        }}
      >
        What I Built
      </p>

      {/* Bullets */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {exp.highlights.map((h, hi) => (
          <div key={hi} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div
              style={{
                width: 3,
                height: 3,
                background: exp.accent,
                borderRadius: 1,
                flexShrink: 0,
                marginTop: 7,
              }}
            />
            <span style={{ fontSize: 13, color: "#d0d0d8", lineHeight: 1.55 }}>{h}</span>
          </div>
        ))}
      </div>

      {/* Tech tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {exp.tech.map((t, ti) => (
          <span
            key={ti}
            style={{
              fontSize: 10,
              fontFamily: "'Geist Mono', monospace",
              color: "#a0a0a8",
              background: "rgba(255,255,255,0.06)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              borderRadius: 4,
              padding: "2px 6px",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Expand toggle */}
      <div
        style={{
          marginTop: 14,
          fontSize: 10,
          color: exp.accent,
          fontFamily: "'Geist Mono', monospace",
          display: "flex",
          alignItems: "center",
          gap: 5,
          opacity: 0.7,
        }}
      >
        <span
          style={{
            display: "inline-block",
            transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
            fontSize: 8,
          }}
        >
          ▶
        </span>
        <span>{isExpanded ? "Hide details" : "View details"}</span>
      </div>

      {/* Expandable detail panel */}
      <div
        style={{
          maxHeight: isExpanded ? 320 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          style={{
            paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.05)",
            marginTop: 14,
          }}
        >
          <p
            style={{
              fontSize: 10,
              color: "#505058",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8,
              fontFamily: "'Geist Mono', monospace",
              margin: "0 0 8px",
            }}
          >
            Architecture
          </p>
          {index === 4 && <ImpactFlowDiagram />}
          {index === 5 && <AgentPipelineSVG />}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DraggableCard — card + live SVG cable that follows pointer drag
// ═══════════════════════════════════════════════════════════════════════════════

function DraggableCard({
  exp,
  index,
  isExpanded,
  onToggle,
}: {
  exp: (typeof omkar.experience)[0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const animFrameRef = useRef<number | null>(null);
  const snapRafRef = useRef<number | null>(null);
  const currentOffset = useRef({ x: 0, y: 0 });
  // Track drag velocity so snapBack can inherit it (makes fling feel natural)
  const dragVelocity = useRef({ x: 0, y: 0 });
  const lastPointerPos = useRef({ x: 0, y: 0, t: 0 });

  // Keep ref in sync with state for stable callbacks
  useEffect(() => {
    currentOffset.current = offset;
  }, [offset]);

  const CABLE_REST_LENGTH = 88; // cable top to card-top when at rest
  const CARD_WIDTH = 420;

  // ── Spring physics snap-back ──
  // Underdamped spring: low damping makes it overshoot & oscillate like a rubber band
  const snapBack = useCallback((initVx = 0, initVy = 0) => {
    if (snapRafRef.current) cancelAnimationFrame(snapRafRef.current);

    const STIFFNESS = 320; // how snappy the pull-back is
    const DAMPING = 13; // low = bouncy; ~2*sqrt(320)≈36 would be critically damped
    const MASS = 1;

    let vx = initVx * 0.35; // inherit a fraction of fling velocity
    let vy = initVy * 0.35;
    let x = currentOffset.current.x;
    let y = currentOffset.current.y;
    let lastTime: number | null = null;

    const step = (now: number) => {
      if (lastTime === null) {
        lastTime = now;
        snapRafRef.current = requestAnimationFrame(step);
        return;
      }
      // Cap dt so a tab backgrounding doesn't catapult the card
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Spring–damper force → acceleration → velocity → position
      const ax = (-STIFFNESS * x - DAMPING * vx) / MASS;
      const ay = (-STIFFNESS * y - DAMPING * vy) / MASS;
      vx += ax * dt;
      vy += ay * dt;
      x += vx * dt;
      y += vy * dt;

      // Sync both ref and state
      currentOffset.current = { x, y };
      setOffset({ x, y });

      // Stop when both position and velocity are negligible
      if (Math.abs(x) < 0.15 && Math.abs(y) < 0.15 && Math.abs(vx) < 0.4 && Math.abs(vy) < 0.4) {
        setOffset({ x: 0, y: 0 });
        currentOffset.current = { x: 0, y: 0 };
        return; // no more rAF — fully settled
      }

      snapRafRef.current = requestAnimationFrame(step);
    };

    snapRafRef.current = requestAnimationFrame(step);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, a, input")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;
    if (snapRafRef.current) cancelAnimationFrame(snapRafRef.current);
    dragVelocity.current = { x: 0, y: 0 };
    lastPointerPos.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      ox: currentOffset.current.x,
      oy: currentOffset.current.y,
    };
    e.currentTarget.style.cursor = "grabbing";
    e.stopPropagation();
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const cx = e.clientX,
      cy = e.clientY,
      now = e.timeStamp;
    animFrameRef.current = requestAnimationFrame(() => {
      // Track instantaneous velocity for natural fling hand-off
      const dt = Math.max(1, now - lastPointerPos.current.t);
      dragVelocity.current = {
        x: ((cx - lastPointerPos.current.x) / dt) * 16, // scale to ~px/frame
        y: ((cy - lastPointerPos.current.y) / dt) * 16,
      };
      lastPointerPos.current = { x: cx, y: cy, t: now };

      const dx = cx - dragStart.current.x;
      const dy = cy - dragStart.current.y;
      const newOffset = { x: dragStart.current.ox + dx, y: dragStart.current.oy + dy };
      currentOffset.current = newOffset;
      setOffset(newOffset);
    });
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDragging.current = false;
      e.currentTarget.style.cursor = "grab";
      // Hand off live drag velocity → spring continues the motion, then bounces back
      snapBack(dragVelocity.current.x, dragVelocity.current.y);
    },
    [snapBack],
  );

  // Compute SVG bezier path from anchor → card-top
  const anchorX = CARD_WIDTH / 2;
  const anchorY = 0;
  const cardTopX = CARD_WIDTH / 2 + offset.x;
  const cardTopY = CABLE_REST_LENGTH + offset.y;
  const dist = Math.sqrt((cardTopX - anchorX) ** 2 + (cardTopY - anchorY) ** 2);
  // Control points droop based on horizontal displacement for natural rope physics
  const droop = Math.min(40, Math.abs(offset.x) * 0.3);
  const c1x = anchorX + offset.x * 0.15;
  const c1y = anchorY + (cardTopY - anchorY) * 0.45 + droop;
  const c2x = cardTopX - offset.x * 0.1;
  const c2y = cardTopY - (cardTopY - anchorY) * 0.3;
  const cablePath = `M ${anchorX} ${anchorY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${cardTopX} ${cardTopY}`;
  const svgHeight = CABLE_REST_LENGTH + Math.max(0, offset.y) + 60;

  const tiltDeg = Math.max(-10, Math.min(10, offset.x * 0.028));
  const dragScale = isDragging.current ? 1.025 : 1;

  return (
    <div style={{ position: "relative", width: CARD_WIDTH }}>
      {/* Live SVG cable */}
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: svgHeight,
          overflow: "visible",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <defs>
          <linearGradient
            id={`cable-grad-${index}`}
            x1={anchorX}
            y1={anchorY}
            x2={anchorX}
            y2={cardTopY}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#f0c060" stopOpacity="1" />
            <stop offset="55%" stopColor={exp.accent} stopOpacity="0.85" />
            <stop offset="100%" stopColor={exp.accent} stopOpacity="0.35" />
          </linearGradient>
          <filter id={`cable-glow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Soft glow halo */}
        <path
          d={cablePath}
          fill="none"
          stroke={`url(#cable-grad-${index})`}
          strokeWidth="5"
          strokeLinecap="round"
          opacity={isHovered ? "0.45" : "0.22"}
          filter={`url(#cable-glow-${index})`}
          style={{ transition: "opacity 0.25s ease" }}
        />
        {/* Core cable line */}
        <path
          d={cablePath}
          fill="none"
          stroke={`url(#cable-grad-${index})`}
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{
            filter: isHovered ? "brightness(1.2) saturate(1.1)" : "none",
            transition: "filter 0.25s ease",
          }}
        />
        {/* Anchor dot (plane attachment) */}
        <circle
          cx={anchorX}
          cy={anchorY}
          r="3.5"
          fill="#f0c060"
          style={{ filter: "drop-shadow(0 0 5px rgba(240,192,96,0.9))" }}
        />
        {/* Card attachment dot */}
        <circle
          cx={cardTopX}
          cy={cardTopY}
          r="5"
          fill="#f0c060"
          style={{ filter: "drop-shadow(0 0 8px rgba(240,192,96,0.85))" }}
        />
        {/* Small tension highlight dot at midpoint */}
        {dist > 100 && (
          <circle
            cx={(anchorX + cardTopX) / 2}
            cy={(anchorY + cardTopY) / 2}
            r="2"
            fill="rgba(240,220,140,0.6)"
          />
        )}
      </svg>

      {/* Draggable card body */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "relative",
          top: CABLE_REST_LENGTH,
          transform: `translate(${offset.x}px, ${offset.y}px) rotate(${tiltDeg}deg) scale(${dragScale})`,
          transformOrigin: "top center",
          cursor: "grab",
          userSelect: "none",
          zIndex: 2,
          transition: isDragging.current ? "none" : "scale 0.25s ease, filter 0.25s ease",
          willChange: "transform",
          filter: isDragging.current || isHovered
            ? `drop-shadow(0 18px 40px rgba(0,0,0,0.6)) drop-shadow(0 0 12px ${exp.accent}44)`
            : `drop-shadow(0 8px 24px rgba(0,0,0,0.4))`,
        }}
      >
        {/* Drag hint tooltip shown on first hover */}
        <div
          style={{
            position: "absolute",
            top: -28,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 10,
            fontFamily: "'Geist Mono', monospace",
            color: "rgba(240,192,96,0.6)",
            letterSpacing: "0.06em",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            opacity: isDragging.current ? 0 : undefined,
            animation: "card-drag-hint 3s ease-in-out 1.5s forwards",
          }}
        >
          drag me ✦
        </div>
        <HangingExperienceCard
          exp={exp}
          index={index}
          isExpanded={isExpanded}
          onToggle={onToggle}
          isHovered={isHovered}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DraggableBanner — small hanging banner for top-left
// ═══════════════════════════════════════════════════════════════════════════════

function DraggableBanner() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const animFrameRef = useRef<number | null>(null);
  const snapRafRef = useRef<number | null>(null);
  const currentOffset = useRef({ x: 0, y: 0 });
  const dragVelocity = useRef({ x: 0, y: 0 });
  const lastPointerPos = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    currentOffset.current = offset;
  }, [offset]);

  const CABLE_REST_LENGTH = 60;
  const CARD_WIDTH = 140;

  const snapBack = useCallback((initVx = 0, initVy = 0) => {
    if (snapRafRef.current) cancelAnimationFrame(snapRafRef.current);
    const STIFFNESS = 320;
    const DAMPING = 13;
    const MASS = 1;
    let vx = initVx * 0.35;
    let vy = initVy * 0.35;
    let x = currentOffset.current.x;
    let y = currentOffset.current.y;
    let lastTime: number | null = null;
    const step = (now: number) => {
      if (lastTime === null) {
        lastTime = now;
        snapRafRef.current = requestAnimationFrame(step);
        return;
      }
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const ax = (-STIFFNESS * x - DAMPING * vx) / MASS;
      const ay = (-STIFFNESS * y - DAMPING * vy) / MASS;
      vx += ax * dt;
      vy += ay * dt;
      x += vx * dt;
      y += vy * dt;
      currentOffset.current = { x, y };
      setOffset({ x, y });
      if (Math.abs(x) < 0.15 && Math.abs(y) < 0.15 && Math.abs(vx) < 0.4 && Math.abs(vy) < 0.4) {
        setOffset({ x: 0, y: 0 });
        currentOffset.current = { x: 0, y: 0 };
        return;
      }
      snapRafRef.current = requestAnimationFrame(step);
    };
    snapRafRef.current = requestAnimationFrame(step);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;
    if (snapRafRef.current) cancelAnimationFrame(snapRafRef.current);
    dragVelocity.current = { x: 0, y: 0 };
    lastPointerPos.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      ox: currentOffset.current.x,
      oy: currentOffset.current.y,
    };
    e.currentTarget.style.cursor = "grabbing";
    e.stopPropagation();
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const cx = e.clientX,
      cy = e.clientY,
      now = e.timeStamp;
    animFrameRef.current = requestAnimationFrame(() => {
      const dt = Math.max(1, now - lastPointerPos.current.t);
      dragVelocity.current = {
        x: ((cx - lastPointerPos.current.x) / dt) * 16,
        y: ((cy - lastPointerPos.current.y) / dt) * 16,
      };
      lastPointerPos.current = { x: cx, y: cy, t: now };
      const newOffset = {
        x: dragStart.current.ox + (cx - dragStart.current.x),
        y: dragStart.current.oy + (cy - dragStart.current.y),
      };
      currentOffset.current = newOffset;
      setOffset(newOffset);
    });
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDragging.current = false;
      e.currentTarget.style.cursor = "grab";
      snapBack(dragVelocity.current.x, dragVelocity.current.y);
    },
    [snapBack],
  );

  const anchorX = CARD_WIDTH / 2;
  const anchorY = 0; // Anchor it directly at the top edge of viewport (was -40, causing clipping)
  const cardTopX = CARD_WIDTH / 2 + offset.x;
  const cardTopY = CABLE_REST_LENGTH + offset.y;
  const dist = Math.sqrt((cardTopX - anchorX) ** 2 + (cardTopY - anchorY) ** 2);
  const droop = Math.min(40, Math.abs(offset.x) * 0.3);
  const c1x = anchorX + offset.x * 0.15;
  const c1y = anchorY + (cardTopY - anchorY) * 0.45 + droop;
  const c2x = cardTopX - offset.x * 0.1;
  const c2y = cardTopY - (cardTopY - anchorY) * 0.3;
  const cablePath = `M ${anchorX} ${anchorY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${cardTopX} ${cardTopY}`;
  const svgHeight = CABLE_REST_LENGTH + Math.max(0, offset.y) + 60;
  const tiltDeg = Math.max(-15, Math.min(15, offset.x * 0.04));
  const dragScale = isDragging.current ? 1.05 : 1;
  const accent = "#4f8ef7"; // Blue accent for banner

  return (
    <div style={{ position: "absolute", top: 0, left: 32, width: CARD_WIDTH, zIndex: 50 }}>
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: svgHeight,
          overflow: "visible",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <defs>
          <linearGradient
            id="banner-cable-grad"
            x1={anchorX}
            y1={anchorY}
            x2={anchorX}
            y2={cardTopY}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#f0c060" stopOpacity="1" />
            <stop offset="55%" stopColor={accent} stopOpacity="0.85" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.35" />
          </linearGradient>
          <filter id="banner-cable-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d={cablePath}
          fill="none"
          stroke="url(#banner-cable-grad)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity={isHovered ? "0.45" : "0.22"}
          filter="url(#banner-cable-glow)"
          style={{ transition: "opacity 0.25s ease" }}
        />
        <path
          d={cablePath}
          fill="none"
          stroke="url(#banner-cable-grad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{
            filter: isHovered ? "brightness(1.2) saturate(1.1)" : "none",
            transition: "filter 0.25s ease",
          }}
        />
        <circle
          cx={cardTopX}
          cy={cardTopY}
          r="4"
          fill="#f0c060"
          style={{ filter: "drop-shadow(0 0 8px rgba(240,192,96,0.85))" }}
        />
      </svg>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "relative",
          top: CABLE_REST_LENGTH,
          transform: `translate(${offset.x}px, ${offset.y}px) rotate(${tiltDeg}deg) scale(${dragScale})`,
          transformOrigin: "top center",
          cursor: "grab",
          userSelect: "none",
          zIndex: 2,
          transition: isDragging.current ? "none" : "scale 0.25s ease, filter 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
          willChange: "transform",
          background: "rgba(8, 12, 20, 0.88)",
          border: isHovered ? `1px solid ${accent}66` : "1px solid rgba(255, 255, 255, 0.22)",
          borderRadius: 12,
          padding: "10px 16px",
          backdropFilter: "blur(28px) saturate(1.4)",
          WebkitBackdropFilter: "blur(28px) saturate(1.4)",
          boxShadow: isDragging.current || isHovered
            ? `0 2px 0 rgba(255, 255, 255, 0.08) inset, 0 18px 40px rgba(0,0,0,0.6), 0 0 16px ${accent}25`
            : `0 2px 0 rgba(255, 255, 255, 0.08) inset, 0 8px 24px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255, 255, 255, 0.06)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#f2f2f3",
            fontFamily: "'Geist Mono', monospace",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Experience
        </span>
      </div>
    </div>
  );
}

/** Static card layout used for mobile + reduced-motion fallback */
function StaticExperienceCard({
  exp,
  index,
  isExpanded,
  onToggle,
  tier = "secondary",
  staggerIndex,
}: {
  exp: (typeof omkar.experience)[0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  tier?: "primary" | "secondary";
  staggerIndex?: number;
}) {
  const isPrimary = tier === "primary";
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredTag, setHoveredTag] = useState<number | null>(null);

  const dims = isPrimary
    ? {
        p: 36,
        img: 52,
        companySize: 26,
        roleSize: 14,
        gapHeader: 20,
        dateSize: 12,
        bulletSize: 14,
        tagSize: 11,
      }
    : {
        p: 20,
        img: 32,
        companySize: 16,
        roleSize: 12,
        gapHeader: 14,
        dateSize: 10,
        bulletSize: 13,
        tagSize: 10,
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.7, delay: (staggerIndex ?? index) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredTag(null);
      }}
      className="exp-static-card"
      role="article"
      aria-label={`${exp.company} — ${exp.role}`}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      style={{
        position: "relative",
        cursor: "pointer",
        background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
        border: `1px solid rgba(255,255,255,0.05)`,
        borderRadius: 20,
        padding: dims.p,
        backdropFilter: "blur(12px)",
        boxShadow: isHovered
          ? `0 16px 48px rgba(0,0,0,0.55), inset 0 0 0 1px ${exp.accent}66`
          : `0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px ${exp.accent}18`,
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Flight Theme Accent — Top Cable (primary cards only) */}
      {isPrimary && (
        <div
          style={{
            position: "absolute",
            top: -28,
            left: 48,
            width: 1,
            height: 28,
            background: `linear-gradient(to bottom, transparent 0%, ${exp.accent}22 40%, ${exp.accent}66 100%)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: -1.5,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: `${exp.accent}bb`,
              boxShadow: `0 0 8px ${exp.accent}cc`,
            }}
          />
        </div>
      )}

      {/* Header */}
      <div
        style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: dims.gapHeader }}
      >
        {exp.company === "Hooman Labs" || exp.company === "IIT Patna" ? (
          <img
            src={exp.company === "Hooman Labs" ? "/hooman_labs.jpg" : "/IIT Patna.png"}
            alt=""
            aria-hidden="true"
            style={{
              width: dims.img,
              height: dims.img,
              borderRadius: 14,
              objectFit: "cover",
              border: `1px solid ${exp.accent}44`,
              background: "#0a0a0a",
            }}
          />
        ) : (
          <div
            style={{
              width: isPrimary ? 44 : dims.img,
              height: isPrimary ? 44 : dims.img,
              borderRadius: 10,
              background: `${exp.accent}18`,
              border: `1px solid ${exp.accent}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isPrimary ? 15 : 12,
              fontWeight: 600,
              color: exp.accent,
              fontFamily: "'Geist Mono', monospace",
              flexShrink: 0,
            }}
          >
            {exp.company.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: dims.companySize,
              fontWeight: 600,
              color: exp.accent,
              fontFamily: "'Geist', sans-serif",
              letterSpacing: "-0.02em",
              marginBottom: 4,
            }}
          >
            {exp.company}
          </div>
          <div
            style={{
              fontSize: dims.roleSize,
              fontFamily: "'Geist Mono', monospace",
              color: "#888",
              letterSpacing: "0.06em",
            }}
          >
            {exp.role}
          </div>
        </div>

        {/* Date pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: `${exp.accent}0a`,
            border: `1px solid ${exp.accent}22`,
            borderRadius: 999,
            padding: "4px 10px",
            fontSize: dims.dateSize,
            color: exp.accent,
            fontFamily: "'Geist Mono', monospace",
            whiteSpace: "nowrap",
          }}
        >
          {exp.period}
        </div>
      </div>

      <div
        style={{
          marginTop: isPrimary ? 24 : 16,
          paddingTop: isPrimary ? 16 : 12,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p
          style={{
            fontSize: 10,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: isPrimary ? 16 : 12,
            fontFamily: "'Geist Mono', monospace",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: isPrimary ? 2 : 1.5,
              height: isPrimary ? 14 : 10,
              background: exp.accent,
              display: "inline-block",
              borderRadius: 1,
            }}
          />
          What I Built
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isPrimary ? 12 : 8,
            marginBottom: isPrimary ? 24 : 16,
          }}
        >
          {exp.highlights.map((h, hi) => (
            <div key={hi} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: `${exp.accent}44`,
                  border: `1px solid ${exp.accent}`,
                  flexShrink: 0,
                  marginTop: 7,
                }}
              />
              <span
                style={{
                  fontSize: dims.bulletSize,
                  color: "#a0a0a8",
                  lineHeight: 1.65,
                  letterSpacing: "0.01em",
                }}
              >
                {h}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {exp.tech.map((t, ti) => (
            <span
              key={ti}
              onMouseEnter={() => setHoveredTag(ti)}
              onMouseLeave={() => setHoveredTag(null)}
              style={{
                fontSize: dims.tagSize,
                fontFamily: "'Geist Mono', monospace",
                color: hoveredTag === ti ? "#e0e0e8" : "#a0a0a8",
                background: hoveredTag === ti ? `${exp.accent}18` : "rgba(255,255,255,0.03)",
                border:
                  hoveredTag === ti
                    ? `1px solid ${exp.accent}44`
                    : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "3px 10px",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: hoveredTag === ti ? "scale(1.05)" : "scale(1)",
                cursor: "default",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Expand / View Details CTA */}
      <div
        style={{
          marginTop: isPrimary ? 24 : 16,
          fontSize: 11,
          color: exp.accent,
          fontFamily: "'Geist Mono', monospace",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontWeight: 500,
          letterSpacing: "0.05em",
          transition: "all 0.25s ease",
          opacity: isHovered ? 1 : 0.6,
        }}
      >
        <span
          style={{
            borderBottom: isHovered ? `1px solid ${exp.accent}66` : "1px solid transparent",
            transition: "border-color 0.25s ease",
            lineHeight: 1.4,
          }}
        >
          VIEW DETAILS
        </span>
        <motion.div
          animate={{ x: isHovered ? 4 : 0, opacity: isHovered ? 1 : 0.5 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <ArrowRight size={14} />
        </motion.div>
      </div>

      <div
        style={{
          maxHeight: isExpanded ? 320 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 14 }}
        >
          <p
            style={{
              fontSize: 10,
              color: "#505058",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0 0 8px",
              fontFamily: "'Geist Mono', monospace",
            }}
          >
            Architecture
          </p>
          {index === 0 && <ImpactFlowDiagram />}
          {index === 1 && <AgentPipelineSVG />}
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Lessons Section (preserved from original — renders after takeoff)
// ═══════════════════════════════════════════════════════════════════════════════

const insights = [
  '"Production systems have no room for hacks. I learned to design for failure first."',
  "\"Multi-agent coordination isn't just about agents — it's about trust between steps.\"",
  '"Working directly with founders compresses 2 years of learning into 2 months."',
];

function LessonsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".lesson-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="lessons-container"
      style={{
        padding: "64px 64px 80px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <p
        style={{
          fontSize: 11,
          color: "#505058",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 20,
          fontFamily: "'Geist Mono', monospace",
        }}
      >
        Lessons
      </p>

      <div style={{ display: "flex", gap: 16 }}>
        {insights.map((quote, qi) => (
          <motion.div
            key={qi}
            className="lesson-card"
            whileHover={{
              y: -5,
              boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
              borderLeftColor: "#f2f2f3",
            }}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.02)",
              border: "0.5px solid rgba(255,255,255,0.06)",
              borderLeft: "3px solid #4f8ef7",
              borderRadius: 14,
              padding: "20px 20px 20px 16px",
              transition: "border-left-color 0.3s",
            }}
          >
            <p
              style={{
                fontSize: 14,
                color: "#a0a0a8",
                lineHeight: 1.7,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              {qi === 0 ? <TypingEffect text={quote} /> : quote}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TypingEffect({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: textRef.current,
      start: "top 85%",
      onEnter: () => setStarted(true),
    });
  });

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [text, started]);

  return (
    <span ref={textRef}>
      {displayedText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        style={{
          display: "inline-block",
          width: 6,
          height: 14,
          background: "#4f8ef7",
          marginLeft: 4,
          verticalAlign: "middle",
        }}
      />
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Season Badge — displayed during cruise phases
// ═══════════════════════════════════════════════════════════════════════════════

function SeasonBadge() {
  // Three separate badge elements; GSAP will hide/show via parent opacity.
  // We stack all three and use sibling GSAP targets to control which is visible.
  return (
    <>
      {/* Rainy badge */}
      <div
        className="season-badge-rainy"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(13,26,46,0.85)",
          border: "0.5px solid rgba(123,167,212,0.25)",
          borderRadius: 20,
          padding: "4px 12px",
          backdropFilter: "blur(8px)",
        }}
      >
        <span style={{ fontSize: 14 }}>🌧️</span>
        <span
          style={{
            fontSize: 11,
            fontFamily: "'Geist Mono', monospace",
            color: SEASON_SKY.rainy.labelColor,
            letterSpacing: "0.06em",
          }}
        >
          {SEASON_SKY.rainy.label}
        </span>
      </div>
      {/* Winter badge */}
      <div
        className="season-badge-winter"
        style={{
          display: "none",
          alignItems: "center",
          gap: 6,
          background: "rgba(14,30,56,0.85)",
          border: "0.5px solid rgba(168,196,224,0.25)",
          borderRadius: 20,
          padding: "4px 12px",
          backdropFilter: "blur(8px)",
        }}
      >
        <span style={{ fontSize: 14 }}>❄️</span>
        <span
          style={{
            fontSize: 11,
            fontFamily: "'Geist Mono', monospace",
            color: SEASON_SKY.winter.labelColor,
            letterSpacing: "0.06em",
          }}
        >
          {SEASON_SKY.winter.label}
        </span>
      </div>
      {/* Summer badge */}
      <div
        className="season-badge-summer"
        style={{
          display: "none",
          alignItems: "center",
          gap: 6,
          background: "rgba(15,36,68,0.85)",
          border: "0.5px solid rgba(244,194,107,0.25)",
          borderRadius: 20,
          padding: "4px 12px",
          backdropFilter: "blur(8px)",
        }}
      >
        <span style={{ fontSize: 14 }}>☀️</span>
        <span
          style={{
            fontSize: 11,
            fontFamily: "'Geist Mono', monospace",
            color: SEASON_SKY.summer.labelColor,
            letterSpacing: "0.06em",
          }}
        >
          {SEASON_SKY.summer.label}
        </span>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Flight HUD Gauges (Decorative overlays)
// ═══════════════════════════════════════════════════════════════════════════════

function FlightGauge({
  label,
  unit,
  classNamePrefix,
  position,
}: {
  label: string;
  unit: string;
  classNamePrefix: string;
  position: "left" | "right";
}) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 32,
        [position]: 32,
        width: 110,
        height: 110,
        borderRadius: "50%",
        background: "rgba(10,10,10,0.6)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(79,142,247,0.15)",
        boxShadow: "0 0 15px rgba(79,142,247,0.1)",
        zIndex: 15,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-hidden="true"
    >
      {/* SVG for dial arc */}
      <svg width="110" height="110" style={{ position: "absolute", inset: 0 }}>
        {/* Background track */}
        <path
          d="M 25 85 A 45 45 0 1 1 85 85"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Filled arc representing range */}
        <path
          d="M 25 85 A 45 45 0 1 1 85 85"
          fill="none"
          stroke="rgba(79,142,247,0.3)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="212"
          strokeDashoffset="50"
        />
      </svg>

      {/* Needle */}
      <div
        className={`${classNamePrefix}-needle`}
        style={{
          position: "absolute",
          bottom: "50%",
          left: "50%",
          width: 2,
          height: 40,
          background: "#4f8ef7",
          transformOrigin: "bottom center",
          transform: "translateX(-50%) rotate(-135deg)", // starting position
          borderRadius: 2,
          boxShadow: "0 0 4px #4f8ef7",
          willChange: "transform",
        }}
      />

      {/* Center dot */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#101010",
          border: "1.5px solid #4f8ef7",
        }}
      />

      {/* Texts */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", marginTop: 15 }}>
        <div
          style={{
            fontSize: 8,
            color: "#505058",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontFamily: "'Geist Mono', monospace",
          }}
        >
          {label}
        </div>
        <div
          className={`${classNamePrefix}-text`}
          style={{
            fontSize: 16,
            color: "#fff",
            fontWeight: 600,
            fontFamily: "'Geist Mono', monospace",
            lineHeight: 1.1,
            textShadow: "0 0 8px rgba(255,255,255,0.3)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          0
        </div>
        <div
          style={{
            fontSize: 9,
            color: "#4f8ef7",
            fontFamily: "'Geist Mono', monospace",
          }}
        >
          {unit}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Takeoff Sequence — Scroll-scrubbed GSAP animation
// ═══════════════════════════════════════════════════════════════════════════════

function TakeoffSequence({
  expandedCard,
  setExpandedCard,
}: {
  expandedCard: number | null;
  setExpandedCard: (i: number | null) => void;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !skyRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=700%", // 6 cards need much more scroll room
          scrub: 2,
          pin: true,
        },
      });

      // ── HUD Flight Data Logic ──
      const flightData = { altitude: 0, speed: 0, altFluc: 0, spdFluc: 0 };

      const updateGauges = () => {
        // Calculate actual values with fluctuation, but clamped to avoid negative
        const actualAlt = Math.max(
          0,
          flightData.altitude + (flightData.altitude > 10000 ? flightData.altFluc - 100 : 0),
        );
        const actualSpd = Math.max(
          0,
          flightData.speed + (flightData.speed > 200 ? flightData.spdFluc - 5 : 0),
        );

        const altNeedle = document.querySelector(".alt-needle") as HTMLElement;
        const altText = document.querySelector(".alt-text") as HTMLElement;
        if (altNeedle && altText) {
          const altProgress = Math.min(1, actualAlt / 35000);
          const altRot = -135 + altProgress * 270;
          altNeedle.style.transform = `translateX(-50%) rotate(${altRot}deg)`;
          altText.innerText = Math.round(actualAlt).toLocaleString();
        }

        const spdNeedle = document.querySelector(".speed-needle") as HTMLElement;
        const spdText = document.querySelector(".speed-text") as HTMLElement;
        if (spdNeedle && spdText) {
          const spdProgress = Math.min(1, actualSpd / 560);
          const spdRot = -135 + spdProgress * 270;
          spdNeedle.style.transform = `translateX(-50%) rotate(${spdRot}deg)`;
          spdText.innerText = Math.round(actualSpd).toString();
        }
      };

      // Independent idle fluctuation (runs constantly)
      gsap.to(flightData, {
        altFluc: 200,
        spdFluc: 10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        onUpdate: () => {
          if (flightData.altitude > 1000 || flightData.speed > 100) {
            updateGauges();
          }
        },
      });

      // Scroll-scrubbed flight metrics
      tl.to(flightData, { speed: 80, duration: 20, ease: "power1.in", onUpdate: updateGauges }, 0);
      tl.to(
        flightData,
        { speed: 560, duration: 30, ease: "power2.out", onUpdate: updateGauges },
        20,
      );
      tl.to(
        flightData,
        { altitude: 35000, duration: 60, ease: "power1.inOut", onUpdate: updateGauges },
        0,
      );

      // ── Phase 1: Runway taxi (0 → 20) ──────────────────────────────────────
      tl.addLabel("runway", 0);
      tl.to(".runway-layer", { x: "-35%", duration: 20, ease: "none" }, 0);

      // ── Phase 2: Takeoff / liftoff (20 → 40) ──────────────────────────────
      tl.addLabel("takeoff", 20);

      tl.to(".plane-wrapper", { rotation: -8, duration: 12, ease: "power2.inOut" }, 20);

      // Audio scrubbing sync
      tl.to(
        {},
        {
          duration: 40,
          onUpdate: function () {
            if (
              audioRef.current &&
              audioRef.current.duration &&
              !isNaN(audioRef.current.duration)
            ) {
              audioRef.current.volume = 0.4;
              audioRef.current.currentTime = this.progress() * audioRef.current.duration;
              if (audioRef.current.paused) audioRef.current.play().catch(() => {});
            }
          },
          onReverseComplete: () => {
            if (audioRef.current) audioRef.current.pause();
          },
          onComplete: () => {
            if (audioRef.current) audioRef.current.pause();
          },
        },
        20,
      );

      // Moon moves back and fades as we fly away
      tl.to(".airport-moon", { x: -300, y: -50, opacity: 0, duration: 15, ease: "power2.in" }, 20);
      // Airport scene slides away / fades on takeoff
      tl.to(
        ".airport-scene",
        { x: "-60%", y: 80, opacity: 0, duration: 14, ease: "power2.in" },
        20,
      );

      tl.to(
        ".runway-layer",
        { x: "-100%", y: 250, opacity: 0, scale: 0.8, duration: 18, ease: "power2.in" },
        20,
      );
      tl.to(".scenery-layer", { y: 200, opacity: 0, duration: 16, ease: "power2.in" }, 20);
      tl.to(".ground-line", { y: 250, opacity: 0, duration: 14, ease: "power1.in" }, 22);

      // Sky → navy
      tl.to(
        skyRef.current,
        {
          "--sky-top": "#0d2240",
          "--sky-mid": "#0a1628",
          "--sky-bot": "#080810",
          duration: 20,
          ease: "none",
        },
        20,
      );

      tl.to(".stars-layer", { opacity: 0.6, duration: 15 }, 25);

      // ── Phase 3: Cloud climb (40 → 60) ─────────────────────────────────────
      tl.addLabel("clouds", 40);
      tl.to(".plane-wrapper", { rotation: -2, duration: 10, ease: "power2.inOut" }, 42);
      tl.to(".plane-wrapper", { rotation: 0, duration: 8, ease: "power2.out" }, 52);

      tl.to(
        skyRef.current,
        {
          "--sky-top": "#122a4a",
          "--sky-mid": "#0d2240",
          "--sky-bot": "#0a1628",
          duration: 20,
          ease: "none",
        },
        40,
      );

      CLOUD_DATA.forEach((cloud, i) => {
        const factor = CLOUD_PARALLAX_FACTOR[i] ?? 1;
        tl.fromTo(
          `.cloud-${i}`,
          { opacity: 0 },
          { opacity: 1, duration: 4, ease: "power1.out" },
          cloud.startAt,
        );
        // Near clouds (higher factor) drift farther/faster; far clouds (lower factor) drift less
        tl.fromTo(
          `.cloud-${i}`,
          { x: 0 },
          { x: cloud.drift * factor, duration: cloud.speed / factor, ease: "none" },
          cloud.startAt,
        );
      });

      // ── Continuous cruise clouds (start showing from 60 to the end) ──
      for (let c = 0; c < 6; c++) {
        tl.to(`.cruise-cloud-${c}`, { autoAlpha: 1, duration: 4 }, 60);
        tl.to(`.cruise-cloud-${c}-loop2`, { autoAlpha: 1, duration: 4 }, 60);

        // Spanning from 60 to 220 (duration 160) so they don't stop mid-scroll
        tl.fromTo(
          `.cruise-cloud-${c}`,
          { xPercent: 150 },
          { xPercent: -500, duration: 160, ease: "none" },
          60,
        );
        tl.fromTo(
          `.cruise-cloud-${c}-loop2`,
          { xPercent: 450 },
          { xPercent: -200, duration: 160, ease: "none" },
          60,
        );
      }

      // ═══════════════════════════════════════════════════════════════════════
      // ── Phase 4a: RAINY SEASON — DJS clubs (60 → 120) ─────────────────────
      // ═══════════════════════════════════════════════════════════════════════
      tl.addLabel("rainy", 60);

      // Sky → stormy dark blue-gray
      tl.to(
        skyRef.current,
        {
          "--sky-top": SEASON_SKY.rainy.top,
          "--sky-mid": SEASON_SKY.rainy.mid,
          "--sky-bot": SEASON_SKY.rainy.bot,
          duration: 10,
          ease: "power1.inOut",
        },
        60,
      );

      // Dim stars — stormy sky
      tl.to(".stars-layer", { opacity: 0.05, duration: 8 }, 60);

      // Rain streaks appear
      tl.to(".rain-layer", { opacity: 1, duration: 6 }, 62);

      // Season label fades in: Rainy (rainy badge is already display:flex by default)
      tl.fromTo(".season-label", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 6 }, 61);

      // Card 0: DJS Code AI (rainy)
      tl.fromTo(
        ".cable-0",
        { scaleY: 0 },
        { scaleY: 1, duration: 8, ease: "power1.out", transformOrigin: "top" },
        CARD_TIMING[0][0],
      );
      tl.fromTo(
        ".card-group-0",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, pointerEvents: "auto", duration: 10, ease: "power2.out" },
        CARD_TIMING[0][1],
      );
      tl.to(".cable-0", { scaleY: 0, duration: 4, ease: "power3.in", transformOrigin: "top" }, 74);
      tl.to(
        ".card-group-0",
        { y: "120vh", opacity: 0, pointerEvents: "none", duration: 8, ease: "power2.in" },
        75,
      );

      // Card 1: DJS S4DS (rainy)
      tl.fromTo(
        ".cable-1",
        { scaleY: 0 },
        { scaleY: 1, duration: 8, ease: "power1.out", transformOrigin: "top" },
        CARD_TIMING[1][0],
      );
      tl.fromTo(
        ".card-group-1",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, pointerEvents: "auto", duration: 10, ease: "power2.out" },
        CARD_TIMING[1][1],
      );
      tl.to(".cable-1", { scaleY: 0, duration: 4, ease: "power3.in", transformOrigin: "top" }, 96);
      tl.to(
        ".card-group-1",
        { y: "120vh", opacity: 0, pointerEvents: "none", duration: 8, ease: "power2.in" },
        97,
      );

      // Card 2: DJS SIGAI (rainy)
      tl.fromTo(
        ".cable-2",
        { scaleY: 0 },
        { scaleY: 1, duration: 8, ease: "power1.out", transformOrigin: "top" },
        CARD_TIMING[2][0],
      );
      tl.fromTo(
        ".card-group-2",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, pointerEvents: "auto", duration: 10, ease: "power2.out" },
        CARD_TIMING[2][1],
      );
      tl.to(".cable-2", { scaleY: 0, duration: 4, ease: "power3.in", transformOrigin: "top" }, 118);
      tl.to(
        ".card-group-2",
        { y: "120vh", opacity: 0, pointerEvents: "none", duration: 8, ease: "power2.in" },
        119,
      );

      // ═══════════════════════════════════════════════════════════════════════
      // ── Phase 4b: WINTER — COGNIFYZ (130 → 160) ───────────────────────────
      // ═══════════════════════════════════════════════════════════════════════
      tl.addLabel("winter", 130);

      // Rain fades out
      tl.to(".rain-layer", { opacity: 0, duration: 8 }, 128);

      // Sky → icy blue-white
      tl.to(
        skyRef.current,
        {
          "--sky-top": SEASON_SKY.winter.top,
          "--sky-mid": SEASON_SKY.winter.mid,
          "--sky-bot": SEASON_SKY.winter.bot,
          duration: 10,
          ease: "power1.inOut",
        },
        128,
      );

      // Season label transition → Winter badge
      tl.to(".season-label", { opacity: 0, y: -8, duration: 4 }, 127);
      // Switch badge to winter (use GSAP set for instant display property changes)
      tl.call(
        () => {
          const rainyBadge = document.querySelector(".season-badge-rainy") as HTMLElement | null;
          const winterBadge = document.querySelector(".season-badge-winter") as HTMLElement | null;
          if (rainyBadge) rainyBadge.style.display = "none";
          if (winterBadge) winterBadge.style.display = "flex";
        },
        [],
        129,
      );
      tl.fromTo(".season-label", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 6 }, 131);

      // Snow particles appear
      tl.to(".snow-layer", { opacity: 1, duration: 8 }, 130);

      // Stars faint shimmer through the cold sky
      tl.to(".stars-layer", { opacity: 0.15, duration: 8 }, 130);

      // Card 3: COGNIFYZ (winter)
      tl.fromTo(
        ".cable-3",
        { scaleY: 0 },
        { scaleY: 1, duration: 8, ease: "power1.out", transformOrigin: "top" },
        CARD_TIMING[3][0],
      );
      tl.fromTo(
        ".card-group-3",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, pointerEvents: "auto", duration: 12, ease: "power2.out" },
        CARD_TIMING[3][1],
      );

      // Drop Cognifyz card at 152
      tl.to(".cable-3", { scaleY: 0, duration: 5, ease: "power3.in", transformOrigin: "top" }, 152);
      tl.to(
        ".card-group-3",
        { y: "120vh", opacity: 0, pointerEvents: "none", duration: 12, ease: "power2.in" },
        154,
      );

      // ═══════════════════════════════════════════════════════════════════════
      // ── Phase 4c: SUMMER — Hooman Labs + IIT Patna (155 → 200) ───────────
      // ═══════════════════════════════════════════════════════════════════════
      tl.addLabel("summer", 155);

      // Snow fades out
      tl.to(".snow-layer", { opacity: 0, duration: 8 }, 152);

      // Birds fade in
      tl.to(".birds-layer", { opacity: 1, duration: 8 }, 155);

      // Sky → warm golden-blue (summer)
      tl.to(
        skyRef.current,
        {
          "--sky-top": SEASON_SKY.summer.top,
          "--sky-mid": SEASON_SKY.summer.mid,
          "--sky-bot": SEASON_SKY.summer.bot,
          duration: 10,
          ease: "power1.inOut",
        },
        153,
      );

      // Season label transition → Summer badge
      tl.to(".season-label", { opacity: 0, y: -8, duration: 4 }, 152);
      // Switch badge to summer
      tl.call(
        () => {
          const winterBadge = document.querySelector(".season-badge-winter") as HTMLElement | null;
          const summerBadge = document.querySelector(".season-badge-summer") as HTMLElement | null;
          if (winterBadge) winterBadge.style.display = "none";
          if (summerBadge) summerBadge.style.display = "flex";
        },
        [],
        154,
      );
      tl.fromTo(".season-label", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 6 }, 156);

      // Stars settle to light cruise level
      tl.to(".stars-layer", { opacity: 0.3, duration: 8 }, 155);

      // Sunrise Glow element rises from the bottom horizon
      tl.fromTo(
        ".sunrise-glow",
        { y: 350, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 0.75, scale: 1, duration: 18, ease: "power2.out" },
        155,
      );

      // Sun sphere pops and rises from behind the horizon
      tl.fromTo(
        ".sun-sphere",
        { y: 400, x: 0, scale: 0.8, opacity: 0 },
        { y: 0, x: 0, scale: 1, opacity: 1, duration: 14, ease: "power2.out" },
        155,
      );

      // Card 4: Hooman Labs (summer)
      tl.fromTo(
        ".cable-4",
        { scaleY: 0 },
        { scaleY: 1, duration: 8, ease: "power1.out", transformOrigin: "top" },
        CARD_TIMING[4][0],
      );
      tl.fromTo(
        ".card-group-4",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, pointerEvents: "auto", duration: 12, ease: "power2.out" },
        CARD_TIMING[4][1],
      );
      tl.to(".cable-4", { scaleY: 0, duration: 4, ease: "power3.in", transformOrigin: "top" }, 167);
      tl.to(
        ".card-group-4",
        { y: "120vh", opacity: 0, pointerEvents: "none", duration: 8, ease: "power2.in" },
        168,
      );

      // Card 5: IIT Patna (summer)
      tl.fromTo(
        ".cable-5",
        { scaleY: 0 },
        { scaleY: 1, duration: 8, ease: "power1.out", transformOrigin: "top" },
        CARD_TIMING[5][0],
      );
      tl.fromTo(
        ".card-group-5",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, pointerEvents: "auto", duration: 12, ease: "power2.out" },
        CARD_TIMING[5][1],
      );
      tl.to(".cable-5", { scaleY: 0, duration: 4, ease: "power3.in", transformOrigin: "top" }, 190);
      tl.to(
        ".card-group-5",
        { y: "120vh", opacity: 0, pointerEvents: "none", duration: 8, ease: "power2.in" },
        191,
      );

      // ── Phase 5: Final Handoff / Drop (200 → 220) ─────────────────────────
      tl.addLabel("drop", 200);
      tl.to(".season-label", { opacity: 0, duration: 4 }, 198);
    },
    { scope: sectionRef },
  );

  // Season label text based on scroll — use ref to update via GSAP onUpdate
  const seasonLabelRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} className="takeoff-section" style={{ position: "relative" }}>
      {/* ── Audio Element ── */}
      <audio ref={audioRef} src="/airplane-lift-off.mp3" preload="auto" />

      <div
        className="takeoff-viewport"
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* ── Draggable Experience Banner ── */}
        <DraggableBanner />

        {/* ── Sky background ── */}
        <div
          ref={skyRef}
          className="sky-bg"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, var(--sky-top, #050508) 0%, var(--sky-mid, #08080c) 50%, var(--sky-bot, #0a0a0f) 100%)",
          }}
        />

        {/* ── Stars layer (visible immediately with subtle 0.3 opacity on start) ── */}
        <div
          className="stars-layer"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            opacity: 0.3,
            pointerEvents: "none",
          }}
        >
          {Array.from({ length: 45 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${(i * 37 + 11) % 65}%`,
                left: `${(i * 71 + 17) % 100}%`,
                width: (i % 3) + 1,
                height: (i % 3) + 1,
                borderRadius: "50%",
                background: "#fff",
                opacity: 0.15 + (i % 5) * 0.15,
              }}
            />
          ))}
        </div>

        {/* ── Rain layer (rainy season — DJS clubs) ── */}
        <div
          className="rain-layer"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            opacity: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${((i * 31) % 110) - 10}%`,
                left: `${((i * 47 + 3) % 110) - 5}%`,
                width: 1,
                height: 14 + (i % 8) * 2,
                background: `rgba(150,200,255,${0.08 + (i % 5) * 0.04})`,
                transform: "rotate(12deg)",
                animation: `rain-fall ${0.6 + (i % 4) * 0.15}s linear infinite`,
                animationDelay: `${(i * 0.08) % 0.8}s`,
              }}
            />
          ))}
        </div>

        {/* ── Snow layer (winter — Cognifyz) ── */}
        <div
          className="snow-layer"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            opacity: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${((i * 43) % 110) - 10}%`,
                left: `${(i * 61 + 7) % 100}%`,
                width: 3 + (i % 4),
                height: 3 + (i % 4),
                borderRadius: "50%",
                background: `rgba(200,230,255,${0.15 + (i % 4) * 0.08})`,
                animation: `snow-fall ${2 + (i % 6) * 0.5}s ease-in infinite`,
                animationDelay: `${(i * 0.12) % 2}s`,
              }}
            />
          ))}
        </div>

        {/* ── Birds layer (summer — Hooman/IIT Patna) ── */}
        <div
          className="birds-layer"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            opacity: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${10 + ((i * 13) % 45)}%`,
                left: `${110 + ((i * 17) % 70)}%`,
                width: 10 + (i % 4) * 3,
                height: 10 + (i % 4) * 3,
                color: `rgba(20, 30, 50, ${0.3 + (i % 4) * 0.15})`, // slightly lighter silhouettes in morning
                animation: `bird-fly ${10 + (i % 6) * 3}s linear infinite`,
                animationDelay: `${i * 0.6}s`,
              }}
            >
              <BirdSVG />
            </div>
          ))}
        </div>

        {/* ── Season label ── */}
        <div
          ref={seasonLabelRef}
          className="season-label"
          style={{
            position: "absolute",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            opacity: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <SeasonBadge />
        </div>

        {/* ── Scenery layer (parallax hills, grounding at the horizon line) ── */}
        <div
          className="scenery-layer"
          style={{
            position: "absolute",
            top: "calc(32% + 5px)",
            left: 0,
            right: 0,
            height: 115,
            zIndex: 1,
            opacity: 0.85,
          }}
        >
          <AirportHillsScenerySVG />
        </div>

        {/* ── Glowing Moon (placed in upper-right sky as a realistic light source) ── */}
        <div
          className="airport-moon"
          style={{
            position: "absolute",
            top: "8%",
            right: "12%",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(245,240,220,0.9) 30%, rgba(245,240,220,0.2) 65%, transparent 100%)",
            boxShadow: "0 0 30px rgba(245,240,220,0.4)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* ── Airport Scene Layer (background: sits behind runway, above horizon) ── */}
        <div
          className="airport-scene"
          style={{
            position: "absolute",
            /* Anchor to the horizon line — push it just above the runway */
            top: "calc(32% - 60px)",
            left: 0,
            right: 0,
            height: 180,
            zIndex: 2,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <AirportSceneSVG />
        </div>

        {/* ── Ground / horizon line ── */}
        <div
          className="ground-line"
          style={{
            position: "absolute",
            top: "calc(32% + 120px)",
            left: 0,
            right: 0,
            height: 1,
            background: "rgba(255,255,255,0.06)",
            zIndex: 2,
          }}
        />

        {/* ── Runway layer (lowered to calc(32% + 120px) to ground the wingtips/engines) ── */}
        <div
          className="runway-layer"
          style={{
            position: "absolute",
            top: "calc(32% + 120px)",
            left: "-10%",
            width: "200%",
            height: 60,
            zIndex: 3,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, #121214 0%, #17171a 100%)",
              borderTop: "1.5px solid #202024",
              borderBottom: "1.5px solid #202024",
            }}
          />
          {/* Dashed center line */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: 3,
              transform: "translateY(-50%)",
              background:
                "repeating-linear-gradient(to right, rgba(255,255,255,0.75) 0px, rgba(255,255,255,0.75) 30px, transparent 30px, transparent 65px)",
            }}
          />
          {/* Edge markings */}
          <div
            style={{
              position: "absolute",
              top: 4,
              left: 0,
              right: 0,
              height: 1.5,
              background:
                "repeating-linear-gradient(to right, rgba(255,190,0,0.55) 0px, rgba(255,190,0,0.55) 20px, transparent 20px, transparent 50px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 4,
              left: 0,
              right: 0,
              height: 1.5,
              background:
                "repeating-linear-gradient(to right, rgba(255,190,0,0.55) 0px, rgba(255,190,0,0.55) 20px, transparent 20px, transparent 50px)",
            }}
          />

          {/* Runway Edge Lighting (amber/white lights blinking along the edges) */}
          <div
            style={{
              position: "absolute",
              top: -3,
              left: 0,
              right: 0,
              height: 6,
              background:
                "repeating-linear-gradient(to right, #ffcc44 0px, #ffcc44 4px, transparent 4px, transparent 80px)",
              filter: "drop-shadow(0 0 3px #ffaa00)",
              opacity: 0.85,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -3,
              left: 0,
              right: 0,
              height: 6,
              background:
                "repeating-linear-gradient(to right, #ffffff 0px, #ffffff 4px, transparent 4px, transparent 80px)",
              filter: "drop-shadow(0 0 3px #ffffff)",
              opacity: 0.75,
            }}
          />
        </div>

        {/* ── Clouds layer ── */}
        <div style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}>
          {CLOUD_DATA.map((cloud, i) => (
            <div
              key={i}
              className={`cloud-${i}`}
              style={{
                position: "absolute",
                top: cloud.top,
                left: "110%",
                width: cloud.size,
                height: cloud.size * 0.42,
                color: `rgba(255,255,255,${cloud.opacity})`,
                opacity: 0,
              }}
            >
              <CloudShape />
            </div>
          ))}

          {/* Continuous Cruise Clouds (6 items, duplicated for seamless looping) */}
          {Array.from({ length: 6 }).map((_, c) => {
            const topPositions = ["12%", "28%", "42%", "58%", "72%", "84%"];
            const sizes = [200, 260, 320, 180, 290, 220];
            const opacities = [0.18, 0.15, 0.22, 0.14, 0.19, 0.16]; // Increased opacity so they are clearly visible
            return (
              <div key={c} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <div
                  className={`cruise-cloud-${c}`}
                  style={{
                    position: "absolute",
                    top: topPositions[c],
                    left: 0,
                    width: sizes[c],
                    height: sizes[c] * 0.42,
                    color: `rgba(255,255,255,${opacities[c]})`,
                    opacity: 0,
                    visibility: "hidden", // Hide by default on start screen
                  }}
                >
                  <CloudShape />
                </div>
                <div
                  className={`cruise-cloud-${c}-loop2`}
                  style={{
                    position: "absolute",
                    top: topPositions[c],
                    left: 0,
                    width: sizes[c],
                    height: sizes[c] * 0.42,
                    color: `rgba(255,255,255,${opacities[c]})`,
                    opacity: 0,
                    visibility: "hidden", // Hide by default on start screen
                  }}
                >
                  <CloudShape />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Sunrise Glow (Summer phase only) ── */}
        <div
          className="sunrise-glow"
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "120%",
            height: "40%",
            background:
              "radial-gradient(ellipse at bottom, rgba(245,158,11,0.2) 0%, rgba(239,68,68,0.08) 50%, transparent 100%)",
            filter: "blur(30px)",
            zIndex: 1,
            opacity: 0,
            pointerEvents: "none",
          }}
        />

        {/* ── Sun Sphere (Right Top, popping up in Summer phase) ── */}
        <div
          className="sun-sphere"
          style={{
            position: "absolute",
            top: "8%",
            right: "8%",
            width: 90,
            height: 90,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #fffdf0 0%, #ffde6a 40%, #f59e0b 80%, rgba(245,158,11,0) 100%)",
            boxShadow: "0 0 40px rgba(245,158,11,0.6), 0 0 90px rgba(245,158,11,0.3)",
            zIndex: 0,
            opacity: 0,
            pointerEvents: "none",
          }}
        />

        {/* ── Airplane (stays centered) ── */}
        <div
          className="plane-wrapper"
          style={{
            position: "absolute",
            top: "32%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 320,
            zIndex: 10,
          }}
        >
          {/* Bob wrapper — gentle up/down float */}
          <div className="plane-bob">
            {/* Tilt wrapper — subtle left/right roll */}
            <div className="plane-tilt">
              {/* Vibration wrapper — tiny engine shake */}
              <div className="plane-vibrate">
                <AirplaneSVG />
              </div>
            </div>
          </div>
        </div>

        {/* ── Hanging experience cards ── */}
        {/* Because position is absolute, cards sit centered on top of each other. 
            GSAP controls opacity and pointer-events so that ONLY ONE card is active/visible/interactable at any given moment. */}
        <div
          className="cards-layer"
          style={{
            position: "absolute",
            top: "46%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 420,
            height: 480,
            zIndex: 10,
          }}
        >
          {omkar.experience.map((exp, i) => (
            <div
              key={exp.company}
              className={`card-group-${i}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                opacity: 0,
                pointerEvents: "none", // Critical: prevent overlapping invisible cards from blocking clicks
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <DraggableCard
                exp={exp}
                index={i}
                isExpanded={expandedCard === i}
                onToggle={() => setExpandedCard(expandedCard === i ? null : i)}
              />
            </div>
          ))}
        </div>

        {/* ── HUD Gauges ── */}
        <FlightGauge label="Altitude" unit="FT" classNamePrefix="alt" position="left" />
        <FlightGauge label="Airspeed" unit="KTS" classNamePrefix="speed" position="right" />

        {/* ── Scroll cue indicator (Bottom Center) ── */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            pointerEvents: "none",
            color: "#a0a0a8",
            animation: "scroll-cue-bounce 2s infinite ease-in-out",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontFamily: "'Geist Mono', monospace",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Scroll to departure
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Fallback Layout (mobile + reduced-motion)
// ═══════════════════════════════════════════════════════════════════════════════

function FallbackLayout({
  expandedCard,
  setExpandedCard,
}: {
  expandedCard: number | null;
  setExpandedCard: (i: number | null) => void;
}) {
  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Static airplane illustration */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "48px 24px 32px",
          opacity: 0.5,
        }}
      >
        <div style={{ width: 260 }}>
          <AirplaneSVG />
        </div>
      </div>

      {/* ── Primary Cards (Hooman Labs, IIT Patna) ── */}
      <div style={{ padding: "0 24px", maxWidth: 700, margin: "0 auto 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {[omkar.experience[4], omkar.experience[5]].map((exp, i) => (
            <StaticExperienceCard
              key={exp.company}
              exp={exp}
              index={4 + i}
              isExpanded={expandedCard === 4 + i}
              onToggle={() => setExpandedCard(expandedCard === 4 + i ? null : 4 + i)}
              tier="primary"
              staggerIndex={i}
            />
          ))}
        </div>
      </div>

      {/* ── Secondary Cards (DJS clubs + COGNIFYZ) ── */}
      <div style={{ padding: "0 24px", maxWidth: 700, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 2,
              height: 16,
              borderRadius: 2,
              background: "linear-gradient(180deg, #888 0%, #333 100%)",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "#666",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontFamily: "'Geist Mono', monospace",
              fontWeight: 500,
            }}
          >
            Other Involvement
          </span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: "linear-gradient(to right, rgba(255,255,255,0.06), transparent)",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[omkar.experience[0], omkar.experience[1], omkar.experience[2], omkar.experience[3]].map(
            (exp, i) => (
              <StaticExperienceCard
                key={exp.company}
                exp={exp}
                index={i}
                isExpanded={expandedCard === i}
                onToggle={() => setExpandedCard(expandedCard === i ? null : i)}
                tier="secondary"
                staggerIndex={i + 2}
              />
            ),
          )}
        </div>
      </div>

      {/* Lessons — simplified (no GSAP scroll animation for fallback) */}
      <div
        style={{
          padding: "32px 24px 0",
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: "#505058",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 16,
            fontFamily: "'Geist Mono', monospace",
          }}
        >
          Lessons
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {insights.map((quote, qi) => (
            <div
              key={qi}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "0.5px solid rgba(255,255,255,0.06)",
                borderLeft: "3px solid #4f8ef7",
                borderRadius: 14,
                padding: "16px 16px 16px 14px",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: "#a0a0a8",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                {quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════════════════════════════════════

function ExperiencePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches);

    window.addEventListener("resize", checkMobile);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener("change", motionHandler);

    return () => {
      window.removeEventListener("resize", checkMobile);
      mql.removeEventListener("change", motionHandler);
    };
  }, []);

  // ── Fallback paths ──
  if (isMobile || prefersReducedMotion) {
    return (
      <PageShell path="/experience">
        <FallbackLayout expandedCard={expandedCard} setExpandedCard={setExpandedCard} />
      </PageShell>
    );
  }

  // ── Full takeoff sequence ──
  return (
    <PageShell path="/experience">
      <TakeoffSequence expandedCard={expandedCard} setExpandedCard={setExpandedCard} />

      {/* ── Gradient Blend Zone ── */}
      <div
        style={{
          height: 180,
          background:
            "linear-gradient(180deg, #fceabb 0%, #c9a87e 25%, #5a4333 50%, #1a1512 75%, #080809 100%)",
        }}
      />

      {/* ── Primary Cards (Hooman Labs, IIT Patna) ── */}
      <div style={{ padding: "20px 32px 0", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {[omkar.experience[4], omkar.experience[5]].map((exp, i) => (
            <StaticExperienceCard
              key={exp.company}
              exp={exp}
              index={4 + i}
              isExpanded={expandedCard === 4 + i}
              onToggle={() => setExpandedCard(expandedCard === 4 + i ? null : 4 + i)}
              tier="primary"
              staggerIndex={i}
            />
          ))}
        </div>
      </div>

      {/* ── Secondary Cards (DJS clubs + COGNIFYZ) ── */}
      <div style={{ padding: "48px 32px 40px", maxWidth: 1000, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 3,
              height: 20,
              borderRadius: 2,
              background: "linear-gradient(180deg, #888 0%, #333 100%)",
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: "#666",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontFamily: "'Geist Mono', monospace",
              fontWeight: 500,
            }}
          >
            Other Involvement
          </span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: "linear-gradient(to right, rgba(255,255,255,0.06), transparent)",
            }}
          />
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
          }}
        >
          {[omkar.experience[0], omkar.experience[1], omkar.experience[2], omkar.experience[3]].map(
            (exp, i) => (
              <StaticExperienceCard
                key={exp.company}
                exp={exp}
                index={i}
                isExpanded={expandedCard === i}
                onToggle={() => setExpandedCard(expandedCard === i ? null : i)}
                tier="secondary"
                staggerIndex={i + 2}
              />
            ),
          )}
        </div>
      </div>

      <LessonsSection />
    </PageShell>
  );
}
