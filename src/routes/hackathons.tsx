import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { omkar } from '@/lib/data';

function HackathonsPage() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const stats = [
    { value: '3', label: 'Hackathons entered' },
    { value: '2', label: 'First place wins' },
    { value: '1000+', label: 'Participants beaten' },
  ];

  return (
    <PageShell path="/hackathons">
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
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 300,
                  color: '#4f8ef7',
                  fontFamily: 'Geist, system-ui, sans-serif',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: '#505058', marginTop: 4 }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trophy cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          padding: '0 64px',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {omkar.hackathons.map((h, i) => (
          <div
            key={h.event}
            style={{ perspective: 1200 }}
            onMouseEnter={() => h.image && setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            onFocus={() => h.image && setHoveredIdx(i)}
            onBlur={() => setHoveredIdx(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              animate={{ rotateY: hoveredIdx === i ? 180 : 0 }}
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* FRONT SIDE */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 20,
                  padding: '40px 32px',
                  textAlign: 'center',
                  position: 'relative',
                  border: `0.5px solid ${h.place === 1 ? 'rgba(201,169,110,0.25)' : h.place === 3 ? 'rgba(192,192,192,0.25)' : 'rgba(255,255,255,0.07)'}`,
                  backfaceVisibility: 'hidden',
                  // prevent flipping during interactions on front side
                  pointerEvents: hoveredIdx === i ? 'none' : 'auto',
                }}
              >
                {/* Shimmer for 1st place and 3rd place */}
                {(h.place === 1 || h.place === 3) && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 20,
                      pointerEvents: 'none',
                      background: h.place === 1
                        ? 'linear-gradient(135deg, transparent 30%, rgba(201,169,110,0.12) 50%, transparent 70%)'
                        : 'linear-gradient(135deg, transparent 30%, rgba(192,192,192,0.12) 50%, transparent 70%)',
                      backgroundSize: '200% 200%',
                      animation: 'shimmer-border 3s linear infinite',
                    }}
                  />
                )}

                {/* Placement badge */}
                <div
                  style={{
                    fontFamily: 'Geist Mono, monospace',
                    fontSize: 11,
                    color: h.place === 1 ? '#c9a96e' : h.place === 3 ? '#c0c0c0' : '#a0a0a8',
                    letterSpacing: '0.15em',
                    marginBottom: 16,
                  }}
                >
                  {h.placeLabel ? h.placeLabel.toUpperCase() : (h.place === 1 ? '1ST' : h.place === 2 ? '2ND' : '3RD') + ' PLACE'}
                </div>

                {/* Trophy icon */}
                <div style={{ marginBottom: 16 }}>
                  <Trophy
                    size={32}
                    color={h.place === 1 ? '#c9a96e' : h.place === 3 ? '#c0c0c0' : '#505058'}
                  />
                </div>

                {/* Event name */}
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: '#f2f2f3',
                    marginBottom: 8,
                    fontFamily: 'Geist, system-ui, sans-serif',
                  }}
                >
                  {h.event}
                </div>

                {/* Host + participants */}
                <div style={{ fontSize: 13, color: '#505058', marginBottom: 4 }}>
                  {h.host}
                </div>
                <div style={{ fontSize: 13, color: '#505058', marginBottom: 4 }}>
                  {h.participants}
                </div>

                {/* Project name */}
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: h.accent,
                    marginTop: 12,
                    marginBottom: 8,
                  }}
                >
                  {h.project}
                </div>

                {/* Detail text */}
                <div
                  style={{
                    fontSize: 13,
                    color: '#a0a0a8',
                    lineHeight: 1.6,
                  }}
                >
                  {h.detail}
                </div>

                {/* Tech tags */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                    justifyContent: 'center',
                    marginTop: 12,
                    marginBottom: 16,
                  }}
                >
                  {h.tech.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontFamily: 'Geist Mono, monospace',
                        fontSize: 11,
                        color: '#505058',
                        background: 'rgba(255,255,255,0.04)',
                        border: '0.5px solid rgba(255,255,255,0.08)',
                        borderRadius: 6,
                        padding: '2px 8px',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Accordion button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedIdx(expandedIdx === i ? null : i);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4f8ef7',
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    margin: '0 auto',
                  }}
                >
                  {expandedIdx === i ? (
                    <>
                      Hide details <ChevronUp size={12} />
                    </>
                  ) : (
                    <>
                      View details <ChevronDown size={12} />
                    </>
                  )}
                </button>

                {/* Expanded section */}
                {expandedIdx === i && (
                  <div
                    style={{
                      padding: '14px 0 0',
                      borderTop: '0.5px solid rgba(255,255,255,0.07)',
                      marginTop: 12,
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: '#505058',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: 4,
                        fontFamily: 'Geist Mono, monospace',
                      }}
                    >
                      PROBLEM:
                    </div>
                    <div style={{ fontSize: 13, color: '#a0a0a8', lineHeight: 1.6 }}>
                      {h.detail}
                    </div>
                  </div>
                )}
              </div>

              {/* BACK SIDE */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 20,
                  border: `0.5px solid rgba(255,255,255,0.07)`,
                  overflow: 'hidden',
                  pointerEvents: hoveredIdx === i ? 'auto' : 'none',
                }}
              >
                {h.image && (
                  <img 
                    src={h.image} 
                    alt={`${h.event} win`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.85,
                      filter: 'grayscale(20%) contrast(1.1)',
                    }}
                  />
                )}
                {/* Subtle overlay to keep it feeling premium and integrated */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 100%)',
                  pointerEvents: 'none'
                }} />
              </div>
            </motion.div>
          </div>
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
    </PageShell>
  );
}

export const Route = createFileRoute('/hackathons')({
  component: HackathonsPage,
});
