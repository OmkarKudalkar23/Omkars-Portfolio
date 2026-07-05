import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function isTouchDevice() {
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function PlaneCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const prevPosRef = useRef({ x: 0, y: 0 });
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);
  const trailRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return;

    document.body.style.cursor = "none";

    const handleMouseMove = (e: MouseEvent) => {
      prevPosRef.current = { ...posRef.current };
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const cursor = cursorRef.current;
      if (!cursor) return;

      const { x, y } = posRef.current;
      const { x: px, y: py } = prevPosRef.current;
      const dx = x - px;
      const dy = y - py;

      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        let angleDiff = targetAngle - angleRef.current;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;
        angleRef.current += angleDiff * 0.15;
      }

      gsap.set(cursor, {
        x: x - 16,
        y: y - 16,
        rotation: angleRef.current,
        transformOrigin: "50% 50%",
      });

      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        const dot = document.createElement("div");
        dot.style.cssText = `
          position: fixed;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(79,142,247,0.6);
          pointer-events: none;
          z-index: 99998;
          left: ${x - 1.5}px;
          top: ${y - 1.5}px;
          box-shadow: 0 0 4px #4f8ef7;
        `;
        document.body.appendChild(dot);
        trailRef.current.push(dot);

        gsap.to(dot, {
          opacity: 0,
          scale: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => dot.remove(),
        });

        if (trailRef.current.length > 8) {
          const old = trailRef.current.shift();
          if (old && old.parentNode) old.remove();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    const el = () => cursorRef.current;
    const hoverIn = () => {
      const c = el();
      if (!c) return;
      gsap.to(c, {
        scale: 1.4,
        filter: "drop-shadow(0 0 6px #4f8ef7)",
        duration: 0.2,
        ease: "power2.out",
      });
    };
    const hoverOut = () => {
      const c = el();
      if (!c) return;
      gsap.to(c, { scale: 1, filter: "none", duration: 0.2, ease: "power2.out" });
    };

    const interactives = document.querySelectorAll<HTMLElement>(
      'a, button, [role="button"], input, textarea, select, [tabindex]',
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", hoverIn);
      el.addEventListener("mouseleave", hoverOut);
    });

    const handleClick = () => {
      const c = el();
      if (!c) return;
      gsap
        .timeline()
        .to(c, { scale: 0.7, duration: 0.08, ease: "power2.in" })
        .to(c, { scale: 1, duration: 0.25, ease: "back.out(3)" });
    };
    window.addEventListener("click", handleClick);

    const textInputs = document.querySelectorAll<HTMLElement>("input, textarea");
    textInputs.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        const c = cursorRef.current;
        if (!c) return;
        gsap.to(c, { rotation: 90, scale: 0.8, duration: 0.3, ease: "power2.out" });
      });
      el.addEventListener("mouseleave", () => {
        const c = cursorRef.current;
        if (!c) return;
        gsap.to(c, { scale: 1, duration: 0.2 });
      });
    });

    const handleMouseLeaveWindow = () => {
      const c = el();
      if (!c) return;
      gsap.to(c, { opacity: 0, duration: 0.2 });
    };
    const handleMouseEnterWindow = () => {
      const c = el();
      if (!c) return;
      gsap.to(c, { opacity: 1, duration: 0.2 });
    };

    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("click", handleClick);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", hoverIn);
        el.removeEventListener("mouseleave", hoverOut);
      });
      textInputs.forEach((el) => {
        el.removeEventListener("mouseenter", hoverIn);
        el.removeEventListener("mouseleave", hoverOut);
      });
      document.body.style.cursor = "auto";
    };
  }, []);

  if (typeof window !== "undefined" && (isTouchDevice() || prefersReducedMotion())) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 32,
        height: 32,
        pointerEvents: "none",
        zIndex: 99999,
        willChange: "transform",
      }}
      aria-hidden="true"
    >
      <img
        src="/plane-top-view.png"
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
