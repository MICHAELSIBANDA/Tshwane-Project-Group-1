export async function submitPayment({ amount }) {
  await new Promise((r) => setTimeout(r, 800));
  return { success: true, newBalance: 87.50 + Number(amount) };
}