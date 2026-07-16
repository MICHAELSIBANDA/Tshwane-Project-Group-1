// src/services/paymentService.js
import { API_BASE_URL } from "./api";

export async function initializePayment({ email, amount, cardNumber }) {
  const url = `${API_BASE_URL}/api/pay`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, amount, cardNumber }),
    });

    const payload = await response.text();
    let data = null;

    try {
      data = payload ? JSON.parse(payload) : null;
    } catch {
      data = payload;
    }

    if (!response.ok) {
      throw new Error(
        data?.message || data || `Payment initialization failed with status ${response.status}`
      );
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new Error(`Unable to reach payment service at ${url}. ${error.message}`);
    }

    throw new Error(`Unable to reach payment service at ${url}.`);
  }
}

export async function verifyPayment(reference) {
  const response = await fetch(`${API_BASE_URL}/api/verify/${encodeURIComponent(reference)}`);
  const payload = await response.text();

  if (!response.ok) {
    throw new Error(payload || "Failed to verify payment");
  }

  return payload;
}