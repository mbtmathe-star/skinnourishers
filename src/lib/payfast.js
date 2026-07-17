export async function startPayfastCheckout(payload) {
  const response = await fetch('/api/payfast/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Unable to start checkout');
  }

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = data.action;
  Object.entries(data.fields).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
}
