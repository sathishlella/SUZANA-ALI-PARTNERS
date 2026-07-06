"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";

export default function MagneticButton({ children, href = "#", onClick, variant = "orange" }) {
  const buttonRef = useRef(null);
  const iconRef = useRef(null);
  const xTo = useRef(null);
  const yTo = useRef(null);
  const rotateTo = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const icon = iconRef.current;
    if (!button || !icon) return;

    xTo.current = gsap.quickTo(button, "x", { duration: 0.4, ease: "power2.out" });
    yTo.current = gsap.quickTo(button, "y", { duration: 0.4, ease: "power2.out" });
    rotateTo.current = gsap.quickTo(icon, "rotation", { duration: 0.35, ease: "back.out(1.7)" });

    return () => {
      gsap.killTweensOf(button);
      gsap.killTweensOf(icon);
    };
  }, []);

  const handleMove = (e) => {
    const button = buttonRef.current;
    if (!button || !xTo.current || !yTo.current) return;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    xTo.current(x * 0.25);
    yTo.current(y * 0.25);
  };

  const handleLeave = () => {
    if (xTo.current && yTo.current) {
      xTo.current(0);
      yTo.current(0);
    }
    if (rotateTo.current) rotateTo.current(-45);
  };

  const handleEnter = () => {
    if (rotateTo.current) rotateTo.current(0);
  };

  const Tag = href ? "a" : "button";
  const props = href ? { href } : { onClick, type: "button" };

  return (
    <Tag
      ref={buttonRef}
      className={`magnetic-button ${variant}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={handleEnter}
      {...props}
    >
      <span className="magnetic-button-label">{children}</span>
      <span ref={iconRef} className="magnetic-button-icon" aria-hidden="true" style={{ transform: "rotate(-45deg)" }}>
        <ArrowRight size={18} strokeWidth={2.5} />
      </span>
    </Tag>
  );
}
