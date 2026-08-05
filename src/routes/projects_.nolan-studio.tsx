import { createFileRoute, Link } from '@tanstack/react-router';
import { motion, useInView } from 'framer-motion';
import { Github, ArrowLeft, ArrowRight } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { canHover } from '@/lib/pointer';
import { useRef } from 'react';

export const Route = createFileRoute('/projects_/nolan-studio')({
  component: NolanStudioPage,
});

// ─── Shared Animation Variants ────────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// ─── Image Frame Component ──────────────────────────────────────────────────
function ImageFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(192, 132, 252, 0.3), 0 0 20px 0px rgba(192, 132, 252, 0.15) inset' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}
    >
      {/* Browser Chrome */}
      <div style={{ height: 28, background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
      </div>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#0a0a0a' }}>
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="100%" height="100%" fill="%231a1a1a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-family="sans-serif">Image not found</text></svg>';
          }}
        />
      </div>
    </motion.div>
  );
}

// ─── Animated Pipeline SVG ──────────────────────────────────────────────────
function AnimatedPipelineSVG() {
  const stages = [
    'Story Input',
    'Entity Extraction',
    'Graph Construction',
    'Multi-Agent Orchestration',
    'Output (Comic / Voice / Visual)'
  ];
  
  const boxW = 240;
  const boxH = 32;
  const svgW = 260;
  const gap = 20; 
  const startY = 10;
  const totalH = stages.length * boxH + (stages.length - 1) * gap + 20;
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
      <svg
        viewBox={`0 0 ${svgW} ${totalH}`}
        width="100%"
        style={{ maxWidth: svgW }}
        height={totalH}
        xmlns="http://www.w3.org/2000/svg"
      >
        {stages.map((label, i) => {
          const y = startY + i * (boxH + gap);
          const arrowY = y + boxH;
          const arrowMidY = arrowY + gap / 2;

          return (
            <g key={i}>
              <motion.rect
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.2, duration: 0.4 }}
                x={(svgW - boxW) / 2}
                y={y}
                width={boxW}
                height={boxH}
                rx="8"
                fill="rgba(192,132,252,0.06)"
                stroke="rgba(192,132,252,0.3)"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              />
              <motion.text
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.2 + 0.1, duration: 0.4 }}
                x={svgW / 2}
                y={y + boxH / 2 + 4}
                textAnchor="middle"
                fill="#c084fc"
                fontSize="11"
                fontFamily="'Geist Mono', monospace"
              >
                {label}
              </motion.text>

              {i < stages.length - 1 && (
                <g>
                  <motion.line
                    initial={{ strokeDashoffset: 50, strokeDasharray: 50 }}
                    whileInView={{ strokeDashoffset: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: i * 0.2 + 0.3, duration: 0.4, ease: 'easeInOut' }}
                    x1={svgW / 2}
                    y1={arrowY}
                    x2={svgW / 2}
                    y2={arrowMidY + gap / 2 - 4}
                    stroke="rgba(192,132,252,0.5)"
                    strokeWidth="1.5"
                  />
                  <motion.polygon
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: i * 0.2 + 0.6, duration: 0.2 }}
                    points={`${svgW / 2},${arrowMidY + gap / 2} ${svgW / 2 - 4},${arrowMidY + gap / 2 - 5} ${svgW / 2 + 4},${arrowMidY + gap / 2 - 5}`}
                    fill="rgba(192,132,252,0.8)"
                  />
                  <motion.circle 
                    initial={{ opacity: 0, y: 0 }}
                    whileInView={{ opacity: [0, 1, 0], y: [0, gap - 8] }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: i * 0.2 + 0.6, duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    r="2.5" 
                    fill="#c084fc"
                    cx={svgW / 2}
                    cy={arrowY + 2}
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

// ─── Main Page Component ────────────────────────────────────────────────────
function NolanStudioPage() {
  return (
    <PageShell path="/projects/nolan-studio">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(16px, 4vw, 32px) 100px' }}>
        
        {/* ── Hero Section ── */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          style={{ paddingTop: 'clamp(48px, 8vw, 80px)', paddingBottom: 64 }}
        >
          <motion.div variants={fadeInUp} style={{ marginBottom: 40 }}>
            <Link 
              to="/projects"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#a0a0a8', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}
              onMouseEnter={e => { if (!canHover) return; e.currentTarget.style.color = '#c084fc'; }}
              onMouseLeave={e => { if (!canHover) return; e.currentTarget.style.color = '#a0a0a8'; }}
            >
              <ArrowLeft size={16} /> Projects
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#c084fc' }} />
            <h1 style={{ fontSize: 'clamp(36px, 8vw, 48px)', fontWeight: 300, color: '#f2f2f3', fontFamily: "'Geist', sans-serif", letterSpacing: '-0.02em', margin: 0 }}>
              Nolan AI Studio
            </h1>
          </motion.div>
          
          <motion.p variants={fadeInUp} style={{ fontSize: 20, color: '#a0a0a8', margin: '0 0 32px', lineHeight: 1.5 }}>
            Graph-RAG powered multi-agent storytelling platform
          </motion.p>

          <motion.div variants={fadeInUp} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
            {['1st Place DevHacks 2026', 'Graph-RAG vs chunking-based RAG', '3x fewer API calls per session'].map((badge, i) => (
              <span key={i} style={{ background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.2)', borderRadius: 20, padding: '6px 14px', fontSize: 13, color: '#c084fc' }}>
                {badge}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {['Neo4j', 'Next.js', 'LangChain', 'MongoDB', 'LangGraph'].map((tech, i) => (
              <span key={i} style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: '#505058', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '4px 10px' }}>
                {tech}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#f2f2f3', textDecoration: 'none', fontSize: 14, background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s' }}>
              <Github size={16} /> View Source
            </a>
          </motion.div>
        </motion.div>

        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', margin: '0 0 64px' }} />

        {/* ── Problem / Solution ── */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 48, marginBottom: 80 }}
        >
          <motion.div variants={fadeInUp}>
            <h3 style={{ fontSize: 12, color: '#505058', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 16px', fontFamily: "'Geist Mono', monospace" }}>
              Problem
            </h3>
            <p style={{ fontSize: 15, color: '#a0a0a8', lineHeight: 1.8, margin: 0 }}>
              Chunking-based RAG loses narrative context — character relationships and story entities get flattened into disconnected vectors, breaking long-form storytelling. 
            </p>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <h3 style={{ fontSize: 12, color: '#c084fc', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 16px', fontFamily: "'Geist Mono', monospace" }}>
              Solution
            </h3>
            <p style={{ fontSize: 15, color: '#a0a0a8', lineHeight: 1.8, margin: 0 }}>
              Replaced vector chunking with Graph-RAG on Neo4j, mapping characters and story entities as graph nodes. A multi-agent system handles AI comic generation, image visualization, and voice-agent narration, with intelligent orchestration cutting redundant calls.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Feature 1: Knowledge Graph ── */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          style={{ marginBottom: 100 }}
        >
          <motion.div variants={fadeInUp} style={{ marginBottom: 32 }}>
            <ImageFrame src="/nolan1.jpeg" alt="Nolan AI Studio Story Editor and Knowledge Graph" />
          </motion.div>
          <motion.h2 variants={fadeInUp} style={{ fontSize: 28, fontWeight: 400, color: '#f2f2f3', margin: '0 0 16px' }}>
            Every character, location, and relationship becomes a node
          </motion.h2>
          <motion.ul variants={staggerContainer} style={{ paddingLeft: 20, margin: 0, color: '#a0a0a8', fontSize: 16, lineHeight: 1.8 }}>
            <motion.li variants={fadeInUp}>Dynamic Neo4j-style knowledge graph mapping story entities.</motion.li>
            <motion.li variants={fadeInUp}>Visualizes relationships like <code>married_to</code>, <code>fought_by</code>, or <code>ally_of</code>.</motion.li>
            <motion.li variants={fadeInUp}>Ensures LLM character consistency across long-form chapters.</motion.li>
          </motion.ul>
        </motion.div>

        {/* ── Feature 2: Comic Generation ── */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          style={{ marginBottom: 100 }}
        >
          <motion.div variants={fadeInUp} style={{ marginBottom: 32 }}>
            <ImageFrame src="/nolan2.jpeg" alt="AI Comic Generation Panels" />
          </motion.div>
          <motion.h2 variants={fadeInUp} style={{ fontSize: 28, fontWeight: 400, color: '#f2f2f3', margin: '0 0 16px' }}>
            From story text to illustrated comic panels
          </motion.h2>
          <motion.p variants={fadeInUp} style={{ color: '#a0a0a8', fontSize: 16, lineHeight: 1.8, margin: 0 }}>
            The pipeline breaks story text into scenes, generates an image per panel using stable diffusion, and seamlessly overlays narration captions to assemble a complete comic strip output.
          </motion.p>
        </motion.div>

        {/* ── Feature 3: Secondary Visual ── */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          style={{ marginBottom: 100 }}
        >
          <motion.div variants={fadeInUp} style={{ marginBottom: 32 }}>
            <ImageFrame src="/nolan3.jpeg" alt="Nolan AI Studio Additional Features" />
          </motion.div>
          <motion.p variants={fadeInUp} style={{ color: '#a0a0a8', fontSize: 16, lineHeight: 1.8, margin: 0, textAlign: 'center' }}>
            Multi-modal outputs provide rich user engagement and diverse storytelling formats.
          </motion.p>
        </motion.div>

        {/* ── Architecture Breakdown ── */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          style={{ marginBottom: 100, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, padding: '48px 32px' }}
        >
          <motion.h2 variants={fadeInUp} style={{ fontSize: 24, fontWeight: 400, color: '#f2f2f3', margin: '0 0 32px', textAlign: 'center' }}>
            System Architecture
          </motion.h2>
          
          <motion.ul variants={staggerContainer} style={{ paddingLeft: 20, margin: '0 0 40px', color: '#a0a0a8', fontSize: 15, lineHeight: 1.8, maxWidth: 600, marginInline: 'auto' }}>
            <motion.li variants={fadeInUp}><strong style={{ color: '#c084fc', fontWeight: 500 }}>Neo4j:</strong> Graph-based entity storage ensuring persistent story states.</motion.li>
            <motion.li variants={fadeInUp}><strong style={{ color: '#c084fc', fontWeight: 500 }}>LangGraph:</strong> Multi-agent orchestration for intelligent task routing.</motion.li>
            <motion.li variants={fadeInUp}><strong style={{ color: '#c084fc', fontWeight: 500 }}>MongoDB:</strong> Session and base story persistence.</motion.li>
            <motion.li variants={fadeInUp}><strong style={{ color: '#c084fc', fontWeight: 500 }}>Voice Layer:</strong> Real-time narration capabilities.</motion.li>
          </motion.ul>

          <AnimatedPipelineSVG />
        </motion.div>

        {/* ── Award Recognition Section ── */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          style={{ 
            marginBottom: 100, 
            background: 'linear-gradient(135deg, rgba(201,169,110,0.08), rgba(8,8,9,0.8))', 
            border: '1px solid rgba(201,169,110,0.3)', 
            borderRadius: 24, 
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
            alignItems: 'center',
            boxShadow: '0 20px 50px -20px rgba(201,169,110,0.15)'
          }}
        >
          <motion.div variants={fadeInUp} style={{ width: '100%', maxWidth: 500, borderRadius: 16, overflow: 'hidden', border: '2px solid rgba(201,169,110,0.4)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <img 
              src="/nolan4.jpeg" 
              alt="Winner of DevHacks 2026, 1st Place" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="300"><rect width="100%" height="100%" fill="%231a1a1a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-family="sans-serif">Award Photo</text></svg>';
              }}
            />
          </motion.div>
          <motion.div variants={fadeInUp} style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, color: '#c9a96e', margin: '0 0 12px' }}>
              1st Place — DevHacks 2026
            </h2>
            <p style={{ color: '#a0a0a8', fontSize: 16, margin: 0, maxWidth: 500, lineHeight: 1.6 }}>
              Recognized for technical ambition and pushing the boundaries of what's possible with multi-agent Graph-RAG systems.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Footer CTA ── */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32 }}
        >
          <Link 
            to="/projects"
            style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f2f2f3', textDecoration: 'none', fontSize: 15, transition: 'opacity 0.2s' }}
            onMouseEnter={e => { if (!canHover) return; e.currentTarget.style.opacity = '0.7'; }}
            onMouseLeave={e => { if (!canHover) return; e.currentTarget.style.opacity = '1'; }}
          >
            <ArrowLeft size={16} /> Back to all projects
          </Link>
          <Link 
            to="/projects"
            style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a0a0a8', textDecoration: 'none', fontSize: 15, transition: 'color 0.2s' }}
            onMouseEnter={e => { if (!canHover) return; e.currentTarget.style.color = '#f2f2f3'; }}
            onMouseLeave={e => { if (!canHover) return; e.currentTarget.style.color = '#a0a0a8'; }}
          >
            Next project <ArrowRight size={16} />
          </Link>
        </motion.div>

      </div>
    </PageShell>
  );
}
