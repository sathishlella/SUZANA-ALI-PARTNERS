"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { partners } from "@/lib/firm-data";

gsap.registerPlugin(ScrollTrigger);

function getTransform(offset) {
  if (offset === 0) return { x: 0, y: 0, rotate: 0, scale: 1, zIndex: 10 };
  if (offset === 1 || offset === -2) return { x: 90, y: 18, rotate: 7, scale: 0.92, zIndex: 5 };
  return { x: -90, y: 18, rotate: -7, scale: 0.92, zIndex: 1 };
}

export default function PartnerStack() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const headerRef = useRef(null);
  const [active, setActive] = useState(0);

  const total = partners.length;

  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const offset = (i - active + total) % total;
      const t = getTransform(offset);
      gsap.to(card, {
        x: t.x,
        y: t.y,
        rotation: t.rotate,
        scale: t.scale,
        zIndex: t.zIndex,
        duration: 0.7,
        ease: "power3.out"
      });
    });
  }, [active, total]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(
        cardsRef.current,
        { y: 120, opacity: 0, scale: 0.86 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 62%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const next = () => setActive((prev) => (prev + 1) % total);
  const prev = () => setActive((prev) => (prev - 1 + total) % total);

  return (
    <section ref={sectionRef} id="partners" className="partners-section">
      <div className="partners-inner">
        <div ref={headerRef} className="partners-header">
          <span className="eyebrow">Partners</span>
          <h2 className="section-title">
            Counsel your matter <span className="accent">deserves.</span>
          </h2>
          <p className="section-lead">
            Three partners, distinct strengths, one standard: clear judgment and direct access.
          </p>
        </div>

        <div className="stack-stage" aria-label="Partner profiles">
          {partners.map((partner, i) => {
            const offset = (i - active + total) % total;
            const t = getTransform(offset);
            const initials = partner.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            return (
              <article
                key={partner.id}
                ref={(el) => (cardsRef.current[i] = el)}
                className="partner-card-stack"
                style={{
                  transform: `translateX(${t.x}px) translateY(${t.y}px) rotate(${t.rotate}deg) scale(${t.scale})`,
                  zIndex: t.zIndex
                }}
                onClick={() => setActive(i)}
              >
                {partner.photo ? (
                  <div className="partner-card-photo">
                    <img src={partner.photo} alt={partner.name} />
                  </div>
                ) : (
                  <div className="partner-card-avatar">{initials}</div>
                )}
                <h3>{partner.name}</h3>
                <span>{partner.title}</span>
                <p>{partner.focus}</p>
              </article>
            );
          })}
        </div>

        <div className="stack-controls">
          <button onClick={prev} aria-label="Previous partner" className="stack-control">
            <ChevronLeft size={22} />
          </button>
          <div className="stack-dots">
            {partners.map((_, i) => (
              <button
                key={i}
                className={`stack-dot ${i === active ? "active" : ""}`}
                onClick={() => setActive(i)}
                aria-label={`Show partner ${i + 1}`}
              />
            ))}
          </div>
          <button onClick={next} aria-label="Next partner" className="stack-control">
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}
