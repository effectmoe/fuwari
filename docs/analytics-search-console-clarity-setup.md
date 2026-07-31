# effect.moe Analytics / Search Console / Clarity Setup

## Current Site Implementation

- Google Tag Manager is installed globally through `src/layouts/Layout.astro`.
- Default GTM container: `GTM-T9L3VSK2`.
- GA4 should be delivered from GTM. Current expected GA4 measurement ID: `G-571MN39B7X`.
- Google Search Console and Microsoft Clarity are intentionally ID-gated.
  They are only rendered when the matching public environment variables are set.

## Connection Status

| Service | Current status | Next requirement |
| --- | --- | --- |
| Google Tag Manager | Connected in generated HTML | Confirm the live container is published |
| GA4 | Expected via GTM container `GTM-T9L3VSK2` | Confirm the GA4 tag for `G-571MN39B7X` is firing inside GTM |
| Google Search Console | Site code supports HTML-tag verification | Set `PUBLIC_GOOGLE_SITE_VERIFICATION` or verify by DNS |
| Microsoft Clarity | Site code supports Clarity injection | Set `PUBLIC_MICROSOFT_CLARITY_PROJECT_ID` |

Do not add a direct GA4 script while the GTM container also fires GA4, because that can double-count page views. If GTM is not used for GA4, remove or disable the GA4 tag in GTM before adding direct `gtag.js`.

## Environment Variables

```bash
PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-T9L3VSK2
PUBLIC_GA4_MEASUREMENT_ID=G-571MN39B7X
PUBLIC_GOOGLE_SITE_VERIFICATION=<Search Console HTML tag token>
PUBLIC_MICROSOFT_CLARITY_PROJECT_ID=<Clarity project id>
```

## Google Search Console

Preferred verification method:

1. Add a Domain property for `effect.moe`.
2. Verify by DNS TXT record when possible.
3. If using the HTML tag method, set the token value in `PUBLIC_GOOGLE_SITE_VERIFICATION`.
4. Submit the sitemap after verification:
   - `https://effect.moe/sitemap-index.xml`
   - `https://effect.moe/rss.xml`
   - `https://effect.moe/llms.txt`

## GA4

Preferred configuration:

1. Use the existing GTM container `GTM-T9L3VSK2`.
2. Add or confirm the GA4 Google tag for `G-571MN39B7X`.
3. Fire on all pages.
4. Confirm real-time traffic from `https://effect.moe/`.

Recommended event tracking candidates:

- Contact form submit success
- Contact form submit error
- Free consultation CTA click
- Pricing CTA click
- AI CRAWL CTA click
- Search modal open
- Blog card click

## Microsoft Clarity

1. Create a Clarity project for `effect.moe`.
2. Copy the project ID.
3. Set `PUBLIC_MICROSOFT_CLARITY_PROJECT_ID`.
4. Rebuild and deploy.
5. Confirm page views in Clarity after production traffic.

## Deployment Check

After setting IDs:

```bash
pnpm build
rg "googletagmanager|google-site-verification|clarity.ms/tag" dist/index.html
```

Only deploy after the IDs are confirmed and the generated HTML contains the expected tags.
