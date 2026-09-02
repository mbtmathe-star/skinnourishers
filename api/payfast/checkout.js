import crypto from 'crypto';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { getConfig, generateSignature, buildAbsoluteUrl } from '../_payfast.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(readFileSync(path.join(__dirname, '../../src/data/services-catalog.json'), 'utf8'));
const treatments = JSON.parse(readFileSync(path.join(__dirname, '../../src/data/treatments.json'), 'utf8'));
const products = JSON.parse(readFileSync(path.join(__dirname, '../../src/data/products.json'), 'utf8'));

function findService(category, service) {
  const group = catalog.find((item) => item.category === category);
  if (group) {
    const match = group.services.find((item) => item.name === service);
    if (match) return match;
  }
  for (const item of catalog) {
    const match = item.services.find((entry) => entry.name === service);
    if (match) return match;
  }
  // Detailed treatment pages book by treatment area (e.g. Plasma Treatment / Forehead).
  const treatment = treatments.find((t) => t.category === category);
  if (treatment) {
    const area = (treatment.pricing || []).find((p) => p.area === service);
    if (area && typeof area.price === 'number') return area;
  }
  return null;
}

function splitName(fullName) {
  const parts = String(fullName).trim().split(/\s+/);
  const first = parts.shift() || 'Customer';
  const last = parts.join(' ') || '-';
  return { first, last };
}

function buildBookingOrder(body) {
  const { category, service } = body;
  const match = findService(category, service);
  if (!match) throw Object.assign(new Error('Unknown service or category'), { status: 400 });
  const deposit = Math.round(match.price * 0.5);
  return {
    amount: deposit,
    itemName: `Deposit - ${service}`.slice(0, 100),
    customStr1: 'booking',
    customStr2: `${category}|${service}`.slice(0, 255),
    returnType: 'booking',
  };
}

function buildShopOrder(body) {
  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) throw Object.assign(new Error('Cart is empty'), { status: 400 });

  let total = 0;
  const refs = [];
  for (const { id, qty } of items) {
    const product = products.find((p) => p.id === id);
    const quantity = Math.max(1, Math.min(20, Number.parseInt(qty, 10) || 1));
    if (!product) throw Object.assign(new Error(`Unknown product id ${id}`), { status: 400 });
    total += product.priceValue * quantity;
    refs.push(`${product.id}:${quantity}`);
  }

  return {
    amount: total,
    itemName: `Skin Nourishers Order (${items.length} item${items.length > 1 ? 's' : ''})`.slice(0, 100),
    customStr1: 'shop',
    customStr2: refs.join(',').slice(0, 255),
    returnType: 'shop',
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let config;
  try {
    config = getConfig();
  } catch (err) {
    res.status(500).json({ error: 'PayFast is not configured yet' });
    return;
  }

  try {
    const body = req.body || {};
    const customer = body.customer || {};
    if (!customer.name || !customer.email || !customer.phone) {
      res.status(400).json({ error: 'Customer name, email, and phone are required' });
      return;
    }

    const order = body.type === 'shop' ? buildShopOrder(body) : buildBookingOrder(body);
    if (order.amount <= 0) {
      res.status(400).json({ error: 'Order amount must be greater than zero' });
      return;
    }

    const { first, last } = splitName(customer.name);
    const paymentId = `${order.returnType}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

    const fields = {
      merchant_id: config.merchantId,
      merchant_key: config.merchantKey,
      return_url: buildAbsoluteUrl(req, `/payment-success?type=${order.returnType}`),
      cancel_url: buildAbsoluteUrl(req, '/payment-cancelled'),
      notify_url: buildAbsoluteUrl(req, '/api/payfast/notify'),
      name_first: first.slice(0, 100),
      name_last: last.slice(0, 100),
      email_address: String(customer.email).slice(0, 100),
      cell_number: String(customer.phone).slice(0, 20),
      m_payment_id: paymentId,
      amount: order.amount.toFixed(2),
      item_name: order.itemName,
      custom_str1: order.customStr1,
      custom_str2: order.customStr2,
    };

    fields.signature = generateSignature(fields, config.passphrase);

    res.status(200).json({ action: `${config.baseUrl}/eng/process`, fields });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Checkout failed' });
  }
}
