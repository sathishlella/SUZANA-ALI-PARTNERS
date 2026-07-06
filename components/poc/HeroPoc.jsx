"use client";

import { useRef } from "react";
import { useLayoutEffect } from "react";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "./MagneticButton";
import { firm } from "@/lib/firm-data";

gsap.registerPlugin(ScrollTrigger);

export default function HeroPoc() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const words = headlineRef.current?.querySelectorAll(".word");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(bg, { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4 })
        .fromTo(eyebrowRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.8")
        .fromTo(words, { y: 70, opacity: 0, rotateX: -30 }, { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.08 }, "-=0.5")
        .fromTo(subRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.6")
        .fromTo(ctaRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6");

      gsap.to(scrollRef.current, {
        y: 8,
        opacity: 0.6,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      gsap.to(bg, {
        yPercent: 12,
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

  const title = "Judgment without noise.";
  const accentWord = "noise.";
  const words = title.split(" ");

  return (
    <section ref={sectionRef} className="poc-hero">
      <div ref={bgRef} className="poc-hero-bg" />
      <div className="poc-hero-overlay" />
      <div className="poc-hero-content">
        <span ref={eyebrowRef} className="poc-eyebrow">{firm.descriptor}</span>
        <h1 ref={headlineRef} className="poc-headline">
          {words.map((word, i) => (
            <span
              key={i}
              className={`word ${word === accentWord ? "accent" : ""}`}
              style={{ display: "inline-block", marginRight: "0.28em" }}
            >
              {word}
            </span>
          ))}
        </h1>
        <p ref={subRef} className="poc-subheadline">
          Banking, property, litigation and corporate counsel across Malaysia - led by partners
          trusted by institutions and individuals.
        </p>
        <div ref={ctaRef} className="poc-hero-actions">
          <MagneticButton href="#poc-team" variant="orange">
            Request Consultation
          </MagneticButton>
          <MagneticButton href={firm.profileUrl} variant="ghost">
            Download Firm Profile
          </MagneticButton>
        </div>
      </div>
      <a ref={scrollRef} className="poc-scroll-cue" href="#poc-team" aria-label="Continue">
        <ArrowDown size={20} />
      </a>
    </section>
  );
}
