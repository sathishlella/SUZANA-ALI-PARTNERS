"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCallback } from "react";
import {
  CalendarCheck,
  Check,
  Clock,
  Loader2,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
  UserRound,
  X,
  CornerDownLeft
} from "lucide-react";
import { matterTypes, partners } from "@/lib/firm-data";

const intro =
  "Good day. I can help you arrange a consultation with the right partner. Could you tell me which type of matter this concerns?";

function partnerLabel(partnerId) {
  return partners.find((partner) => partner.id === partnerId)?.name || "Suzana Ali";
}

function initialMessages() {
  return [{ role: "assistant", content: intro }];
}

export default function LegalConcierge({ embedded = false }) {
  const [open, setOpen] = useState(embedded);
  const [messages, setMessages] = useState(initialMessages);
  const [stage, setStage] = useState("matter");
  const [context, setContext] = useState({
    matterType: "",
    partnerId: "suzana",
    slotId: "",
    slotLabel: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    notes: ""
  });
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [details, setDetails] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    notes: ""
  });
  const scroller = useRef(null);
  const panelRef = useRef(null);

  const selectedPartner = useMemo(
    () => partners.find((partner) => partner.id === context.partnerId) || partners[0],
    [context.partnerId]
  );

  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, stage, loading, slots]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (embedded || !open) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") handleClose();
    }

    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        const launcher = document.querySelector(".concierge-launcher");
        if (!launcher || !launcher.contains(event.target)) {
          handleClose();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, embedded, handleClose]);

  async function conciergeReply(nextStage, nextContext, nextMessages) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: nextStage,
          context: nextContext,
          transcript: nextMessages
        })
      });
      const data = await response.json();
      const content = data.reply || "Thank you. I can continue with the appointment request.";
      setMessages((current) => [...current, { role: "assistant", content }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Thank you. I can continue with the appointment request."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function pushUser(content) {
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    return next;
  }

  async function chooseMatter(matterType) {
    const nextContext = { ...context, matterType };
    setContext(nextContext);
    const nextMessages = pushUser(matterType);
    setStage("partner");
    await conciergeReply("matter", nextContext, nextMessages);
  }

  async function choosePartner(partnerId) {
    const nextContext = { ...context, partnerId, slotId: "", slotLabel: "" };
    setContext(nextContext);
    setSlots([]);
    const nextMessages = pushUser(`I would like to meet ${partnerLabel(partnerId)}.`);
    setStage("slot");
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/availability?partner=${encodeURIComponent(partnerId)}`);
      const data = await response.json();
      setSlots(data.slots || []);
    } catch {
      setError("Available slots could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
    await conciergeReply("partner", nextContext, nextMessages);
  }

  async function chooseSlot(slot) {
    const nextContext = { ...context, slotId: slot.id, slotLabel: slot.label };
    setContext(nextContext);
    const nextMessages = pushUser(slot.label);
    setStage("details");
    await conciergeReply("slot", nextContext, nextMessages);
  }

  async function submitDetails(event) {
    event.preventDefault();
    const nextContext = { ...context, ...details };
    setContext(nextContext);
    const nextMessages = pushUser(
      `${details.clientName}, ${details.clientEmail}${details.clientPhone ? `, ${details.clientPhone}` : ""}`
    );
    setStage("booking");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextContext)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "The booking could not be completed.");
      }
      setBooking(data.booking);
      setStage("booked");
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `Thank you, ${data.booking.clientName}. Your consultation request with ${data.booking.partnerName} for ${data.booking.slotLabel} has been received. Reference ${data.booking.id}.`
        }
      ]);
    } catch (bookingError) {
      setStage("details");
      setError(bookingError.message);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I could not complete that booking request just now. Please check the details or choose another available slot."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function resetConversation() {
    setMessages(initialMessages());
    setStage("matter");
    setContext({
      matterType: "",
      partnerId: "suzana",
      slotId: "",
      slotLabel: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      notes: ""
    });
    setSlots([]);
    setBooking(null);
    setError("");
    setDetails({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      notes: ""
    });
  }

  const showInputFooter = stage === "matter" || stage === "partner" || stage === "slot";
  const inputPlaceholder =
    stage === "matter"
      ? "Select a matter type above..."
      : stage === "partner"
        ? "Select a partner above..."
        : stage === "slot"
          ? "Select an available slot above..."
          : "Type your message...";

  const panel = (
    <section className={embedded ? "concierge concierge-embedded" : "concierge"} id="concierge">
      <div className="concierge-header">
        <div className="concierge-header-info">
          <div className="concierge-avatar">
            <span>SA</span>
          </div>
          <div>
            <h3>Legal Concierge</h3>
            <span className="concierge-status">Private intake</span>
          </div>
        </div>
        {!embedded && (
          <button className="icon-button" type="button" onClick={() => setOpen(false)} aria-label="Close concierge">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="conversation" ref={scroller}>
        {messages.map((message, index) => (
          <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
            {message.role === "assistant" && (
              <div className="message-avatar" aria-hidden="true">
                <span>SA</span>
              </div>
            )}
            <div className="message-bubble">
              <span>{message.content}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant loading-message">
            <div className="message-avatar" aria-hidden="true">
              <span>SA</span>
            </div>
            <div className="message-bubble typing-bubble">
              <span className="typing-dots">
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        )}
      </div>

      {error && <div className="concierge-error">{error}</div>}

      <div className="concierge-actions">
        {stage === "matter" && (
          <div className="choice-grid">
            {matterTypes.map((matter) => (
              <button type="button" className="choice-button" key={matter} onClick={() => chooseMatter(matter)}>
                <Sparkles size={15} />
                <span>{matter}</span>
              </button>
            ))}
          </div>
        )}

        {stage === "partner" && (
          <div className="partner-choice-grid">
            {partners.map((partner) => (
              <button type="button" className="partner-choice" key={partner.id} onClick={() => choosePartner(partner.id)}>
                <UserRound size={17} />
                <strong>{partner.name}</strong>
                <span>{partner.title}</span>
              </button>
            ))}
          </div>
        )}

        {stage === "slot" && (
          <div className="slot-grid">
            {slots.map((slot) => (
              <button type="button" className="slot-button" key={slot.id} onClick={() => chooseSlot(slot)}>
                <CalendarCheck size={15} />
                <span>{slot.label}</span>
              </button>
            ))}
            {!loading && slots.length === 0 && <p className="muted">No online slots are available for {selectedPartner.name}.</p>}
          </div>
        )}

        {stage === "details" && (
          <form className="details-form" onSubmit={submitDetails}>
            <label>
              Name
              <input
                required
                value={details.clientName}
                onChange={(event) => setDetails((current) => ({ ...current, clientName: event.target.value }))}
                autoComplete="name"
              />
            </label>
            <label>
              Email
              <input
                required
                type="email"
                value={details.clientEmail}
                onChange={(event) => setDetails((current) => ({ ...current, clientEmail: event.target.value }))}
                autoComplete="email"
              />
            </label>
            <label>
              Phone
              <input
                value={details.clientPhone}
                onChange={(event) => setDetails((current) => ({ ...current, clientPhone: event.target.value }))}
                autoComplete="tel"
              />
            </label>
            <label>
              Brief notes
              <textarea
                rows="2"
                value={details.notes}
                onChange={(event) => setDetails((current) => ({ ...current, notes: event.target.value }))}
              />
            </label>
            <button className="primary-button full-width" type="submit" disabled={loading}>
              {loading ? <Loader2 size={17} /> : <Send size={17} />}
              <span>Request Slot</span>
            </button>
          </form>
        )}

        {stage === "booked" && booking && (
          <div className="booking-receipt">
            <div className="receipt-mark">
              <Check size={18} />
            </div>
            <strong>{booking.id}</strong>
            <span>{booking.partnerName}</span>
            <span>{booking.slotLabel}</span>
            <button className="ghost-button" type="button" onClick={resetConversation}>
              <Clock size={15} />
              <span>New Request</span>
            </button>
          </div>
        )}
      </div>

      {showInputFooter && (
        <div className="concierge-input-bar">
          <input type="text" placeholder={inputPlaceholder} disabled readOnly />
          <button type="button" disabled aria-label="Send">
            <CornerDownLeft size={18} />
          </button>
        </div>
      )}
    </section>
  );

  if (embedded) return panel;

  return (
    <>
      {open && (
        <div ref={panelRef} className="floating-concierge">
          {panel}
        </div>
      )}
      <button
        className="concierge-launcher"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close legal concierge" : "Open legal concierge"}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        <span>{open ? "Close" : "Book"}</span>
      </button>
    </>
  );
}
