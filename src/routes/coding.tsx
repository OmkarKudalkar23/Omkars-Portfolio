import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { PageShell } from '@/components/layout/PageShell';
import { Code2, ExternalLink } from 'lucide-react';

export const Route = createFileRoute('/coding')({
  component: CodingPage,
});

function CodingPage() {
  const { data: lcData, isLoading: lcLoading, error: lcError } = useQuery({
    queryKey: ['leetcode', 'djikstraster'],
    queryFn: async () => {
      const res = await fetch('https://alfa-leetcode-api.onrender.com/djikstraster/solved');
      if (!res.ok) throw new Error('Failed to fetch LeetCode data');
      const json = await res.json();
      if (json.errors) throw new Error(json.errors[0].message || 'API Error');
      return json;
    },
    staleTime: 1000 * 60 * 60,
  });

  const { data: gfgData, isLoading: gfgLoading, error: gfgError } = useQuery({
    queryKey: ['gfg', 'kudalkaritem'],
    queryFn: async () => {
      const res = await fetch('https://gfgstatscard.vercel.app/kudalkaritem?raw=true');
      if (!res.ok) throw new Error('Failed to fetch GFG data');
      return res.json();
    },
    staleTime: 1000 * 60 * 60,
  });

  return (
    <PageShell path="/coding">
      <div style={{ padding: '80px 64px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: '#505058', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            Competitive Programming
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 300, color: '#f2f2f3', fontFamily: "'Geist', sans-serif", letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>
            Algorithmic problem solving.<br/>
            Optimizing for efficiency.
          </h1>
          <p style={{ fontSize: 17, color: '#a0a0a8', marginTop: 16, maxWidth: 520, lineHeight: 1.7 }}>
            A track record of tackling complex data structures and algorithms, consistently pushing for optimal time and space complexity.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '0.5px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
            maxWidth: 600,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.05)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Code2 size={20} color="#f2f2f3" />
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 500, color: '#f2f2f3', margin: 0 }}>LeetCode</h2>
                <div style={{ fontSize: 13, fontFamily: "'Geist Mono', monospace", color: '#a0a0a8', marginTop: 4 }}>@djikstraster</div>
              </div>
            </div>
            <a href="https://leetcode.com/u/djikstraster/" target="_blank" rel="noreferrer" style={{ color: '#505058', transition: 'color 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#f2f2f3'} onMouseLeave={e => e.currentTarget.style.color = '#505058'}>
              <ExternalLink size={20} />
            </a>
          </div>

          {lcLoading ? (
            <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#505058', fontFamily: "'Geist Mono', monospace", fontSize: 13 }}>
              Fetching live stats...
            </div>
          ) : lcError ? (
            <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontFamily: "'Geist Mono', monospace", fontSize: 13 }}>
              Unable to load stats.
            </div>
          ) : lcData ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 16 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, color: '#505058', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#f2f2f3' }}>{lcData.solvedProblem || 0}</div>
              </div>
              <div style={{ background: 'rgba(52, 211, 153, 0.05)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Easy</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#34d399' }}>{lcData.easySolved || 0}</div>
              </div>
              <div style={{ background: 'rgba(250, 204, 21, 0.05)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, color: '#facc15', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Medium</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#facc15' }}>{lcData.mediumSolved || 0}</div>
              </div>
              <div style={{ background: 'rgba(248, 113, 113, 0.05)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hard</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#f87171' }}>{lcData.hardSolved || 0}</div>
              </div>
            </div>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '0.5px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
            maxWidth: 600,
            marginTop: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.05)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#2f8d46', fontFamily: "'Geist', sans-serif" }}>
                GfG
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 500, color: '#f2f2f3', margin: 0 }}>GeeksForGeeks</h2>
                <div style={{ fontSize: 13, fontFamily: "'Geist Mono', monospace", color: '#a0a0a8', marginTop: 4 }}>@kudalkaritem</div>
              </div>
            </div>
            <a href="https://auth.geeksforgeeks.org/user/kudalkaritem" target="_blank" rel="noreferrer" style={{ color: '#505058', transition: 'color 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#f2f2f3'} onMouseLeave={e => e.currentTarget.style.color = '#505058'}>
              <ExternalLink size={20} />
            </a>
          </div>

          {gfgLoading ? (
            <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#505058', fontFamily: "'Geist Mono', monospace", fontSize: 13 }}>
              Fetching live stats...
            </div>
          ) : gfgError ? (
            <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontFamily: "'Geist Mono', monospace", fontSize: 13 }}>
              Unable to load stats.
            </div>
          ) : gfgData ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 16 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, color: '#505058', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#f2f2f3' }}>{gfgData.total_problems_solved || 0}</div>
              </div>
              <div style={{ background: 'rgba(52, 211, 153, 0.05)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Easy</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#34d399' }}>{gfgData.Easy || 0}</div>
              </div>
              <div style={{ background: 'rgba(250, 204, 21, 0.05)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, color: '#facc15', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Medium</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#facc15' }}>{gfgData.Medium || 0}</div>
              </div>
              <div style={{ background: 'rgba(248, 113, 113, 0.05)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hard</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#f87171' }}>{gfgData.Hard || 0}</div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </PageShell>
  );
}
