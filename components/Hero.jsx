"use client";

import { useRef, useLayoutEffect } from "react";
import { ArrowDown, Phone } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { firm } from "@/lib/firm-data";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const metaRef = useRef(null);
  const scrollRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const words = headlineRef.current?.querySelectorAll(".word");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(eyebrowRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 })
        .fromTo(words, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, "-=0.4")
        .fromTo(subRef.current, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85 }, "-=0.55")
        .fromTo(ctaRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.55")
        .fromTo(metaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5");

      gsap.to(scrollRef.current, {
        y: 8,
        opacity: 0.55,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      gsap.to(bgRef.current, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const title = "Your trusted advocates for life’s defining moments";
  const words = title.split(" ");
  const accentIndex = words.indexOf("trusted");

  return (
    <section ref={sectionRef} className="hero-section" id="top">
      <div ref={bgRef} className="hero-bg" />
      <div className="hero-overlay" />
      <div className="hero-content hero-content-centered">
        <span ref={eyebrowRef} className="eyebrow hero-eyebrow">{firm.descriptor.toUpperCase()}</span>
        <h1 ref={headlineRef} className="display-lg hero-headline">
          {words.map((word, i) => (
            <span
              key={i}
              className={`word ${i === accentIndex ? "accent" : ""}`}
              style={{ display: "inline-block", marginRight: "0.22em" }}
            >
              {word}
            </span>
          ))}
        </h1>
        <p ref={subRef} className="hero-subtitle">
          Banking, property, litigation and corporate counsel across Malaysia. A firm built on clear judgment,
          teamwork and direct access.
        </p>
        <div ref={ctaRef} className="hero-actions">
          <a href={`tel:${firm.primaryPhone.replace(/\s/g, "")}`} className="button button-primary">
            <Phone size={18} />
            Call us
          </a>
          <a href={firm.profileUrl} className="button button-light">
            Download Firm Profile
          </a>
        </div>
        <div ref={metaRef} className="hero-meta-row">
          <div className="hero-meta-item">
            <strong>3</strong>
            <span>Offices</span>
          </div>
          <div className="hero-meta-item">
            <strong>14</strong>
            <span>Panel Relationships</span>
          </div>
        </div>
      </div>
      <a ref={scrollRef} className="hero-scroll" href="#firm" aria-label="Continue">
        <ArrowDown size={20} />
      </a>
    </section>
  );
}
