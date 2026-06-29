import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ExternalLink, Github, Code, Check, Copy } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { omkar } from '@/lib/data';

function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [emailHovered, setEmailHovered] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText(omkar.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const socials = [
    {
      icon: <ExternalLink size={14} />,
      label: 'LinkedIn',
      href: omkar.linkedin,
    },
    {
      icon: <Github size={14} />,
      label: 'GitHub',
      href: omkar.github,
    },
    {
      icon: <Code size={14} />,
      label: 'LeetCode',
      href: omkar.leetcode,
    },
  ];

  return (
    <PageShell path="/contact">
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(79,142,247,0.06) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 560,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'rgba(79,142,247,0.08)',
                border: '0.5px solid rgba(79,142,247,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: '#4f8ef7',
                  fontFamily: 'Geist Mono, monospace',
                }}
              >
                OK
              </span>
            </div>

            {/* Availability badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                background: 'rgba(62,207,142,0.08)',
                border: '0.5px solid rgba(62,207,142,0.2)',
                borderRadius: 20,
                marginBottom: 24,
              }}
            >
              <div
                className="dot-pulse-green"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#3ecf8e',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: '#3ecf8e',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                Available Now
              </span>
            </div>

            {/* Heading */}
            <h1
              style={{
                fontSize: 44,
                fontWeight: 300,
                color: '#f2f2f3',
                fontFamily: 'Geist, system-ui, sans-serif',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                marginBottom: 20,
                marginTop: 0,
              }}
            >
              Let's build something together.
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: 17,
                color: '#a0a0a8',
                lineHeight: 1.8,
                maxWidth: 440,
                margin: '0 auto 32px',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              I'm Omkar — a first-year student already shipping production AI
              systems. If you're building something hard, I want to help.
            </p>

            {/* Location + status */}
            <div
              style={{
                fontSize: 14,
                color: '#505058',
                marginBottom: 40,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Mumbai, India · B.Tech CSE (Data Science) · DJSCE
            </div>

            {/* Primary CTA — send email */}
            <a
              href={`mailto:${omkar.email}`}
              style={{
                display: 'block',
                textAlign: 'center',
                background: '#4f8ef7',
                borderRadius: 14,
                padding: '16px 32px',
                fontSize: 16,
                fontWeight: 500,
                color: '#080809',
                textDecoration: 'none',
                marginBottom: 12,
                transition: 'opacity 0.15s',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.9')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')
              }
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  justifyContent: 'center',
                }}
              >
                <Mail size={16} />
                Send Email
              </span>
            </a>

            {/* Copyable email address */}
            <div
              onClick={copyEmail}
              onMouseEnter={() => setEmailHovered(true)}
              onMouseLeave={() => setEmailHovered(false)}
              style={{
                fontSize: 13,
                color: emailHovered ? '#a0a0a8' : '#505058',
                fontFamily: 'Geist Mono, monospace',
                marginBottom: 32,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'color 0.15s',
              }}
            >
              {omkar.email}
              {copied ? (
                <Check size={12} color="#3ecf8e" />
              ) : (
                <Copy size={12} />
              )}
            </div>

            {/* Social links */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: 48,
              }}
            >
              {socials.map(({ icon, label, href }) => (
                <SocialLink key={label} icon={icon} label={label} href={href} />
              ))}
            </div>

            {/* Response time */}
            <p
              style={{
                fontSize: 13,
                color: '#505058',
                fontStyle: 'italic',
                fontFamily: 'Inter, system-ui, sans-serif',
                margin: 0,
              }}
            >
              Response time: usually within a few hours.
            </p>
          </motion.div>
        </div>
      </div>
    </PageShell>
  );
}

interface SocialLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

function SocialLink({ icon, label, href }: SocialLinkProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 20px',
        background: hovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
        border: '0.5px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        fontSize: 13,
        color: hovered ? '#f2f2f3' : '#a0a0a8',
        textDecoration: 'none',
        transition: 'all 0.15s',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {icon}
      {label}
    </a>
  );
}

export const Route = createFileRoute('/contact')({
  component: ContactPage,
});
