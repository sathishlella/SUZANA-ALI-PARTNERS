# AGENTS.md

Agent-focused guide for the **Suzana Ali & Partners Website** repository.

## Project overview

This is the marketing website for **Suzana Ali & Partners**, a Malaysian law firm (Advocates & Solicitors). It is built as a single-page Next.js application using the App Router. The site presents the firm, its advocates and solicitors, practice areas and panel relationships, and provides a floating "Legal Concierge" chat assistant that answers visitor questions about the firm. Primary conversion is by phone: "Call us" buttons open an office-picker modal with direct `tel:` links.

The project intentionally has **no CMS and no database**. All firm content is static JavaScript data in `lib/firm-data.js`. A complete server-side booking pipeline (slot availability, booking persistence to `data/bookings.json`, confirmation emails) still exists under `app/api/availability`, `app/api/book`, `lib/booking.js` and `lib/email.js`, but **no UI currently consumes it** — the concierge was simplified from a booking wizard into a pure Q&A chatbot, and the consultation CTAs now open the call modal instead. Treat the booking pipeline as dormant intake infrastructure: keep it working, but do not assume any client calls it.

Every external integration (AI chat, email) degrades gracefully so the site remains fully demoable without configuration.

Key repository facts:

- Framework: Next.js 16 with App Router and React 19.
- Language: JavaScript (JSX), ES modules (`"type": "module"`).
- Styling: plain CSS in `app/globals.css`; no Tailwind or CSS-in-JS.
- Package manager: npm.
- AI integration: Groq SDK for concierge chat replies (optional; canned fallback without a key).
- Email integration: nodemailer for booking confirmation emails (optional; logged without SMTP). Only used by the dormant booking pipeline.
- Persistence: `data/bookings.json` is the booking ledger (currently an empty array). Only written by `POST /api/book`.
- Animation: GSAP 3 with the ScrollTrigger plugin, plus plain CSS animations.
- Icons: `lucide-react`.
- Analytics: GA4 via gtag.js, wired in `app/layout.jsx` with `next/script` (`afterInteractive`). The measurement ID (`G-XFFC25Q5L7`) is hardcoded there — it is public by design, so no env variable. The GA4 property is owned by the client's Google account.

## Project structure

