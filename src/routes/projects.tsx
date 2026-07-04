import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type ReactElement, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Menu, Asterisk } from 'lucide-react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { omkar } from '@/lib/data';

export const Route = createFileRoute('/projects')({ component: ProjectsPage });

// ─── SVG Visuals ────────────────────────────────────────────────────────────

function NolanVisual() {
  // Graph network: 6 nodes connected by lines with animated data flow dot
  const nodes = [
    { cx: 150, cy: 125, r: 20, label: 'Story Input', main: true },
    { cx: 75,  cy: 75,  r: 14, label: 'Agent Orchestrator', main: false },
    { cx: 230, cy: 70,  r: 14, label: 'Comic', main: false },
    { cx: 240, cy: 165, r: 14, label: 'Voice', main: false },
    { cx: 75,  cy: 175, r: 14, label: 'Image', main: false },
    { cx: 150, cy: 215, r: 12, label: 'Story', main: false },
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 2], [1, 5],
  ];
  const delays = ['0s', '0.6s', '1.2s', '1.8s', '0.3s', '0.9s'];

  return (
    <svg
      viewBox="0 0 300 250"
      style={{ width: '100%', height: '100%' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="nolan-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a0d2e" />
          <stop offset="100%" stopColor="#080809" />
        </radialGradient>
      </defs>
      <rect width="300" height="250" fill="url(#nolan-bg)" />

      {/* Edges */}
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="rgba(192,132,252,0.3)"
          strokeWidth="1"
        />
      ))}

      {/* Animated data-flow dot along main→orchestrator edge */}
      <circle r="3" fill="#c084fc" opacity="0.9">
        <animateMotion
          dur="2.5s"
          repeatCount="indefinite"
          path={`M ${nodes[0].cx} ${nodes[0].cy} L ${nodes[1].cx} ${nodes[1].cy}`}
        />
      </circle>
      {/* Another dot main→comic */}
      <circle r="2.5" fill="#c084fc" opacity="0.7">
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          begin="1s"
          path={`M ${nodes[0].cx} ${nodes[0].cy} L ${nodes[2].cx} ${nodes[2].cy}`}
        />
      </circle>

      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle
            cx={n.cx} cy={n.cy} r={n.r}
            fill={n.main ? 'rgba(192,132,252,0.18)' : 'rgba(192,132,252,0.08)'}
            stroke="#c084fc"
            strokeWidth={n.main ? 1.5 : 1}
          >
            <animate
              attributeName="r"
              values={`${n.r};${n.r + 2};${n.r}`}
              dur="3s"
              begin={delays[i]}
              repeatCount="indefinite"
            />
          </circle>
          <text
            x={n.cx}
            y={n.cy + n.r + 10}
            textAnchor="middle"
            fill="rgba(192,132,252,0.7)"
            fontSize="8"
            fontFamily="'Geist Mono', monospace"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function FinverseVisual() {
  return (
    <svg
      viewBox="0 0 300 250"
      style={{ width: '100%', height: '100%' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="finverse-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0a1f17" />
          <stop offset="100%" stopColor="#080809" />
        </radialGradient>
      </defs>
      <rect width="300" height="250" fill="url(#finverse-bg)" />

      {/* Outer dashed ring */}
      <circle
        cx="150" cy="125" r="90"
        stroke="#34d399" strokeWidth="1"
        strokeDasharray="4 6"
        fill="none"
        opacity="0.4"
      />
      {/* Inner solid ring */}
      <circle
        cx="150" cy="125" r="60"
        stroke="#34d399" strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />

      {/* Offline label top-right */}
      <text x="248" y="26" fill="#34d399" fontSize="8" fontFamily="'Geist Mono', monospace" opacity="0.8">✕ offline</text>

      {/* Sync arrows (rotating group) */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 150 125"
          to="360 150 125"
          dur="4s"
          repeatCount="indefinite"
        />
        {/* Two arc arrows forming a sync symbol */}
        <path
          d="M 135 105 A 22 22 0 1 1 165 105"
          stroke="#34d399" strokeWidth="2" fill="none" strokeLinecap="round"
        />
        <path
          d="M 165 145 A 22 22 0 1 1 135 145"
          stroke="#34d399" strokeWidth="2" fill="none" strokeLinecap="round"
        />
        {/* Arrow heads */}
        <polygon points="133,108 127,100 141,103" fill="#34d399" />
        <polygon points="167,142 173,150 159,147" fill="#34d399" />
      </g>

      {/* Synced label */}
      <text x="150" y="232" textAnchor="middle" fill="#34d399" fontSize="9" fontFamily="'Geist Mono', monospace" opacity="0.7">synced</text>

      {/* 3 orbiting data dots along outer ring */}
      {[0, 1, 2].map((i) => (
        <circle key={i} r="4" fill="#34d399" opacity="0.8">
          <animateMotion
            dur="5s"
            begin={`${i * 1.67}s`}
            repeatCount="indefinite"
            path="M 150 35 A 90 90 0 1 1 149.99 35"
          />
        </circle>
      ))}
    </svg>
  );
}

function SignSyncVisual() {
  const [activeGif, setActiveGif] = useState(0);
  const gifs = ['/sign1.gif', '/sign2.gif'];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGif(prev => (prev + 1) % gifs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [gifs.length]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: '#0a1525',
      overflow: 'hidden'
    }}>
      <AnimatePresence initial={false}>
        <motion.img
          key={activeGif}
          src={gifs[activeGif]}
          alt={`Sign translation ${activeGif + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </AnimatePresence>
    </div>
  );
}

const PROJECT_VISUALS: Record<string, () => ReactElement> = {
  nolan: NolanVisual,
  finverse: FinverseVisual,
  signsync: SignSyncVisual,
};

function ProjectsPage() {
  const navigate = useNavigate();
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(true);

  useEffect(() => {
    setIsPointerFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPointerFine) return;
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  };

  const Visual = hoveredProjectId ? PROJECT_VISUALS[hoveredProjectId] : null;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => isPointerFine && setIsCursorVisible(true)}
      onMouseLeave={() => setIsCursorVisible(false)}
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#e5e5e5',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'auto'
      }}
    >
      {/* Background Dots */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <Sidebar />

      {/* Sidebar Email */}
      <div style={{ position: 'fixed', left: 24, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: 'left center', fontSize: 11, fontFamily: "'Geist Mono', monospace", color: '#505058', letterSpacing: '0.1em', pointerEvents: 'none', zIndex: 10 }}>
        omkarkudalkar23@gmail.com
      </div>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '32px 48px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Asterisk size={24} color="#a0a0a8" />
          </motion.div>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em' }}>SELECTED PROJECTS</span>
        </div>
        <Menu size={20} />
      </header>

      {/* Main List */}
      <main style={{ maxWidth: 1000, margin: '80px auto 0', padding: '0 48px 100px', position: 'relative', zIndex: 10 }}>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {omkar.projects.map((p) => {
            const isHovered = hoveredProjectId === p.id;
            const isAnyHovered = hoveredProjectId !== null;

            return (
              <motion.div
                key={p.id}
                tabIndex={0}
                onMouseEnter={() => setHoveredProjectId(p.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
                onFocus={() => setHoveredProjectId(p.id)}
                onBlur={() => setHoveredProjectId(null)}
                onClick={() => navigate({ to: p.id === 'nolan' ? '/projects/nolan-studio' : p.id === 'finverse' ? '/projects/finverse' : '/projects' })}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '48px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  cursor: isPointerFine ? 'none' : 'pointer',
                  opacity: isAnyHovered ? (isHovered ? 1 : 0.3) : 1,
                  transition: 'opacity 0.3s ease',
                  outline: 'none'
                }}
              >
                {/* Top Highlight Border */}
                <div style={{
                  position: 'absolute',
                  top: -1, // Overlay exactly on the border
                  left: 0,
                  right: 0,
                  height: 1,
                  background: 'rgba(255,255,255,0.5)',
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  zIndex: 2,
                }} />
                {/* Bottom Highlight Border */}
                <div style={{
                  position: 'absolute',
                  bottom: -1, // Overlay exactly on the border
                  left: 0,
                  right: 0,
                  height: 1,
                  background: 'rgba(255,255,255,0.5)',
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  zIndex: 2,
                }} />
                <div style={{ width: 80, fontSize: 14, fontFamily: "'Geist Mono', monospace", color: '#505058' }}>
                  _{p.index}.
                </div>
                <div>
                  <div style={{ position: 'relative', margin: '0 0 12px' }}>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, margin: 0, fontFamily: "'Geist', sans-serif", letterSpacing: '-0.03em', color: '#666' }}>
                      {p.name}
                    </h2>
                    <motion.h2
                      initial={false}
                      animate={{ clipPath: isHovered ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)' }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: 700,
                        margin: 0,
                        fontFamily: "'Geist', sans-serif",
                        letterSpacing: '-0.03em',
                        color: p.accent,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {p.name}
                    </motion.h2>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 12, fontFamily: "'Geist Mono', monospace", color: '#a0a0a8', flexWrap: 'wrap' }}>
                    {p.tech.map((t, i) => (
                      <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        {i > 0 && <span style={{ margin: '0 12px', color: '#505058' }}>•</span>}
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Thumbnail Preview */}
      <AnimatePresence>
        {isPointerFine && hoveredProjectId && Visual && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: '15%',
              right: '-5%', // Peeking off screen
              width: 440,
              height: 330,
              borderRadius: 24,
              overflow: 'hidden',
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              zIndex: 5,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Visual />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Cursor */}
      {isPointerFine && (
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 150,
            height: 150,
            x: smoothX,
            y: smoothY,
            translateX: '-50%',
            translateY: '-50%',
            pointerEvents: 'none',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isCursorVisible && hoveredProjectId ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'white',
            mixBlendMode: 'difference',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{ width: 6, height: 6, background: 'black', borderRadius: '50%' }} />
            {hoveredProjectId && (
               <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{ position: 'absolute', color: 'black', fontSize: 10, fontFamily: "'Geist Mono', monospace", fontWeight: 700, letterSpacing: '0.1em' }}
               >
                 VIEW
               </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
