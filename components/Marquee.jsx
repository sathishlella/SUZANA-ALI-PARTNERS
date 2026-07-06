"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const items = [
  "Established 2020",
  "RM5,000,000 Professional Indemnity",
  "14 Panel Relationships",
  "Maybank Berhad",
  "Public Bank Berhad",
  "RHB Bank",
  "Bank Islam Malaysia Berhad",
  "Hong Leong Bank Berhad",
  "Medical Device Authority",
  "Embassy of the Kingdom of Bahrain"
];

export default function Marquee() {
  const trackRef = useRef(null);
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="marquee-section" aria-label="Firm credentials">
      <div className="marquee-track" ref={trackRef}>
        <div className="marquee-content">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="marquee-item">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
