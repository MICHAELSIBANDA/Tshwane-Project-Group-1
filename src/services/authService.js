import { API_BASE_URL } from "./api";

export async function changePassword({ govId, newPassword }) {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/${encodeURIComponent(govId)}/password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword,
      }),
    }
  );

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "Unable to update password.");
  }

  return text;
}