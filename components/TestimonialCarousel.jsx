"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "The firm handled a complex banking dispute with precision and kept us informed at every stage. Their judgment was invaluable.",
    author: "General Counsel",
    role: "Financial Institution"
  },
  {
    quote:
      "Measured, discreet and resolute. Exactly the counsel you want when the stakes are high and the path is uncertain.",
    author: "Private Client",
    role: "Property & Probate Matter"
  },
  {
    quote:
      "Responsive, commercial and deeply knowledgeable about government contracts and institutional processes.",
    author: "Company Director",
    role: "Corporate Advisory"
  }
];

export default function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const goTo = (index) => setActive(index);

  const t = testimonials[active];

  return (
    <section
      ref={sectionRef}
      className="testimonial-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="testimonial-inner">
        <Quote size={44} className="testimonial-quote-icon" />

        {/* All quotes share one grid cell, so the band always reserves the
            height of the tallest quote — the background never resizes. */}
        <div className="testimonial-quote-stack">
          {testimonials.map((item, i) => (
            <blockquote
              key={i}
              className={`testimonial-quote ${i === active ? "is-active" : ""}`}
              aria-hidden={i !== active}
            >
              &ldquo;{item.quote}&rdquo;
            </blockquote>
          ))}
        </div>

        <div className="testimonial-author" key={active}>
          <strong>{t.author}</strong>
          <span>{t.role}</span>
        </div>

        <div className="testimonial-controls">
          <button onClick={prev} aria-label="Previous testimonial" className="testimonial-control">
            <ChevronLeft size={22} />
          </button>
          <div className="testimonial-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`testimonial-dot ${i === active ? "active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Show testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button onClick={next} aria-label="Next testimonial" className="testimonial-control">
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}
