import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Please enter your ID/card number and password.");
      return;
    }

    try {
      setSubmitting(true);
      const url = `${API_BASE_URL}/api/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: identifier.trim(), password: password.trim() }),
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
          data?.message || data || `Login failed with status ${response.status}.`
        );
      }

      const govId = data?.user?.gov_id || data?.gov_id || data?.user?.id || "";
      if (!govId) {
        throw new Error("The server did not return a valid user identifier.");
      }

      localStorage.setItem("gov_id", govId);
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to log in right now.";
      setError(`Unable to reach the login service at ${API_BASE_URL}/api/login. ${message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: "3rem auto", padding: "0 1rem" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <label>
          ID or Card Number
          <input
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="Enter your government ID or card number"
            style={{ display: "block", width: "100%", marginTop: "0.35rem", padding: "0.7rem" }}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            style={{ display: "block", width: "100%", marginTop: "0.35rem", padding: "0.7rem" }}
          />
        </label>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </main>
  );
}