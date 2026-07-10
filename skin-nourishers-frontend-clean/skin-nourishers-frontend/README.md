# Skin Nourishers Frontend

Clean React + Vite reconstruction of the captured Skin Nourishers frontend.

## Source of truth

The reconstruction is based only on the captured live application at:

`https://www.skinnourishers.online-web.co.za/`

The original compiled application and CSS captured from that deployment are retained under `recovery-reference/` for parity work. The live application source is now editable under `src/`.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Frontend routes

- `/`
- `/about`
- `/services`
- `/results`
- `/pricing`
- `/blog`
- `/products`
- `/contact`
- `/booking`
- `/payment-success`
- `/payment-cancelled`
- wildcard 404

## Deployment

`vercel.json` contains SPA fallback routing and passthrough rewrites for the six original treatment videos that were requested by the captured live app but whose binary bodies were not embedded in the HAR.

## Backend boundary

The public frontend is reconstructed. Supabase data, admin authentication, PayFast processing, orders, realtime products, and private server-side logic are intentionally deferred to the backend phase.
