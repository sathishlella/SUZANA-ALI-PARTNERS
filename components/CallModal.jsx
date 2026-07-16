"use client";

import { useCallback, useEffect, useState } from "react";
import { Phone, X } from "lucide-react";
import { firm } from "@/lib/firm-data";

/**
 * Office picker for the "Call us" buttons. Any element on the page can open it
 * by dispatching a window "open-call-modal" event, so the hero, the contact
 * CTA and the mobile menu all share one picker instead of dialling blindly.
 */
export default function CallModal() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-call-modal", handleOpen);
    return () => window.removeEventListener("open-call-modal", handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="call-modal-backdrop"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Choose an office to call"
    >
      <div className="call-modal" onClick={(event) => event.stopPropagation()}>
        <button className="call-modal-close" type="button" onClick={close} aria-label="Close">
          <X size={18} />
        </button>

        <span className="eyebrow">Call the firm</span>
        <h3>Which office would you like to call?</h3>

        <div className="call-office-list">
          {firm.offices.map((office) => (
            <a
              key={office.id}
              className="call-office"
              href={`tel:${office.phone.split("/")[0].trim().replace(/\s/g, "")}`}
              onClick={close}
            >
              <span className="call-office-icon">
                <Phone size={16} />
              </span>
              <span className="call-office-text">
                <strong>{office.label}</strong>
                <span>{office.phone}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
