# Suzana Ali & Partners Website

Premium Next.js website with an AI-assisted legal concierge, slot booking, local booking ledger, and email-ready confirmation flow.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Configure AI and email

Copy `.env.example` to `.env.local`, then set:

- `GROQ_API_KEY` for natural chat responses.
- SMTP values for live confirmation emails.
- Partner email values so bookings route to Suzana, Shahriman, or Nur Farahizzah.

Without these values, the site still works locally. The concierge uses polished fallback responses, bookings are saved to `data/bookings.json`, and email messages are logged instead of sent.
