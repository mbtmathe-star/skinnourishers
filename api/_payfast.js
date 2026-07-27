import crypto from 'crypto';

// Field order per PayFast's own docs: "The pairs must be listed in the order in
// which they appear in the attributes description... Do not use the API signature
// format, which uses alphabetical ordering!" This is that documented order.
// passphrase is deliberately NOT in this list — see generateSignature.
const SIGNATURE_FIELD_ORDER = [
  'merchant_id', 'merchant_key', 'return_url', 'cancel_url', 'notify_url', 'notify_method',
  'name_first', 'name_last', 'email_address', 'cell_number', 'm_payment_id', 'amount',
  'item_name', 'item_description',
  'custom_int1', 'custom_int2', 'custom_int3', 'custom_int4', 'custom_int5',
  'custom_str1', 'custom_str2', 'custom_str3', 'custom_str4', 'custom_str5',
  'email_confirmation', 'confirmation_address', 'currency', 'payment_method',
  'subscription_type', 'billing_date', 'recurring_amount', 'frequency',
  'cycles', 'subscription_notify_email', 'subscription_notify_webhook', 'subscription_notify_buyer',
];

// PayFast's published server IP ranges (developers.payfast.co.za, "Ports and IP
// addresses" — marked "Updated" there, so re-check if PayFast ever announces a change).
// Static allowlist is what PayFast itself recommends, and is more robust than
// resolving their hostnames via DNS at request time (no network dependency, no
// risk of a slow/failed lookup during ITN validation).
const VALID_PAYFAST_CIDRS = [
  '197.97.145.144/28',
  '41.74.179.192/27',
  '102.216.36.0/28',
  '102.216.36.128/28',
  '144.126.193.139/32',
];

function ipToLong(ip) {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
}

function ipInCidr(ip, cidr) {
  const [range, bitsStr] = cidr.split('/');
  const bits = Number(bitsStr);
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ipToLong(ip) & mask) === (ipToLong(range) & mask);
}

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

// Mirrors PayFast's official generateSignature exactly: build the string from
// non-empty fields in the documented order, then unconditionally append
// passphrase at the very end (not at a fixed position in the field list —
// PayFast's own reference implementation always tacks it on last).
export function generateSignature(data, passphrase) {
  let paramString = '';
  for (const key of SIGNATURE_FIELD_ORDER) {
    const value = data[key];
    if (value === undefined || value === null || String(value) === '') continue;
    paramString += `${key}=${phpUrlEncode(String(value).trim())}&`;
  }
  paramString = paramString.slice(0, -1);
  if (passphrase) {
    paramString += `&passphrase=${phpUrlEncode(passphrase.trim())}`;
  }
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
  if (!requestIp || !/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(requestIp)) return false;
  return VALID_PAYFAST_CIDRS.some((cidr) => ipInCidr(requestIp, cidr));
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
