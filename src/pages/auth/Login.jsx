import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../services/api";
import "./Login.css";

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="10" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 14v2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

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

      const govId = data?.gov_id || "";
const email = data?.email || "";

if (!govId) {
  throw new Error("The server did not return a valid user identifier.");
}

localStorage.setItem("gov_id", govId);

if (email) {
  localStorage.setItem("email", email);
}


navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to log in right now.";
      setError(`Unable to reach the login service at ${API_BASE_URL}/api/login. ${message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="login-hero__icon">
          <LockIcon />
        </div>
        <h1>Welcome Back</h1>
        <p>Sign in to access your Tshwane bus card account.</p>
      </section>

      <section className="login-content">
        <svg className="login-skyline" viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 260V170h21v-44h39v73h38v-35h18v-52h12v-25h12v25h20v88h31v-30h40v-22h42v72h116v-92h41V93h20v35h25v92h43v-165h63v165h34v-108h22v-28h31v136h42v-54h24v-35h31v89h36v-47h20v-28h28v75h39v-40h44v-31h33v71h33v40H0Z" />
        </svg>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-identifier">ID or Card Number</label>
            <div className="login-field__control">
              <input
                id="login-identifier"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="Enter your government ID or card number"
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <div className="login-field__control">
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && <p className="login-message is-error">{error}</p>}

          <button className="login-submit" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>

          <p className="login-divider">or</p>

          <button className="login-signup__link" type="button" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </form>
      </section>
    </main>
  );
}