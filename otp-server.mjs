/**
 * Investors Circle — OTP + lead API
 *
 * Endpoints:
 *   POST /api/otp/send    { phone }
 *   POST /api/otp/verify  { phone, otp }
 *   POST /api/leads       { ...form, phoneVerifiedToken }
 *
 * Env:
 *   PORT                 default 8080
 *   OTP_SECRET           HMAC secret for verification tokens (required in production)
 *   MSG91_AUTH_KEY       MSG91 auth key (India SMS OTP)
 *   MSG91_TEMPLATE_ID    MSG91 OTP template id
 *   OTP_DEMO_MODE=true   return OTP in API response (local testing only)
 *   LEADS_WEBHOOK_URL    optional webhook (Zapier / Google Sheets / CRM)
 */

import http from 'node:http';
import https from 'node:https';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8080);
const OTP_SECRET = process.env.OTP_SECRET || 'dev-only-change-me';
const DEMO_MODE = String(process.env.OTP_DEMO_MODE || 'true').toLowerCase() === 'true';
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY || '';
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID || '';
const LEADS_WEBHOOK_URL = process.env.LEADS_WEBHOOK_URL || '';
const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_SENDS_PER_HOUR = 5;
const MAX_VERIFY_ATTEMPTS = 5;
const TOKEN_TTL_MS = 30 * 60 * 1000;

/** @type {Map<string, { hash: string, expires: number, sentAt: number, attempts: number, sends: number[] }>} */
const otpStore = new Map();
/** @type {Map<string, number>} */
const ipHits = new Map();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

function isValidIndianMobile(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function hashOtp(phone, otp) {
  return crypto.createHmac('sha256', OTP_SECRET).update(`${phone}:${otp}`).digest('hex');
}

function signToken(phone) {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${phone}.${exp}`;
  const sig = crypto.createHmac('sha256', OTP_SECRET).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

function verifyToken(token, phone) {
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

function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown')
    .split(',')[0]
    .trim();
}

function rateLimitIp(ip, limit = 30, windowMs = 60_000) {
  const now = Date.now();
  const key = `${ip}:${Math.floor(now / windowMs)}`;
  const n = (ipHits.get(key) || 0) + 1;
  ipHits.set(key, n);
  return n <= limit;
}

function generateOtp() {
  return String(crypto.randomInt(100000, 999999));
}

function httpRequest(url, options, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request(
      {
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port || (u.protocol === 'https:' ? 443 : 80),
        path: u.pathname + u.search,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      res => {
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => {
          resolve({
            status: res.statusCode || 0,
            body: Buffer.concat(chunks).toString('utf8'),
          });
        });
      }
    );
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function sendSmsViaMsg91(phone, otp) {
  if (!MSG91_AUTH_KEY) return { ok: false, reason: 'MSG91_AUTH_KEY missing' };

  // Preferred: MSG91 OTP API (auto template)
  const params = new URLSearchParams({
    template_id: MSG91_TEMPLATE_ID || undefined,
    mobile: `91${phone}`,
    authkey: MSG91_AUTH_KEY,
    otp,
    otp_expiry: '5',
  });
  // Remove undefined template if empty
  if (!MSG91_TEMPLATE_ID) params.delete('template_id');

  const url = `https://api.msg91.com/api/v5/otp?${params.toString()}`;
  const res = await httpRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: 'application/json' },
  }, '{}');

  let parsed = {};
  try { parsed = JSON.parse(res.body); } catch { /* ignore */ }
  const ok = res.status >= 200 && res.status < 300 && String(parsed.type || '').toLowerCase() !== 'error';
  return { ok, reason: parsed.message || res.body.slice(0, 200), raw: parsed };
}

async function handleSendOtp(req, res) {
  if (!rateLimitIp(clientIp(req))) return json(res, 429, { error: 'Too many requests. Please wait and try again.' });

  let body;
  try { body = await readBody(req); } catch {
    return json(res, 400, { error: 'Invalid JSON body' });
  }

  const phone = normalizePhone(body.phone);
  if (!isValidIndianMobile(phone)) {
    return json(res, 400, { error: 'Enter a valid 10-digit Indian mobile number' });
  }

  const now = Date.now();
  const existing = otpStore.get(phone);
  if (existing && now - existing.sentAt < RESEND_COOLDOWN_MS) {
    const wait = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.sentAt)) / 1000);
    return json(res, 429, { error: `Please wait ${wait}s before resending OTP`, retryAfter: wait });
  }

  const sends = (existing?.sends || []).filter(t => now - t < 60 * 60 * 1000);
  if (sends.length >= MAX_SENDS_PER_HOUR) {
    return json(res, 429, { error: 'OTP limit reached for this number. Try again later.' });
  }

  const otp = generateOtp();
  const entry = {
    hash: hashOtp(phone, otp),
    expires: now + OTP_TTL_MS,
    sentAt: now,
    attempts: 0,
    sends: [...sends, now],
  };
  otpStore.set(phone, entry);

  let smsOk = false;
  let smsReason = '';
  if (MSG91_AUTH_KEY) {
    try {
      const sms = await sendSmsViaMsg91(phone, otp);
      smsOk = sms.ok;
      smsReason = sms.reason || '';
      if (!smsOk) console.error('[otp] MSG91 send failed:', smsReason);
    } catch (err) {
      console.error('[otp] MSG91 error:', err);
      smsReason = err.message || 'SMS provider error';
    }
  }

  if (!smsOk && !DEMO_MODE) {
    otpStore.delete(phone);
    return json(res, 503, {
      error: 'SMS gateway is not configured. Set MSG91_AUTH_KEY (and MSG91_TEMPLATE_ID) or enable OTP_DEMO_MODE for testing.',
    });
  }

  const response = {
    ok: true,
    message: smsOk ? 'OTP sent successfully' : 'OTP generated (demo mode)',
    retryAfter: 30,
  };
  if (!smsOk && DEMO_MODE) {
    response.demoOtp = otp;
    console.log(`[otp:demo] ${phone} => ${otp}`);
  }
  return json(res, 200, response);
}

