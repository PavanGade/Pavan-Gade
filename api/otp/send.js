import { isValidIndianMobile, normalizePhone, sendOtp } from '../_otp.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const phone = normalizePhone(req.body?.phone);
  if (!isValidIndianMobile(phone)) {
    return res.status(400).json({ error: 'Enter a valid 10-digit Indian mobile number' });
  }
  const result = await sendOtp(phone);
  return res.status(result.status).json(result.body);
}
