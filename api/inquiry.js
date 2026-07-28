import { buildEmailHtml, getResendConfig, sendEmail } from './_email.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { apiKey, fromAddress, toAddress } = getResendConfig();
  if (!apiKey) {
    res.status(500).json({ error: 'Email is not configured yet' });
    return;
  }

  const body = req.body || {};
  const { formName, name, email, phone, fields } = body;
  if (!formName || !name || !email || !phone) {
    res.status(400).json({ error: 'formName, name, email, and phone are required' });
    return;
  }

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

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[Resend] Error sending inquiry email:', err);
    res.status(502).json({ error: 'Failed to send email' });
  }
}
