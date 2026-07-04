import { useEffect, useState, useRef, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

interface AirplaneLandingIntroProps {
  onFinish: () => void;
}

// Pre-load the GLB model to ensure fast load time
useGLTF.preload("/Jet.glb");

// 3D Jet Model component
function JetModel({ animState }: { animState: React.MutableRefObject<{ x: number; y: number; z: number; rx: number; ry: number; rz: number; scale: number; wireframe: number }> }) {
  const { scene } = useGLTF("/Jet.glb");
  const modelRef = useRef<THREE.Group>(null);
  
  // Cache map to store original GLB materials on load
  const originalMaterials = useRef<Map<string, THREE.Material>>(new Map());

  // Store original materials on mount
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        originalMaterials.current.set(mesh.uuid, mesh.material as THREE.Material);
      }
    });
  }, [scene]);

  const wireframeMaterial = useRef(new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    wireframe: true,
    transparent: true,
    opacity: 0.85
  }));

  useFrame(() => {
    if (!modelRef.current) return;

    // Apply animated values from GSAP ref
    modelRef.current.position.set(animState.current.x, animState.current.y, animState.current.z);
    modelRef.current.rotation.set(animState.current.rx, animState.current.ry, animState.current.rz);
    modelRef.current.scale.setScalar(animState.current.scale);

    // Toggle materials based on active section wireframe value (lerped between 0 and 1)
    const isWireframe = animState.current.wireframe > 0.5;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (isWireframe) {
          mesh.material = wireframeMaterial.current;
        } else {
          const orig = originalMaterials.current.get(mesh.uuid);
          if (orig) {
            mesh.material = orig;
          }
        }
      }
    });
  });

  return <primitive ref={modelRef} object={scene} />;
}

