import { createFileRoute } from '@tanstack/react-router';
import { PageShell } from '@/components/layout/PageShell';
import { omkar } from '@/lib/data';
import { useEffect, useRef, useState, useId } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute('/experience')({ component: ExperiencePage });

// ═══════════════════════════════════════════════════════════════════════════════
// SVG Assets — Flat-style inline illustrations
// ═══════════════════════════════════════════════════════════════════════════════

function AirplaneSVG({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      viewBox="0 0 500 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: '100%', height: '100%', ...style }}
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
      <path
        d="M230 128 L130 188 L155 188 L310 132Z"
        fill="#B0B5BF"
      />
      {/* Wing highlight */}
      <path
        d="M240 128 L200 148 L310 132Z"
        fill="#C8CDD6"
        opacity="0.5"
      />

      {/* Vertical tail fin */}
      <path
        d="M78 48 L50 8 L68 8 L102 48Z"
        fill="#B0B5BF"
      />
      {/* Tail fin accent */}
      <path
        d="M60 28 L68 8 L74 8 L66 28Z"
        fill="#4F8EF7"
        opacity="0.6"
      />

      {/* Horizontal stabilizer */}
      <path
        d="M70 125 L32 152 L50 152 L100 130Z"
        fill="#B0B5BF"
      />

      {/* Engine pod (under wing) */}
      <ellipse cx="240" cy="152" rx="30" ry="13" fill="#9DA2AB" />
      <ellipse cx="240" cy="152" rx="26" ry="10" fill="#8A8F98" />
      <ellipse cx="268" cy="152" rx="4" ry="9" fill="#6B7080" />

      {/* Blue accent stripe along fuselage */}
      <rect x="60" y="90" width="406" height="5" rx="2.5" fill="#4F8EF7" />

      {/* Door outline */}
      <rect x="408" y="62" width="10" height="26" rx="3" fill="none" stroke="#A8ADB8" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

function CloudShape({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  const id = useId().replace(/:/g, '');
  const filterId = `cloud-blur-${id}`;
  const gradId = `cloud-grad-${id}`;

  return (
    <svg
      className={className}
      viewBox="0 0 280 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: '100%', height: '100%', overflow: 'visible', ...style }}
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
        <ellipse cx="105" cy="55" rx="60" ry="35" fill={`url(#${gradId})`} opacity="0.8" transform="rotate(-4 105 55)" />
        <ellipse cx="185" cy="60" rx="55" ry="32" fill={`url(#${gradId})`} opacity="0.85" transform="rotate(3 185 60)" />
        
        {/* Outer/Edge ellipses (dimmer, more irregular) */}
        <ellipse cx="60" cy="75" rx="45" ry="22" fill={`url(#${gradId})`} opacity="0.4" transform="rotate(-8 60 75)" />
        <ellipse cx="225" cy="70" rx="40" ry="20" fill={`url(#${gradId})`} opacity="0.35" transform="rotate(6 225 70)" />
        <ellipse cx="150" cy="40" rx="35" ry="22" fill={`url(#${gradId})`} opacity="0.5" />
        <ellipse cx="90" cy="85" rx="40" ry="18" fill={`url(#${gradId})`} opacity="0.3" transform="rotate(-2 90 85)" />
        <ellipse cx="190" cy="80" rx="35" ry="16" fill={`url(#${gradId})`} opacity="0.25" transform="rotate(4 190 80)" />
      </g>
    </svg>
  );
}

function CityScenerySVG({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1000 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ width: '100%', height: '100%', ...style }}
    >
      {/* Background buildings */}
      <path d="M0,200 L0,120 L40,120 L40,80 L80,80 L80,140 L120,140 L120,60 L180,60 L180,110 L220,110 L220,40 L280,40 L280,130 L320,130 L320,90 L360,90 L360,150 L420,150 L420,70 L480,70 L480,120 L540,120 L540,50 L600,50 L600,140 L660,140 L660,80 L720,80 L720,110 L780,110 L780,30 L840,30 L840,130 L900,130 L900,60 L960,60 L960,150 L1000,150 L1000,200 Z" fill="#0b1324" />
      {/* Foreground buildings */}
      <path d="M0,200 L0,150 L30,150 L30,110 L70,110 L70,160 L100,160 L100,90 L150,90 L150,140 L190,140 L190,70 L250,70 L250,150 L290,150 L290,110 L340,110 L340,170 L390,170 L390,100 L440,100 L440,140 L490,140 L490,80 L550,80 L550,160 L610,160 L610,100 L650,100 L650,130 L700,130 L700,60 L760,60 L760,150 L810,150 L810,90 L870,90 L870,160 L930,160 L930,110 L980,110 L980,200 Z" fill="#131d33" opacity="0.9"/>
    </svg>
  );
}

// Cloud layout data: parallax layers of 10 clouds
const CLOUD_DATA = [
  { top: '8%',  size: 320, opacity: 0.12, speed: 16, startAt: 34, drift: -2200 }, // Big, close
  { top: '25%', size: 180, opacity: 0.06, speed: 24, startAt: 37, drift: -1400 },
  { top: '55%', size: 400, opacity: 0.14, speed: 12, startAt: 39, drift: -2600 }, // Very big, close
  { top: '38%', size: 240, opacity: 0.08, speed: 20, startAt: 41, drift: -1700 },
  { top: '68%', size: 140, opacity: 0.05, speed: 28, startAt: 38, drift: -1200 },
  { top: '15%', size: 200, opacity: 0.07, speed: 22, startAt: 43, drift: -1500 },
  { top: '48%', size: 280, opacity: 0.09, speed: 18, startAt: 40, drift: -1900 },
  { top: '75%', size: 100, opacity: 0.03, speed: 34, startAt: 36, drift: -1000 }, // Small, far
  // Sparse cruise-phase clouds
  { top: '12%', size: 260, opacity: 0.05, speed: 22, startAt: 55, drift: -1600 },
  { top: '82%', size: 120, opacity: 0.02, speed: 40, startAt: 62, drift: -1100 },
];

// ── Season configuration per experience card (index matches omkar.experience) ──
// 0-2: DJS clubs → Rainy (stormy blue-gray)
// 3: Cognifyz → Winter (ice blue-white)
// 4-5: Hooman Labs + IIT Patna → Summer (warm golden blue)
const SEASON_SKY = {
  rainy: {
    top: '#0d1a2e', mid: '#111d30', bot: '#0a1220',
    label: 'Rainy Season',
    labelColor: '#7ba7d4',
  },
  winter: {
    top: '#0e1e38', mid: '#152845', bot: '#0d1a2e',
    label: 'Winter',
    labelColor: '#a8c4e0',
  },
  summer: {
    top: '#0f2444', mid: '#0a1c38', bot: '#080c18',
    label: 'Summer',
    labelColor: '#f4c26b',
  },
} as const;

// Card reveal timing: [cableStart, cardStart] per experience index
const CARD_TIMING = [
  [62, 65],   // DJS Code AI  (rainy)
  [84, 87],   // DJS S4DS     (rainy)
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
    'Paper Input',
    'Keyword Extraction',
    'Argument Mining',
    'Citation Gap Detection',
    'Report Output',
  ];
  const boxW = 170;
  const boxH = 26;
  const svgW = 190;
  const gap = 14;
  const startY = 10;
  const totalH = stages.length * boxH + (stages.length - 1) * gap + 20;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
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
                    x1={svgW / 2} y1={arrowY}
                    x2={svgW / 2} y2={arrowMidY + gap / 2 - 4}
                    stroke="rgba(62,207,142,0.6)" strokeWidth="1.5"
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
      {['CRM Systems', 'Voice Agent', 'Enterprise Clients'].map((label, li) => (
        <div key={li} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              background: 'rgba(79,142,247,0.06)',
              border: '0.5px solid rgba(79,142,247,0.15)',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 12,
              color: '#4f8ef7',
              fontFamily: "'Geist Mono', monospace",
            }}
          >
            {label}
          </span>
          {li < 2 && (
            <span style={{ color: '#505058', fontSize: 13 }}>→</span>
          )}
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
}: {
  exp: (typeof omkar.experience)[0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="exp-hanging-card"
      role="article"
      aria-label={`${exp.company} — ${exp.role}`}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      style={{ cursor: 'pointer' }}
    >
      {/* Header: badge + company */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        {exp.company === 'Hooman Labs' || exp.company === 'IIT Patna' ? (
          <img
            src={exp.company === 'Hooman Labs' ? '/hooman_labs.jpg' : '/IIT Patna.png'}
            alt=""
            style={{
              width: 28, height: 28, borderRadius: 6, objectFit: 'cover',
              border: `1px solid ${exp.accent}33`,
              background: '#0a0a0a',
            }}
          />
        ) : (
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: `${exp.accent}18`,
            border: `1px solid ${exp.accent}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600, color: exp.accent,
            fontFamily: "'Geist Mono', monospace",
            flexShrink: 0,
          }}>
            {exp.company.slice(0, 2).toUpperCase()}
          </div>
        )}
        <span style={{
          fontSize: 18, fontWeight: 500, color: exp.accent,
          fontFamily: "'Geist', sans-serif",
        }}>
          {exp.company}
        </span>
      </div>

      {/* Role */}
      <div style={{
        fontSize: 13, fontFamily: "'Geist Mono', monospace",
        color: '#505058', marginBottom: 6,
      }}>
        {exp.role}
      </div>

      {/* Date range pill */}
      <span style={{
        display: 'inline-block',
        background: `${exp.accent}14`,
        border: `0.5px solid ${exp.accent}33`,
        borderRadius: 4, padding: '2px 8px', fontSize: 11,
        color: exp.accent, fontFamily: "'Geist Mono', monospace",
      }}>
        {exp.period}
      </span>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '14px 0' }} />

      {/* WHAT I BUILT */}
      <p style={{
        fontSize: 10, color: '#505058', textTransform: 'uppercase',
        letterSpacing: '0.08em', marginBottom: 10,
        fontFamily: "'Geist Mono', monospace", margin: '0 0 10px',
      }}>
        What I Built
      </p>

      {/* Bullets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {exp.highlights.map((h, hi) => (
          <div key={hi} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{
              width: 3, height: 3, background: exp.accent,
              borderRadius: 1, flexShrink: 0, marginTop: 7,
            }} />
            <span style={{ fontSize: 13, color: '#a0a0a8', lineHeight: 1.55 }}>{h}</span>
          </div>
        ))}
      </div>

      {/* Tech tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {exp.tech.map((t, ti) => (
          <span key={ti} style={{
            fontSize: 10, fontFamily: "'Geist Mono', monospace",
            color: '#505058', background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(255,255,255,0.08)',
            borderRadius: 4, padding: '2px 6px',
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* Expand toggle */}
      <div style={{
        marginTop: 14, fontSize: 10, color: exp.accent,
        fontFamily: "'Geist Mono', monospace",
        display: 'flex', alignItems: 'center', gap: 5,
        opacity: 0.7,
      }}>
        <span style={{
          display: 'inline-block',
          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s ease',
          fontSize: 8,
        }}>▶</span>
        <span>{isExpanded ? 'Hide details' : 'View details'}</span>
      </div>

      {/* Expandable detail panel */}
      <div
        style={{
          maxHeight: isExpanded ? 320 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{
          paddingTop: 14,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          marginTop: 14,
        }}>
          <p style={{
            fontSize: 10, color: '#505058', textTransform: 'uppercase',
            letterSpacing: '0.08em', marginBottom: 8,
            fontFamily: "'Geist Mono', monospace", margin: '0 0 8px',
          }}>
            Architecture
          </p>
          {index === 4 && <ImpactFlowDiagram />}
          {index === 5 && <AgentPipelineSVG />}
        </div>
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
}: {
  exp: (typeof omkar.experience)[0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="exp-static-card"
      role="article"
      aria-label={`${exp.company} — ${exp.role}`}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      style={{
        cursor: 'pointer',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 28,
        marginBottom: 20,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        {exp.company === 'Hooman Labs' || exp.company === 'IIT Patna' ? (
          <img
            src={exp.company === 'Hooman Labs' ? '/hooman_labs.jpg' : '/IIT Patna.png'}
            alt="" aria-hidden="true"
            style={{
              width: 32, height: 32, borderRadius: 8, objectFit: 'cover',
              border: `1px solid ${exp.accent}33`, background: '#0a0a0a',
            }}
          />
        ) : (
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `${exp.accent}18`,
            border: `1px solid ${exp.accent}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 600, color: exp.accent,
            fontFamily: "'Geist Mono', monospace",
            flexShrink: 0,
          }}>
            {exp.company.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <div style={{ fontSize: 20, fontWeight: 500, color: exp.accent, fontFamily: "'Geist', sans-serif" }}>
            {exp.company}
          </div>
          <div style={{ fontSize: 13, fontFamily: "'Geist Mono', monospace", color: '#505058' }}>
            {exp.role}
          </div>
        </div>
      </div>

      {/* Date pill */}
      <span style={{
        display: 'inline-block', background: `${exp.accent}14`,
        border: `0.5px solid ${exp.accent}33`, borderRadius: 4,
        padding: '2px 8px', fontSize: 11, color: exp.accent,
        fontFamily: "'Geist Mono', monospace",
      }}>
        {exp.period}
      </span>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '18px 0' }} />

      <p style={{
        fontSize: 10, color: '#505058', textTransform: 'uppercase',
        letterSpacing: '0.08em', marginBottom: 12,
        fontFamily: "'Geist Mono', monospace", margin: '0 0 12px',
      }}>
        What I Built
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {exp.highlights.map((h, hi) => (
          <div key={hi} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{
              width: 3, height: 3, background: exp.accent,
              borderRadius: 1, flexShrink: 0, marginTop: 7,
            }} />
            <span style={{ fontSize: 14, color: '#a0a0a8', lineHeight: 1.6 }}>{h}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {exp.tech.map((t, ti) => (
          <span key={ti} style={{
            fontSize: 11, fontFamily: "'Geist Mono', monospace",
            color: '#505058', background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(255,255,255,0.08)',
            borderRadius: 4, padding: '2px 8px',
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* Expand */}
      <div style={{
        marginTop: 14, fontSize: 10, color: exp.accent,
        fontFamily: "'Geist Mono', monospace",
        display: 'flex', alignItems: 'center', gap: 5, opacity: 0.7,
      }}>
        <span style={{
          display: 'inline-block',
          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s ease', fontSize: 8,
        }}>▶</span>
        <span>{isExpanded ? 'Hide details' : 'View details'}</span>
      </div>

      <div style={{
        maxHeight: isExpanded ? 320 : 0, overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{ paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 14 }}>
          <p style={{
            fontSize: 10, color: '#505058', textTransform: 'uppercase',
            letterSpacing: '0.08em', margin: '0 0 8px',
            fontFamily: "'Geist Mono', monospace",
          }}>
            Architecture
          </p>
          {index === 0 && <ImpactFlowDiagram />}
          {index === 1 && <AgentPipelineSVG />}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Lessons Section (preserved from original — renders after takeoff)
// ═══════════════════════════════════════════════════════════════════════════════

const insights = [
  '"Production systems have no room for hacks. I learned to design for failure first."',
  '"Multi-agent coordination isn\'t just about agents — it\'s about trust between steps."',
  '"Working directly with founders compresses 2 years of learning into 2 months."',
];

function LessonsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.lesson-card',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="lessons-container" style={{
      padding: '64px 64px 80px',
      maxWidth: 1200,
      margin: '0 auto',
    }}>
      <p style={{
        fontSize: 11, color: '#505058', textTransform: 'uppercase',
        letterSpacing: '0.1em', marginBottom: 20,
        fontFamily: "'Geist Mono', monospace",
      }}>
        Lessons
      </p>

      <div style={{ display: 'flex', gap: 16 }}>
        {insights.map((quote, qi) => (
          <motion.div
            key={qi}
            className="lesson-card"
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.3)', borderLeftColor: '#f2f2f3' }}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.02)',
              border: '0.5px solid rgba(255,255,255,0.06)',
              borderLeft: '3px solid #4f8ef7',
              borderRadius: 14,
              padding: '20px 20px 20px 16px',
              transition: 'border-left-color 0.3s',
            }}
          >
            <p style={{
              fontSize: 14, color: '#a0a0a8', lineHeight: 1.7,
              fontStyle: 'italic', margin: 0,
            }}>
              {qi === 0 ? <TypingEffect text={quote} /> : quote}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TypingEffect({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: textRef.current,
      start: 'top 85%',
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
          display: 'inline-block', width: 6, height: 14,
          background: '#4f8ef7', marginLeft: 4, verticalAlign: 'middle',
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
      <div className="season-badge-rainy" style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(13,26,46,0.85)',
        border: '0.5px solid rgba(123,167,212,0.25)',
        borderRadius: 20, padding: '4px 12px',
        backdropFilter: 'blur(8px)',
      }}>
        <span style={{ fontSize: 14 }}>🌧️</span>
        <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: SEASON_SKY.rainy.labelColor, letterSpacing: '0.06em' }}>
          {SEASON_SKY.rainy.label}
        </span>
      </div>
      {/* Winter badge */}
      <div className="season-badge-winter" style={{
        display: 'none', alignItems: 'center', gap: 6,
        background: 'rgba(14,30,56,0.85)',
        border: '0.5px solid rgba(168,196,224,0.25)',
        borderRadius: 20, padding: '4px 12px',
        backdropFilter: 'blur(8px)',
      }}>
        <span style={{ fontSize: 14 }}>❄️</span>
        <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: SEASON_SKY.winter.labelColor, letterSpacing: '0.06em' }}>
          {SEASON_SKY.winter.label}
        </span>
      </div>
      {/* Summer badge */}
      <div className="season-badge-summer" style={{
        display: 'none', alignItems: 'center', gap: 6,
        background: 'rgba(15,36,68,0.85)',
        border: '0.5px solid rgba(244,194,107,0.25)',
        borderRadius: 20, padding: '4px 12px',
        backdropFilter: 'blur(8px)',
      }}>
        <span style={{ fontSize: 14 }}>☀️</span>
        <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: SEASON_SKY.summer.labelColor, letterSpacing: '0.06em' }}>
          {SEASON_SKY.summer.label}
        </span>
      </div>
    </>
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

  useGSAP(() => {
    if (!sectionRef.current || !skyRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=700%', // 6 cards need much more scroll room
        scrub: 2,
        pin: true,
      },
    });

    // ── Phase 1: Runway taxi (0 → 20) ──────────────────────────────────────
    tl.addLabel('runway', 0);
    tl.to('.runway-layer', { x: '-35%', duration: 20, ease: 'none' }, 0);

    // ── Phase 2: Takeoff / liftoff (20 → 40) ──────────────────────────────
    tl.addLabel('takeoff', 20);

    tl.to('.plane-wrapper', { rotation: -8, duration: 12, ease: 'power2.inOut' }, 20);

    // Audio scrubbing sync
    tl.to({}, {
      duration: 40,
      onUpdate: function () {
        if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
          audioRef.current.volume = 0.4;
          audioRef.current.currentTime = this.progress() * audioRef.current.duration;
          if (audioRef.current.paused) audioRef.current.play().catch(() => {});
        }
      },
      onReverseComplete: () => { if (audioRef.current) audioRef.current.pause(); },
      onComplete: () => { if (audioRef.current) audioRef.current.pause(); },
    }, 20);

    tl.to('.runway-layer', { x: '-100%', y: 250, opacity: 0, scale: 0.8, duration: 18, ease: 'power2.in' }, 20);
    tl.to('.scenery-layer', { y: 200, opacity: 0, duration: 16, ease: 'power2.in' }, 20);
    tl.to('.ground-line', { y: 250, opacity: 0, duration: 14, ease: 'power1.in' }, 22);

    // Sky → navy
    tl.to(skyRef.current, {
      '--sky-top': '#0d2240', '--sky-mid': '#0a1628', '--sky-bot': '#080810',
      duration: 20, ease: 'none',
    }, 20);

    tl.to('.stars-layer', { opacity: 0.6, duration: 15 }, 25);

    // ── Phase 3: Cloud climb (40 → 60) ─────────────────────────────────────
    tl.addLabel('clouds', 40);
    tl.to('.plane-wrapper', { rotation: -2, duration: 10, ease: 'power2.inOut' }, 42);
    tl.to('.plane-wrapper', { rotation: 0, duration: 8, ease: 'power2.out' }, 52);

    tl.to(skyRef.current, {
      '--sky-top': '#122a4a', '--sky-mid': '#0d2240', '--sky-bot': '#0a1628',
      duration: 20, ease: 'none',
    }, 40);

    CLOUD_DATA.forEach((cloud, i) => {
      tl.fromTo(`.cloud-${i}`, { opacity: 0 }, { opacity: 1, duration: 4, ease: 'power1.out' }, cloud.startAt);
      tl.fromTo(`.cloud-${i}`, { x: 0 }, { x: cloud.drift, duration: cloud.speed, ease: 'none' }, cloud.startAt);
    });

    // ── Continuously looping cruise clouds (start showing from 60 to the end) ──
    // We animate a secondary translate or reset position to loop them
    for (let c = 0; c < 6; c++) {
      // Loop 1
      tl.fromTo(`.cruise-cloud-${c}`, { x: '100vw' }, { x: '-150vw', duration: 35 + c * 5, ease: 'none' }, 60 + c * 6);
      // Loop 2 (starts after loop 1 moves a bit)
      tl.fromTo(`.cruise-cloud-${c}-loop2`, { x: '100vw' }, { x: '-150vw', duration: 35 + c * 5, ease: 'none' }, 85 + c * 6);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ── Phase 4a: RAINY SEASON — DJS clubs (60 → 120) ─────────────────────
    // ═══════════════════════════════════════════════════════════════════════
    tl.addLabel('rainy', 60);

    // Sky → stormy dark blue-gray
    tl.to(skyRef.current, {
      '--sky-top': SEASON_SKY.rainy.top,
      '--sky-mid': SEASON_SKY.rainy.mid,
      '--sky-bot': SEASON_SKY.rainy.bot,
      duration: 10, ease: 'power1.inOut',
    }, 60);

    // Dim stars — stormy sky
    tl.to('.stars-layer', { opacity: 0.05, duration: 8 }, 60);

    // Rain streaks appear
    tl.to('.rain-layer', { opacity: 1, duration: 6 }, 62);

    // Season label fades in: Rainy (rainy badge is already display:flex by default)
    tl.fromTo('.season-label', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 6 }, 61);

    // Card 0: DJS Code AI (rainy)
    tl.fromTo('.cable-0', { scaleY: 0 }, { scaleY: 1, duration: 8, ease: 'power1.out', transformOrigin: 'top' }, CARD_TIMING[0][0]);
    tl.fromTo('.card-group-0', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 10, ease: 'power2.out' }, CARD_TIMING[0][1]);

    // Card 1: DJS S4DS (rainy)
    tl.fromTo('.cable-1', { scaleY: 0 }, { scaleY: 1, duration: 8, ease: 'power1.out', transformOrigin: 'top' }, CARD_TIMING[1][0]);
    tl.fromTo('.card-group-1', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 10, ease: 'power2.out' }, CARD_TIMING[1][1]);

    // Card 2: DJS SIGAI (rainy)
    tl.fromTo('.cable-2', { scaleY: 0 }, { scaleY: 1, duration: 8, ease: 'power1.out', transformOrigin: 'top' }, CARD_TIMING[2][0]);
    tl.fromTo('.card-group-2', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 10, ease: 'power2.out' }, CARD_TIMING[2][1]);

    // All 3 DJS cards visible together → short hold, then drop
    // Drop DJS cards at 124
    tl.to(['.cable-0', '.cable-1', '.cable-2'], {
      scaleY: 0, duration: 5, ease: 'power3.in', transformOrigin: 'top', stagger: 2,
    }, 124);
    tl.to(['.card-group-0', '.card-group-1', '.card-group-2'], {
      y: '120vh', opacity: 0, duration: 12, ease: 'power2.in', stagger: 2,
    }, 126);

    // ═══════════════════════════════════════════════════════════════════════
    // ── Phase 4b: WINTER — COGNIFYZ (130 → 160) ───────────────────────────
    // ═══════════════════════════════════════════════════════════════════════
    tl.addLabel('winter', 130);

    // Rain fades out
    tl.to('.rain-layer', { opacity: 0, duration: 8 }, 128);

    // Sky → icy blue-white
    tl.to(skyRef.current, {
      '--sky-top': SEASON_SKY.winter.top,
      '--sky-mid': SEASON_SKY.winter.mid,
      '--sky-bot': SEASON_SKY.winter.bot,
      duration: 10, ease: 'power1.inOut',
    }, 128);

    // Season label transition → Winter badge
    tl.to('.season-label', { opacity: 0, y: -8, duration: 4 }, 127);
    // Switch badge to winter (use GSAP set for instant display property changes)
    tl.call(() => {
      const rainyBadge = document.querySelector('.season-badge-rainy') as HTMLElement | null;
      const winterBadge = document.querySelector('.season-badge-winter') as HTMLElement | null;
      if (rainyBadge) rainyBadge.style.display = 'none';
      if (winterBadge) winterBadge.style.display = 'flex';
    }, [], 129);
    tl.fromTo('.season-label', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 6 }, 131);

    // Snow particles appear
    tl.to('.snow-layer', { opacity: 1, duration: 8 }, 130);

    // Stars faint shimmer through the cold sky
    tl.to('.stars-layer', { opacity: 0.15, duration: 8 }, 130);

    // Card 3: COGNIFYZ (winter)
    tl.fromTo('.cable-3', { scaleY: 0 }, { scaleY: 1, duration: 8, ease: 'power1.out', transformOrigin: 'top' }, CARD_TIMING[3][0]);
    tl.fromTo('.card-group-3', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 12, ease: 'power2.out' }, CARD_TIMING[3][1]);

    // Drop Cognifyz card at 152
    tl.to('.cable-3', { scaleY: 0, duration: 5, ease: 'power3.in', transformOrigin: 'top' }, 152);
    tl.to('.card-group-3', { y: '120vh', opacity: 0, duration: 12, ease: 'power2.in' }, 154);

    // ═══════════════════════════════════════════════════════════════════════
    // ── Phase 4c: SUMMER — Hooman Labs + IIT Patna (155 → 200) ───────────
    // ═══════════════════════════════════════════════════════════════════════
    tl.addLabel('summer', 155);

    // Snow fades out
    tl.to('.snow-layer', { opacity: 0, duration: 8 }, 152);

    // Sky → warm golden-blue (summer)
    tl.to(skyRef.current, {
      '--sky-top': SEASON_SKY.summer.top,
      '--sky-mid': SEASON_SKY.summer.mid,
      '--sky-bot': SEASON_SKY.summer.bot,
      duration: 10, ease: 'power1.inOut',
    }, 153);

    // Season label transition → Summer badge
    tl.to('.season-label', { opacity: 0, y: -8, duration: 4 }, 152);
    // Switch badge to summer
    tl.call(() => {
      const winterBadge = document.querySelector('.season-badge-winter') as HTMLElement | null;
      const summerBadge = document.querySelector('.season-badge-summer') as HTMLElement | null;
      if (winterBadge) winterBadge.style.display = 'none';
      if (summerBadge) summerBadge.style.display = 'flex';
    }, [], 154);
    tl.fromTo('.season-label', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 6 }, 156);

    // Stars settle to light cruise level
    tl.to('.stars-layer', { opacity: 0.3, duration: 8 }, 155);

    // Sunrise Glow element rises from the bottom horizon
    tl.fromTo('.sunrise-glow', 
      { y: 350, opacity: 0, scale: 0.8 }, 
      { y: 0, opacity: 0.75, scale: 1, duration: 18, ease: 'power2.out' }, 
      155
    );

    // Card 4: Hooman Labs (summer)
    tl.fromTo('.cable-4', { scaleY: 0 }, { scaleY: 1, duration: 8, ease: 'power1.out', transformOrigin: 'top' }, CARD_TIMING[4][0]);
    tl.fromTo('.card-group-4', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 12, ease: 'power2.out' }, CARD_TIMING[4][1]);

    // Card 5: IIT Patna (summer)
    tl.fromTo('.cable-5', { scaleY: 0 }, { scaleY: 1, duration: 8, ease: 'power1.out', transformOrigin: 'top' }, CARD_TIMING[5][0]);
    tl.fromTo('.card-group-5', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 12, ease: 'power2.out' }, CARD_TIMING[5][1]);

    // ── Phase 5: Final Handoff / Drop (200 → 220) ─────────────────────────
    tl.addLabel('drop', 200);
    tl.to('.season-label', { opacity: 0, duration: 4 }, 198);

    tl.to(['.cable-4', '.cable-5'], {
      scaleY: 0, duration: 5, ease: 'power3.in', transformOrigin: 'top', stagger: 3,
    }, 200);
    tl.to(['.card-group-4', '.card-group-5'], {
      y: '120vh', opacity: 0, duration: 12, ease: 'power2.in', stagger: 3,
    }, 202);

  }, { scope: sectionRef });

  // Season label text based on scroll — use ref to update via GSAP onUpdate
  const seasonLabelRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className="takeoff-section"
      style={{ position: 'relative' }}
    >
      {/* ── Audio Element ── */}
      <audio ref={audioRef} src="/airplane-lift-off.mp3" preload="auto" />

      <div className="takeoff-viewport" style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
      }}>
        {/* ── Sky background ── */}
        <div ref={skyRef} className="sky-bg" />

        {/* ── Stars layer ── */}
        <div className="stars-layer" style={{
          position: 'absolute', inset: 0, zIndex: 1,
          opacity: 0, pointerEvents: 'none',
        }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${(i * 37 + 11) % 50}%`,
              left: `${(i * 71 + 17) % 100}%`,
              width: (i % 3) + 1,
              height: (i % 3) + 1,
              borderRadius: '50%',
              background: '#fff',
              opacity: 0.2 + (i % 5) * 0.1,
            }} />
          ))}
        </div>

        {/* ── Rain layer (rainy season — DJS clubs) ── */}
        <div className="rain-layer" style={{
          position: 'absolute', inset: 0, zIndex: 2,
          opacity: 0, pointerEvents: 'none', overflow: 'hidden',
        }}>
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${(i * 31) % 110 - 10}%`,
              left: `${(i * 47 + 3) % 110 - 5}%`,
              width: 1,
              height: 14 + (i % 8) * 2,
              background: `rgba(150,200,255,${0.08 + (i % 5) * 0.04})`,
              transform: 'rotate(12deg)',
              animation: `rain-fall ${0.6 + (i % 4) * 0.15}s linear infinite`,
              animationDelay: `${(i * 0.08) % 0.8}s`,
            }} />
          ))}
        </div>

        {/* ── Snow layer (winter — Cognifyz) ── */}
        <div className="snow-layer" style={{
          position: 'absolute', inset: 0, zIndex: 2,
          opacity: 0, pointerEvents: 'none', overflow: 'hidden',
        }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${(i * 43) % 110 - 10}%`,
              left: `${(i * 61 + 7) % 100}%`,
              width: 3 + (i % 4),
              height: 3 + (i % 4),
              borderRadius: '50%',
              background: `rgba(200,230,255,${0.15 + (i % 4) * 0.08})`,
              animation: `snow-fall ${2 + (i % 6) * 0.5}s ease-in infinite`,
              animationDelay: `${(i * 0.12) % 2}s`,
            }} />
          ))}
        </div>

        {/* ── Season label ── */}
        <div
          ref={seasonLabelRef}
          className="season-label"
          style={{
            position: 'absolute',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            opacity: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <SeasonBadge />
        </div>

        {/* ── Scenery layer (city silhouette) ── */}
        <div className="scenery-layer" style={{
          position: 'absolute',
          top: 'calc(32% + 15px)',
          left: 0, right: 0, height: 120,
          zIndex: 1, opacity: 0.6,
        }}>
          <CityScenerySVG />
        </div>

        {/* ── Ground / horizon line ── */}
        <div className="ground-line" style={{
          position: 'absolute',
          top: 'calc(32% + 135px)',
          left: 0, right: 0, height: 1,
          background: 'rgba(255,255,255,0.06)',
          zIndex: 2,
        }} />

        {/* ── Runway layer ── */}
        <div className="runway-layer" style={{
          position: 'absolute',
          top: 'calc(32% + 135px)',
          left: '-10%', width: '200%', height: 60, zIndex: 3,
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: '#161618',
            borderTop: '1.5px solid #2a2a2e',
            borderBottom: '1.5px solid #2a2a2e',
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: 0, right: 0, height: 3,
            transform: 'translateY(-50%)',
            background: 'repeating-linear-gradient(to right, rgba(255,255,255,0.7) 0px, rgba(255,255,255,0.7) 30px, transparent 30px, transparent 65px)',
          }} />
          <div style={{
            position: 'absolute', top: 4, left: 0, right: 0, height: 2,
            background: 'repeating-linear-gradient(to right, rgba(255,200,0,0.4) 0px, rgba(255,200,0,0.4) 20px, transparent 20px, transparent 50px)',
          }} />
          <div style={{
            position: 'absolute', bottom: 4, left: 0, right: 0, height: 2,
            background: 'repeating-linear-gradient(to right, rgba(255,200,0,0.4) 0px, rgba(255,200,0,0.4) 20px, transparent 20px, transparent 50px)',
          }} />
        </div>

        {/* ── Clouds layer ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}>
          {CLOUD_DATA.map((cloud, i) => (
            <div
              key={i}
              className={`cloud-${i}`}
              style={{
                position: 'absolute',
                top: cloud.top, left: '110%',
                width: cloud.size, height: cloud.size * 0.42,
                color: `rgba(255,255,255,${cloud.opacity})`,
                opacity: 0,
              }}
            >
              <CloudShape />
            </div>
          ))}

          {/* Continuous Cruise Clouds (6 items, duplicated for seamless looping) */}
          {Array.from({ length: 6 }).map((_, c) => {
            const topPositions = ['15%', '30%', '45%', '60%', '75%', '85%'];
            const sizes = [180, 240, 310, 150, 280, 210];
            const opacities = [0.08, 0.05, 0.12, 0.04, 0.07, 0.06];
            return (
              <div key={c} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div
                  className={`cruise-cloud-${c}`}
                  style={{
                    position: 'absolute',
                    top: topPositions[c],
                    left: 0,
                    width: sizes[c],
                    height: sizes[c] * 0.42,
                    color: `rgba(255,255,255,${opacities[c]})`,
                    transform: 'translateX(100vw)',
                  }}
                >
                  <CloudShape />
                </div>
                <div
                  className={`cruise-cloud-${c}-loop2`}
                  style={{
                    position: 'absolute',
                    top: topPositions[c],
                    left: 0,
                    width: sizes[c],
                    height: sizes[c] * 0.42,
                    color: `rgba(255,255,255,${opacities[c]})`,
                    transform: 'translateX(100vw)',
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
            position: 'absolute',
            bottom: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120%',
            height: '40%',
            background: 'radial-gradient(ellipse at bottom, rgba(245,158,11,0.2) 0%, rgba(239,68,68,0.08) 50%, transparent 100%)',
            filter: 'blur(30px)',
            zIndex: 1,
            opacity: 0,
            pointerEvents: 'none',
          }}
        />

        {/* ── Airplane (stays centered) ── */}
        <div className="plane-wrapper" style={{
          position: 'absolute',
          top: '32%', left: '50%',
          transform: 'translateX(-50%)',
          width: 320, zIndex: 10,
        }}>
          <AirplaneSVG />
        </div>

        {/* ── Hanging experience cards ── */}
        {/* Cards are positioned absolutely at the center so they display beautifully, one-by-one, without being compressed by a flex row */}
        <div className="cards-layer" style={{
          position: 'absolute',
          top: '46%', left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 420,
          height: 480,
          zIndex: 10,
        }}>
          {omkar.experience.map((exp, i) => (
            <div
              key={exp.company}
              className={`card-group-${i}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                opacity: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Cable line */}
              <div
                className={`cable-${i}`}
                style={{
                  width: 1, height: 70,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.25) 0%, ${exp.accent}55 100%)`,
                  transformOrigin: 'top',
                  transform: 'scaleY(0)',
                }}
              />
              {/* Connector dot */}
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: exp.accent, marginTop: -3, marginBottom: 10,
                boxShadow: `0 0 8px ${exp.accent}44`,
              }} />
              {/* Card */}
              <HangingExperienceCard
                exp={exp}
                index={i}
                isExpanded={expandedCard === i}
                onToggle={() => setExpandedCard(expandedCard === i ? null : i)}
              />
            </div>
          ))}
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
      <div style={{
        display: 'flex', justifyContent: 'center',
        padding: '48px 24px 32px', opacity: 0.5,
      }}>
        <div style={{ width: 260 }}>
          <AirplaneSVG />
        </div>
      </div>

      {/* Experience cards — stacked */}
      <div style={{ padding: '0 24px', maxWidth: 700, margin: '0 auto' }}>
        {omkar.experience.map((exp, i) => (
          <StaticExperienceCard
            key={exp.company}
            exp={exp}
            index={i}
            isExpanded={expandedCard === i}
            onToggle={() => setExpandedCard(expandedCard === i ? null : i)}
          />
        ))}
      </div>

      {/* Lessons — simplified (no GSAP scroll animation for fallback) */}
      <div style={{
        padding: '32px 24px 0',
        maxWidth: 700,
        margin: '0 auto',
      }}>
        <p style={{
          fontSize: 11, color: '#505058', textTransform: 'uppercase',
          letterSpacing: '0.1em', marginBottom: 16,
          fontFamily: "'Geist Mono', monospace",
        }}>
          Lessons
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {insights.map((quote, qi) => (
            <div
              key={qi}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '0.5px solid rgba(255,255,255,0.06)',
                borderLeft: '3px solid #4f8ef7',
                borderRadius: 14,
                padding: '16px 16px 16px 14px',
              }}
            >
              <p style={{
                fontSize: 14, color: '#a0a0a8', lineHeight: 1.7,
                fontStyle: 'italic', margin: 0,
              }}>
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

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    window.addEventListener('resize', checkMobile);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', motionHandler);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mql.removeEventListener('change', motionHandler);
    };
  }, []);

  // ── Fallback paths ──
  if (isMobile || prefersReducedMotion) {
    return (
      <PageShell path="/experience">
        <FallbackLayout
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
        />
      </PageShell>
    );
  }

  // ── Full takeoff sequence ──
  return (
    <PageShell path="/experience">
      <TakeoffSequence
        expandedCard={expandedCard}
        setExpandedCard={setExpandedCard}
      />
      
      {/* ── Static Cards (The "Landing" Zone) ── */}
      {/* Renders immediately after the pin ends so they scroll smoothly into view */}
      <div style={{ padding: '40px 24px 20px', maxWidth: 700, margin: '0 auto' }}>
        {omkar.experience.map((exp, i) => (
          <StaticExperienceCard
            key={exp.company}
            exp={exp}
            index={i}
            isExpanded={expandedCard === i}
            onToggle={() => setExpandedCard(expandedCard === i ? null : i)}
          />
        ))}
      </div>

      <LessonsSection />
    </PageShell>
  );
}
