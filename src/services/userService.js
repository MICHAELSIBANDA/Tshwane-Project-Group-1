import { API_BASE_URL } from "./api";

export async function getHomeData(govId) {
  const response = await fetch(`${API_BASE_URL}/api/users/${govId}/home`);

  if (!response.ok) {
    throw new Error("Failed to load account data");
  }

  return response.json(); // { first_name, last_name, gov_id, balance }
}

export async function changePassword({ govId, newPassword }) {
  console.log("Sending request:", {
    govId,
    newPassword,
  });

  const response = await fetch(
    `${API_BASE_URL}/api/auth/${govId}/password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gov_Id: govId,
        password: newPassword
      }),
    }
  );

  const text = await response.text();

  console.log("Status:", response.status);
  console.log("Response:", text);

  if (!response.ok) {
    throw new Error(text || "Unable to update password.");
  }

  return text ? JSON.parse(text) : { success: true };
}