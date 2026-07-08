"use client";

import { useRef, useState, useLayoutEffect } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { practiceGroups } from "@/lib/firm-data";

gsap.registerPlugin(ScrollTrigger);

/**
 * Renders the summary as whole, unbreakable words so a line can only ever wrap
 * at a space — never mid-word. Each word carries its stagger index (`--i`) so
 * the reveal animation is driven entirely by CSS (no JS/CSS desync on hover).
 */
function PracticeSummary({ text }) {
  const words = text.split(" ");
  return (
    <p className="practice-summary">
      {words.map((word, i) => (
        <span className="summary-word-wrap" key={`${word}-${i}`}>
          <span className="word" style={{ "--i": i }}>
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

export default function PracticeAccordion() {
  const [openIndex, setOpenIndex] = useState(-1);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const itemsRef = useRef([]);

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
        itemsRef.current,
        { y: 40, opacity: 0 },
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
      <div className="container">
        <div ref={headerRef} className="section-header">
          <span className="eyebrow">Practice Areas</span>
          <h2 className="section-title">
            Built for <span className="accent">complex</span> client journeys.
          </h2>
        </div>

        <div className="practice-list">
          {practiceGroups.map((group, index) => {
            const isOpen = openIndex === index;
            const number = String(index + 1).padStart(2, "0");

            return (
              <div
                key={group.title}
                ref={(el) => (itemsRef.current[index] = el)}
                className={`practice-item ${isOpen ? "open" : ""}`}
              >
                <button
                  className="practice-trigger"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`practice-panel-${index}`}
                >
                  <span className="practice-number">{number}</span>
                  <span className="practice-title">{group.title}</span>
                  <span className="practice-icon">
                    <ChevronDown size={20} />
                  </span>
                </button>
                <div
                  className={`practice-panel ${isOpen ? "open" : ""}`}
                  id={`practice-panel-${index}`}
                  role="region"
                >
                  <div className="practice-panel-inner">
                    <PracticeSummary text={group.summary} />
                    <ul className="practice-tags">
                      {group.matters.map((matter, tagIndex) => (
                        <li key={matter} style={{ "--i": tagIndex }}>
                          {matter}
                        </li>
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
