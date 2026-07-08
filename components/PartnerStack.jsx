"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { partners } from "@/lib/firm-data";

gsap.registerPlugin(ScrollTrigger);

export default function PartnerStack() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
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
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="partners" className="partners-section">
      <div className="container">
        <div ref={headerRef} className="section-header centered">
          <span className="eyebrow">Advocates &amp; Solicitors</span>
          <h2 className="section-title">
            Counsel your matter <span className="accent">deserves.</span>
          </h2>
          <p className="section-lead">One firm, shared standards: clear judgment and direct access.</p>
        </div>

        <div className="partners-grid">
          {partners.map((partner, i) => {
            const initials = partner.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            return (
              <article
                key={partner.id}
                ref={(el) => (cardsRef.current[i] = el)}
                className="partner-card"
              >
                {partner.photo ? (
                  <div className="partner-photo">
                    <img src={partner.photo} alt={partner.name} />
                  </div>
                ) : (
                  <div className="partner-monogram">{initials}</div>
                )}
                <h3>{partner.name}</h3>
                <span className="partner-role">{partner.title}</span>
                {partner.qualification && (
                  <p className="partner-qualification">
                    {partner.qualification.split(";").map((line, index) => (
                      <span className="qual-line" key={index}>
                        {line.trim()}
                      </span>
                    ))}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
