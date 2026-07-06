# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # install dependencies
npm run dev      # start Next.js dev server (http://localhost:3000)
npm run build    # production build
npm run start    # run production build
npm run lint     # next lint
```

There is no test suite configured. This is a single-page Next.js (App Router) marketing site - there is no per-route or per-component test/build target to isolate.

## Environment

Copy `.env.example` to `.env.local` to enable live integrations. Without it, the app runs fully in degraded/fallback mode (see Architecture below) - this is the expected local dev state, not an error condition.

- `GROQ_API_KEY` / `GROQ_MODEL` - enables natural-language concierge replies via Groq.
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASS` / `EMAIL_FROM` - enables real booking confirmation emails via nodemailer.
- `SUZANA_EMAIL` / `SHAHRIMAN_EMAIL` / `NUR_FARAHIZZAH_EMAIL` - routes booking notifications to the correct partner inbox.
- `NEXT_PUBLIC_SITE_URL` - used for `metadataBase`.

## Architecture

This is the marketing + intake website for a Malaysian law firm (Suzana Ali & Partners), built as a single long-scrolling page (`app/page.jsx`) plus a chat-style booking widget. The core design idea: **every integration degrades gracefully to a local fallback**, so the site is fully demoable with zero configuration.

### Data flow: firm content vs. runtime booking state

- `lib/firm-data.js` is the single source of truth for static content - firm info, offices, the three partners (with `emailEnv` pointing at the env var used to notify them), practice groups, panel partners, and the matter-type list shown in the concierge. Both `app/page.jsx` and `components/LegalConcierge.jsx` import from here; there is no CMS or database.
- `data/bookings.json` is a flat-file booking ledger, read/written by `lib/booking.js` via `node:fs`. There is no database - this file *is* the persistence layer.

### Booking/slot logic (`lib/booking.js`)

- Availability is computed on demand, not stored: `availabilityFor(partnerId)` generates candidate slots for the next 20 calendar days (weekdays only, four fixed times: 09:30/11:00/14:30/16:00, Asia/Kuala_Lumpur), then filters out any `slotId` already present in `bookings.json` for that partner, stopping once 12 open slots are found.
- Slot IDs are deterministic strings of the form `partnerId:YYYY-MM-DD:HH:MM`, which is what makes the "already booked" filter a simple Set lookup rather than a real calendar/conflict system.
- `POST /api/book` (`app/api/book/route.js`) re-validates the requested slot against `availabilityFor` at submission time (not trusting the client-held slot list) before writing the booking and triggering email.

### Concierge chat (`components/LegalConcierge.jsx` + `app/api/chat/route.js`)

- The concierge is a **staged wizard, not a free-form chatbot**: `stage` moves through `matter → partner → slot → details → booking → booked`, and each stage renders fixed UI (choice buttons, a slot grid, a details form) - the LLM only ever generates the connective assistant *text* between stages via `POST /api/chat`, it does not drive stage transitions or collect structured data itself.
- `/api/chat` calls Groq only if `GROQ_API_KEY` is set; otherwise (or on any Groq error) it returns a canned per-stage line from `fallbackReplies`. The frontend also has its own try/catch fallback text if the request fails outright. This means the concierge always feels functional even fully offline.
- The component is rendered twice in `app/page.jsx`: once `embedded` inline in the `#concierge` section (always open, no launcher/close button), and once as a floating launcher button + panel elsewhere on the page. The `embedded` prop is what toggles this behavior, not a separate component.

### Email (`lib/email.js`)

- `sendBookingEmails` sends two HTML emails (client confirmation + firm/partner notification) via nodemailer only if all of `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` are set; otherwise it logs both payloads to the console with `[booking-email:client]` / `[booking-email:firm]` prefixes and returns `{ sent: false, mode: "logged" }`. When checking "did the email send," check the SMTP env vars first, then grep server logs for those prefixes.
- `partnerEmail()` in `lib/booking.js` resolves which inbox gets the firm notification, falling back to `SUZANA_EMAIL` and then a hardcoded address if a partner's specific env var isn't set.

### Styling

Plain CSS in `app/globals.css`, imported once in `app/layout.jsx` - no CSS-in-JS or Tailwind. Class names used in `app/page.jsx` (`.hero`, `.stat-band`, `.practice-grid`, `.concierge-band`, etc.) are the section hooks to edit when restyling.
