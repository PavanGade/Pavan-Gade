# Deploy Investors Circle (simple guide)

You need two things online:
1. **The website pages** (`index.html` + `logos/`)
2. **The OTP server** (so mobile verification works)

---

## Hostinger (your host)

### 1) Upload the website

1. Log in to **Hostinger** → open **hPanel**
2. Open **Files** → **File Manager**
3. Go to the folder for your site (usually `public_html`)
4. Upload these from the project:
   - `index.html`
   - the whole `logos` folder
5. If Hostinger asks to overwrite an old `index.html`, choose **Replace**
6. Visit your domain (e.g. `https://investorscircle.in`) — the new page should load

**Tip:** Zip `index.html` + `logos` on your computer, upload the zip in File Manager, then **Extract**.

### 2) Turn on OTP (mobile verification)

Hostinger shared hosting is mostly for HTML files. OTP needs Node.js.

**Option A — Hostinger Node.js (if your plan has it)**  
1. hPanel → **Websites** → **Node.js** (or **Advanced** → Node.js)  
2. Create an app, set startup file to `otp-server.mjs`  
3. Upload the full project (including `otp-server.mjs`, `package.json`, `api/`)  
4. Set environment variables:
   - `OTP_DEMO_MODE=false`
   - `OTP_SECRET=long-random-secret`
   - `MSG91_AUTH_KEY=...`
   - `MSG91_TEMPLATE_ID=...`
5. Start the app  

**Option B — Keep site on Hostinger, OTP API on Vercel (easiest)**  
1. Deploy this GitHub repo on [vercel.com](https://vercel.com) (Import → Deploy)  
2. Copy your Vercel URL, e.g. `https://your-app.vercel.app`  
3. In Hostinger File Manager, edit `index.html` and add this **before** `</body>`:

```html
<script>window.IC_OTP_API = 'https://your-app.vercel.app/api/otp';</script>
```

4. Save. Form OTP will call Vercel; the website stays on Hostinger.

### 3) MSG91 for real SMS

1. Sign up at https://msg91.com  
2. Create an OTP template  
3. Put the keys in Vercel or Hostinger Node env vars (see Option A/B above)

---

## Fastest way: Netlify (free)

### A) Put the page online (2 minutes)

1. Open: https://app.netlify.com/drop  
2. Sign up / log in (email is fine)  
3. Download this folder from the repo, or use the zip with:
   - `index.html`
   - `logos/` (folder)
4. Drag that folder onto the Netlify Drop page  
5. Netlify gives you a link like:  
   `https://random-name.netlify.app`  
6. That link **is your website**

You can later connect your own domain (e.g. investorscircle.in) in Netlify → Domain settings.

### B) Turn on OTP (so fake leads are blocked)

The form needs a small server for SMS OTP.

1. Open: https://vercel.com  
2. Sign in with GitHub  
3. Click **Add New Project** → import `PavanGade/Pavan-Gade`  
4. Use branch: `cursor/mobile-otp-verification-4cc6` (or `main` after you merge PR #5)  
5. Add environment variables:
   - `OTP_DEMO_MODE` = `false`
   - `OTP_SECRET` = any long random password
   - `MSG91_AUTH_KEY` = from https://msg91.com
   - `MSG91_TEMPLATE_ID` = your MSG91 OTP template id  
6. Deploy  

Then in `index.html`, set your API URL (or host frontend on the same Vercel project so `/api/otp` works automatically).

**Easiest OTP setup:** deploy the **whole repo** on Vercel (not only Netlify Drop). Then one URL serves both the page and `/api/otp`.

---

## Recommended: one Vercel site (page + OTP together)

1. Go to https://vercel.com → Import the GitHub repo  
2. Framework: Other  
3. Root directory: `/`  
4. Build command: leave empty  
5. Output: leave empty (static files at root)  
6. Deploy  

Open the Vercel URL — that is your live website with OTP API on the same domain.

---

## Your own domain (investorscircle.in)

After Netlify or Vercel deploy:
1. Open Domain settings on that host  
2. Add `investorscircle.in`  
3. Change DNS at your domain registrar to the values they show  

---

## Need help?

Tell me which you prefer:
- **Netlify Drop** (fastest page only)
- **Vercel** (page + OTP together — recommended)
- **Your existing hosting** for investorscircle.in (cPanel / Hostinger / etc.)
