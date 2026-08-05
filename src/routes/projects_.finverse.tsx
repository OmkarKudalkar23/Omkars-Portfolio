import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Github, ArrowLeft, ArrowRight } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';

export const Route = createFileRoute('/projects_/finverse')({
  component: FinversePage,
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
      whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(52, 211, 153, 0.3), 0 0 20px 0px rgba(52, 211, 153, 0.15) inset' }}
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

// ─── Main Page Component ────────────────────────────────────────────────────
function FinversePage() {
  return (
    <PageShell path="/projects/finverse">
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
              onMouseEnter={e => e.currentTarget.style.color = '#34d399'}
              onMouseLeave={e => e.currentTarget.style.color = '#a0a0a8'}
            >
              <ArrowLeft size={16} /> Projects
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#34d399' }} />
            <h1 style={{ fontSize: 'clamp(36px, 8vw, 48px)', fontWeight: 300, color: '#f2f2f3', fontFamily: "'Geist', sans-serif", letterSpacing: '-0.02em', margin: 0 }}>
              Finverse
            </h1>
          </motion.div>
          
          <motion.p variants={fadeInUp} style={{ fontSize: 20, color: '#a0a0a8', margin: '0 0 32px', lineHeight: 1.5 }}>
            Offline-first financial literacy for rural India
          </motion.p>

          <motion.div variants={fadeInUp} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
            {['500+ rural users', '40% better lesson completion', '5+ 3D gamified modules'].map((badge, i) => (
              <span key={i} style={{ background: 'rgba(52, 211, 153,0.1)', border: '1px solid rgba(52, 211, 153,0.2)', borderRadius: 20, padding: '6px 14px', fontSize: 13, color: '#34d399' }}>
                {badge}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {['Next.js', 'Three.js', 'IndexedDB', 'MongoDB', 'GSAP'].map((tech, i) => (
              <span key={i} style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: '#505058', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '4px 10px' }}>
                {tech}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp}>
            <a href="https://github.com/OmkarKudalkar23" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#f2f2f3', textDecoration: 'none', fontSize: 14, background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s' }}>
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
              Rural communities face unreliable connectivity and low financial literacy — static content fails to engage and can't sync learning progress offline.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <h3 style={{ fontSize: 12, color: '#34d399', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 16px', fontFamily: "'Geist Mono', monospace" }}>
              Solution
            </h3>
            <p style={{ fontSize: 15, color: '#a0a0a8', lineHeight: 1.8, margin: 0 }}>
              An offline-first platform with IndexedDB synchronization, IVR assistance, real-time government scheme updates, and community learning. 5+ gamified 3D modules turn financial education into an interactive experience.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Feature 1: Offline Sync ── */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          style={{ marginBottom: 100 }}
        >
          <motion.div variants={fadeInUp} style={{ marginBottom: 32 }}>
            <ImageFrame src="/finverse1.png" alt="Finverse Offline Dashboard" />
          </motion.div>
          <motion.h2 variants={fadeInUp} style={{ fontSize: 28, fontWeight: 400, color: '#f2f2f3', margin: '0 0 16px' }}>
            Built for intermittent connectivity
          </motion.h2>
          <motion.ul variants={staggerContainer} style={{ paddingLeft: 20, margin: 0, color: '#a0a0a8', fontSize: 16, lineHeight: 1.8 }}>
            <motion.li variants={fadeInUp}>Robust client-side architecture using IndexedDB.</motion.li>
            <motion.li variants={fadeInUp}>Syncs progress automatically when a connection is restored.</motion.li>
            <motion.li variants={fadeInUp}>Never drops user progress mid-lesson.</motion.li>
          </motion.ul>
        </motion.div>

        {/* ── Feature 2: 3D Modules ── */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          style={{ marginBottom: 100 }}
        >
          <motion.div variants={fadeInUp} style={{ marginBottom: 32 }}>
            <ImageFrame src="/finverse2.png" alt="Finverse 3D Modules" />
          </motion.div>
          <motion.h2 variants={fadeInUp} style={{ fontSize: 28, fontWeight: 400, color: '#f2f2f3', margin: '0 0 16px' }}>
            Interactive 3D Learning
          </motion.h2>
          <motion.p variants={fadeInUp} style={{ color: '#a0a0a8', fontSize: 16, lineHeight: 1.8, margin: 0 }}>
            Powered by Three.js, these 3D gamified environments make complex financial concepts accessible and engaging for first-time digital learners.
          </motion.p>
        </motion.div>

        {/* ── Feature 3: Community & Schemes ── */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          style={{ marginBottom: 100 }}
        >
          <motion.div variants={fadeInUp} style={{ marginBottom: 32 }}>
            <ImageFrame src="/finverse3.png" alt="Finverse Community Features" />
          </motion.div>
          <motion.h2 variants={fadeInUp} style={{ fontSize: 28, fontWeight: 400, color: '#f2f2f3', margin: '0 0 16px' }}>
            Local Communities & IVR Integration
          </motion.h2>
          <motion.p variants={fadeInUp} style={{ color: '#a0a0a8', fontSize: 16, lineHeight: 1.8, margin: 0 }}>
            Connects users to government scheme feeds and offers IVR assistance directly through the platform, bridging the digital literacy gap.
          </motion.p>
        </motion.div>

        {/* ── Image 4 (Showcase) ── */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          style={{ marginBottom: 100 }}
        >
          <motion.div variants={fadeInUp} style={{ marginBottom: 32 }}>
            <img 
              src="/finverse4.png" 
              alt="Finverse Dashboard Showcase" 
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 16, border: '2px solid rgba(52, 211, 153, 0.4)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            />
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
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <ArrowLeft size={16} /> Back to all projects
          </Link>
          <Link 
            to="/projects"
            style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a0a0a8', textDecoration: 'none', fontSize: 15, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f2f2f3'}
            onMouseLeave={e => e.currentTarget.style.color = '#a0a0a8'}
          >
            Next project <ArrowRight size={16} />
          </Link>
        </motion.div>

      </div>
    </PageShell>
  );
}
