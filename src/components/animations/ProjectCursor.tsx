import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function ProjectCursor() {
  const [isHoverable, setIsHoverable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Track mouse coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smooth the movement using a spring
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if the device has a fine pointer (not a touch screen)
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    // If reduced motion, we won't use the custom cursor
    if (!mediaQuery.matches || reducedMotion) {
      return;
    }
    
    setIsHoverable(true);

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Ensure cursor is visible once it starts moving
      if (!isVisible) setIsVisible(true);
    };

    // Hide cursor when leaving window
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isHoverable) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 140,
        height: 140,
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
        pointerEvents: "none",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "white",
          mixBlendMode: "difference", // Gives a nice effect on dark backgrounds
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            background: "black",
            borderRadius: "50%",
          }}
        />
      </div>
    </motion.div>
  );
}
