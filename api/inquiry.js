import { buildEmailHtml, getResendConfig, sendEmail } from './_email.js';
import { insertInquiry } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};
  const { formName, name, email, phone, fields } = body;
  if (!formName || !name || !email || !phone) {
    res.status(400).json({ error: 'formName, name, email, and phone are required' });
    return;
  }

  const { apiKey, fromAddress, toAddress } = getResendConfig();
  const enquiringAbout = (fields && (fields['Enquiring About'] || fields['Enquiring about'])) || null;

  // Email the enquiry through (non-fatal — a recorded enquiry that failed to
  // email is still recoverable; a lost enquiry is not).
  let emailed = false;
  if (apiKey) {
    try {
      await sendEmail({
        apiKey,
        from: `Skin Nourishers Website <${fromAddress}>`,
        to: toAddress,
        replyTo: email,
        subject: `${formName} — ${name}`,
        html: buildEmailHtml({
          title: formName,
          intro: 'New submission from the Skin Nourishers website',
          rows: [
            ['Name', name],
            ['Email', email],
            ['Phone', phone],
            ...Object.entries(fields || {}),
          ],
        }),
      });
      emailed = true;
    } catch (err) {
      console.error('[Resend] Error sending inquiry email:', err);
    }
  }

  // Record the enquiry so it can be counted, chased and reported on later
  // (non-fatal — falls back to email-only if the table/DB is unavailable).
  let recorded = false;
  try {
    await insertInquiry({
      form_name: formName,
      name,
      email,
      phone,
      enquiring_about: enquiringAbout,
      fields: fields || {},
      emailed,
    });
    recorded = true;
  } catch (err) {
    console.error('[DB] Error recording inquiry:', err);
  }

  if (!emailed && !recorded) {
    res.status(502).json({ error: 'Unable to submit right now. Please call or WhatsApp us.' });
    return;
  }

  res.status(200).json({ ok: true, emailed, recorded });
}
