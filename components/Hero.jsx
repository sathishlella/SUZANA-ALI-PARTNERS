"use client";

import { useRef, useLayoutEffect } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { firm } from "@/lib/firm-data";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const portraitRef = useRef(null);
  const inkRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const actionsRef = useRef(null);
  const metaRef = useRef(null);
  const scrollRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const words = titleRef.current?.querySelectorAll(".word");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(portraitRef.current, { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4 })
        .fromTo(inkRef.current, { xPercent: 10, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.1 }, "-=1")
        .fromTo(eyebrowRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.7")
        .fromTo(words, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.06 }, "-=0.6")
        .fromTo(subRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.7")
        .fromTo(actionsRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
        .fromTo(metaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6");

      gsap.to(scrollRef.current, {
        y: 8,
        opacity: 0.5,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      gsap.to(portraitRef.current, {
        yPercent: 5,
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
    <section ref={sectionRef} className="hero" id="top">
      <div ref={portraitRef} className="hero-portrait">
        <img src="/images/suzana-portrait.png" alt="Suzana Ali, Founding Partner" />
      </div>

      <div ref={inkRef} className="hero-ink">
        <div className="hero-content">
          <span ref={eyebrowRef} className="eyebrow hero-eyebrow">{firm.descriptor}</span>
          <h1 ref={titleRef} className="display-xl hero-title">
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
            Banking, property, litigation and corporate counsel across Malaysia. Led by partners trusted by
            institutions and individuals.
          </p>
          <div ref={actionsRef} className="hero-actions">
            <a href="#concierge" className="button button-primary">
              Request Consultation
              <ArrowRight size={18} />
            </a>
            <a href={firm.profileUrl} className="button button-light">
              Download Firm Profile
            </a>
          </div>
        </div>
      </div>

      <div ref={metaRef} className="hero-meta">
        <div className="hero-meta-item">
          <strong>2020</strong>
          <span>Established</span>
        </div>
        <div className="hero-meta-item">
          <strong>3</strong>
          <span>Partners</span>
        </div>
        <div className="hero-meta-item">
          <strong>14</strong>
          <span>Panel Relationships</span>
        </div>
      </div>

      <a ref={scrollRef} className="hero-scroll" href="#firm" aria-label="Continue">
        <ArrowDown size={20} />
      </a>
    </section>
  );
}
