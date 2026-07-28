import { neon } from '@neondatabase/serverless';

export async function insertOrder(order) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }

  const sql = neon(process.env.DATABASE_URL);
  await sql`
    insert into orders (
      type, status, m_payment_id, pf_payment_id, amount,
      description, customer_name, customer_email, customer_phone, raw_itn
    ) values (
      ${order.type}, ${order.status}, ${order.m_payment_id}, ${order.pf_payment_id}, ${order.amount},
      ${order.description}, ${order.customer_name}, ${order.customer_email}, ${order.customer_phone}, ${JSON.stringify(order.raw_itn)}
    )
  `;
}
