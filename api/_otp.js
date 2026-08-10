import crypto from 'node:crypto';

const OTP_SECRET = process.env.OTP_SECRET || 'dev-only-change-me';
const DEMO_MODE = String(process.env.OTP_DEMO_MODE || 'true').toLowerCase() === 'true';
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY || '';
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID || '';
const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_SENDS_PER_HOUR = 5;
const MAX_VERIFY_ATTEMPTS = 5;
const TOKEN_TTL_MS = 30 * 60 * 1000;

/** In-memory store (use Redis/KV in multi-instance production). */
const g = globalThis;
if (!g.__icOtpStore) g.__icOtpStore = new Map();
const otpStore = g.__icOtpStore;

export function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

export function isValidIndianMobile(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function hashOtp(phone, otp) {
  return crypto.createHmac('sha256', OTP_SECRET).update(`${phone}:${otp}`).digest('hex');
}

export function signToken(phone) {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${phone}.${exp}`;
  const sig = crypto.createHmac('sha256', OTP_SECRET).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export function verifyToken(token, phone) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [tokPhone, expStr, sig] = parts;
  if (tokPhone !== phone) return false;
  const exp = Number(expStr);
  if (!exp || Date.now() > exp) return false;
  const expected = crypto.createHmac('sha256', OTP_SECRET).update(`${tokPhone}.${expStr}`).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

function generateOtp() {
  return String(crypto.randomInt(100000, 999999));
}

async function sendSmsViaMsg91(phone, otp) {
  if (!MSG91_AUTH_KEY) return { ok: false, reason: 'MSG91_AUTH_KEY missing' };
  const params = new URLSearchParams({
    mobile: `91${phone}`,
    authkey: MSG91_AUTH_KEY,
    otp,
    otp_expiry: '5',
  });
  if (MSG91_TEMPLATE_ID) params.set('template_id', MSG91_TEMPLATE_ID);
  const url = `https://api.msg91.com/api/v5/otp?${params.toString()}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    body: '{}',
  });
  const text = await res.text();
  let parsed = {};
  try { parsed = JSON.parse(text); } catch { /* ignore */ }
  const ok = res.ok && String(parsed.type || '').toLowerCase() !== 'error';
  return { ok, reason: parsed.message || text.slice(0, 200) };
}

export async function sendOtp(phone) {
  const now = Date.now();
  const existing = otpStore.get(phone);
  if (existing && now - existing.sentAt < RESEND_COOLDOWN_MS) {
    const wait = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.sentAt)) / 1000);
    return { status: 429, body: { error: `Please wait ${wait}s before resending OTP`, retryAfter: wait } };
  }
  const sends = (existing?.sends || []).filter(t => now - t < 60 * 60 * 1000);
  if (sends.length >= MAX_SENDS_PER_HOUR) {
    return { status: 429, body: { error: 'OTP limit reached for this number. Try again later.' } };
  }

  const otp = generateOtp();
  otpStore.set(phone, {
    hash: hashOtp(phone, otp),
    expires: now + OTP_TTL_MS,
    sentAt: now,
    attempts: 0,
    sends: [...sends, now],
  });

  let smsOk = false;
  if (MSG91_AUTH_KEY) {
    const sms = await sendSmsViaMsg91(phone, otp);
    smsOk = sms.ok;
    if (!smsOk) console.error('[otp] MSG91 failed:', sms.reason);
  }

  if (!smsOk && !DEMO_MODE) {
    otpStore.delete(phone);
    return {
      status: 503,
      body: {
        error: 'SMS gateway is not configured. Set MSG91_AUTH_KEY / MSG91_TEMPLATE_ID or OTP_DEMO_MODE=true for testing.',
      },
    };
  }

  const body = {
    ok: true,
    message: smsOk ? 'OTP sent successfully' : 'OTP generated (demo mode)',
    retryAfter: 30,
  };
  if (!smsOk && DEMO_MODE) {
    body.demoOtp = otp;
    console.log(`[otp:demo] ${phone} => ${otp}`);
  }
  return { status: 200, body };
}

export async function verifyOtp(phone, otpRaw) {
  const otp = String(otpRaw || '').replace(/\D/g, '');
  if (!/^\d{6}$/.test(otp)) {
    return { status: 400, body: { error: 'Enter the 6-digit OTP' } };
  }
  const entry = otpStore.get(phone);
  if (!entry) return { status: 400, body: { error: 'OTP expired or not requested. Send a new OTP.' } };
  if (Date.now() > entry.expires) {
    otpStore.delete(phone);
    return { status: 400, body: { error: 'OTP expired. Please request a new one.' } };
  }
  if (entry.attempts >= MAX_VERIFY_ATTEMPTS) {
    otpStore.delete(phone);
    return { status: 429, body: { error: 'Too many incorrect attempts. Request a new OTP.' } };
  }
  entry.attempts += 1;
  const ok = crypto.timingSafeEqual(Buffer.from(entry.hash), Buffer.from(hashOtp(phone, otp)));
  if (!ok) {
    return {
      status: 400,
      body: { error: 'Incorrect OTP. Try again.', attemptsLeft: MAX_VERIFY_ATTEMPTS - entry.attempts },
    };
  }
  otpStore.delete(phone);
  return { status: 200, body: { ok: true, token: signToken(phone), phone } };
}

export const config = { DEMO_MODE, hasMsg91: Boolean(MSG91_AUTH_KEY) };
