"use client";

import { useRef, useState, useLayoutEffect } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { practiceGroups } from "@/lib/firm-data";

gsap.registerPlugin(ScrollTrigger);

export default function PracticeAccordion() {
  const [openIndex, setOpenIndex] = useState(0);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const rowsRef = useRef([]);

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
        rowsRef.current,
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
                ref={(el) => (rowsRef.current[index] = el)}
                className={`accordion-row ${isOpen ? "open" : ""}`}
              >
                <button className="accordion-trigger" onClick={() => toggle(index)} aria-expanded={isOpen}>
                  <span className="accordion-number">{number}</span>
                  <span className="accordion-title">{group.title}</span>
                  <span className="accordion-icon">
                    <ChevronDown size={22} />
                  </span>
                </button>
                <div className="accordion-panel" style={{ maxHeight: isOpen ? 300 : 0 }}>
                  <div className="accordion-panel-inner">
                    <p>{group.summary}</p>
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
