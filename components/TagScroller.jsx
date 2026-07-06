"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { matterTypes } from "@/lib/firm-data";

gsap.registerPlugin(ScrollTrigger);

export default function TagScroller() {
  const sectionRef = useRef(null);
  const rowRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rowRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="tag-section">
      <div className="tag-row" ref={rowRef}>
        {matterTypes.map((type) => (
          <span key={type} className="tag-pill">
            {type}
          </span>
        ))}
      </div>
    </section>
  );
}
