"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { firm } from "@/lib/firm-data";

export default function Topbar() {
  const [scrolled, setScrolled] = useState(false);
  const topbarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header ref={topbarRef} className={`topbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container topbar-inner">
        <a href="#top" className="brand">
          <span className="brand-mark">SAP</span>
          <strong>{firm.name}</strong>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#firm">Our Firm</a>
          <a href="#practices">Practices</a>
          <a href="#partners">Partners</a>
          <a href="#insights">Insights</a>
          <a href="#contact">Contact</a>
        </nav>

        <a href="#concierge" className="nav-cta">
          <CalendarCheck size={15} />
          Book Consultation
        </a>
      </div>
    </header>
  );
}
