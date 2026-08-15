import { useEffect, useState, useRef, Suspense } from "react";
import { gsap } from "gsap";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Pre-load the same low-poly jet GLB used by the landing page
useGLTF.preload("/Jet.glb");

// Camera constants matching the landing page flight stage
const CAM_Z = 300;
const FOV = 45;
const DEPTH = 35;

interface OrbitPlaneState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  depth: number;
}

// 3D Low-poly Jet model driven by the GSAP orbit state
function OrbitJet({ state }: { state: React.MutableRefObject<OrbitPlaneState> }) {
  const { scene } = useGLTF("/Jet.glb");
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const model = modelRef.current;
    if (!model) return;
    const s = state.current;

    // Convert screen-space pixels (driven by GSAP) into world units
    const vh = window.innerHeight;
    const pxPerUnit = vh / (2 * CAM_Z * Math.tan((FOV * Math.PI) / 360));
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    model.position.set((s.x - cx) / pxPerUnit, -(s.y - cy) / pxPerUnit, (s.depth * 2 - 1) * DEPTH);
    // Base ry = +90deg points the nose right (+x) like the old SVG,
    // rz banks it along the ellipse tangent (screen-plane rotation).
    model.rotation.set(0, Math.PI / 2, (s.rotation * Math.PI) / 180);
    model.scale.setScalar(s.scale);
  });

  return <primitive ref={modelRef} object={scene} />;
}

