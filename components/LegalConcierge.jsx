"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CornerDownLeft, Loader2, MessageCircle, X } from "lucide-react";
import { firm } from "@/lib/firm-data";

const intro =
  "Good day. I can answer questions about the firm — our practice areas, offices, or how to reach us. What would you like to know?";

const suggestions = [
  "What areas of law do you handle?",
  "Where are your offices?",
  "How do I arrange a consultation?"
];

function initialMessages() {
  return [{ role: "assistant", content: intro }];
}

export default function LegalConcierge({ embedded = false }) {
  const [open, setOpen] = useState(embedded);
  const [messages, setMessages] = useState(initialMessages);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scroller = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, loading]);

  const handleClose = useCallback(() => setOpen(false), []);

  // Any element on the page can open this single floating chatbot.
  useEffect(() => {
    if (embedded) return;
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-concierge", handleOpen);
    return () => window.removeEventListener("open-concierge", handleOpen);
  }, [embedded]);

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

  async function send(text) {
    const trimmed = (text || "").trim();
    if (!trimmed || loading) return;

    setUserInput("");
    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: nextMessages })
      });
      const data = await response.json();
      const content =
        data.reply || `Please call the firm at ${firm.primaryPhone} and our team will be glad to assist you.`;
      setMessages((current) => [...current, { role: "assistant", content }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `I couldn't reach the assistant just now. Please call the firm at ${firm.primaryPhone}.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    send(userInput);
    // Keep the caret in the box so you can keep typing straight away.
    inputRef.current?.focus();
  }

  // Starter questions only while nothing has been asked yet, so the chat stays clean.
  const showSuggestions = messages.length === 1 && !loading;

  const panel = (
    <section className={`concierge-card ${embedded ? "concierge-card-embedded" : ""}`}>
      <div className="concierge-header">
        <div className="concierge-header-info">
          <div className="concierge-avatar">
            <span>SA</span>
          </div>
          <div>
            <h3>Legal Concierge</h3>
            <span className="concierge-status">Ask us anything</span>
          </div>
        </div>
        {!embedded && (
          <button className="concierge-close" type="button" onClick={handleClose} aria-label="Close concierge">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="concierge-scroll" ref={scroller}>
        <div className="conversation">
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

        {showSuggestions && (
          <div className="concierge-actions">
            <div className="choice-grid">
              {suggestions.map((question) => (
                <button type="button" className="choice-button" key={question} onClick={() => send(question)}>
                  <span>{question}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <form className="concierge-input-bar" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Type your message…"
          value={userInput}
          onChange={(event) => setUserInput(event.target.value)}
          aria-label="Type a message to the concierge"
        />
        <button type="submit" disabled={loading || !userInput.trim()} aria-label="Send message">
          {loading ? <Loader2 size={18} /> : <CornerDownLeft size={18} />}
        </button>
      </form>
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
        <span>{open ? "Close" : "Chatbot"}</span>
      </button>
    </>
  );
}
