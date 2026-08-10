# Pavan-Gade

## Investors Circle Landing Page

Modern Stripe-inspired redesign for [investorscircle.in](https://investorscircle.in/).

### Quick start (with mobile OTP)

```bash
npm run dev
# open http://localhost:8080
```

The apply form **requires mobile OTP verification** before submit. In demo mode (`OTP_DEMO_MODE=true`), the OTP is returned in the API response and shown as a toast so you can test without SMS.

### Production SMS (eliminate fake leads)

1. Copy `.env.example` → `.env`
2. Create an [MSG91](https://msg91.com/) account and OTP template
3. Set:

```bash
OTP_DEMO_MODE=false
OTP_SECRET=<long-random-secret>
MSG91_AUTH_KEY=<your-auth-key>
MSG91_TEMPLATE_ID=<your-template-id>
```

4. Restart:

```bash
npm start
```

Verified leads are appended to `data/leads.jsonl`. Optionally set `LEADS_WEBHOOK_URL` to forward them to Zapier / Make / your CRM.

### API

| Endpoint | Body | Purpose |
|---|---|---|
| `POST /api/otp/send` | `{ "phone": "9876543210" }` | Send OTP |
| `POST /api/otp/verify` | `{ "phone": "...", "otp": "123456" }` | Verify OTP → token |
| `POST /api/leads` | form fields + `phoneVerifiedToken` | Accept verified lead only |

Vercel-compatible handlers also live under `api/` (`api/otp/send.js`, `api/otp/verify.js`, `api/leads.js`).

### Static assets

Deploy `index.html` together with the `logos/` folder. When using only static hosting (no Node), point the form at your OTP API:

```html
<script>window.IC_OTP_API = 'https://your-api.example.com/api/otp';</script>
```

### React version (optional)

See [`investors-circle/README.md`](investors-circle/README.md).
