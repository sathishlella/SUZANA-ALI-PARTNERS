"use client";

import { useRef, useState, useLayoutEffect } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { practiceGroups } from "@/lib/firm-data";

gsap.registerPlugin(ScrollTrigger);

function BlurredStagger({ text, isOpen }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const chars = containerRef.current.querySelectorAll(".char");

    gsap.fromTo(
      chars,
      { opacity: 0, filter: "blur(8px)", y: 8 },
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.45,
        stagger: 0.012,
        ease: "power2.out"
      }
    );
  }, [isOpen]);

  return (
    <p ref={containerRef} className="blur-stagger-text">
      {text.split("").map((char, index) => (
        <span key={index} className="char" style={{ display: "inline-block" }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </p>
  );
}

export default function PracticeAccordion() {
  const [openIndex, setOpenIndex] = useState(0);
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
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
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

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section ref={sectionRef} id="practices" className="practices-section">
      <div className="section-inner">
        <div ref={headerRef} className="section-header">
          <span className="eyebrow">Practice Areas</span>
          <h2 className="section-title">
            Built for <span className="accent">complex</span> client journeys.
          </h2>
        </div>

        <div className="accordion">
          {practiceGroups.map((group, index) => {
            const isOpen = openIndex === index;
            const number = String(index + 1).padStart(2, "0");

            return (
              <div
                key={group.title}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`accordion-card ${isOpen ? "open" : ""}`}
              >
                <div className="accordion-card-border" aria-hidden="true" />
                <button className="accordion-trigger" onClick={() => toggle(index)} aria-expanded={isOpen}>
                  <span className="accordion-number">{number}</span>
                  <span className="accordion-title">{group.title}</span>
                  <span className="accordion-icon">
                    <ChevronDown size={20} />
                  </span>
                </button>
                <div className={`accordion-panel ${isOpen ? "open" : ""}`}>
                  <div className="accordion-panel-inner">
                    <BlurredStagger text={group.summary} isOpen={isOpen} />
                    <ul>
                      {group.matters.map((matter) => (
                        <li key={matter}>{matter}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
