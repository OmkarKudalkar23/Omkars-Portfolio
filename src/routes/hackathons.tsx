import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { omkar } from '@/lib/data';
import { Component as EtheralShadow } from '@/components/ui/etheral-shadow';
import './hackathons.css';

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  })
};

function HackathonsPage() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const stats = [
    { value: '6', label: 'Hackathons entered' },
    { value: '3', label: 'First place wins' },
    { value: '1000+', label: 'Participants beaten' },
  ];

  return (
    <PageShell path="/hackathons">
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
        <EtheralShadow
          color="rgba(128, 128, 128, 1)"
          animation={{ scale: 100, speed: 90 }}
          noise={{ opacity: 1, scale: 1.2 }}
          sizing="fill"
        />
      </div>
      <div className="relative z-10">
      {/* Hero */}
      <div
        style={{
          padding: '80px 64px 48px',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: '#505058',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: 16,
            fontFamily: 'Geist Mono, monospace',
          }}
        >
          Competitive Record
        </p>
        <h1
          style={{
            fontSize: 48,
            fontWeight: 300,
            color: '#f2f2f3',
            fontFamily: 'Geist, system-ui, sans-serif',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          3 hackathons.
          <br />
          2 wins. 1 runner-up.
        </h1>
        <p
          style={{
            fontSize: 17,
            color: '#a0a0a8',
            marginTop: 16,
            lineHeight: 1.6,
          }}
        >
          Competing to validate ideas under pressure — and winning.
        </p>

        {/* Stat counters */}
        <div style={{ display: 'flex', gap: 48, marginTop: 48 }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="stat-number">
                {stat.value}
              </div>
              <div className="stat-label">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trophy cards */}
      <div
        className="cards-grid"
        style={{
          padding: '0 64px',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {omkar.hackathons.map((h, i) => (
          <motion.div
            key={h.event}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            custom={i}
            className="hackathon-card"
          >
            {i === 1 && (
              <div className="featured-badge">
                Featured
              </div>
            )}
            
            {h.image && (
              <div className="card-image-overlay">
                <img src={h.image} alt={h.event} />
              </div>
            )}

            <div className="card-content-wrapper">
              <div className="card-index">
                [0{i + 1}]
              </div>

              <div className="card-title">
                {h.project} - {h.event}
              </div>

              <div className="card-subtitle">
                {new Date().getFullYear()} · {h.placeLabel || (h.place === 1 ? '1st Place' : h.place === 2 ? '2nd Place' : '3rd Place')}
              </div>

              <div className="card-desc">
                {h.detail}
              </div>

              <div className="card-footer">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="card-link"
                >
                  ↗ live
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quote section */}
      <div
        style={{
          marginTop: 64,
          padding: '0 64px',
          maxWidth: 1200,
          margin: '64px auto 0',
          paddingBottom: 80,
          textAlign: 'center',
        }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: 17,
            fontStyle: 'italic',
            color: '#a0a0a8',
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.8,
          }}
        >
          "The edge isn't just skill — it's the ability to ship something real
          in 24 hours that solves a real problem. Twice, that was enough to
          win."
        </motion.p>
      </div>
      </div>
    </PageShell>
  );
}

export const Route = createFileRoute('/hackathons')({
  component: HackathonsPage,
});
