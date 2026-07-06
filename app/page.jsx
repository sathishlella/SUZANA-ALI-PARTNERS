"use client";

import { useRef, useLayoutEffect } from "react";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Check,
  Clock,
  Download,
  Landmark,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Scale,
  ShieldCheck,
  UserRound
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import PracticeAccordion from "@/components/PracticeAccordion";
import TagScroller from "@/components/TagScroller";
import PartnerStack from "@/components/PartnerStack";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import MagneticButton from "@/components/MagneticButton";
import LegalConcierge from "@/components/LegalConcierge";
import { firm, panelPartners } from "@/lib/firm-data";

gsap.registerPlugin(ScrollTrigger);

function useReveal(ref) {
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 76%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [ref]);
}

export default function HomePage() {
  const firmRef = useRef(null);
  const contactRef = useRef(null);
  const panelRef = useRef(null);

  useReveal(firmRef);
  useReveal(contactRef);
  useReveal(panelRef);

  return (
    <main>
      <header className="topbar">
        <div className="utility">
          <span>{firm.established}</span>
          <a href={`tel:${firm.primaryPhone.replace(/\s/g, "")}`}>
            <Phone size={15} />
            {firm.primaryPhone}
          </a>
          <a href={`mailto:${firm.klEmail}`}>
            <Mail size={15} />
            {firm.klEmail}
          </a>
        </div>
        <nav className="nav" aria-label="Main navigation">
          <a className="brand" href="#top">
            <span>SAP</span>
            <strong>{firm.name}</strong>
          </a>
          <div className="nav-links">
            <a href="#firm">Our Firm</a>
            <a href="#practices">Practices</a>
            <a href="#partners">Partners</a>
            <a href="#panel">Panel</a>
            <a href="#contact">Contact</a>
          </div>
          <a className="nav-cta" href="#concierge">
            <CalendarCheck size={16} />
            Book Consultation
          </a>
        </nav>
      </header>

      <Hero />
      <Marquee />

      <section className="firm-section" id="firm">
        <div ref={firmRef} className="section-inner">
          <div className="section-header">
            <span className="eyebrow">Our Firm</span>
            <h2 className="section-title">
              Institutional confidence with <span className="accent">boutique</span> attention.
            </h2>
          </div>
          <div className="firm-grid">
            <div className="firm-copy">
              <p>
                Suzana Ali &amp; Partners provides comprehensive legal services through two strategically located Malaysian
                offices. The firm brings together three partners across banking, property, civil litigation, debt recovery,
                commercial and contractual disputes, corporate law, enforcement proceedings and probate matters.
              </p>
              <p>
                The website experience is designed around the same promise: clear judgment, discreet intake and direct
                access to the right legal team.
              </p>
            </div>
            <div className="firm-stat">
              <span>Professional Indemnity</span>
              <strong>{firm.indemnity}</strong>
              <p>Coverage supported by Pacific &amp; Orient Insurance Co. Berhad and Lonpac Insurance Berhad.</p>
            </div>
          </div>
        </div>
      </section>

      <PracticeAccordion />
      <TagScroller />
      <PartnerStack />

      <section className="concierge-band" id="concierge">
        <div className="concierge-band-inner">
          <div className="concierge-copy">
            <span className="eyebrow">Consultation</span>
            <h2>
              A private intake path from first question to confirmed slot.
            </h2>
            <p>
              The first contact should feel discreet, precise and reassuring. The concierge keeps the exchange focused,
              collects the right essentials and routes the request to the selected partner.
            </p>
            <div className="concierge-micro-list">
              <span><Clock size={14} /> 10-minute setup</span>
              <span><Check size={14} /> Partner-matched</span>
              <span><ShieldCheck size={14} /> Confidential</span>
            </div>
          </div>
          <LegalConcierge embedded />
        </div>
      </section>

      <TestimonialCarousel />

      <section className="section-inner" id="panel" style={{ padding: "100px 0" }}>
        <div ref={panelRef}>
          <div className="section-header">
            <span className="eyebrow">Panel Partners</span>
            <h2 className="section-title">
              Trusted by banks, institutions and public-sector aligned bodies.
            </h2>
          </div>
          <div className="panel-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
            {panelPartners.map((name) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "22px",
                  borderRadius: "12px",
                  border: "1px solid var(--line)",
                  background: "var(--panel)",
                  minHeight: "96px"
                }}
              >
                <Scale size={18} style={{ color: "var(--orange-soft)", flexShrink: 0, marginTop: "3px" }} />
                <span style={{ fontSize: "0.95rem", lineHeight: "1.45", color: "var(--ivory-dim)" }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div ref={contactRef} className="section-inner">
          <div className="section-header">
            <span className="eyebrow">Offices</span>
            <h2 className="section-title">
              Petaling Jaya and <span className="accent">Seremban.</span>
            </h2>
          </div>
          <div className="office-grid">
            {firm.offices.map((office) => (
              <article className="office-card" key={office.city}>
                <MapPin size={24} />
                <h3>{office.label}</h3>
                <p>{office.address}</p>
                <a href={`tel:${office.phone.split("/")[0].replace(/\s/g, "")}`}>
                  <Phone size={16} />
                  {office.phone}
                </a>
                <a href={`mailto:${office.email}`}>
                  <Mail size={16} />
                  {office.email}
                </a>
              </article>
            ))}
          </div>
          <div className="final-cta">
            <MagneticButton href="#concierge" variant="orange">
              Start Consultation Request
            </MagneticButton>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p className="footer-wordmark">Suzana Ali &amp; Partners</p>
        <div className="footer-rule" />
        <div className="footer-meta">
          <span>{firm.name}</span>
          <p>{firm.descriptor} | {firm.established}</p>
        </div>
      </footer>

      <LegalConcierge />
    </main>
  );
}
