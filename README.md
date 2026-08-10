# Investors Circle

Premium investment intelligence landing page for [Investors Circle](https://investorscircle.in).

Built with **Next.js**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **GSAP-ready patterns**, **Lenis**, **Recharts**, **React Hook Form** and **Zod**.

---

## 1. Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 2. Environment variables

Copy `.env.example` to `.env.local` and fill in values as needed:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `NEXT_PUBLIC_SITE_NAME` | Brand name |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits only / E.164 without `+` for WhatsApp FAB (empty hides FAB) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public contact email |
| `NEXT_PUBLIC_CONTACT_PHONE` | Public phone |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Lead form POST endpoint (Formspree, webhook, CRM) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager |
| `NEXT_PUBLIC_GA4_ID` | GA4 (used if GTM is empty) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel |
| `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` | LinkedIn Insight Tag |
| `NEXT_OUTPUT` | `export` (default) or `standalone` |

Never commit secrets. Tracking IDs belong in env vars only.

---

## 3. Production build

### Static export (Hostinger shared / static hosting)

```bash
NEXT_OUTPUT=export npm run build
```

Output folder: `out/`

Preview:

```bash
npx serve out
```

### Node / standalone (Hostinger VPS / Cloud with Node)

```bash
NEXT_OUTPUT=standalone npm run build
node .next/standalone/server.js
```

Copy `public` and `.next/static` into the standalone folder if deploying standalone:

```bash
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
```

---

## 4. Hostinger deployment

### Important compatibility note

| Hostinger product | Compatible approach |
|---|---|
| Shared / Web hosting (PHP/static) | Use **static export** (`out/`) |
| VPS / Cloud with Node.js | Use `next start` or **standalone** |

Shared Hostinger hosting cannot run the Next.js Node server. This project defaults to `output: "export"` so the site can be uploaded as static files.

### Static deploy steps

1. Run `NEXT_OUTPUT=export npm run build`
2. Upload the contents of `out/` to `public_html` (or your domain root)
3. Ensure `.htaccess` routes unknown paths to `index.html` only if you add client-only routes later; with trailing-slash static pages, each route already has its own `index.html`
4. Set DNS A/CNAME records to Hostinger
5. Enable SSL in Hostinger (Let's Encrypt)

### Example Apache rewrite (optional, for clean fallbacks)

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [L]
```

---

## 5. Domain configuration

1. Point your domain to Hostinger nameservers or A record
2. Set `NEXT_PUBLIC_SITE_URL` to `https://your-domain.com`
3. Rebuild so canonical/OG/sitemap URLs are correct

---

## 6. SSL configuration

In Hostinger hPanel:

1. Websites → your site → SSL
2. Install free Let's Encrypt certificate
3. Force HTTPS redirect

---

## 7. Analytics setup

1. Create GTM / GA4 / Meta Pixel / LinkedIn Insight containers
2. Add IDs to `.env.local` (or Hostinger env / build-time env)
3. Rebuild and deploy
4. Verify events in each platform debugger

Tracked events (via `trackEvent()` in `src/lib/analytics.ts`):

- `page_view`
- `hero_cta_click`
- `opportunity_view`
- `opportunity_category_select`
- `insight_click`
- `form_start`
- `form_submit`
- `form_success`
- `phone_click`
- `whatsapp_click`
- `nav_cta_click`
- `final_cta_click`

---

## 8. Form / API setup

On static Hostinger deploys there is **no Next.js API route**.

Set `NEXT_PUBLIC_FORM_ENDPOINT` to:

- Formspree form URL
- Make.com / Zapier webhook
- Your CRM intake URL
- A small serverless function elsewhere

If the endpoint is empty, the form shows a local success state for UI testing only (no data is stored).

---

## Project structure

```text
src/
  app/                  # Routes + metadata
  components/           # Section + UI components
  data/                 # Structured content (CMS-ready)
  lib/                  # analytics, utils, validations
  types/                # Shared TypeScript types
public/                 # Static assets
legacy/                 # Previous HTML/Vite experiments (archived)
```

Future investor portal routes can be added under:

- `/investor/login`
- `/investor/dashboard`
- `/investor/opportunities`
- `/investor/portfolio`
- `/investor/documents`
- `/investor/profile`

without restructuring the landing page.

---

## Content rules

Do not invent investor counts, capital deployed, returns, testimonials, awards or partnerships. Placeholder values use `XX+`, `₹XX Cr+` or `[PLACEHOLDER]` until real data is supplied.

---

## Scripts

```bash
npm run dev      # development
npm run build    # production build (honors NEXT_OUTPUT)
npm run start    # Node server (standalone/non-export builds)
npm run lint     # ESLint
```
