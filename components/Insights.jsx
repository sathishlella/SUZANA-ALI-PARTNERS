"use client";

import { useRef, useLayoutEffect } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const insights = [
  {
    category: "Banking",
    title: "Enforcing security documents in a shifting recovery landscape",
    excerpt:
      "What banks and financial institutions should consider before commencing enforcement proceedings in Malaysia."
  },
  {
    category: "Private Client",
    title: "Wills, trusts and the family business",
    excerpt:
      "How succession planning and probate strategy protect both family harmony and commercial continuity."
  },
  {
    category: "Corporate",
    title: "Government contracts: tender risks and contractual discipline",
    excerpt:
      "Practical guidance for institutions navigating public-sector procurement and performance obligations."
  }
];

export default function Insights() {
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
        { y: 50, opacity: 0 },
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
    <section ref={sectionRef} id="insights" className="insights-section">
      <div className="container">
        <div ref={headerRef} className="section-header centered">
          <span className="eyebrow">Insights</span>
          <h2 className="section-title">
            Notes on <span className="accent">judgment</span> and process.
          </h2>
          <p className="section-lead">Short perspectives on the legal and commercial issues our clients navigate.</p>
        </div>

        <div className="insights-grid">
          {insights.map((item, i) => (
            <article
              key={item.title}
              ref={(el) => (cardsRef.current[i] = el)}
              className="insight-card"
            >
              <div className="insight-meta">
                <span>{item.category}</span>
                <span>2026</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
              <a href="#contact" className="insight-link">
                Read more
                <ArrowRight size={16} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
