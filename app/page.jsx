"use client";

import { useRef, useLayoutEffect } from "react";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  Mail,
  MapPin,
  Phone,
  Scale,
  ShieldCheck
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Topbar from "@/components/Topbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import PracticeAccordion from "@/components/PracticeAccordion";
import TagScroller from "@/components/TagScroller";
import PartnerStack from "@/components/PartnerStack";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import Insights from "@/components/Insights";
import LegalConcierge from "@/components/LegalConcierge";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
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
  const panelRef = useRef(null);
  const contactRef = useRef(null);

  useReveal(firmRef);
  useReveal(panelRef);
  useReveal(contactRef);

  return (
    <>
      <CustomCursor />
      <PageTransition />

      <main>
        <Topbar />
        <Hero />
        <Marquee />

        <section className="firm-section" id="firm">
          <div ref={firmRef} className="container">
            <div className="firm-grid">
              <div className="firm-heading">
                <span className="eyebrow">Our Firm</span>
                <h2 className="section-title">
                  Institutional confidence with <span className="accent">boutique</span> attention.
                </h2>
              </div>
              <div className="firm-body">
                <div className="firm-copy">
                  <p>
                    Suzana Ali &amp; Partners provides comprehensive legal services through two strategically located
                    Malaysian offices. The firm brings together three partners across banking, property, civil
                    litigation, debt recovery, commercial and contractual disputes, corporate law, enforcement
                    proceedings and probate matters.
                  </p>
                  <p>
                    The website experience is designed around the same promise: clear judgment, discreet intake and
                    direct access to the right legal team.
                  </p>
                </div>
                <div className="firm-stat">
                  <span>Professional Indemnity</span>
                  <strong>{firm.indemnity}</strong>
                  <p>Coverage supported by Pacific &amp; Orient Insurance Co. Berhad and Lonpac Insurance Berhad.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PracticeAccordion />
        <TagScroller />
        <PartnerStack />

        <section className="concierge-section" id="concierge">
          <div className="container">
            <div className="concierge-grid">
              <div className="concierge-copy">
                <span className="eyebrow">Consultation</span>
                <h2>A private intake path from first question to confirmed slot.</h2>
                <p>
                  The first contact should feel discreet, precise and reassuring. The concierge keeps the exchange
                  focused, collects the right essentials and routes the request to the selected partner.
                </p>
                <div className="concierge-badges">
                  <span>
                    <Clock size={14} /> 10-minute setup
                  </span>
                  <span>
                    <Check size={14} /> Partner-matched
                  </span>
                  <span>
                    <ShieldCheck size={14} /> Confidential
                  </span>
                </div>
              </div>
              <LegalConcierge embedded />
            </div>
          </div>
        </section>

        <TestimonialCarousel />
        <Insights />

        <section className="panel-section" id="panel">
          <div ref={panelRef} className="container">
            <div className="section-header centered">
              <span className="eyebrow">Panel &amp; Institutional Relationships</span>
              <h2 className="section-title">
                Trusted by banks, institutions and public-sector aligned bodies.
              </h2>
            </div>
            <div className="panel-grid">
              {panelPartners.map((name) => (
                <div key={name} className="panel-item">
                  <Scale size={18} style={{ color: "var(--bronze-soft)", flexShrink: 0, marginTop: "3px" }} />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div ref={contactRef} className="container">
            <div className="section-header centered">
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
              <a href="#concierge" className="button button-primary">
                Start Consultation Request
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-brand">
                <p className="footer-wordmark">Suzana Ali &amp; Partners</p>
                <p className="footer-tagline">
                  Experienced and trusted legal counsel across Malaysia. Clear judgment, discreet intake, direct access.
                </p>
                <div className="footer-socials">
                  <a href="#" aria-label="LinkedIn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a href="#" aria-label="Facebook">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a href="#" aria-label="Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="footer-col">
                <span>Navigate</span>
                <a href="#firm">Our Firm</a>
                <a href="#practices">Practices</a>
                <a href="#partners">Partners</a>
                <a href="#insights">Insights</a>
                <a href="#contact">Contact</a>
              </div>

              <div className="footer-col">
                <span>Practices</span>
                <a href="#practices">Banking &amp; Finance</a>
                <a href="#practices">Litigation</a>
                <a href="#practices">Corporate</a>
                <a href="#practices">Property &amp; Private Client</a>
              </div>

              <div className="footer-col">
                <span>Contact</span>
                <a href={`tel:${firm.primaryPhone.replace(/\s/g, "")}`}>{firm.primaryPhone}</a>
                <a href={`mailto:${firm.klEmail}`}>{firm.klEmail}</a>
                <p>{firm.offices[0].label}</p>
                <p>{firm.offices[1].label}</p>
              </div>
            </div>

            <div className="footer-rule" />

            <div className="footer-bottom">
              <p>
                &copy; {new Date().getFullYear()} {firm.name}. All rights reserved.
              </p>
              <div className="footer-legal">
                <a href="#">Privacy Policy</a>
                <a href="#">Disclaimer</a>
              </div>
            </div>
          </div>
        </footer>

        <LegalConcierge />
      </main>
    </>
  );
}
