# Frontend Validation Report

## Automated checks

- `pricing_categories`: **14**
- `pricing_services`: **179**
- `treatments`: **8**
- `results`: **10**
- `reviews`: **20**
- `blog_cards`: **6**
- `referenced_local_asset_paths`: **34**
- `source_truth_css_sha256_match`: **True**
- `missing_refs_are_exact_six_videos`: **True**
- `old_compiled_js_not_executed`: **True**
- `new_source_entry_present`: **True**

## Missing local binaries

The only referenced local paths without embedded files are the six original MP4 bodies already identified in the HAR audit. They resolve to the exact source-of-truth host at runtime:

- `/videos/acne-treatment.mp4`
- `/videos/hydra-facial.mp4`
- `/videos/treatment-d2.mp4`
- `/videos/treatment-d3.mp4`
- `/videos/treatment-d4.mp4`
- `/videos/treatment-d5.mp4`

## Build and routing

- `npm run build`: passed
- `npm audit`: 0 vulnerabilities
- Local Vite preview route smoke test: all reconstructed routes returned HTTP 200
- Vercel SPA fallback: configured

## Browser parity note

Automated screenshot comparison is not marked complete because Chromium navigation is blocked by administrator policy in this runtime. A final visual comparison should be run on an unrestricted browser before production cutover.