async function handleVerifyOtp(req, res) {
  if (!rateLimitIp(clientIp(req), 60)) return json(res, 429, { error: 'Too many requests. Please wait and try again.' });

  let body;
  try { body = await readBody(req); } catch {
    return json(res, 400, { error: 'Invalid JSON body' });
  }

  const phone = normalizePhone(body.phone);
  const otp = String(body.otp || '').replace(/\D/g, '');
  if (!isValidIndianMobile(phone)) return json(res, 400, { error: 'Invalid mobile number' });
  if (!/^\d{6}$/.test(otp)) return json(res, 400, { error: 'Enter the 6-digit OTP' });

  const entry = otpStore.get(phone);
  if (!entry) return json(res, 400, { error: 'OTP expired or not requested. Send a new OTP.' });
  if (Date.now() > entry.expires) {
    otpStore.delete(phone);
    return json(res, 400, { error: 'OTP expired. Please request a new one.' });
  }
  if (entry.attempts >= MAX_VERIFY_ATTEMPTS) {
    otpStore.delete(phone);
    return json(res, 429, { error: 'Too many incorrect attempts. Request a new OTP.' });
  }

  entry.attempts += 1;
  const ok = crypto.timingSafeEqual(
    Buffer.from(entry.hash),
    Buffer.from(hashOtp(phone, otp))
  );
  if (!ok) {
    return json(res, 400, {
      error: 'Incorrect OTP. Try again.',
      attemptsLeft: MAX_VERIFY_ATTEMPTS - entry.attempts,
    });
  }

  otpStore.delete(phone);
  const token = signToken(phone);
  return json(res, 200, { ok: true, token, phone });
}

async function handleLead(req, res) {
  if (!rateLimitIp(clientIp(req), 20)) return json(res, 429, { error: 'Too many submissions' });

  let body;
  try { body = await readBody(req); } catch {
    return json(res, 400, { error: 'Invalid JSON body' });
  }

  const phone = normalizePhone(body.phone);
  if (!isValidIndianMobile(phone)) return json(res, 400, { error: 'Invalid mobile number' });
  if (!verifyToken(body.phoneVerifiedToken, phone)) {
    return json(res, 403, { error: 'Mobile number is not verified' });
  }
  if (!body.fullName || !body.email) {
    return json(res, 400, { error: 'Name and email are required' });
  }

  const lead = {
    ...body,
    phone,
    receivedAt: new Date().toISOString(),
    ip: clientIp(req),
  };

  const leadsDir = path.join(__dirname, 'data');
  fs.mkdirSync(leadsDir, { recursive: true });
  fs.appendFileSync(path.join(leadsDir, 'leads.jsonl'), JSON.stringify(lead) + '\n', 'utf8');

  if (LEADS_WEBHOOK_URL) {
    try {
      await httpRequest(LEADS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }, JSON.stringify(lead));
    } catch (err) {
      console.error('[leads] webhook failed:', err.message);
    }
  }

  console.log(`[lead] verified ${phone} — ${body.fullName}`);
  return json(res, 200, { ok: true });
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.normalize(path.join(__dirname, urlPath));
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403); return res.end('Forbidden');
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404); return res.end('Not found');
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = (req.url || '').split('?')[0];
  const method = req.method || 'GET';

  if (method === 'OPTIONS' && url.startsWith('/api/')) {
    return json(res, 204, {});
  }

  try {
    if (method === 'POST' && url === '/api/otp/send') return await handleSendOtp(req, res);
    if (method === 'POST' && url === '/api/otp/verify') return await handleVerifyOtp(req, res);
    if (method === 'POST' && url === '/api/leads') return await handleLead(req, res);
    if (method === 'GET') return serveStatic(req, res);
    json(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    json(res, 500, { error: 'Internal server error' });
  }
});

server.listen(PORT, () => {
  console.log(`Investors Circle OTP server on http://localhost:${PORT}`);
  console.log(`Demo mode: ${DEMO_MODE ? 'ON (OTP returned in API for testing)' : 'OFF'}`);
  console.log(`MSG91: ${MSG91_AUTH_KEY ? 'configured' : 'not configured'}`);
});