```text
.
├── app/
│   ├── api/
│   │   ├── availability/route.js   # GET available slots for an office (dormant; no UI caller)
│   │   ├── book/route.js           # POST a new booking (dormant; no UI caller)
│   │   └── chat/route.js           # POST concierge chat reply (the live integration)
│   ├── poc/
│   │   ├── page.jsx                # Motion design proof-of-concept at /poc
│   │   └── poc.css                 # POC-specific styles
│   ├── globals.css                 # Global styles and responsive rules (~2700 lines)
│   ├── layout.jsx                  # Root layout with fonts and metadata
│   ├── page.jsx                    # Single long-scrolling marketing page
│   ├── icon.png / apple-icon.png / favicon.ico
├── components/
│   ├── poc/
│   │   ├── HeroPoc.jsx             # POC hero variant
│   │   ├── MagneticButton.jsx      # POC magnetic hover button
│   │   └── TeamStackPoc.jsx        # POC 3D card-stack team carousel
│   ├── CallModal.jsx               # Office-picker call modal (opened via "open-call-modal" event)
│   ├── CustomCursor.jsx            # Custom dot + ring cursor
│   ├── Hero.jsx                    # Full-viewport hero section
│   ├── Insights.jsx                # Insights/article cards section
│   ├── LegalConcierge.jsx          # Floating Q&A chatbot component
│   ├── MagneticButton.jsx          # Magnetic hover button (root version)
│   ├── Marquee.jsx                 # Infinite scrolling credentials band
│   ├── PageTransition.jsx          # Full-screen page-load curtain
│   ├── PartnerStack.jsx            # Team profile cards (GSAP scroll animation)
│   ├── PracticeAccordion.jsx       # Expandable practice area list
│   ├── TagScroller.jsx             # Horizontal matter-type pills
│   ├── TestimonialCarousel.jsx     # Auto-rotating testimonial slider
│   └── Topbar.jsx                  # Fixed header with navigation
├── data/
│   └── bookings.json               # Flat-file booking ledger (empty array)
├── lib/
│   ├── booking.js                  # Booking/slot logic and file I/O (dormant pipeline)
│   ├── email.js                    # Email rendering and sending (dormant pipeline)
│   └── firm-data.js                # Static firm content, team, practices
├── public/
│   ├── downloads/                  # Downloadable firm profile PDF
│   ├── images/                     # Team portraits, group photo, firm logo
│   ├── logos/                      # 14 panel/institutional logo images
│   └── heropage*.png               # Hero background images (`/heropage.png` is the active one)
├── LOGO for panels/                # Source logo assets (not served; copies live in public/logos/)
├── .env.example                    # Template for environment variables
├── next.config.mjs                 # Next.js config (strict mode only)
├── package.json                    # Dependencies and scripts
├── jsconfig.json                   # Path alias `@/*` maps to `./*`
└── CLAUDE.md                       # Older companion agent notes (partially outdated; this file is authoritative)
```

The repository root also contains source documents (a firm profile PDF and a screenshot) that are not referenced by the code; the served firm profile PDF lives in `public/downloads/`.

## Technology stack

- **Runtime / framework**: Node.js, Next.js `^16.2.10`, React / React DOM `^19.2.7`.
- **Animation**: GSAP `^3.15.0` with the ScrollTrigger plugin.
- **Icons**: `lucide-react` `^1.23.0`.
- **AI**: `groq-sdk` `^1.3.0` (optional; fallback reply is used when not configured).
- **Email**: `nodemailer` `^9.0.3` (optional; emails are logged when SMTP is not configured).
- **Fonts**: Inter (body/UI) and Cormorant Garamond (editorial headings), loaded via `next/font/google` in `app/layout.jsx` as CSS variables `--font-inter` and `--font-cormorant`.
- **Build tooling**: Next.js built-in compiler/bundler; `jsconfig.json` enables `@/` imports. `package.json` pins `postcss` via an npm `overrides` entry.

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

There is no dedicated test suite. The site is a single-page marketing application; there is no per-route or per-component test/build target to isolate.

## Environment configuration

Copy `.env.example` to `.env.local` to enable live integrations. Without a `.env.local` file the site runs in a fully degraded/fallback mode. This is the expected local development state, not an error.

Variables:

| Variable | Purpose | Default in `.env.example` |
|---|---|---|
| `GROQ_API_KEY` | Enables natural-language concierge replies via Groq. | empty |
| `GROQ_MODEL` | Groq model name. | `llama-3.3-70b-versatile` |
| `SMTP_HOST` | SMTP server host for booking emails (dormant pipeline). | empty |
| `SMTP_PORT` | SMTP port. | `587` |
| `SMTP_SECURE` | Set `"true"` for TLS on port 465. | `false` |
| `SMTP_USER` | SMTP authentication user. | empty |
| `SMTP_PASS` | SMTP authentication password. | empty |
| `EMAIL_FROM` | Sender address for booking emails. | `Suzana Ali & Partners <appointments@suzanaali.com>` |
| `SUZANA_EMAIL` | Notification inbox (fallback recipient for all offices). | `admin.kl@suzanaali.com` |
| `SHAHRIMAN_EMAIL` | Notification inbox variable (defined but not referenced by any office record today). | `admin.kl@suzanaali.com` |
| `NUR_FARAHIZZAH_EMAIL` | Notification inbox variable (defined but not referenced by any office record today). | `admin.ns@suzanaali.com` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL. | `http://localhost:3000` |

Do not commit real secrets. `.gitignore` excludes `.env`, `.env.local`, `.next`, `node_modules`, and debug log files.

Only `NEXT_PUBLIC_SITE_URL` is intended for the browser. Keep all other variables server-side only.

## Code organization and data flow

### Static content (`lib/firm-data.js`)

This is the single source of truth for all firm content:

- `firm` — firm name, descriptor, established date, profile PDF URL (`/downloads/suzana-ali-partners-firm-profile-2026.pdf`), phones, emails, and three offices (Kota Damansara/Petaling Jaya, Seremban, Ipoh). Each office has `id`, `city`, `label`, `address`, `phone`, `email`, and `emailEnv`. Note: all three offices currently set `emailEnv: "SUZANA_EMAIL"`.
- `partners` — five team members: three Partners (`suzana`, `shahriman`, `nur-farahizzah`) and two Lawyers (`muhammad-idzzul`, `nur-izzatul`), each with `id`, `name`, `title`, `qualification`, and `photo`.
- `practiceGroups` — five practice groups with titles, summaries, and matter tags.
- `panelPartners` — fourteen institutional / bank panel relationships, each with `name` and `logo` (paths under `/logos/`).
- `matterTypes` — seven matter categories (exported for the booking pipeline; not rendered by the current page).

`app/page.jsx`, `components/LegalConcierge.jsx`, `components/CallModal.jsx`, `app/api/chat/route.js` (plus `PartnerStack.jsx` and the POC carousel) all import from here.

### Concierge chat (`components/LegalConcierge.jsx` + `app/api/chat/route.js`)

The concierge is a floating Q&A chatbot, not a booking wizard. It keeps a local `messages` transcript, posts the whole transcript to `/api/chat`, and renders the reply. It shows three starter suggestion buttons until the first question is asked.

- The component accepts an `embedded` prop, but the page only uses the floating variant: `app/page.jsx` renders `<LegalConcierge />` once inside `<main>`, as a launcher button plus a floating panel. Any element can open it by dispatching a `window` `CustomEvent("open-concierge")`; the panel also closes on Escape or outside click.
- `POST /api/chat` accepts `{ transcript }` (truncated to the last 10 messages; roles normalized to `user`/`assistant`) and returns `{ reply, provider }` where `provider` is `"groq"` or `"fallback"`.
- With `GROQ_API_KEY` it calls Groq (`temperature 0.4`, `max_tokens 220`); the system prompt caps replies at ~60 words, forbids markdown, and grounds answers in a `firmKnowledge()` block built from `lib/firm-data.js`. Without a key — or on any Groq error — it returns a single canned fallback reply with the firm's phone and email.

### Call modal (`components/CallModal.jsx`)

All "Call us" CTAs (hero, topbar, `#concierge` section, `#contact` section) dispatch a `window` `CustomEvent("open-call-modal")`. `CallModal` listens for it and shows a modal listing the three offices with `tel:` links (first number used when an office lists two). It locks body scroll while open and closes on Escape or backdrop click.

### Dormant booking pipeline (`lib/booking.js`, `lib/email.js`, `app/api/availability`, `app/api/book`)

Still fully implemented but not wired to any UI:

- `availabilityForOffice(officeId)` generates candidate slots for the next 20 calendar days (starting tomorrow), weekdays only, at fixed times (`09:30`, `11:00`, `14:30`, `16:00`), labelled in `Asia/Kuala_Lumpur`. It filters out slot IDs already present in `data/bookings.json` for that office and returns up to 12 open slots. Slot IDs are deterministic strings: `officeId:YYYY-MM-DD:HH:MM`.
- `readBookings()` / `writeBooking(booking)` read and append to `data/bookings.json` via `node:fs/promises`; a missing file reads as `[]`.
- `getOffice(officeId)` returns the matching office record, defaulting to the first office. `officeEmail(office)` resolves the notification recipient from the office's `emailEnv` variable, falling back to `SUZANA_EMAIL` and then a hardcoded address. `makeBookingId()` generates IDs like `SAP-<timestamp36>-<random>`. `publicBooking(booking)` strips server-only fields (phone, notes, officeEmail, etc.) before sending a booking to the client.
- `GET /api/availability?office=<id>` returns office info (`id`, `label`, `city`) and available slots; defaults to `kota-damansara`.
- `POST /api/book` trims and validates fields (matter type, slot, name, valid email required), re-validates the requested slot server-side against `availabilityForOffice()` (returns `409` if the slot is gone), writes the booking, triggers email, and returns `{ booking: publicBooking(...), email }`.
- `sendBookingEmails(booking)` in `lib/email.js` sends two HTML emails: a client confirmation and a firm/office notification (recipient: `booking.officeEmail`, `replyTo` set to the client). If SMTP is not configured, it logs both payloads to the console with `[booking-email:client]` and `[booking-email:firm]` prefixes and returns `{ sent: false, mode: "logged" }`; otherwise it returns `{ sent: true, mode: "smtp" }`.

### Page composition (`app/page.jsx`)

`app/page.jsx` is a client component (`"use client"`) that assembles the single long-scrolling page in this order:

1. `CustomCursor`
2. `PageTransition`
3. `Topbar`
4. `Hero`
5. `Marquee`
6. `#firm` — static "Our Firm" section
7. `PracticeAccordion`
8. `TagScroller`
9. `PartnerStack`
10. `#concierge` — consultation copy + "Call us" CTA (dispatches `open-call-modal`)
11. `TestimonialCarousel`
12. `Insights`
13. `#panel` — panel relationships grid (maps `panelPartners`, `<img>` logos with a `Scale` icon fallback)
14. `#contact` — office cards (maps `firm.offices`) and final "Call us" CTA
15. `footer` — navigation, practice and per-office contact columns
16. `<LegalConcierge />` and `<CallModal />` — floating overlays rendered at the end of `<main>`

An inline `useReveal(ref)` hook provides GSAP ScrollTrigger fade-up animations for the three static sections (`#firm`, `#panel`, `#contact`). A document-level click handler smooth-scrolls in-page `#anchor` links without appending the hash to the address bar (plain anchor navigation still works without JS).

### Proof-of-concept route (`/poc`)

`app/poc/page.jsx` renders a separate motion demo at `/poc`. It imports `components/poc/HeroPoc.jsx` and `components/poc/TeamStackPoc.jsx` and uses `app/poc/poc.css`. The POC is not linked from the main page; its own footer states it is a placeholder for review and links back to `/`.

## Code style guidelines

- Use ES modules; `package.json` declares `"type": "module"`.
- Prefer `@/` path aliases for imports from the project root (configured in `jsconfig.json`). Note: `lib/booking.js` and `lib/email.js` are the exception — they import `./firm-data` relatively (without file extension).
- Use double quotes for strings and JSX attributes (consistent with the existing code).
- Use semantic class names in kebab-case in CSS and JSX.
- React components are default-exported functions in `.jsx` files.
- Practically every component under `components/` (and `app/page.jsx`) is a client component starting with `"use client";` — they use hooks, GSAP, or window events. Server components are the exception (`app/layout.jsx`, `app/poc/page.jsx`).
- Server-side API routes live under `app/api/*/route.js` and use `NextResponse.json()`.
- GSAP usage pattern: `gsap.registerPlugin(ScrollTrigger)` at module scope, animations inside `useLayoutEffect` wrapped in `gsap.context(...)`, cleaned up with `ctx.revert()`.
- Cross-component UI triggers use `window` `CustomEvent`s (`open-concierge`, `open-call-modal`) rather than prop drilling or state libraries.
- Keep the single-source-of-truth pattern: firm content belongs in `lib/firm-data.js`, booking logic in `lib/booking.js`, and email logic in `lib/email.js`.

## Styling

- `app/globals.css` is imported once in `app/layout.jsx`. The POC route has its own `app/poc/poc.css`.
- Plain CSS only — no Tailwind, no CSS-in-JS.
- CSS custom properties define the color palette:
  - Creams/taupes: `--cream`, `--cream-warm`, `--taupe`, `--taupe-deep`, `--paper`
  - Dark espresso: `--espresso`, `--espresso-dim`
  - Bronze accents: `--bronze`, `--bronze-soft`, `--bronze-light`
  - Utility: `--muted`, `--line`, `--line-strong`, `--shadow`, `--shadow-glow`
- Major section classes: `.hero-section`, `.firm-section`, `.practices-section`, `.partners-section`, `.concierge-section`, `.testimonial-section`, `.insights-section`, `.panel-section`, `.contact-section`, `.footer`.
- Fluid typography uses `clamp()` extensively.
- Responsive breakpoints in use: `min-width: 520px`, `min-width: 768px`, `max-width: 767px`, `max-width: 700px`, `max-width: 980px`, `max-width: 640px`, and `max-width: 380px`.
- Reduced motion support is present: `@media (prefers-reduced-motion: reduce)` disables animations, hides the custom cursor, and restores the default cursor.
- The native cursor is hidden on precise pointers (`@media (hover: hover) and (pointer: fine)`) to show the custom cursor component; touch devices keep the default cursor.

## Testing instructions

There is no automated test suite configured. Manual verification steps:

1. Run `npm install && npm run dev`.
2. Visit `http://localhost:3000` and confirm the page renders without console errors.
3. Open the concierge (floating "Ask us" launcher) and ask a question, e.g. "Where are your offices?".
4. With `GROQ_API_KEY` set, verify the response is a Groq-generated reply (`provider: "groq"` in the network response). Without it, verify the canned fallback reply appears (`provider: "fallback"`).
5. Click any "Call us" button (hero, `#concierge`, `#contact`) and confirm the office-picker modal opens with the three offices and working `tel:` links; confirm Escape and backdrop click close it.
6. Visit `http://localhost:3000/poc` to review the motion proof-of-concept.
7. Run `npm run lint` and `npm run build` before shipping changes.

