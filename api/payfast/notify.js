import querystring from 'querystring';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  getConfig, readRawBody, paramStringFromParsed,
  pfValidSignature, pfValidIP, pfValidServerConfirmation,
} from '../_payfast.js';
import { buildEmailHtml, getResendConfig, sendEmail } from '../_email.js';
import { insertOrder } from '../_db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(readFileSync(path.join(__dirname, '../../src/data/services-catalog.json'), 'utf8'));
const products = JSON.parse(readFileSync(path.join(__dirname, '../../src/data/products.json'), 'utf8'));

const BOOKSY_URL = 'https://booksy.com/en-za/33005_skin-nourishers_skin-care_54460_sandton';

// Recomputes the amount we expect to have been charged from the custom_str1/2
// reference we set at checkout time, so ITN can be verified without a database.
function expectedAmount(customStr1, customStr2) {
  if (customStr1 === 'booking') {
    const [category, service] = String(customStr2 || '').split('|');
    const group = catalog.find((p) => p.category === category);
    const match = (group && group.services.find((s) => s.name === service))
      || catalog.flatMap((c) => c.services).find((s) => s.name === service);
    return match ? Math.round(match.price * 0.5) : null;
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

// Human-readable summary of custom_str1/2, for the confirmation emails and
// the persisted order row — same reference data used to verify the amount.
function describeOrder(customStr1, customStr2) {
  if (customStr1 === 'booking') {
    const [category, service] = String(customStr2 || '').split('|');
    return `${service} (${category})`;
  }
  if (customStr1 === 'shop') {
    return String(customStr2 || '')
      .split(',')
      .map((pair) => {
        const [idStr, qtyStr] = pair.split(':');
        const product = products.find((p) => p.id === Number(idStr));
        return product ? `${qtyStr}x ${product.name}` : null;
      })
      .filter(Boolean)
      .join(', ');
  }
  return customStr2 || '';
}

async function notifyBusiness({ parsed, description }) {
  const { apiKey, fromAddress, toAddress } = getResendConfig();
  if (!apiKey) return;
  await sendEmail({
    apiKey,
    from: `Skin Nourishers Website <${fromAddress}>`,
    to: toAddress,
    replyTo: parsed.email_address,
    subject: `Payment Received — R${parsed.amount_gross} (${parsed.custom_str1})`,
    html: buildEmailHtml({
      title: 'Payment Received',
      intro: 'A PayFast payment was validated and confirmed.',
      rows: [
        ['Amount', `R${parsed.amount_gross}`],
        ['Type', parsed.custom_str1],
        ['Details', description],
        ['Customer', parsed.name_first ? `${parsed.name_first} ${parsed.name_last}` : ''],
        ['Email', parsed.email_address],
        ['Our Payment ID', parsed.m_payment_id],
        ['PayFast Payment ID', parsed.pf_payment_id],
      ],
    }),
  });
}

async function notifyCustomer({ parsed, description }) {
  const { apiKey, fromAddress } = getResendConfig();
  if (!apiKey || !parsed.email_address) return;
  const isBooking = parsed.custom_str1 === 'booking';
  const html = buildEmailHtml({
    title: isBooking ? 'Deposit Confirmed' : 'Order Confirmed',
    intro: isBooking
      ? `Thank you — your deposit has been received. Next: pick your appointment time on Booksy — ${BOOKSY_URL}`
      : 'Thank you — your order has been received and is being processed.',
    rows: [
      ['Amount Paid', `R${parsed.amount_gross}`],
      ['Details', description],
      ['Reference', parsed.m_payment_id],
    ],
  });
  await sendEmail({
    apiKey,
    from: `Skin Nourishers <${fromAddress}>`,
    to: parsed.email_address,
    subject: isBooking ? 'Your Deposit is Confirmed — Skin Nourishers' : 'Your Order is Confirmed — Skin Nourishers',
    html,
  });
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
      const description = describeOrder(parsed.custom_str1, parsed.custom_str2);
      console.log(
        `[PayFast ITN] PAID payment_id=${parsed.m_payment_id} amount=${parsed.amount_gross} ` +
        `type=${parsed.custom_str1} ref=${parsed.custom_str2} email=${parsed.email_address} status=${parsed.payment_status}`
      );

      try {
        await insertOrder({
          type: parsed.custom_str1,
          status: 'paid',
          m_payment_id: parsed.m_payment_id,
          pf_payment_id: parsed.pf_payment_id,
          amount: parsed.amount_gross,
          description,
          customer_name: parsed.name_first ? `${parsed.name_first} ${parsed.name_last}` : null,
          customer_email: parsed.email_address || null,
          customer_phone: parsed.cell_number || null,
          raw_itn: parsed,
        });
      } catch (dbErr) {
        console.error('[PayFast ITN] Order persistence failed (payment is still valid):', dbErr.message);
      }

      try {
        await notifyBusiness({ parsed, description });
        await notifyCustomer({ parsed, description });
      } catch (emailErr) {
        console.error('[PayFast ITN] Confirmation email failed (payment is still valid):', emailErr.message);
      }
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
