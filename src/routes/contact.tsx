import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Copy, ExternalLink, Github, Check, ChevronDown, Mail } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { omkar } from '@/lib/data';
import { canHover } from '@/lib/pointer';

function getAngle(x: number, y: number) {
  let angle = (Math.atan2(y, x) * 180 / Math.PI) + 90;
  if (angle < 0) angle += 360;
  return angle;
}

const initialBlips = [
  { id: '1', x: 15, y: -25, label: 'OMKAR — MUM' },
  { id: '2', x: -35, y: -15, label: 'INCOMING — ???' },
  { id: '3', x: 25, y: 45, label: 'SIGNAL DETECTED' },
  { id: '4', x: -50, y: 25, label: 'UNKNOWN' },
].map(b => ({ ...b, angle: getAngle(b.x, b.y) }));

const ContactTypeOptions = [
  "INTERNSHIP OPPORTUNITY",
  "FREELANCE PROJECT",
  "COLLABORATION",
  "JUST SAYING HI",
  "OTHER"
];

function ContactPage() {
  const shouldReduceMotion = useReducedMotion();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const radarSweepRef = useRef<HTMLDivElement>(null);
  
  // Custom array refs
  const blipsRef = useRef<(HTMLDivElement | null)[]>([]);
  const typewritersRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const sweepTweenRef = useRef<gsap.core.Tween | null>(null);
  const freqTweenRef = useRef<gsap.core.Tween | null>(null);
  const audioTweensRef = useRef<gsap.core.Tween[]>([]);
  
  const [blips, setBlips] = useState(initialBlips);
  const [isTyping, setIsTyping] = useState(false);
  
  const [callsign, setCallsign] = useState('');
  const [contactType, setContactType] = useState(ContactTypeOptions[0]);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  
  const [emailTouched, setEmailTouched] = useState(false);
  const emailValid = email === '' ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const [typeOpen, setTypeOpen] = useState(false);
  const [submitState, setSubmitState] = useState<'idle' | 'transmitting' | 'success'>('idle');
  const [copied, setCopied] = useState(false);
  
  // Audio waveform bars
  const waveformBars = Array.from({ length: 40 });
  const waveformRef = useRef<(SVGRectElement | null)[]>([]);

  useGSAP(() => {
    if (shouldReduceMotion) return;
    
    // Sweep Animation (virtual sweep object to calculate blip angle fades)
    const sweepObj = { rotation: 0 };
    sweepTweenRef.current = gsap.to(sweepObj, {
      rotation: 360,
      duration: 4,
      repeat: -1,
      ease: "none",
      onUpdate: function() {
        const currentRotation = sweepObj.rotation % 360;
        blipsRef.current.forEach((blipEl) => {
          if (!blipEl) return;
          const angle = parseFloat(blipEl.getAttribute('data-angle') || '0');
          let diff = (currentRotation - angle + 360) % 360;
          if (diff >= 0 && diff < 15) {
            if ((gsap.getProperty(blipEl, "opacity") as number) < 0.5) {
              gsap.killTweensOf(blipEl);
              gsap.set(blipEl, { opacity: 1 });
              gsap.to(blipEl, { opacity: 0.1, duration: 3, ease: "power1.out" });
            }
          }
        });
      }
    });

    // Audio Waveform Animation
    waveformRef.current.forEach((bar, i) => {
      if (!bar) return;
      const tween = gsap.to(bar, {
        scaleY: "random(0.1, 1)",
        duration: "random(0.1, 0.4)",
        repeat: -1,
        yoyo: true,
        ease: "none",
        transformOrigin: "bottom"
      });
      audioTweensRef.current.push(tween);
    });

    // Freq bar animation
    freqTweenRef.current = gsap.to('.freq-bar', {
      width: "random(60%, 95%)",
      duration: 0.2,
      repeat: -1,
      ease: "none"
    });
    
    // Page load sequence
    const tl = gsap.timeline();
    gsap.set(leftPanelRef.current, { borderRightColor: 'rgba(59,130,246,0)' });
    gsap.set('.radar-container', { opacity: 0 });
    gsap.set(typewritersRef.current, { opacity: 0, x: -10 });
    gsap.set('.right-panel-border', { scaleY: 0, transformOrigin: 'top' });
    gsap.set('.tx-header', { opacity: 0 });
    
    tl.to(leftPanelRef.current, { borderRightColor: 'rgba(59,130,246,0.2)', duration: 0.4, ease: "power2.inOut" }, 0.2)
      .to('.radar-container', { opacity: 1, duration: 0.8, ease: "power1.out" }, 0.4)
      .to(typewritersRef.current, { opacity: 1, x: 0, duration: 0.2, stagger: 0.15 }, 0.6)
      .to('.right-panel-border', { scaleY: 1, duration: 0.4, ease: "power2.inOut" }, 1.0)
      .to('.tx-header', { opacity: 1, duration: 0.4 }, 1.2);
      
  }, { scope: containerRef });

  useEffect(() => {
    if (shouldReduceMotion || !sweepTweenRef.current || !freqTweenRef.current) return;
    if (isTyping) {
      gsap.to(sweepTweenRef.current, { timeScale: 1.6, duration: 0.5 });
      gsap.to(freqTweenRef.current, { timeScale: 2, duration: 0.2 });
    } else {
      gsap.to(sweepTweenRef.current, { timeScale: 1, duration: 1.0 });
      gsap.to(freqTweenRef.current, { timeScale: 1, duration: 1.0 });
    }
  }, [isTyping, shouldReduceMotion]);

  useEffect(() => {
    if (!isTyping) return;
    const t = setTimeout(() => setIsTyping(false), 1000);
    return () => clearTimeout(t);
  }, [callsign, message, email, isTyping]);

  const handleInput = () => {
    if (!isTyping) setIsTyping(true);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(omkar.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitState !== 'idle' || emailValid === false) return;
    
    setSubmitState('transmitting');
    
    if (sweepTweenRef.current && !shouldReduceMotion) {
      gsap.to(sweepTweenRef.current, { timeScale: 0, duration: 0.5 });
      blipsRef.current.forEach(blip => {
        if (blip) {
          gsap.killTweensOf(blip);
          gsap.to(blip, { opacity: 1, duration: 0.1, yoyo: true, repeat: 5 });
        }
      });
      // audio burst
      audioTweensRef.current.forEach(tw => gsap.to(tw, { timeScale: 3, duration: 0.2 }));
    }

    setTimeout(() => {
      setSubmitState('success');
      
      if (callsign) {
        const angle = getAngle(30, -30);
        setBlips(prev => [...prev, {
          id: 'new', x: 30, y: -30, label: `CALLSIGN: ${callsign.toUpperCase()}`, angle
        }]);
      }
      
      if (sweepTweenRef.current && !shouldReduceMotion) {
         gsap.to(sweepTweenRef.current, { timeScale: 1, duration: 1, delay: 0.5 });
         audioTweensRef.current.forEach(tw => gsap.to(tw, { timeScale: 1, duration: 1, delay: 0.5 }));
      }
      
      const subject = encodeURIComponent(`ATC Contact: ${contactType}`);
      const body = encodeURIComponent(`Callsign: ${callsign}\nReturn Frequency: ${email}\n\nTransmission:\n${message}`);
      window.location.href = `mailto:${omkar.email}?subject=${subject}&body=${body}`;
      
      setTimeout(() => setSubmitState('idle'), 4000);
    }, 2000);
  };

  return (
    <PageShell path="/contact">
      <div 
        ref={containerRef}
        style={{
          minHeight: '100vh',
          backgroundColor: '#060d1a',
          color: '#ffffff',
          fontFamily: '"Space Mono", "JetBrains Mono", monospace',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Responsive flex layout handler using standard media query would be better here, but we use flexWrap for simplicity in inline styles or use a styled container if needed. We'll use CSS to make it stack. */}
        <style dangerouslySetInnerHTML={{__html: `
          .atc-layout { display: flex; flex-direction: column; height: 100%; min-height: 100vh; }
          .atc-left { flex: 1 1 100%; border-right: none; border-bottom: 1px solid rgba(59,130,246,0.2); }
          .atc-right { flex: 1 1 100%; }
          @media (min-width: 1024px) {
            .atc-layout { flex-direction: row; }
            .atc-left { flex: 1 1 45%; border-right: 1px solid rgba(59,130,246,0); border-bottom: none; min-height: 100vh; }
            .atc-right { flex: 1 1 55%; min-height: 100vh; overflow-y: auto; }
          }
        `}} />
        
        {/* CRT Overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)'
        }} />
        <motion.div
          animate={shouldReduceMotion ? {} : { opacity: [1, 0.97, 1, 0.98, 1] }}
          transition={{ duration: 0.15, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 51, background: 'rgba(0,255,100,0.01)' }}
        />

        <div className="atc-layout" style={{ position: 'relative', zIndex: 10 }}>
          {/* LEFT PANEL */}
          <div 
            ref={leftPanelRef}
            className="atc-left"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '40px 24px',
              position: 'relative',
            }}
          >
             <div className="radar-container" style={{
               position: 'relative',
               width: '100%',
               maxWidth: 360,
               aspectRatio: '1/1',
               margin: '0 auto 40px',
               borderRadius: '50%',
               overflow: 'hidden',
               border: '2px solid #004d1a',
               boxShadow: '0 0 20px rgba(0, 255, 100, 0.15) inset, 0 0 15px rgba(0, 255, 100, 0.1)'
             }}>
               {/* ATC Radar GIF */}
               <img
                 src="/radar.gif"
                 alt="ATC Radar"
                 style={{
                   position: 'absolute',
                   inset: 0,
                   width: '100%',
                   height: '100%',
                   objectFit: 'cover',
                   mixBlendMode: 'screen',
                   opacity: 0.9
                 }}
               />

               {/* North/East/South/West overlays */}
               <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', fontSize: 7, color: 'rgba(0, 255, 100, 0.45)', fontWeight: 700 }}>N</div>
               <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 7, color: 'rgba(0, 255, 100, 0.45)', fontWeight: 700 }}>E</div>
               <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', fontSize: 7, color: 'rgba(0, 255, 100, 0.45)', fontWeight: 700 }}>S</div>
               <div style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 7, color: 'rgba(0, 255, 100, 0.45)', fontWeight: 700 }}>W</div>

               {/* Absolutely Positioned Blips on Top of Canvas */}
               <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                 {blips.map((blip, i) => {
                   // Map coordinates (-100 to 100) to percent (0% to 100%)
                   const leftPercent = 50 + (blip.x / 2);
                   const topPercent = 50 + (blip.y / 2);

                   return (
                     <div
                       key={blip.id}
                       ref={el => { blipsRef.current[i] = el; }}
                       data-angle={blip.angle}
                       style={{
                         position: 'absolute',
                         left: `${leftPercent}%`,
                         top: `${topPercent}%`,
                         transform: 'translate(-50%, -50%)',
                         opacity: 0.1,
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'center',
                         pointerEvents: 'none',
                         willChange: 'opacity'
                       }}
                     >
                       <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff64', boxShadow: '0 0 8px #00ff64' }} />
                       <div style={{ fontSize: 5, color: '#00ff64', marginTop: 2, fontWeight: 700, whiteSpace: 'nowrap', opacity: 0.8 }}>
                         {blip.label}
                       </div>
                     </div>
                   );
                 })}
               </div>
             </div>

            {/* Status HUD */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12, color: '#00ff64', maxWidth: 400, margin: '0 auto', width: '100%' }}>
              {[
                { label: 'CONTROLLER', value: 'OMKAR KUDALKAR' },
                { label: 'FREQUENCY', value: <div style={{ display: 'inline-flex', alignItems: 'center', width: '100%' }}>121.500 MHz <span style={{ marginLeft: 8, display: 'inline-block', width: 60, height: 8, background: 'rgba(0,255,100,0.2)', position: 'relative' }}><span className="freq-bar" style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '80%', background: '#00ff64' }}/></span></div> },
                { label: 'STATUS', value: <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><motion.span animate={shouldReduceMotion ? {} : { opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff64' }}/> ACTIVE — ON DUTY</span> },
                { label: 'LOCATION', value: 'MUMBAI APPROACH (BOM)' },
                { label: 'CLEARANCE', value: 'AVAILABLE FOR INTERNSHIP / FREELANCE' },
                { label: 'VISIBILITY', value: '10KM — CONDITIONS CLEAR' }
              ].map((line, i) => (
                <div key={i} ref={el => { typewritersRef.current[i] = el; }} className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <span style={{ width: 90, opacity: 0.6, flexShrink: 0 }}>{line.label}</span>
                  <span style={{ flex: 1, opacity: 0.9 }}>{line.value}</span>
                </div>
              ))}
            </div>

            <div style={{ flex: 1 }} />

            {/* Audio Waveform */}
            <div style={{ marginTop: 40, width: '100%', maxWidth: 400, margin: '40px auto 0' }}>
              <div style={{ fontSize: 10, color: 'rgba(0,255,100,0.6)', marginBottom: 8 }}>CHANNEL OPEN — AWAITING TRANSMISSION</div>
              <svg width="100%" height="24" preserveAspectRatio="none">
                {waveformBars.map((_, i) => (
                  <rect 
                    key={i}
                    ref={el => { waveformRef.current[i] = el; }}
                    x={`${(i / waveformBars.length) * 100}%`} 
                    y="4" 
                    width={`${100 / waveformBars.length - 1}%`} 
                    height="20" 
                    fill="rgba(0,255,100,0.4)" 
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div 
            ref={rightPanelRef}
            className="atc-right"
            style={{
              padding: '40px 24px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(90deg, rgba(59,130,246,0.03) 0%, transparent 100%)'
            }}
          >
            <div className="right-panel-border" style={{ position: 'absolute', left: -1, top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, rgba(59,130,246,0.5), transparent)' }} />
            
            <div style={{ maxWidth: 480, width: '100%', margin: '0 auto', paddingBottom: 64 }}>
              {/* Header */}
              <div className="tx-header" style={{ marginBottom: 48, borderBottom: '1px solid rgba(0,255,100,0.3)', paddingBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(0,255,100,0.8)' }}>
                  <span>TRANSMISSION REQUEST <motion.span animate={shouldReduceMotion ? {} : { opacity: [1,0] }} transition={{ duration: 0.8, repeat: Infinity }}>_</motion.span></span>
                  <span>FREQ: 121.500 MHz</span>
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>PILOT → CONTROLLER</div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                
                {/* Field 1: Callsign */}
                <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 1.4 }}>
                  <ConsoleInput 
                    label="CALLSIGN" 
                    value={callsign} 
                    onChange={(e: any) => { setCallsign(e.target.value); handleInput(); }} 
                    placeholder="IDENTIFY YOURSELF, PILOT" 
                  />
                </motion.div>

                {/* Field 2: Contact Type */}
                <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 1.5 }} style={{ position: 'relative' }}>
                  <div style={{ fontSize: 12, color: 'rgba(0,255,100,0.6)', marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                    CONTACT TYPE <span style={{ flex: 1, height: 1, background: 'rgba(0,255,100,0.2)', marginLeft: 8 }} />
                  </div>
                  <div 
                    onClick={() => setTypeOpen(!typeOpen)}
                    style={{ 
                      display: 'flex', alignItems: 'center', background: '#0a1628', 
                      border: `1px solid ${typeOpen ? 'rgba(0,255,100,0.6)' : 'rgba(0,255,100,0.2)'}`,
                      padding: '12px 16px', color: '#00ff64', fontSize: 14, cursor: 'pointer',
                      boxShadow: typeOpen ? '0 0 12px rgba(0,255,100,0.1)' : 'none'
                    }}
                  >
                    <span style={{ color: 'rgba(0,255,100,0.5)', marginRight: 12 }}>{'>'}</span>
                    <span style={{ flex: 1 }}>{contactType}</span>
                    <ChevronDown size={16} />
                  </div>
                  <AnimatePresence>
                    {typeOpen && (
                      <motion.div 
                        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                        style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#0a1628', border: '1px solid rgba(0,255,100,0.4)', zIndex: 10, marginTop: 4 }}
                      >
                        {ContactTypeOptions.map(opt => (
                          <div 
                            key={opt}
                            onClick={() => { setContactType(opt); setTypeOpen(false); }}
                            style={{ padding: '12px 16px', fontSize: 13, color: opt === contactType ? '#00ff64' : 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                            onMouseEnter={e => {
                              if (!canHover) return;
                              e.currentTarget.style.background = 'rgba(0,255,100,0.1)';
                            }}
                            onMouseLeave={e => {
                              if (!canHover) return;
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            {opt === contactType && <div style={{ width: 6, height: 6, background: '#00ff64', borderRadius: '50%' }} />}
                            <span style={{ marginLeft: opt === contactType ? 0 : 14 }}>{opt}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Field 3: Transmission */}
                <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 1.6 }}>
                  <ConsoleTextarea 
                    label="TRANSMISSION" 
                    value={message} 
                    onChange={(e: any) => { setMessage(e.target.value); handleInput(); }} 
                    placeholder="BEGIN TRANSMISSION..." 
                  />
                </motion.div>

                {/* Field 4: Origin Frequency (Email) */}
                <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 1.7 }}>
                  <ConsoleInput 
                    label="RETURN FREQUENCY (EMAIL)" 
                    value={email} 
                    onChange={(e: any) => { setEmail(e.target.value); handleInput(); }} 
                    onBlur={() => { setEmailTouched(true); }}
                    placeholder="YOUR CONTACT FREQUENCY" 
                    error={emailTouched && emailValid === false}
                    success={emailTouched && emailValid === true}
                  />
                  {emailTouched && emailValid === false && (
                    <div style={{ color: '#ef4444', fontSize: 10, marginTop: 8 }}>INVALID FREQUENCY FORMAT</div>
                  )}
                  {emailTouched && emailValid === true && (
                    <div style={{ color: '#00ff64', fontSize: 10, marginTop: 8 }}>✓ FREQUENCY CONFIRMED</div>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: shouldReduceMotion ? 0 : 1.8, type: 'spring' }} style={{ marginTop: 16 }}>
                  <button
                    type="submit"
                    disabled={submitState !== 'idle'}
                    style={{
                      width: '100%', padding: '16px', borderRadius: 999, border: '1px solid rgba(0,255,100,0.4)',
                      background: submitState === 'success' ? '#00ff64' : 'linear-gradient(135deg, #064e3b, #065f46)',
                      color: submitState === 'success' ? '#001a0d' : '#00ff64',
                      fontSize: 14, fontFamily: 'inherit', fontWeight: 'bold', cursor: submitState === 'idle' ? 'pointer' : 'default',
                      position: 'relative', overflow: 'hidden', boxShadow: '0 0 16px rgba(0,255,100,0.1)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={e => {
                      if (!canHover || submitState !== 'idle') return;
                      e.currentTarget.style.boxShadow = '0 0 24px rgba(0,255,100,0.3)';
                    }}
                    onMouseLeave={e => {
                      if (!canHover || submitState !== 'idle') return;
                      e.currentTarget.style.boxShadow = '0 0 16px rgba(0,255,100,0.1)';
                    }}
                  >
                    {submitState === 'transmitting' && (
                      <motion.div 
                        initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2, ease: "linear" }}
                        style={{ position: 'absolute', top: 0, left: 0, bottom: 0, background: 'rgba(0,255,100,0.2)' }}
                      />
                    )}
                    <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      {submitState === 'idle' && <>▶ INITIATE TRANSMISSION</>}
                      {submitState === 'transmitting' && <>TRANSMITTING...</>}
                      {submitState === 'success' && <><Check size={16} /> TRANSMISSION RECEIVED</>}
                    </span>
                  </button>
                </motion.div>

              </form>

              {/* Direct Contact Strip */}
              <motion.div 
                initial={shouldReduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: shouldReduceMotion ? 0 : 2.0 }}
                style={{ marginTop: 64 }}
              >
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                  ─── OR REACH ME DIRECTLY <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)', marginLeft: 8 }} />
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div 
                    onClick={copyEmail}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: '1px solid rgba(0,255,100,0.2)', color: copied ? '#00ff64' : '#a0a0a8', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.02)' }}
                  >
                    <Mail size={14} />
                    {copied ? 'COPIED TO FREQUENCY LOG' : omkar.email}
                    {!copied && <Copy size={12} style={{ opacity: 0.5 }} />}
                  </div>
                  <a href={omkar.linkedin} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', border: '1px solid rgba(0,255,100,0.2)', color: '#a0a0a8', fontSize: 12, textDecoration: 'none', background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }} onMouseEnter={e => { if (!canHover) return; e.currentTarget.style.borderColor = 'rgba(0,255,100,0.6)'; }} onMouseLeave={e => { if (!canHover) return; e.currentTarget.style.borderColor = 'rgba(0,255,100,0.2)'; }}>
                    LinkedIn <ExternalLink size={12} />
                  </a>
                  <a href={omkar.github} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', border: '1px solid rgba(0,255,100,0.2)', color: '#a0a0a8', fontSize: 12, textDecoration: 'none', background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }} onMouseEnter={e => { if (!canHover) return; e.currentTarget.style.borderColor = 'rgba(0,255,100,0.6)'; }} onMouseLeave={e => { if (!canHover) return; e.currentTarget.style.borderColor = 'rgba(0,255,100,0.2)'; }}>
                    GitHub <ExternalLink size={12} />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function ConsoleInput({ label, value, onChange, onBlur, placeholder, error, success }: any) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? '#ef4444' : success ? '#00ff64' : focused ? 'rgba(0,255,100,0.6)' : 'rgba(0,255,100,0.2)';
  
  return (
    <div>
      <div style={{ fontSize: 12, color: error ? '#ef4444' : 'rgba(0,255,100,0.6)', marginBottom: 8, display: 'flex', alignItems: 'center', transition: 'all 0.2s', transform: focused || value ? 'translateY(0)' : 'translateY(4px)' }}>
        {label} <span style={{ flex: 1, height: 1, background: borderColor, marginLeft: 8, transition: 'all 0.2s' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', background: '#0a1628', border: `1px solid ${borderColor}`, padding: '12px 16px', boxShadow: focused && !error ? '0 0 12px rgba(0,255,100,0.1)' : 'none', transition: 'all 0.2s' }}>
        <span style={{ color: error ? '#ef4444' : 'rgba(0,255,100,0.5)', marginRight: 12 }}>{'>'}</span>
        <input 
          type="text" 
          value={value} 
          onChange={onChange} 
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); if (onBlur) onBlur(e); }}
          placeholder={focused ? '' : placeholder}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: error ? '#ef4444' : '#00ff64', fontFamily: 'inherit', fontSize: 14 }}
        />
      </div>
    </div>
  );
}

