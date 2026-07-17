import querystring from 'querystring';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  getConfig, readRawBody, paramStringFromParsed,
  pfValidSignature, pfValidIP, pfValidServerConfirmation,
} from '../_payfast.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pricing = JSON.parse(readFileSync(path.join(__dirname, '../../src/data/pricing.json'), 'utf8'));
const products = JSON.parse(readFileSync(path.join(__dirname, '../../src/data/products.json'), 'utf8'));

// Recomputes the amount we expect to have been charged from the custom_str1/2
// reference we set at checkout time, so ITN can be verified without a database.
function expectedAmount(customStr1, customStr2) {
  if (customStr1 === 'booking') {
    const [category, service] = String(customStr2 || '').split('|');
    const group = pricing.find((p) => p.category === category);
    const match = group && group.services.find((s) => s.name === service);
    return match ? Math.round(match.priceValue * 0.5) : null;
  }
  if (customStr1 === 'shop') {
    let total = 0;
    for (const pair of String(customStr2 || '').split(',')) {
      const [idStr, qtyStr] = pair.split(':');
      const product = products.find((p) => p.id === Number(idStr));
      if (!product) return null;
      total += product.priceValue * Number(qtyStr);
    }
    return total;
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  let config;
  try {
    config = getConfig();
  } catch (err) {
    console.error('[PayFast ITN] Not configured:', err.message);
    res.status(200).send('OK');
    return;
  }

  try {
    const raw = await readRawBody(req);
    const parsed = querystring.parse(raw);
    const paramString = paramStringFromParsed(parsed);

    const validSignature = await pfValidSignature(parsed, paramString, config.passphrase);
    const validIp = await pfValidIP(req);
    const expected = expectedAmount(parsed.custom_str1, parsed.custom_str2);
    const validAmount = expected !== null && Math.abs(expected - Number.parseFloat(parsed.amount_gross)) <= 0.01;
    const validServer = await pfValidServerConfirmation(paramString, config.baseUrl);

    const isValid = validSignature && validIp && validAmount && validServer;

    if (isValid) {
      // No database/email is wired up yet — this log line is the only durable
      // record of a completed payment until that lands. Check `vercel logs`.
      console.log(
        `[PayFast ITN] PAID payment_id=${parsed.m_payment_id} amount=${parsed.amount_gross} ` +
        `type=${parsed.custom_str1} ref=${parsed.custom_str2} email=${parsed.email_address} status=${parsed.payment_status}`
      );
    } else {
      console.error('[PayFast ITN] REJECTED', {
        m_payment_id: parsed.m_payment_id,
        validSignature, validIp, validAmount, validServer,
      });
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('[PayFast ITN] Error processing notification:', err);
    res.status(500).end();
  }
}
