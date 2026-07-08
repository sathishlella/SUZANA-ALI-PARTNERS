"use client";

import { useEffect, useRef, useState } from "react";
import { Phone } from "lucide-react";
import { firm } from "@/lib/firm-data";

const navItems = [
  { href: "#firm", label: "Our Firm" },
  { href: "#practices", label: "Practices" },
  { href: "#partners", label: "Advocates & Solicitors" },
  { href: "#insights", label: "Insights" },
  { href: "#contact", label: "Contact" }
];

export default function Topbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const topbarRef = useRef(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);

      // Reveal on scroll up, hide on scroll down (past a threshold).
      const last = lastScrollY.current;
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 140);
        lastScrollY.current = y;
      }
    };

    lastScrollY.current = window.scrollY;
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the menu (releasing the scroll lock) if the viewport grows to desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handleChange = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // Lock body scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const phoneHref = `tel:${firm.primaryPhone.replace(/\s/g, "")}`;

  return (
    <>
      <header
        ref={topbarRef}
        className={`topbar ${scrolled ? "scrolled" : ""} ${hidden && !menuOpen ? "hidden" : ""} ${
          menuOpen ? "menu-open" : ""
        }`}
      >
        <div className="container topbar-inner">
          <a href="#top" className="brand" onClick={() => setMenuOpen(false)}>
            <img src="/images/sap-logo.png" alt="SAP" className="brand-mark" />
            <strong>{firm.name.toUpperCase()}</strong>
          </a>

          <nav className="nav-links" aria-label="Main navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <span className="nav-cta nav-cta-text">Established 2020</span>

          <button
            type="button"
            className={`nav-toggle ${menuOpen ? "open" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
          </button>
        </div>
      </header>

      {/* Sibling of the header (not a child): the topbar's backdrop-filter would
          otherwise trap this fixed overlay inside the ~70px header box. */}
      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <nav className="mobile-menu-nav" aria-label="Mobile navigation">
          {navItems.map((item, index) => (
            <a key={item.href} href={item.href} style={{ "--i": index }} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mobile-menu-footer">
          <a href={phoneHref} className="button button-primary" onClick={() => setMenuOpen(false)}>
            <Phone size={17} />
            Call the firm
          </a>
          <span className="mobile-menu-note">{firm.established}</span>
        </div>
      </div>
    </>
  );
}
