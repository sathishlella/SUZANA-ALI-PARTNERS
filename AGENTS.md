<!-- AGENTS.md for Suzana Ali & Partners Website -->

# AGENTS.md

Agent-focused guide for the **Suzana Ali & Partners Website** repository.

## Project overview

This is the marketing and intake website for **Suzana Ali & Partners**, a Malaysian law firm. It is built as a single-page Next.js application using the App Router. The site presents the firm, its advocates and solicitors, practice areas and panel relationships, and provides a guided legal concierge that lets visitors book consultation slots.

The project intentionally has **no CMS and no database**. All firm content is static JavaScript data in `lib/firm-data.js`, and bookings are persisted to a local JSON file at `data/bookings.json`. Every external integration degrades gracefully so the site remains fully demoable without configuration.

Key repository facts:

- Framework: Next.js 16.2.10 with App Router and React 19.2.7.
- Language: JavaScript (JSX), ES modules (`"type": "module"`).
- Styling: plain CSS in `app/globals.css`; no Tailwind or CSS-in-JS.
- Package manager: npm.
- AI integration: Groq SDK for concierge chat replies.
- Email integration: nodemailer for booking confirmation emails.
- Persistence: `data/bookings.json` is the booking ledger.
- Animation: GSAP 3.15.0 with ScrollTrigger, plus plain CSS animations.
- Icons: `lucide-react`.

## Project structure