export function IntroAnimation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<(HTMLDivElement | null)[]>([]);
  const planeState = useRef<OrbitPlaneState>({ x: 0, y: 0, scale: 0.15, rotation: 0, depth: 0 });
  const planeWrapRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(SVGCircleElement | null)[]>([]);
  const bracketLeftRef = useRef<HTMLDivElement>(null);
  const bracketRightRef = useRef<HTMLDivElement>(null);
  const nameTextRef = useRef<HTMLHeadingElement>(null);

  const numColumns = 8;
  const trailPositions = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    // Check sessionStorage to play only once per session
    const hasPlayed = sessionStorage.getItem("introPlayed");
    if (hasPlayed) {
      setIsPlaying(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsReducedMotion(prefersReducedMotion);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    // Lock scrolling while intro is playing
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("introPlayed", "true");
          setIsPlaying(false);
          document.body.style.overflow = "";
        },
      });

      // Stage 1a: Draw the mark
      if (isReducedMotion) {
        gsap.set(".intro-mark-path", { strokeDashoffset: 0 });
        gsap.set(".intro-letter", { opacity: 1, y: 0, scale: 1 });
        tl.to({}, { duration: 0.5 }); // Short hold
      } else {
        // Position variables for relative orbit paths
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const isMobileView = window.innerWidth < 480;

        // Ellipse parameters
        const a = isMobileView ? 180 : 320;
        const b = isMobileView ? 50 : 80;

        // Keep the 3D jet a consistent on-screen size across viewports
        const sizeScale = Math.max(window.innerHeight / 1080, 0.5);
        const orbitScale = 4 * sizeScale;

        // Hide plane initially
        gsap.set(planeState.current, {
          x: centerX,
          y: centerY,
          scale: orbitScale * 0.15,
          rotation: 0,
          depth: 0,
        });
        gsap.set(planeWrapRef.current, {
          opacity: 0,
          zIndex: 5,
        });

        // Initialize trail dots
        trailRefs.current.forEach((dot) => {
          if (dot) {
            gsap.set(dot, { opacity: 0, x: centerX, y: centerY });
          }
        });

        // 1. Draw SVG bracket outlines
        tl.to(".intro-mark-path.p1", { strokeDashoffset: 0, duration: 0.4, ease: "power2.inOut" })
          .to(
            ".intro-mark-path.p2",
            { strokeDashoffset: 0, duration: 0.4, ease: "power2.inOut" },
            "-=0.25",
          )
          .to(
            ".intro-mark-path.p3",
            { strokeDashoffset: 0, duration: 0.4, ease: "power2.inOut" },
            "-=0.25",
          );

        // Pause briefly
        tl.to({}, { duration: 0.2 });

        // 2. Name Reveal (staggered letters fade in & move up slightly)
        tl.fromTo(
          ".intro-letter",
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.5)", stagger: 0.08 },
        );

        // Hold the name on screen so it registers before plane enters
        tl.to({}, { duration: 0.6 });

        // 3. Stage 1.5A — Plane enters from behind (depth illusion)
        tl.to(planeState.current, {
          scale: orbitScale,
          // Position it to start at the leftmost point of the ellipse (-a, 0)
          x: centerX - a,
          y: centerY,
          duration: 0.6,
          ease: "power2.out",
        });
        tl.to(planeWrapRef.current, {
          opacity: 0.7,
          duration: 0.6,
          ease: "power2.out",
        });

        // Trail update function
        const updateTrail = (tx: number, ty: number) => {
          trailPositions.current.unshift({ x: tx, y: ty });
          trailPositions.current.splice(4); // Keep last 4 positions

          trailRefs.current.forEach((dot, index) => {
            if (!dot) return;
            const pos = trailPositions.current[index + 1];
            if (pos) {
              gsap.set(dot, {
                x: pos.x,
                y: pos.y,
                opacity: 0.6 - index * 0.18,
                scale: 1 - index * 0.25,
              });
            }
          });
        };

        // 4. Stage 1.5B — Orbit 1.5 times (use GSAP ticker / onUpdate)
        tl.to(
          { progress: 0 },
          {
            progress: 1.5,
            duration: 1.8,
            ease: "none",
            onUpdate: function () {
              const p = this.targets()[0].progress;
              // Ellipse path centered on "OMKAR" text
              // Counterclockwise: starts at Math.PI (leftmost point) and goes Pi -> 3Pi -> 4Pi
              const angle = Math.PI + p * Math.PI * 2;
              const x = centerX + Math.cos(angle) * a;
              const y = centerY + Math.sin(angle) * b;

              // Rotation = tangent angle of ellipse at current point
              // dx = -a * sin(angle), dy = b * cos(angle)
              const tangentAngle = Math.atan2(b * Math.cos(angle), -a * Math.sin(angle));

              const depth = (Math.sin(angle) + 1) / 2; // 0 (top/behind) to 1 (bottom/front)

              gsap.set(planeState.current, {
                x,
                y,
                rotation: tangentAngle * (180 / Math.PI),
                depth,
              });
              gsap.set(planeWrapRef.current, {
                opacity: 0.6 + depth * 0.4,
                zIndex: depth > 0.5 ? 20 : 5, // Swap z-index to create behind/front depth
              });

              updateTrail(x, y);
            },
          },
        );

        // 5. Stage 1.5C — Takeoff breakout (accelerates right)
        tl.to(planeState.current, {
          x: window.innerWidth + 120,
          y: centerY - 45,
          rotation: -8,
          scale: orbitScale * 0.6,
          duration: isMobileView ? 0.3 : 0.5,
          ease: "power3.in",
          onUpdate: function () {
            // Hide trail dots quickly as the plane exits
            trailRefs.current.forEach((dot) => {
              if (dot) gsap.set(dot, { opacity: 0 });
            });
          },
        });
        tl.to(planeWrapRef.current, {
          opacity: 0,
          duration: isMobileView ? 0.3 : 0.5,
          ease: "power3.in",
        });

        // Bracket close + name fade out simultaneously
        tl.to(bracketLeftRef.current, { x: -15, opacity: 0, duration: 0.25 }, "-=0.25");
        tl.to(bracketRightRef.current, { x: 15, opacity: 0, duration: 0.25 }, "-=0.25");
        tl.to(nameTextRef.current, { opacity: 0, duration: 0.2 }, "-=0.2");

        // Hold briefly before shutter transition
        tl.to({}, { duration: 0.2 });
      }

      // Stage 2: Shutter transition - grid of vertical blocks drop down out of view
      tl.to(blocksRef.current, {
        yPercent: 100, // Move down 100% of their height
        duration: 0.6,
        ease: "expo.inOut",
        stagger: isReducedMotion ? 0 : 0.08,
      });

      // Final fail-safe fade out of the container at the very end
      tl.to(containerRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [isPlaying, isReducedMotion]);

  // Once finished playing (or if skipped), completely unmount from the DOM
  if (!isPlaying) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999, // Ensure it covers everything
        display: "flex",
        flexDirection: "row",
        pointerEvents: "auto", // Prevent clicking things underneath during animation
        background: "transparent",
      }}
    >
      {/* The block overlay layer */}
      {Array.from({ length: numColumns }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            blocksRef.current[i] = el;
          }}
          style={{
            flex: 1,
            height: "100%",
            background: "#081326", // Solid dark bluish color overlay
            border: "1px solid rgba(255, 255, 255, 0.10)", // Subtle white border on all sides
            willChange: "transform",
          }}
        />
      ))}

      {/* The floating content layer */}
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          gap: "1rem",
        }}
      >
        {/* SVG < */}
        <div
          ref={bracketLeftRef}
          style={{ display: "flex", alignItems: "center", zIndex: 10, willChange: "transform" }}
        >
          <svg viewBox="0 0 40 40" style={{ height: "clamp(3rem, 10vw, 8rem)", width: "auto" }}>
            <path
              className="intro-mark-path p1"
              d="M30 5 L10 20 L30 35"
              fill="none"
              stroke="#e5e5e5"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="100"
              strokeDashoffset="100"
            />
          </svg>
        </div>

        {/* Name Reveal */}
        <h1
          ref={nameTextRef}
          style={{
            color: "#e5e5e5",
            fontSize: "clamp(3rem, 10vw, 8rem)",
            fontFamily: "'Archivo Black', sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            margin: 0,
            lineHeight: 1,
            zIndex: 10, // Must sit between z-index swaps of plane
            willChange: "opacity",
          }}
        >
          {"OMKAR".split("").map((letter, i) => (
            <span
              key={i}
              className="intro-letter"
              style={{ display: "inline-block", opacity: isReducedMotion ? 1 : 0 }}
            >
              {letter}
            </span>
          ))}
        </h1>

        {/* SVG /> */}
        <div
          ref={bracketRightRef}
          style={{ display: "flex", alignItems: "center", zIndex: 10, willChange: "transform" }}
        >
          <svg viewBox="0 0 60 40" style={{ height: "clamp(3rem, 10vw, 8rem)", width: "auto" }}>
            <path
              className="intro-mark-path p2"
              d="M30 5 L10 35"
              fill="none"
              stroke="#e5e5e5"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="100"
              strokeDashoffset="100"
            />
            <path
              className="intro-mark-path p3"
              d="M40 5 L60 20 L40 35"
              fill="none"
              stroke="#e5e5e5"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="100"
              strokeDashoffset="100"
            />
          </svg>
        </div>
      </div>

      {/* SVG Motion Trail System */}
      {!isReducedMotion && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 6, // Renders along with the plane depth
          }}
        >
          <circle
            ref={(el) => {
              trailRefs.current[0] = el;
            }}
            r="3"
            fill="#4f8ef7"
          />
          <circle
            ref={(el) => {
              trailRefs.current[1] = el;
            }}
            r="2"
            fill="#4f8ef7"
          />
          <circle
            ref={(el) => {
              trailRefs.current[2] = el;
            }}
            r="1"
            fill="#4f8ef7"
          />
        </svg>
      )}

      {/* 3D Low-poly Jet Asset (same GLB as the landing page) */}
      {!isReducedMotion && (
        <div
          ref={planeWrapRef}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            opacity: 0,
            pointerEvents: "none",
            willChange: "transform, opacity",
          }}
        >
          <Canvas
            camera={{ position: [0, 0, CAM_Z], fov: FOV }}
            style={{ pointerEvents: "none" }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={2.2} />
            <directionalLight position={[0, 100, 150]} intensity={2.0} />
            <directionalLight position={[0, -100, 150]} intensity={1.0} />
            <directionalLight position={[-150, 0, 50]} intensity={1.0} />
            <Suspense fallback={null}>
              <OrbitJet state={planeState} />
            </Suspense>
          </Canvas>
        </div>
      )}
    </div>
  );
}
