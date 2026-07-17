import crypto from 'crypto';
import dns from 'dns/promises';

const SIGNATURE_FIELD_ORDER = [
  'merchant_id', 'merchant_key', 'return_url', 'cancel_url', 'notify_url', 'notify_method',
  'name_first', 'name_last', 'email_address', 'cell_number', 'm_payment_id', 'amount',
  'item_name', 'item_description',
  'custom_int1', 'custom_int2', 'custom_int3', 'custom_int4', 'custom_int5',
  'custom_str1', 'custom_str2', 'custom_str3', 'custom_str4', 'custom_str5',
  'email_confirmation', 'confirmation_address', 'currency', 'payment_method',
  'subscription_type', 'passphrase', 'billing_date', 'recurring_amount', 'frequency',
  'cycles', 'subscription_notify_email', 'subscription_notify_webhook', 'subscription_notify_buyer',
];

const VALID_PAYFAST_HOSTS = ['www.payfast.co.za', 'sandbox.payfast.co.za', 'w1w.payfast.co.za', 'w2w.payfast.co.za'];

export function getConfig() {
  const merchantId = process.env.PAYFAST_MERCHANT_ID;
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
  const passphrase = process.env.PAYFAST_PASSPHRASE || '';
  const mode = (process.env.PAYFAST_MODE || 'sandbox').toLowerCase();
  const baseUrl = mode === 'live' ? 'https://www.payfast.co.za' : 'https://sandbox.payfast.co.za';
  if (!merchantId || !merchantKey) {
    throw new Error('PAYFAST_MERCHANT_ID / PAYFAST_MERCHANT_KEY are not configured');
  }
  return { merchantId, merchantKey, passphrase, mode, baseUrl };
}

// PHP's urlencode(): encodeURIComponent + space -> '+' + the extra chars PHP escapes
// that encodeURIComponent leaves alone (! ' ( ) * ~). Must match exactly or every
// signature (outgoing and ITN) will mismatch.
export function phpUrlEncode(value) {
  return encodeURIComponent(String(value))
    .replace(/%20/g, '+')
    .replace(/[!'()*~]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

export function md5(input) {
  return crypto.createHash('md5').update(input, 'utf8').digest('hex');
}

// Mirrors PayFast PHP SDK's Auth::generateSignature — fixed field order, only
// non-empty values, passphrase inserted at its position in that order.
export function generateSignature(data, passphrase) {
  const attrs = {};
  for (const key of SIGNATURE_FIELD_ORDER) {
    if (key === 'passphrase') continue;
    if (data[key] !== undefined && data[key] !== null && String(data[key]) !== '') {
      attrs[key] = data[key];
    }
  }
  if (passphrase) attrs.passphrase = passphrase.trim();

  let paramString = '';
  for (const key of SIGNATURE_FIELD_ORDER) {
    if (attrs[key] === undefined) continue;
    paramString += `${key}=${phpUrlEncode(String(attrs[key]).trim())}&`;
  }
  paramString = paramString.slice(0, -1);
  return md5(paramString);
}

export function buildAbsoluteUrl(req, path) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}${path}`;
}

export function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

// Mirrors PayFast PHP SDK's Notification::dataToString — walks fields in the
// order PayFast posted them and stops at 'signature' (PayFast always sends it last).
export function paramStringFromParsed(parsed) {
  let str = '';
  for (const [key, val] of Object.entries(parsed)) {
    if (key === 'signature') break;
    str += `${key}=${phpUrlEncode(val)}&`;
  }
  return str.slice(0, -1);
}

export async function pfValidSignature(parsed, paramString, passphrase) {
  const signed = passphrase ? `${paramString}&passphrase=${phpUrlEncode(passphrase.trim())}` : paramString;
  return parsed.signature === md5(signed);
}

export async function pfValidIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const requestIp = (Array.isArray(forwarded) ? forwarded[0] : forwarded || '').split(',')[0].trim();
  if (!requestIp) return false;

  const results = await Promise.allSettled(VALID_PAYFAST_HOSTS.map((host) => dns.resolve4(host)));
  const validIps = new Set();
  for (const result of results) {
    if (result.status === 'fulfilled') result.value.forEach((ip) => validIps.add(ip));
  }
  return validIps.has(requestIp);
}

export async function pfValidServerConfirmation(paramString, baseUrl) {
  const response = await fetch(`${baseUrl}/eng/query/validate`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: paramString,
  });
  const text = (await response.text()).trim();
  return text === 'VALID';
}
