export async function sendInquiry({ formName, name, email, phone, fields }) {
  const response = await fetch('/api/inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formName, name, email, phone, fields }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Unable to send. Please try again.');
  }
  return data;
}
