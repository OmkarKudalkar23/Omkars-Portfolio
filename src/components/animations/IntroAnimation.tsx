import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

export function IntroAnimation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<(HTMLDivElement | null)[]>([]);
  const numColumns = 8; // Adjust this to change the number of vertical shutter blocks

  useEffect(() => {
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
        tl.to(".intro-mark-path.p1", { strokeDashoffset: 0, duration: 0.4, ease: "power2.inOut" })
          .to(".intro-mark-path.p2", { strokeDashoffset: 0, duration: 0.4, ease: "power2.inOut" }, "-=0.25")
          .to(".intro-mark-path.p3", { strokeDashoffset: 0, duration: 0.4, ease: "power2.inOut" }, "-=0.25");

        // Pause briefly
        tl.to({}, { duration: 0.2 });

        // Stage 1b: Name Reveal (staggered letters fade in & move up slightly)
        tl.fromTo(
          ".intro-letter",
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.5)", stagger: 0.08 }
        );

        // Hold the name on screen so it registers
        tl.to({}, { duration: 0.7 });
      }

      // Stage 2: Transition out
      // 2a. The text fades out slightly overlapping with the blocks animating away
      tl.to(
        contentRef.current,
        { opacity: 0, scale: 0.95, duration: 0.4, ease: "power2.inOut" },
        "-=0.1"
      );

      // 2b. Shutter transition - grid of vertical blocks drop down out of view
      tl.to(
        blocksRef.current,
        {
          yPercent: 100, // Move down 100% of their height
          duration: 0.6,
          ease: "expo.inOut",
          stagger: isReducedMotion ? 0 : 0.08,
        },
        "-=0.3"
      );

      // 2c. Small fail-safe fade out of the container at the very end
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
            border: "1px solid rgba(255, 255, 255, 0.15)", // Subtle white border on all sides
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
        <div style={{ display: "flex", alignItems: "center" }}>
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
          }}
        >
          {"OMKAR".split("").map((letter, i) => (
            <span key={i} className="intro-letter" style={{ display: "inline-block", opacity: isReducedMotion ? 1 : 0 }}>
              {letter}
            </span>
          ))}
        </h1>

        {/* SVG /> */}
        <div style={{ display: "flex", alignItems: "center" }}>
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
    </div>
  );
}
