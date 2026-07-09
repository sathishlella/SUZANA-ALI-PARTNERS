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
                    Suzana Ali &amp; Partners provides comprehensive legal services through three strategically located
                    Malaysian offices. The firm brings together advocates and solicitors across banking, property, civil
                    litigation, debt recovery, commercial and contractual disputes, corporate law, enforcement
                    proceedings and probate matters.
                  </p>
                  <p>
                    Every engagement is built on the same promise: clear judgment, discreet intake and direct access to
                    the right legal team.
                  </p>
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
            <div className="consult-cta">
              <span className="eyebrow">Consultation</span>
              <h2>Book a private consultation.</h2>
              <p>
                Choose the matter type, select your preferred office, pick an available slot and share a few details.
                The concierge routes your request directly to the firm.
              </p>
              <div className="concierge-badges">
                <span>
                  <Clock size={14} /> 10-minute setup
                </span>
                <span>
                  <Check size={14} /> Office-matched
                </span>
                <span>
                  <ShieldCheck size={14} /> Confidential
                </span>
              </div>
              <button
                type="button"
                className="button button-primary consult-cta-button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-concierge"))}
              >
                <CalendarCheck size={18} />
                Book a consultation
              </button>
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
              {panelPartners.map((partner) => (
                <div key={partner.name} className="panel-item">
                  <div className="panel-logo">
                    {partner.logo ? (
                      <img src={partner.logo} alt={`${partner.name} logo`} loading="lazy" />
                    ) : (
                      <Scale size={22} style={{ color: "var(--bronze-soft)" }} />
                    )}
                  </div>
                  <span>{partner.name}</span>
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
                Petaling Jaya, Seremban and <span className="accent">Ipoh.</span>
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
              <a href={`tel:${firm.primaryPhone.replace(/\s/g, "")}`} className="button button-primary">
                <Phone size={18} />
                Call us
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
              </div>

              <div className="footer-col">
                <span>Navigate</span>
                <a href="#firm">Our Firm</a>
                <a href="#practices">Practices</a>
                <a href="#partners">Advocates &amp; Solicitors</a>
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
                {firm.offices.map((office) => (
                  <div className="footer-office" key={office.id}>
                    <strong>{office.label}</strong>
                    <a href={`tel:${office.phone.split("/")[0].trim().replace(/\s/g, "")}`}>{office.phone}</a>
                    <a href={`mailto:${office.email}`}>{office.email}</a>
                  </div>
                ))}
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
