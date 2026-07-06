# AGENTS.md

Agent-focused guide for the **Suzana Ali & Partners Website** repository.

## Project overview

This is the marketing and intake website for **Suzana Ali & Partners**, a Malaysian law firm. It is a single-page Next.js application using the App Router. The site presents the firm, its partners, practice areas and panel relationships, and provides a guided legal concierge that lets visitors book consultation slots.

The project intentionally has **no CMS and no database**. All firm content is static JavaScript data, and bookings are persisted to a local JSON file. Every external integration degrades gracefully so the site remains fully demoable without configuration.

Key repository facts:

- Framework: Next.js 16 with App Router and React 19.
- Language: JavaScript (JSX), ES modules (`"type": "module"`).
- Styling: plain CSS in `app/globals.css`; no Tailwind or CSS-in-JS.
- Package manager: npm.
- AI integration: Groq SDK for concierge chat replies.
- Email integration: nodemailer for booking confirmation emails.
- Persistence: `data/bookings.json` is the booking ledger.

## Project structure

```text
.
├── app/
│   ├── api/
│   │   ├── availability/route.js   # GET available slots for a partner
│   │   ├── book/route.js           # POST a new booking
│   │   └── chat/route.js           # POST concierge chat reply
│   ├── globals.css                 # Global styles and responsive rules
│   ├── layout.jsx                  # Root layout with metadata
│   └── page.jsx                    # Single long-scrolling marketing page
├── components/
│   └── LegalConcierge.jsx          # Client booking wizard component
├── data/
│   └── bookings.json               # Flat-file booking ledger
├── lib/
│   ├── booking.js                  # Booking/slot logic and file I/O
│   ├── email.js                    # Email rendering and sending
│   └── firm-data.js                # Static firm content, partners, practices
├── public/
│   ├── downloads/                  # Downloadable firm profile PDF
│   └── images/                     # Hero background, portrait assets
├── .env.example                    # Template for environment variables
├── next.config.mjs                 # Next.js config (strict mode only)
├── package.json                    # Dependencies and scripts
└── jsconfig.json                   # Path alias `@/*` maps to `./*`
```

## Technology stack

- **Runtime / framework**: Node.js, Next.js 16, React 19, React DOM 19.
- **Icons**: `lucide-react`.
- **AI**: `groq-sdk` (optional; fallback replies are used when not configured).
- **Email**: `nodemailer` (optional; emails are logged when SMTP is not configured).
- **Build tooling**: Next.js built-in compiler/bundler; `jsconfig.json` enables `@/` imports.

## Build and run commands

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Available npm scripts (from `package.json`):

```bash
npm run dev    # Next.js development server
npm run build  # Production build
npm run start  # Run the production build
npm run lint   # Run next lint
```

There is no dedicated test suite. The site is a single-page marketing application; CLAUDE.md explicitly notes there is no per-route or per-component test/build target to isolate.

## Environment configuration

Copy `.env.example` to `.env.local` to enable live integrations. Without a `.env.local` file the site runs in a fully degraded/fallback mode. This is the expected local development state, not an error.

Variables:

| Variable | Purpose |
|---|---|
| `GROQ_API_KEY` | Enables natural-language concierge replies via Groq. |
| `GROQ_MODEL` | Groq model name (default `llama-3.3-70b-versatile`). |
| `SMTP_HOST` | SMTP server host for booking emails. |
| `SMTP_PORT` | SMTP port (default `587`). |
| `SMTP_SECURE` | Set `"true"` for TLS on port 465. |
| `SMTP_USER` | SMTP authentication user. |
| `SMTP_PASS` | SMTP authentication password. |
| `EMAIL_FROM` | Sender address for booking emails. |
| `SUZANA_EMAIL` | Notification inbox for Suzana Ali. |
| `SHAHRIMAN_EMAIL` | Notification inbox for Shahriman. |
| `NUR_FARAHIZZAH_EMAIL` | Notification inbox for Nur Farahizzah. |
| `NEXT_PUBLIC_SITE_URL` | Used as `metadataBase` (default `http://localhost:3000`). |

Do not commit real secrets. `.gitignore` excludes `.env`, `.env.local`, and log files.

## Code organization and data flow

### Static content (`lib/firm-data.js`)

This is the single source of truth for all firm content: firm metadata, offices, partners, practice groups, panel partners, and matter types shown in the concierge. Both `app/page.jsx` and `components/LegalConcierge.jsx` import from here.

### Booking logic (`lib/booking.js`)

- `availabilityFor(partnerId)` generates candidate slots for the next 20 calendar days, weekdays only, at fixed times (`09:30`, `11:00`, `14:30`, `16:00` in `Asia/Kuala_Lumpur`). It filters out slot IDs already present in `data/bookings.json` for that partner and returns up to 12 open slots.
- Slot IDs are deterministic strings: `partnerId:YYYY-MM-DD:HH:MM`.
- `writeBooking(booking)` appends a booking to `data/bookings.json`.
- `partnerEmail(partnerId)` resolves the notification recipient from environment variables, falling back to `SUZANA_EMAIL` and then a hardcoded address.

### API routes (`app/api/*`)

- `GET /api/availability?partner=<id>` returns available slots for a partner.
- `POST /api/book` validates the requested slot, writes the booking, and triggers email.
- `POST /api/chat` returns concierge assistant text; calls Groq if configured, otherwise returns canned fallback replies.

### Concierge UI (`components/LegalConcierge.jsx`)

The concierge is a staged wizard, not a free-form chatbot. Stages are: `matter → partner → slot → details → booking → booked`. The LLM only generates connective assistant text between stages; it does not drive transitions or collect structured data.

The component is rendered twice in `app/page.jsx`:

1. `<LegalConcierge embedded />` inline in the `#concierge` section (always open).
2. `<LegalConcierge />` as a floating launcher button and panel elsewhere on the page.

The `embedded` prop toggles behavior; there is no separate component.

### Email (`lib/email.js`)

`sendBookingEmails(booking)` sends two HTML emails: a client confirmation and a firm/partner notification. If SMTP is not configured, it logs both payloads to the console with `[booking-email:client]` and `[booking-email:firm]` prefixes and returns `{ sent: false, mode: "logged" }`.

### Styling

`app/globals.css` is imported once in `app/layout.jsx`. Class names such as `.hero`, `.stat-band`, `.practice-grid`, `.concierge-band`, `.concierge`, etc. are the section hooks for layout and styling changes. The stylesheet uses CSS custom properties for the color palette and includes responsive breakpoints at `1180px` and `820px`.

## Code style guidelines

- Use ES modules; `package.json` declares `"type": "module"`.
- Prefer `@/` path aliases for imports from the project root (configured in `jsconfig.json`).
- Use double quotes for strings and JSX attributes (consistent with the existing code).
- Use semantic class names in kebab-case in CSS and JSX.
- React components are default-exported functions in `.jsx` files.
- Server-side API routes live under `app/api/*/route.js` and use `NextResponse.json()`.
- Client components begin with `"use client";` (only `components/LegalConcierge.jsx` currently needs this).
- Keep the single-source-of-truth pattern: firm content belongs in `lib/firm-data.js`, booking logic in `lib/booking.js`, and email logic in `lib/email.js`.

## Testing instructions

There is no automated test suite configured. Manual verification steps:

1. Run `npm install && npm run dev`.
2. Visit `http://localhost:3000` and confirm the page renders without console errors.
3. Scroll to the concierge section and complete a test booking.
4. Verify that `data/bookings.json` contains the new booking.
5. Without SMTP configured, check the terminal/server logs for `[booking-email:client]` and `[booking-email:firm]` entries.
6. With `GROQ_API_KEY` set, verify the concierge uses Groq-generated replies. Without it, verify fallback replies appear.

## Security considerations

- **Do not commit secrets**. Keep API keys and SMTP credentials in `.env.local` only.
- **No legal advice in the concierge**. The chat system prompt explicitly forbids legal advice, predictions, fees, and lawyer-client privilege claims.
- **Booking validation**. `POST /api/book` re-validates the requested slot server-side against `availabilityFor()` rather than trusting client-held slot data.
- **Input sanitization**. Booking fields are trimmed on the server; email addresses are validated with a regex before a booking is accepted.
- **File persistence**. `data/bookings.json` is read and written via `node:fs/promises` from `process.cwd()`. Ensure the runtime process has write access to the `data/` directory in production.
- **Public assets**. The firm profile PDF and images in `public/` are served statically. Verify that no sensitive documents are placed there.
- **Environment exposure**. Only `NEXT_PUBLIC_SITE_URL` is intended for the browser. Keep all other variables server-side only.

## Deployment notes

- The project is a standard Next.js application. Build with `npm run build` and start with `npm run start`.
- Remember to provision the `data/` directory with write permissions if you want bookings to persist on disk.
- For live email, configure all `SMTP_*` variables and partner email variables.
- For live AI chat, set `GROQ_API_KEY` and optionally `GROQ_MODEL`.
