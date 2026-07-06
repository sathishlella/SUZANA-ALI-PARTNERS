"use client";

import { useRef, useLayoutEffect } from "react";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "./MagneticButton";
import { firm } from "@/lib/firm-data";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const portraitRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const portrait = portraitRef.current;
    const words = headlineRef.current?.querySelectorAll(".word");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(portrait, { y: 60, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 1.2 })
        .fromTo(eyebrowRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.7")
        .fromTo(words, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, "-=0.5")
        .fromTo(subRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.6")
        .fromTo(ctaRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6");

      gsap.to(scrollRef.current, {
        y: 8,
        opacity: 0.55,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      gsap.to(portrait, {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(bgRef.current, {
        yPercent: 10,
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

  const title = "Counsel for matters that demand judgment.";
  const words = title.split(" ");
  const accentIndex = words.indexOf("judgment.");

  return (
    <section ref={sectionRef} className="hero-section" id="top">
      <div ref={bgRef} className="hero-bg" />
      <div className="hero-overlay" />
      <div className="hero-content hero-content-centered">
        <div ref={portraitRef} className="hero-portrait">
          <img src="/images/suzana-portrait.png" alt="Suzana Ali, Founding Partner" />
        </div>
        <span ref={eyebrowRef} className="eyebrow">{firm.descriptor}</span>
        <h1 ref={headlineRef} className="hero-headline hero-headline-centered">
          {words.map((word, i) => (
            <span
              key={i}
              className={`word ${i === accentIndex ? "accent" : ""}`}
              style={{ display: "inline-block", marginRight: "0.25em" }}
            >
              {word}
            </span>
          ))}
        </h1>
        <p ref={subRef} className="hero-subheadline hero-subheadline-centered">
          Banking, property, litigation and corporate counsel across Malaysia - led by partners
          trusted by institutions and individuals.
        </p>
        <div ref={ctaRef} className="hero-actions hero-actions-centered">
          <MagneticButton href="#concierge" variant="orange">
            Request Consultation
          </MagneticButton>
          <MagneticButton href={firm.profileUrl} variant="ghost">
            Download Firm Profile
          </MagneticButton>
        </div>
      </div>
      <a ref={scrollRef} className="scroll-cue" href="#firm" aria-label="Continue">
        <ArrowDown size={20} />
      </a>
    </section>
  );
}
