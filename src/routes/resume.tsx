import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink, Github, Mail, Code } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { omkar } from '@/lib/data';

function ResumePage() {
  const [activeSection, setActiveSection] = useState('Education');

  const sections = ['Education', 'Experience', 'Projects', 'Achievements', 'Skills'];

  function scrollTo(section: string) {
    setActiveSection(section);
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const skillEntries = Object.entries(omkar.skills) as [string, string[]][];

  return (
    <PageShell path="/resume">
      <div style={{ display: 'flex', gap: 0, minHeight: '100vh' }}>
        {/* Left sticky TOC */}
        <div
          style={{
            width: 240,
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflowY: 'auto',
            padding: '48px 24px',
            borderRight: '0.5px solid rgba(255,255,255,0.06)',
            background: 'rgba(8,8,9,0.8)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: 14,
              fontFamily: 'Geist Mono, monospace',
              color: '#4f8ef7',
              marginBottom: 24,
              fontWeight: 600,
            }}
          >
            OK
          </div>

          {/* Navigation label */}
          <div
            style={{
              fontSize: 10,
              color: '#505058',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 12,
              fontFamily: 'Geist Mono, monospace',
            }}
          >
            Navigation
          </div>

          {/* TOC buttons */}
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => scrollTo(section)}
              style={{
                display: 'block',
                textAlign: 'left',
                padding: '8px 12px',
                fontSize: 13,
                color: activeSection === section ? '#4f8ef7' : '#505058',
                background:
                  activeSection === section
                    ? 'rgba(79,142,247,0.08)'
                    : 'transparent',
                borderRadius: 8,
                width: '100%',
                cursor: 'pointer',
                border: 'none',
                borderLeft:
                  activeSection === section
                    ? '2px solid #4f8ef7'
                    : '2px solid transparent',
                transition: 'all 0.15s ease',
                marginBottom: 2,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              {section}
            </button>
          ))}

          {/* Divider */}
          <hr
            style={{
              border: 'none',
              borderTop: '0.5px solid rgba(255,255,255,0.06)',
              margin: '20px 0',
            }}
          />

          {/* Availability */}
          <div
            style={{
              fontSize: 10,
              color: '#505058',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 10,
              fontFamily: 'Geist Mono, monospace',
            }}
          >
            Available for:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['Internships', 'Projects'].map((label) => (
              <span
                key={label}
                style={{
                  display: 'inline-block',
                  background: 'rgba(62,207,142,0.08)',
                  border: '0.5px solid rgba(62,207,142,0.2)',
                  borderRadius: 12,
                  padding: '4px 12px',
                  fontSize: 12,
                  color: '#3ecf8e',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Right content column */}
        <div
          style={{
            flex: 1,
            padding: '48px 56px 80px',
            overflowY: 'auto',
            maxWidth: 760,
          }}
        >
          {/* Action bar */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 40,
            }}
          >
            {[
              {
                icon: <Download size={14} />,
                label: 'Download PDF',
                action: () => window.open('/resume.pdf'),
              },
              {
                icon: <Mail size={14} />,
                label: 'Copy Email',
                action: () =>
                  navigator.clipboard.writeText(omkar.email),
              },
              {
                icon: <ExternalLink size={14} />,
                label: 'LinkedIn',
                action: () => window.open(omkar.linkedin, '_blank'),
              },
              {
                icon: <Github size={14} />,
                label: 'GitHub',
                action: () => window.open(omkar.github, '_blank'),
              },
              {
                icon: <Code size={14} />,
                label: 'LeetCode',
                action: () => window.open(omkar.leetcode, '_blank'),
              },
            ].map(({ icon, label, action }) => (
              <ActionButton key={label} icon={icon} label={label} action={action} />
            ))}
          </div>

          {/* Education */}
          <motion.section
            id="Education"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div
              style={{
                fontSize: 11,
                color: '#505058',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 20,
                fontFamily: 'Geist Mono, monospace',
              }}
            >
              Education
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: '#f2f2f3',
                fontFamily: 'Geist, system-ui, sans-serif',
              }}
            >
              {omkar.college}
            </div>
            <div style={{ fontSize: 14, color: '#a0a0a8', marginTop: 4 }}>
              {omkar.degree}
            </div>
            <div
              style={{
                fontSize: 13,
                fontFamily: 'Geist Mono, monospace',
                color: '#505058',
                marginTop: 2,
              }}
            >
              {omkar.batch}
            </div>

            {/* CGPA row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 10,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: '#505058',
                  fontFamily: 'Geist Mono, monospace',
                }}
              >
                CGPA
              </span>
              <span
                style={{
                  color: '#4f8ef7',
                  fontWeight: 500,
                  fontSize: 18,
                  fontFamily: 'Geist, system-ui, sans-serif',
                }}
              >
                {omkar.cgpa}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  background: 'rgba(79,142,247,0.08)',
                  border: '0.5px solid rgba(79,142,247,0.2)',
                  borderRadius: 8,
                  padding: '2px 10px',
                  fontSize: 11,
                  color: '#4f8ef7',
                  fontFamily: 'Geist Mono, monospace',
                }}
              >
                First Year
              </span>
            </div>
          </motion.section>

          <hr
            style={{
              border: 'none',
              borderTop: '0.5px solid rgba(255,255,255,0.06)',
              margin: '32px 0',
            }}
          />

          {/* Experience */}
          <motion.section
            id="Experience"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div
              style={{
                fontSize: 11,
                color: '#505058',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 20,
                fontFamily: 'Geist Mono, monospace',
              }}
            >
              Experience
            </div>

            {omkar.experience.map((exp) => (
              <div key={exp.company} style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: exp.accent,
                      fontFamily: 'Geist, system-ui, sans-serif',
                    }}
                  >
                    {exp.company}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Geist Mono, monospace',
                      color: '#505058',
                      fontSize: 12,
                    }}
                  >
                    {exp.period}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: '#a0a0a8',
                    marginTop: 4,
                    marginBottom: 8,
                  }}
                >
                  {exp.role}
                </div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {exp.highlights.map((h, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: 13,
                        color: '#a0a0a8',
                        lineHeight: 1.6,
                        marginBottom: 4,
                      }}
                    >
                      {h}
                    </li>
                  ))}
                </ul>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                    marginTop: 8,
                  }}
                >
                  {exp.tech.map((t) => (
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
              </div>
            ))}
          </motion.section>

          <hr
            style={{
              border: 'none',
              borderTop: '0.5px solid rgba(255,255,255,0.06)',
              margin: '32px 0',
            }}
          />

          {/* Projects */}
          <motion.section
            id="Projects"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div
              style={{
                fontSize: 11,
                color: '#505058',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 20,
                fontFamily: 'Geist Mono, monospace',
              }}
            >
              Projects
            </div>

            {omkar.projects.map((p) => (
              <div key={p.id} style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: p.accent,
                      fontFamily: 'Geist, system-ui, sans-serif',
                    }}
                  >
                    {p.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Geist Mono, monospace',
                      color: '#505058',
                      fontSize: 12,
                    }}
                  >
                    {p.date}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: '#a0a0a8',
                    marginTop: 4,
                    marginBottom: 6,
                  }}
                >
                  {p.tagline}
                </div>

                {/* Metrics */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                    marginBottom: 6,
                  }}
                >
                  {p.metrics.map((m) => (
                    <span
                      key={m.label}
                      style={{
                        fontSize: 11,
                        color: '#4f8ef7',
                        background: 'rgba(79,142,247,0.08)',
                        border: '0.5px solid rgba(79,142,247,0.15)',
                        borderRadius: 6,
                        padding: '2px 8px',
                        fontFamily: 'Geist Mono, monospace',
                      }}
                    >
                      {m.value} {m.label}
                    </span>
                  ))}
                </div>

                {/* Tech tags */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                    marginBottom: 6,
                  }}
                >
                  {p.tech.map((t) => (
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

                {/* GitHub link */}
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 12,
                    color: '#505058',
                    textDecoration: 'none',
                    fontFamily: 'Geist Mono, monospace',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLAnchorElement).style.color = '#4f8ef7')
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLAnchorElement).style.color = '#505058')
                  }
                >
                  ↗ github
                </a>
              </div>
            ))}
          </motion.section>

          <hr
            style={{
              border: 'none',
              borderTop: '0.5px solid rgba(255,255,255,0.06)',
              margin: '32px 0',
            }}
          />

          {/* Achievements */}
          <motion.section
            id="Achievements"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div
              style={{
                fontSize: 11,
                color: '#505058',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 20,
                fontFamily: 'Geist Mono, monospace',
              }}
            >
              Achievements
            </div>

            {omkar.hackathons.map((h, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {h.place === 1 && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#c9a96e',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: h.place === 1 ? '#c9a96e' : '#f2f2f3',
                      fontFamily: 'Geist, system-ui, sans-serif',
                    }}
                  >
                    {h.placeLabel} — {h.event}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: '#505058',
                    marginTop: 4,
                  }}
                >
                  {h.host} · {h.participants}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: '#a0a0a8',
                    marginBottom: 4,
                  }}
                >
                  {h.project}
                </div>
              </div>
            ))}
          </motion.section>

          <hr
            style={{
              border: 'none',
              borderTop: '0.5px solid rgba(255,255,255,0.06)',
              margin: '32px 0',
            }}
          />

          {/* Skills */}
          <motion.section
            id="Skills"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div
              style={{
                fontSize: 11,
                color: '#505058',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 20,
                fontFamily: 'Geist Mono, monospace',
              }}
            >
              Skills
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {skillEntries.map(([category, items]) => (
                <div key={category}>
                  <div
                    style={{
                      fontSize: 11,
                      color: '#505058',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: 6,
                      fontFamily: 'Geist Mono, monospace',
                    }}
                  >
                    {category}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {items.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          fontFamily: 'Geist Mono, monospace',
                          fontSize: 11,
                          color: '#a0a0a8',
                          background: 'rgba(255,255,255,0.04)',
                          border: '0.5px solid rgba(255,255,255,0.08)',
                          borderRadius: 6,
                          padding: '2px 8px',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </PageShell>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

function ActionButton({ icon, label, action }: ActionButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={action}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        background: hovered
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        fontSize: 13,
        color: hovered ? '#f2f2f3' : '#a0a0a8',
        cursor: 'pointer',
        transition: 'all 0.15s',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

export const Route = createFileRoute('/resume')({
  component: ResumePage,
});
