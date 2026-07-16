import { API_BASE_URL } from "./api";

export async function initializePayment(amount) {

    const email = localStorage.getItem("email");

    if (!email) {
        throw new Error("Email not found. Please log in again.");
    }

    const response = await fetch(`${API_BASE_URL}/api/pay`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            amount
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Unable to initialize payment.");
    }

    return response.json();
}
export async function verifyPayment(reference) {
  const response = await fetch(`${API_BASE_URL}/api/verify/${reference}`);

  if (!response.ok) {
    throw new Error("Payment verification failed.");
  }

  return response.text();
}

export async function getLatestBalance(cardNumber) {
  const response = await fetch(
    `${API_BASE_URL}/api/balance/${cardNumber}`
  );

  if (!response.ok) {
    throw new Error("Unable to fetch balance.");
  }

  return response.json();
}