"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function PageTransition() {
  const curtainRef = useRef(null);
  const wordmarkRef = useRef(null);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setDone(true)
      });

      tl.to(wordmarkRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      })
        .to(wordmarkRef.current, {
          opacity: 0,
          y: -12,
          duration: 0.4,
          ease: "power2.in"
        })
        .to(
          curtainRef.current,
          {
            yPercent: -100,
            duration: 0.9,
            ease: "power3.inOut"
          },
          "-=0.2"
        );
    });

    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <div ref={curtainRef} className="page-curtain">
      <span ref={wordmarkRef} className="page-curtain-wordmark" style={{ opacity: 0, transform: "translateY(12px)" }}>
        Suzana Ali &amp; Partners
      </span>
    </div>
  );
}
