import fs from 'node:fs';
import path from 'node:path';
import { isValidIndianMobile, normalizePhone, verifyToken } from './_otp.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  const phone = normalizePhone(body.phone);
  if (!isValidIndianMobile(phone)) return res.status(400).json({ error: 'Invalid mobile number' });
  if (!verifyToken(body.phoneVerifiedToken, phone)) {
    return res.status(403).json({ error: 'Mobile number is not verified' });
  }
  if (!body.fullName || !body.email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const lead = {
    ...body,
    phone,
    receivedAt: new Date().toISOString(),
  };

  try {
    const leadsDir = path.join(process.cwd(), 'data');
    fs.mkdirSync(leadsDir, { recursive: true });
    fs.appendFileSync(path.join(leadsDir, 'leads.jsonl'), JSON.stringify(lead) + '\n');
  } catch (err) {
    console.error('[leads] persist failed:', err.message);
  }

  if (process.env.LEADS_WEBHOOK_URL) {
    try {
      await fetch(process.env.LEADS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
    } catch (err) {
      console.error('[leads] webhook failed:', err.message);
    }
  }

  return res.status(200).json({ ok: true });
}