function ConsoleTextarea({ label, value, onChange, placeholder }: any) {
  const [focused, setFocused] = useState(false);
  const borderColor = focused ? 'rgba(0,255,100,0.6)' : 'rgba(0,255,100,0.2)';
  
  return (
    <div>
      <div style={{ fontSize: 12, color: 'rgba(0,255,100,0.6)', marginBottom: 8, display: 'flex', alignItems: 'center', transition: 'all 0.2s', transform: focused || value ? 'translateY(0)' : 'translateY(4px)' }}>
        {label} <span style={{ flex: 1, height: 1, background: borderColor, marginLeft: 8, transition: 'all 0.2s' }} />
      </div>
      <div style={{ display: 'flex', background: '#0a1628', border: `1px solid ${borderColor}`, padding: '12px 16px', boxShadow: focused ? '0 0 12px rgba(0,255,100,0.1)' : 'none', transition: 'all 0.2s', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', color: 'rgba(0,255,100,0.5)', marginRight: 12, marginTop: 2, gap: 4 }}>
           <span>{'>'}</span><span>{'>'}</span><span>{'>'}</span>
        </div>
        <textarea 
          value={value} 
          onChange={onChange} 
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? '' : placeholder}
          rows={4}
          maxLength={500}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#00ff64', fontFamily: 'inherit', fontSize: 14, resize: 'none' }}
        />
        <div style={{ position: 'absolute', bottom: 8, right: 12, fontSize: 10, color: 'rgba(0,255,100,0.4)' }}>
          {value.length} / 500
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/contact')({
  component: ContactPage,
});