export function AirplaneLandingIntro({ onFinish }: AirplaneLandingIntroProps) {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true on mount to avoid SSR issues with Canvas
  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const tau = Math.PI * 2;

  // Plane animation state ref matching the exact Codepen positioning space (Camera at Z=180)
  const planeAnimState = useRef({
    x: 80,
    y: -32,
    z: -60,
    rx: 0,
    ry: tau * -0.25,
    rz: 0,
    scale: 13.5, // Even larger colossal scale to make the jet massive
    wireframe: 0
  });

  useGSAP(() => {
    if (loading || !isClient) return;

    // Set initial stroke-dasharray & stroke-dashoffset on SVG elements
    gsap.set(["#line-length", "#line-wingspan", "#circle-phalange"], {
      strokeDasharray: 1000,
      strokeDashoffset: 1000
    });

    const sectionDuration = 1;

    // Main flight timeline incorporating the exact Codepen flight path positions & rotations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".content-trigger",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onLeave: () => {
          // Once scroll finishes, fade out and transition to home chatbot
          gsap.to(".airplane-landing-viewport", {
            opacity: 0,
            duration: 0.8,
            onComplete: onFinish,
          });
        },
      },
      defaults: { duration: sectionDuration, ease: "power2.inOut" }
    });

    let delay = 0;

    // ── Phase 1: Scroll CTA fade out and initial takeoff entry ──
    tl.to(".scroll-cta", { duration: 0.25, opacity: 0 }, delay);
    tl.to(planeAnimState.current, { x: -10, ease: "power1.in" }, delay);

    delay += sectionDuration;

    // ── Phase 2: Buses (tilt and translate left) ──
    tl.to(planeAnimState.current, { rx: tau * 0.25, ry: 0, rz: -tau * 0.05, ease: "power1.inOut" }, delay);
    tl.to(planeAnimState.current, { x: -40, y: 0, z: -60, ease: "power1.inOut" }, delay);

    delay += sectionDuration;

    // ── Phase 3: Leave ground (orbit and bank right) ──
    tl.to(planeAnimState.current, { rx: tau * 0.25, ry: 0, rz: tau * 0.05, ease: "power3.inOut" }, delay);
    tl.to(planeAnimState.current, { x: 40, y: 0, z: -60, ease: "power2.inOut" }, delay);

    delay += sectionDuration;

    // ── Phase 4: Fly sky (bank left and climb) ──
    tl.to(planeAnimState.current, { rx: tau * 0.2, ry: 0, rz: -tau * 0.1, ease: "power3.inOut" }, delay);
    tl.to(planeAnimState.current, { x: -40, y: 0, z: -30, ease: "power2.inOut" }, delay);

    delay += sectionDuration;

    // ── Phase 5: Blueprint start (align pointing straight down, shift to wireframe) ──
    tl.to(planeAnimState.current, { rx: 0, rz: 0, ry: tau * 0.25 }, delay);
    tl.to(planeAnimState.current, { x: 0, y: -10, z: 50 }, delay);
    tl.to(planeAnimState.current, { wireframe: 1, duration: 0.5 }, delay);

    delay += sectionDuration;
    delay += sectionDuration; // hold blueprint wireframe state

    // ── Phase 6: Facts - Length (vertical dimension scale & position shift) ──
    tl.to(planeAnimState.current, { rx: tau * 0.25, ry: tau * 0.5, rz: 0, ease: "power4.inOut" }, delay);
    tl.to(planeAnimState.current, { z: 30, ease: "power4.inOut" }, delay);

    delay += sectionDuration;

    // ── Phase 7: Facts - Wingspan ──
    tl.to(planeAnimState.current, { rx: tau * 0.25, ry: tau * 0.5, rz: 0, ease: "power4.inOut" }, delay);
    tl.to(planeAnimState.current, { z: 60, x: 30, ease: "power4.inOut" }, delay);

    delay += sectionDuration;

    // ── Phase 8: Facts - Left Phalange ──
    tl.to(planeAnimState.current, { rx: tau * 0.35, ry: tau * 0.75, rz: tau * 0.6, ease: "power4.inOut" }, delay);
    tl.to(planeAnimState.current, { z: 100, x: 20, y: 0, ease: "power4.inOut" }, delay);

    delay += sectionDuration;

    // ── Phase 9: Facts - Engines (climb away and reset solid texture) ──
    tl.to(planeAnimState.current, { rx: tau * 0.15, ry: tau * 0.85, rz: -tau * 0, ease: "power1.in" }, delay);
    tl.to(planeAnimState.current, { z: -150, x: 0, y: 0, ease: "power1.inOut" }, delay);
    tl.to(planeAnimState.current, { wireframe: 0, duration: 0.5 }, delay);

    delay += sectionDuration;

    // ── Phase 10: Exit into Sunset (accelerate off-screen) ──
    tl.to(planeAnimState.current, { duration: sectionDuration, rx: -tau * 0.05, ry: tau, rz: -tau * 0.1, ease: "none" }, delay);
    tl.to(planeAnimState.current, { duration: sectionDuration, x: 0, y: 30, z: 320, ease: "power1.in" }, delay);

    // ── ScrollTrigger SVG line drawings matching the timeline layout ──
    gsap.to("#line-length", {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: ".length",
        scrub: true,
        start: "top bottom",
        end: "top top"
      }
    });

    gsap.to("#line-wingspan", {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: ".wingspan",
        scrub: true,
        start: "top 25%",
        end: "bottom 50%"
      }
    });

    gsap.to("#circle-phalange", {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: ".phalange",
        scrub: true,
        start: "top 50%",
        end: "bottom 100%"
      }
    });

    // Fading lines out
    gsap.to("#line-length", {
      opacity: 0,
      strokeDashoffset: 1000,
      scrollTrigger: {
        trigger: ".length",
        scrub: true,
        start: "top top",
        end: "bottom top"
      }
    });

    gsap.to("#line-wingspan", {
      opacity: 0,
      strokeDashoffset: 1000,
      scrollTrigger: {
        trigger: ".wingspan",
        scrub: true,
        start: "top top",
        end: "bottom top"
      }
    });

    gsap.to("#circle-phalange", {
      opacity: 0,
      strokeDashoffset: 1000,
      scrollTrigger: {
        trigger: ".phalange",
        scrub: true,
        start: "top top",
        end: "bottom top"
      }
    });

    // Ground & clouds parallax movement
    gsap.to(".ground", {
      y: "30%",
      scrollTrigger: {
        trigger: ".ground-container",
        scrub: true,
        start: "top bottom",
        end: "bottom top"
      }
    });

    gsap.from(".clouds", {
      y: "25%",
      scrollTrigger: {
        trigger: ".ground-container",
        scrub: true,
        start: "top bottom",
        end: "bottom top"
      }
    });

  }, [loading, isClient]);

  const handleSkip = () => {
    gsap.to(".airplane-landing-viewport", {
      opacity: 0,
      duration: 0.5,
      onComplete: onFinish,
    });
  };

  return (
    <div className="airplane-landing-viewport">
      {/* Skip Button */}
      <button onClick={handleSkip} className="skip-landing-btn">
        SKIP INTRO ➔
      </button>

      {/* Loading Screen */}
      {loading && (
        <div className="loading">PREPARING FLIGHT...</div>
      )}

      {/* Trigger element dictates the scroll boundaries */}
      <div className="content-trigger" style={{ width: "100%", position: "relative" }}>
        
        {/* Content Wrapper matching CSS selectors */}
        <div className="content">
          
          {/* Fixed Stage for Plane Render (Camera Z=180 matching Codepen specs) */}
          <div className="plane-flight-stage">
            {isClient && (
              <Canvas camera={{ position: [0, 0, 180], fov: 45 }} style={{ pointerEvents: "none" }}>
                <ambientLight intensity={2.2} />
                <directionalLight position={[0, 100, 150]} intensity={2.0} />
                <directionalLight position={[0, -100, 150]} intensity={1.0} />
                <directionalLight position={[-150, 0, 50]} intensity={1.0} />
                <Suspense fallback={null}>
                  <JetModel animState={planeAnimState} />
                </Suspense>
              </Canvas>
            )}
          </div>

          {/* ── Section 1: Intro ── */}
          <div className="section">
            <h1>Omkar Kudalkar.</h1>
            <h3>The Portfolio Guide.</h3>
            <p>You've probably never seen a portfolio like this.</p>
            <div className="scroll-cta" style={{ opacity: loading ? 0 : 1 }}>Scroll</div>
          </div>

          {/* ── Section 2: Buses comparison ── */}
          <div className="section right">
            <h2>Most are standard static sites...</h2>
          </div>

          {/* ── Ground / Clouds Parallax Container ── */}
          <div className="ground-container">
            <div className="parallax ground" />
            
            {/* ── Section 3: Leave ground ── */}
            <div className="section right">
              <h2>..except this one talks back.</h2>
              <p>Yes, really!</p>
            </div>

            {/* ── Section 4: Fly through sky ── */}
            <div className="section">
              <h2>Powered by conversational AI.</h2>
              <p>Ask anything about me.</p>
            </div>

            {/* ── Section 5: Physical laws ── */}
            <div className="section right">
              <h2>Defying traditional static resumes.</h2>
              <p>Explore interactive maps, experiences, and logs.</p>
            </div>
            <div className="parallax clouds" />
          </div>

          {/* ── Blueprint Facts & Figures ── */}
          <div className="blueprint">
            {/* Blueprint SVG overlay (drawn dynamically by ScrollTrigger) */}
            <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ pointerEvents: "none" }}>
              {/* Length measuring line (vertical) */}
              <line id="line-length" x1="10" y1="80" x2="90" y2="80" />
              {/* Wingspan measuring bracket path (horizontal) */}
              <path id="line-wingspan" d="M10 50 L40 35 M60 35 L90 50" />
              {/* Target callout circle (Engines/Tools) */}
              <circle id="circle-phalange" cx="60" cy="60" r="15" />
            </svg>

            <div className="section dark">
              <h2>The Technical Specs.</h2>
              <p>Let's get into the nitty gritty...</p>
            </div>

            <div className="section dark length">
              <h2>Full-Stack Dev.</h2>
              <p>Over 3 years of building production applications, scaling databases, and designing real-time interactive panels.</p>
            </div>

            <div className="section dark wingspan">
              <h2>AI / ML Engineering.</h2>
              <p>Building specialized agentic workflows with LangGraph, LangChain, custom vector indices, and speech APIs.</p>
            </div>

            <div className="section dark phalange">
              <h2>8+ Hackathon Wins.</h2>
              <p>Top finishes in major national competitions, building robust solutions under extreme time constraints.</p>
            </div>

            <div className="section dark">
              <h2>Interactive OS.</h2>
              <p>Equipped with reactive experiences, live ATC radars, and a direct chat connection to my digital agent.</p>
            </div>
          </div>

          {/* ── Sunset Outro & Credits ── */}
          <div className="sunset">
            <div className="section">
              {/* Spacer */}
            </div>
            <div className="section end">
              <h2>Begin flight.</h2>
              <ul className="credits">
                <li>Conversational AI Portfolio</li>
                <li>Keep scrolling or click skip to launch.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
