# TeleCRM feature parity map

Mapped from https://telecrm.in/features into PRSPCT.

| Feature | PRSPCT status | Where |
|---------|---------------|-------|
| Excel upload | Done (CSV + XLSX) | `/app/prospects/import` |
| Facebook Auto Lead Capture | Provider + Integrations sync | `lib/providers/facebook-leads`, `/app/integrations` |
| Custom API Integration | Done | `/api/v1/prospects`, `/api/v1/leads/capture` |
| Automatic Lead Distribution | Done (round-robin) | `lib/distribution`, Integrations settings |
| WhatsApp Notifications | Official Cloud API provider + demo | `lib/providers/whatsapp` |
| 1-click dialer | Done | `/app/dialer` |
| Autodialer | Queue UI + telephony provider | `/app/dialer` |
| Click-to-call from Web | Done (`tel:` + provider) | Prospect detail, Dialer |
| Call Recording | Provider architecture (demo) | Telephony provider |
| 1-Click WhatsApp | Done | Prospect detail, Dialer |
| 1-Click SMS/Email | Done | Prospect detail (`sms:`, `mailto:`) |
| Follow-up Reminders | Done | Tasks + dialer quick create |
| Push Notification | Browser/demo provider | `lib/providers/push`, Integrations |
| Payment Creation | Done | `/app/payments` |
| Hour-by-hour Report | Done | `/app/reports` |
| Daily Reports | Done | `/app/reports` |
| Leaderboard Report | Done | `/app/reports` |
| Sales Report | Done | `/app/reports` |
| Agents Report | Done | `/app/reports` |
| Custom Report | Done | `/app/reports` |
| Lead Management | Done | Prospects module |
| Bulk Edit Leads | Done (status/owner/list/tag/delete) | Prospects |
| WhatsApp Bulk Marketing | Official template bulk API only | WhatsApp provider + Integrations |
| Instant Welcome Messages | Automation template + batch | Automations |
| Triggers & Workflows | Enhanced templates + evaluator | `/app/automations` |
| WhatsApp Automation | Official API adapters only (no unofficial bots) | Providers |
| Tech Support | Done | `/app/support` |

**Policy:** Unofficial WhatsApp automation, unauthorized scraping, and fake telephony recordings are not implemented. Configure Meta/telephony/SMS keys for live mode.