```text
.
├── app/
│   ├── api/
│   │   ├── availability/route.js   # GET available slots for a partner
│   │   ├── book/route.js           # POST a new booking
│   │   └── chat/route.js           # POST concierge chat reply
│   ├── poc/
│   │   ├── page.jsx                # Motion design proof-of-concept at /poc
│   │   └── poc.css                 # POC-specific styles
│   ├── globals.css                 # Global styles and responsive rules
│   ├── layout.jsx                  # Root layout with fonts and metadata
│   └── page.jsx                    # Single long-scrolling marketing page
├── components/
│   ├── poc/
│   │   ├── HeroPoc.jsx             # POC hero variant
│   │   ├── MagneticButton.jsx      # POC magnetic hover button
│   │   └── TeamStackPoc.jsx        # POC 3D card-stack partner carousel
│   ├── CustomCursor.jsx            # Custom dot + ring cursor
│   ├── Hero.jsx                    # Full-viewport hero section
│   ├── Insights.jsx                # Insights/article cards section
│   ├── LegalConcierge.jsx          # Client booking wizard component
│   ├── MagneticButton.jsx          # Magnetic hover button (root version)
│   ├── Marquee.jsx                 # Infinite scrolling credentials band
│   ├── PageTransition.jsx          # Full-screen page-load curtain
│   ├── PartnerStack.jsx            # Partner profile cards
│   ├── PracticeAccordion.jsx       # Expandable practice area list
│   ├── TagScroller.jsx             # Horizontal matter-type pills
│   ├── TestimonialCarousel.jsx     # Auto-rotating testimonial slider
│   └── Topbar.jsx                  # Fixed header with navigation
├── data/
│   └── bookings.json               # Flat-file booking ledger
├── lib/
│   ├── booking.js                  # Booking/slot logic and file I/O
│   ├── email.js                    # Email rendering and sending
│   └── firm-data.js                # Static firm content, partners, practices
├── public/
│   ├── downloads/                  # Downloadable firm profile PDF
│   └── images/                     # Hero background and portrait assets
├── .env.example                    # Template for environment variables
├── next.config.mjs                 # Next.js config (strict mode only)
├── package.json                    # Dependencies and scripts
└── jsconfig.json                   # Path alias `@/*` maps to `./*`
```

## Technology stack

- **Runtime / framework**: Node.js, Next.js 16, React 19, React DOM 19.
- **Animation**: GSAP 3.15.0 with ScrollTrigger plugin.
- **Icons**: `lucide-react` 1.23.0.
- **AI**: `groq-sdk` 1.3.0 (optional; fallback replies are used when not configured).
- **Email**: `nodemailer` 9.0.3 (optional; emails are logged when SMTP is not configured).
- **Fonts**: Inter (body/UI) and Cormorant Garamond (editorial headings), loaded via `next/font/google`.
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

There is no dedicated test suite. The site is a single-page marketing application; there is no per-route or per-component test/build target to isolate.

## Environment configuration

Copy `.env.example` to `.env.local` to enable live integrations. Without a `.env.local` file the site runs in a fully degraded/fallback mode. This is the expected local development state, not an error.

Variables:

| Variable | Purpose | Default in `.env.example` |
|---|---|---|
| `GROQ_API_KEY` | Enables natural-language concierge replies via Groq. | empty |
| `GROQ_MODEL` | Groq model name. | `llama-3.3-70b-versatile` |
| `SMTP_HOST` | SMTP server host for booking emails. | empty |
| `SMTP_PORT` | SMTP port. | `587` |
| `SMTP_SECURE` | Set `"true"` for TLS on port 465. | `false` |
| `SMTP_USER` | SMTP authentication user. | empty |
| `SMTP_PASS` | SMTP authentication password. | empty |
| `EMAIL_FROM` | Sender address for booking emails. | `Suzana Ali & Partners <appointments@suzanaali.com>` |
| `SUZANA_EMAIL` | Notification inbox for Suzana Ali. | `admin.kl@suzanaali.com` |
| `SHAHRIMAN_EMAIL` | Notification inbox for Shahriman. | `admin.kl@suzanaali.com` |
| `NUR_FARAHIZZAH_EMAIL` | Notification inbox for Nur Farahizzah. | `admin.ns@suzanaali.com` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL / metadataBase. | `http://localhost:3000` |

Do not commit real secrets. `.gitignore` excludes `.env`, `.env.local`, and debug log files.

Only `NEXT_PUBLIC_SITE_URL` is intended for the browser. Keep all other variables server-side only.

## Code organization and data flow

### Static content (`lib/firm-data.js`)

This is the single source of truth for all firm content:

- `firm` — firm name, descriptor, established date, profile PDF URL, phones, emails, and three offices (Petaling Jaya, Seremban and Ipoh/Perak).
- `partners` — three advocates and solicitors (`suzana`, `shahriman`, `nur-farahizzah`), each with `id`, `name`, `title`, `qualification`, and `photo`.
- `practiceGroups` — five practice groups with titles, summaries, and matter tags.
- `panelPartners` — fourteen institutional / bank panel relationships.
- `matterTypes` — seven matter categories shown in the concierge wizard.

Both `app/page.jsx` and `components/LegalConcierge.jsx` import from here.

### Booking logic (`lib/booking.js`)

- `availabilityForOffice(officeId)` generates candidate slots for the next 20 calendar days, weekdays only, at fixed times (`09:30`, `11:00`, `14:30`, `16:00`) in `Asia/Kuala_Lumpur`. It filters out slot IDs already present in `data/bookings.json` for that office and returns up to 12 open slots.
- Slot IDs are deterministic strings: `officeId:YYYY-MM-DD:HH:MM`.
- `writeBooking(booking)` appends a booking to `data/bookings.json`.
- `getOffice(officeId)` returns the office record from `firm.offices`.
- `officeEmail(office)` resolves the notification recipient from the office's `emailEnv` environment variable, falling back to `SUZANA_EMAIL` and then a hardcoded address.
- `makeBookingId()` generates IDs like `SAP-<timestamp36>-<random>`.
- `publicBooking(booking)` strips server-only fields before sending the booking to the client.

### API routes (`app/api/*`)

- `GET /api/availability?office=<id>` returns available slots and office info.
- `POST /api/book` validates the requested slot, writes the booking, triggers email, and returns the public booking.
- `POST /api/chat` returns concierge assistant text; calls Groq if configured, otherwise returns canned fallback replies.

### Concierge UI (`components/LegalConcierge.jsx`)

The concierge is a staged wizard, not a free-form chatbot. Stages are: `matter → office → slot → details → booking → booked`. The LLM only generates connective assistant text between stages; it does not drive transitions or collect structured data.

The component is rendered twice in `app/page.jsx`:

1. `<LegalConcierge embedded />` inline in the `#concierge` section (always open).
2. `<LegalConcierge />` as a floating launcher button and panel elsewhere on the page.

The `embedded` prop toggles behavior; there is no separate component.

### Email (`lib/email.js`)

`sendBookingEmails(booking)` sends two HTML emails: a client confirmation and a firm/partner notification. If SMTP is not configured (missing `SMTP_HOST`, `SMTP_USER`, or `SMTP_PASS`), it logs both payloads to the console with `[booking-email:client]` and `[booking-email:firm]` prefixes and returns `{ sent: false, mode: "logged" }`.

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
10. `#concierge` — consultation copy + `<LegalConcierge embedded />`
11. `TestimonialCarousel`
12. `Insights`
13. `#panel` — panel relationships grid
14. `#contact` — offices and final CTA
15. `footer`
16. `<LegalConcierge />` — floating launcher variant

An inline `useReveal(ref)` hook provides GSAP scroll-triggered fade-up animations for the three static sections (`#firm`, `#panel`, `#contact`).

### Proof-of-concept route (`/poc`)

`app/poc/page.jsx` renders a separate dark editorial motion demo at `/poc`. It imports `components/poc/HeroPoc.jsx` and `components/poc/TeamStackPoc.jsx` and uses `app/poc/poc.css`. The POC is not linked from the main page and is explicitly marked as a motion/design review placeholder.

## Code style guidelines

- Use ES modules; `package.json` declares `"type": "module"`.
- Prefer `@/` path aliases for imports from the project root (configured in `jsconfig.json`).
- Use double quotes for strings and JSX attributes (consistent with the existing code).
- Use semantic class names in kebab-case in CSS and JSX.
- React components are default-exported functions in `.jsx` files.
- Server-side API routes live under `app/api/*/route.js` and use `NextResponse.json()`.
- Client components begin with `"use client";` (only `components/LegalConcierge.jsx` and `app/page.jsx` currently need this).
- Keep the single-source-of-truth pattern: firm content belongs in `lib/firm-data.js`, booking logic in `lib/booking.js`, and email logic in `lib/email.js`.

## Styling

- `app/globals.css` is imported once in `app/layout.jsx`.
- Plain CSS only — no Tailwind, no CSS-in-JS.
- CSS custom properties define the color palette:
  - Creams/taupes: `--cream`, `--cream-warm`, `--taupe`, `--paper`
  - Dark espresso: `--espresso`
  - Bronze accents: `--bronze`, `--bronze-soft`, `--bronze-light`
  - Utility: `--line`, `--line-strong`, `--shadow`, `--shadow-glow`
- Major section classes: `.hero-section`, `.firm-section`, `.practices-section`, `.partners-section`, `.concierge-section`, `.testimonial-section`, `.panel-section`, `.insights-section`, `.contact-section`, `.footer`.
- Fluid typography uses `clamp()` extensively.
- Responsive breakpoints are defined at `min-width: 768px`, `max-width: 980px`, `max-width: 640px`, and `max-width: 380px`.
- Reduced motion support is present: `@media (prefers-reduced-motion: reduce)` disables animations, hides the custom cursor, and restores the default cursor.
- The native cursor is hidden on desktop (`hover: hover` and `pointer: fine`) to show the custom cursor component; touch devices keep the default cursor.

## Testing instructions

There is no automated test suite configured. Manual verification steps:

1. Run `npm install && npm run dev`.
2. Visit `http://localhost:3000` and confirm the page renders without console errors.
3. Scroll to the concierge section and complete a test booking (choose matter type, office, slot and details).
4. Verify that `data/bookings.json` contains the new booking with `officeId` and `officeLabel`.
5. Without SMTP configured, check the terminal/server logs for `[booking-email:client]` and `[booking-email:firm]` entries.
6. With `GROQ_API_KEY` set, verify the concierge uses Groq-generated replies. Without it, verify fallback replies appear.