The dormant booking pipeline can be exercised directly over the API if needed:

- `curl "http://localhost:3000/api/availability?office=seremban"` returns office info plus up to 12 open slots.
- `curl -X POST http://localhost:3000/api/book -H "Content-Type: application/json" -d '{"officeId":"seremban","slotId":"<id from availability>","matterType":"Civil litigation or dispute","clientName":"Test","clientEmail":"test@example.com"}'` creates a booking; repeating it with the same `slotId` returns `409`, and `data/bookings.json` gains a `SAP-…` record. Without SMTP configured, the server logs `[booking-email:client]` and `[booking-email:firm]` entries.

## Security considerations

- **Do not commit secrets**. Keep API keys and SMTP credentials in `.env.local` only (git-ignored).
- **No legal advice in the concierge**. The chat system prompt explicitly forbids legal advice, opinions on the merits of a matter, case predictions, and fee quotes; it also forbids ranking or comparing the lawyers, and grounds answers strictly in the firm information from `lib/firm-data.js`.
- **Booking validation** (dormant pipeline). `POST /api/book` re-validates the requested slot server-side against `availabilityForOffice()` rather than trusting client-held slot data, and returns `409` for taken slots.
- **Input sanitization**. Booking fields are trimmed on the server; email addresses are validated with a regex before a booking is accepted.
- **Minimal client exposure**. Booking API responses use `publicBooking()` to strip server-only fields (client phone, notes, office routing email).
- **File persistence**. `data/bookings.json` is read and written via `node:fs/promises` from `process.cwd()`. Ensure the runtime process has write access to the `data/` directory in production if the booking pipeline is ever re-enabled.
- **Public assets**. Everything in `public/` (firm profile PDF, portraits, logos) is served statically. Verify that no sensitive documents are placed there.
- **Environment exposure**. Only `NEXT_PUBLIC_SITE_URL` is intended for the browser. Keep all other variables server-side only.

## Deployment notes

- The project is a standard Next.js application. Build with `npm run build` and start with `npm run start`.
- `next.config.mjs` enables React Strict Mode only; no custom export, image domains, or rewrites are configured.
- For live AI chat, set `GROQ_API_KEY` and optionally `GROQ_MODEL`.
- If the booking pipeline is re-enabled: provision the `data/` directory with write permissions, configure all `SMTP_*` variables for live email, and set the partner/office email variables referenced by each office's `emailEnv` in `lib/firm-data.js`.
