# Frontend Reconstruction Status

## Complete

- Editable React + Vite source project
- Shared header, footer, mobile navigation, cart shell, floating WhatsApp and ambient audio control
- Home route and recovered section order
- About route
- Services route with all 8 recovered treatment objects
- Results route with all 10 recovered gallery items
- Pricing route with all 179 services across 14 categories
- Blog route with all 6 recovered cards
- Products frontend state
- Contact route
- Booking UI with 50% deposit calculation and query-string service preselection
- Payment success and payment cancelled frontend routes
- Captured wildcard 404 behavior
- Mobile sticky booking CTA on Home
- Exact recovered CSS bundle preserved as `src/source-truth.css`
- Original compiled JS/CSS retained under `recovery-reference/compiled/`
- Vercel SPA fallback configuration
- Production build passed
- All reconstructed frontend routes returned HTTP 200 in local preview smoke testing
- `npm audit` passed with 0 vulnerabilities

## Recovered data checks

- 8 treatment groups
- 10 results items
- 179 pricing services
- 14 pricing categories
- 20 Google review objects
- 6 blog cards
- 34 local asset paths referenced by captured bundle

## Treatment videos (resolved)

All 8 treatment-page videos are now real local files supplied directly by the site owner (`public/videos/`), replacing the earlier source-site proxy rewrites — the dev-server proxy in `vite.config.js` and the matching `vercel.json` rewrites have been removed since they're no longer needed:

- `plasma-treatment.mp4`, `hydra-facial.mp4`, `hair-regrowth-therapy.mp4`, `ultraformer-therapy.mp4`, `laser-hair-removal.mp4`, `anti-aging-treatment.mp4`, `acne-treatment.mp4`, `cellulite-treatment.mp4`

Two more owner-supplied videos cover services that only existed as pricing line items (no dedicated Services-page treatment group): `skin-tag-removal.mp4` and `spider-vein-removal.mp4`, shown inline on the Pricing page directly on their "Body Treatments" cards (`Skin Tag Removal`, `Spider Veins Per Area` in `src/data/pricing.json`). `skin-tag-removal.mp4` was re-encoded (53.8MB → 21MB, same visual quality) since it was a ~4:46 clip; both skin-tag and spider-vein videos also had their orientation baked into the pixel data (they carried a 90° rotation tag) for reliable cross-browser playback. All video elements are `autoplay muted loop playsInline` with no native controls, so nothing is downloadable.

## PayFast payment function (added)

- `/api/payfast/checkout` (Vercel serverless function) signs and initiates PayFast payments for both the booking deposit flow and the product shop cart. Amount is always recomputed server-side from `src/data/pricing.json` / `src/data/products.json` — never trusted from the client.
- `/api/payfast/notify` handles the ITN webhook: signature verification, source-IP verification against PayFast's published hosts, amount verification (recomputed independently, no DB needed), and PayFast's server-side `/eng/query/validate` confirmation.
- Requires `PAYFAST_MERCHANT_ID`, `PAYFAST_MERCHANT_KEY`, `PAYFAST_PASSPHRASE`, `PAYFAST_MODE` (`sandbox`|`live`, defaults to `sandbox`) as Vercel environment variables.

## Deferred backend work

- Supabase product loading and realtime updates
- Order persistence (there is still no database — a validated PayFast payment is currently only recorded as a structured log line in Vercel function logs, not stored anywhere durable or emailed to the merchant)
- Admin authentication and dashboards
- Transactional email / server functions

The booking and shop frontend does not falsely report payment success when backend processing is unavailable; the `/payment-success` page describes the payment as being processed rather than definitively confirmed, since only the asynchronous ITN webhook is authoritative.

## Verification limitation

Automated browser screenshot comparison could not be completed in this runtime because Chromium navigation is blocked by an environment administrator policy. Build, route, data, asset-path and SPA smoke tests were completed instead. Visual parity should receive a final browser comparison on an unrestricted local machine before production cutover.
