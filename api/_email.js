export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Renders a simple label/value table inside a card — used for both the
// consultation/assessment inquiry emails and the payment confirmation emails.
export function buildEmailHtml({ title, intro, rows }) {
  const rowsHtml = rows
    .filter(([, value]) => value)
    .map(([label, value]) => `<tr><td style="padding:6px 12px;color:#666;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 12px;">${escapeHtml(value)}</td></tr>`)
    .join('');

  return `
    <div style="font-family:sans-serif;max-width:560px;">
      <h2 style="margin-bottom:4px;">${escapeHtml(title)}</h2>
      <p style="color:#666;margin-top:0;">${escapeHtml(intro)}</p>
      <table style="border-collapse:collapse;width:100%;">
        ${rowsHtml}
      </table>
    </div>
  `;
}

export function getResendConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    fromAddress: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    toAddress: process.env.RESEND_TO_EMAIL || 'info@skinnourishers.co.za',
  };
}

export async function sendEmail({ apiKey, from, to, replyTo, subject, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend send failed: ${response.status} ${errorBody}`);
  }
}
