"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";

export default function MagneticButton({ children, href = "#", onClick, variant = "light" }) {
  const buttonRef = useRef(null);
  const iconRef = useRef(null);

  const handleMove = (e) => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(button, {
      x: x * 0.25,
      y: y * 0.25,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleLeave = () => {
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)"
    });
  };

  const handleEnter = () => {
    gsap.to(iconRef.current, {
      rotation: 0,
      scale: 1.1,
      duration: 0.35,
      ease: "back.out(1.7)"
    });
  };

  const handleIconLeave = () => {
    gsap.to(iconRef.current, {
      rotation: -45,
      scale: 1,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const Tag = href ? "a" : "button";
  const props = href ? { href } : { onClick, type: "button" };

  return (
    <Tag
      ref={buttonRef}
      className={`poc-button ${variant}`}
      onMouseMove={handleMove}
      onMouseLeave={(e) => {
        handleLeave();
        handleIconLeave();
      }}
      onMouseEnter={handleEnter}
      {...props}
    >
      <span className="poc-button-label">{children}</span>
      <span ref={iconRef} className="poc-button-icon" aria-hidden="true">
        <ArrowRight size={18} strokeWidth={2.5} />
      </span>
    </Tag>
  );
}