## Security considerations

- **Do not commit secrets**. Keep API keys and SMTP credentials in `.env.local` only.
- **No legal advice in the concierge**. The chat system prompt explicitly forbids legal advice, predictions, fees, and lawyer-client privilege claims.
- **Booking validation**. `POST /api/book` re-validates the requested slot server-side against `availabilityForOffice()` rather than trusting client-held slot data.
- **Input sanitization**. Booking fields are trimmed on the server; email addresses are validated with a regex before a booking is accepted.
- **File persistence**. `data/bookings.json` is read and written via `node:fs/promises` from `process.cwd()`. Ensure the runtime process has write access to the `data/` directory in production.
- **Public assets**. The firm profile PDF and images in `public/` are served statically. Verify that no sensitive documents are placed there.
- **Environment exposure**. Only `NEXT_PUBLIC_SITE_URL` is intended for the browser. Keep all other variables server-side only.

## Deployment notes

- The project is a standard Next.js application. Build with `npm run build` and start with `npm run start`.
- `next.config.mjs` enables React Strict Mode only; no custom export, image domains, or rewrites are configured.
- Remember to provision the `data/` directory with write permissions if you want bookings to persist on disk.
- For live email, configure all `SMTP_*` variables and partner email variables.
- For live AI chat, set `GROQ_API_KEY` and optionally `GROQ_MODEL`.
