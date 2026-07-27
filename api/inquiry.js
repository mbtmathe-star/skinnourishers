function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEmailHtml({ formName, name, email, phone, fields }) {
  const rows = Object.entries(fields || {})
    .filter(([, value]) => value)
    .map(([label, value]) => `<tr><td style="padding:6px 12px;color:#666;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:6px 12px;">${escapeHtml(value)}</td></tr>`)
    .join('');

  return `
    <div style="font-family:sans-serif;max-width:560px;">
      <h2 style="margin-bottom:4px;">${escapeHtml(formName)}</h2>
      <p style="color:#666;margin-top:0;">New submission from the Skin Nourishers website</p>
      <table style="border-collapse:collapse;width:100%;">
        <tr><td style="padding:6px 12px;color:#666;white-space:nowrap;">Name</td><td style="padding:6px 12px;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:6px 12px;color:#666;white-space:nowrap;">Email</td><td style="padding:6px 12px;">${escapeHtml(email)}</td></tr>
        <tr><td style="padding:6px 12px;color:#666;white-space:nowrap;">Phone</td><td style="padding:6px 12px;">${escapeHtml(phone)}</td></tr>
        ${rows}
      </table>
    </div>
  `;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
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

  const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const toAddress = process.env.RESEND_TO_EMAIL || 'info@skinnourishers.co.za';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Skin Nourishers Website <${fromAddress}>`,
        to: [toAddress],
        reply_to: email,
        subject: `${formName} — ${name}`,
        html: buildEmailHtml({ formName, name, email, phone, fields }),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[Resend] Send failed:', response.status, errorBody);
      res.status(502).json({ error: 'Failed to send email' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[Resend] Error sending email:', err);
    res.status(502).json({ error: 'Failed to send email' });
  }
}
