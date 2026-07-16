import { API_BASE_URL } from "./api";

export async function getHomeData(govId) {
  const response = await fetch(`${API_BASE_URL}/api/users/${govId}/home`);

  if (!response.ok) {
    throw new Error("Failed to load account data");
  }

  return response.json(); // { first_name, last_name, gov_id, balance }
}

export async function changePassword({ govId, currentPassword, newPassword }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/${encodeURIComponent(govId)}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  const payload = await response.text();

  if (!response.ok) {
    throw new Error(payload || "Unable to update password.");
  }

  return payload ? JSON.parse(payload) : { success: true };
}