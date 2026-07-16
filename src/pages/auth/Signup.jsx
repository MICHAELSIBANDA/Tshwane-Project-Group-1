import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../../services/api";
import "./Login.css";
import "./Register.css";

function UserPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0 2c-2.67 0-8 1.34-8 4v1h8m8-5v6m-3-3h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    cardNumber: "",
    idNumber: "",
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field) {
    return (event) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      if (error) {
        setError("");
      }
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!values.cardNumber.trim() || !values.idNumber.trim() || !values.firstName.trim() || !values.lastName.trim() || !values.address.trim() || !values.phone.trim() || !values.email.trim()) {
      setError("Please complete all the required fields.");
      return;
    }

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber: values.cardNumber.trim(),
          idNumber: values.idNumber.trim(),
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          address: values.address.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          password: values.password,
        }),
      });

      const payload = await response.text();
      let data = null;
      try {
        data = payload ? JSON.parse(payload) : null;
      } catch {
        data = payload;
      }

      if (!response.ok) {
        throw new Error(data?.message || data || `Registration failed with status ${response.status}.`);
      }

      navigate("/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to complete registration right now.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page register-page">
      <section className="login-hero register-hero">
        <div className="login-hero__icon">
          <UserPlusIcon />
        </div>
        <h1>Create Your Account</h1>
        <p>Join Tshwane bus service and travel with ease.</p>
      </section>

      <section className="login-content">
        <svg className="login-skyline" viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 260V170h21v-44h39v73h38v-35h18v-52h12v-25h12v25h20v88h31v-30h40v-22h42v72h116v-92h41V93h20v35h25v92h43v-165h63v165h34v-108h22v-28h31v136h42v-54h24v-35h31v89h36v-47h20v-28h28v75h39v-40h44v-31h33v71h33v40H0Z" />
        </svg>

        <form className="login-form register-form" onSubmit={handleSubmit} noValidate>
          {error && <p className="login-message is-error" role="alert">{error}</p>}

          <div className="login-field">
            <label htmlFor="cardNumber">Card Number</label>
            <div className="login-field__control">
              <input id="cardNumber" value={values.cardNumber} onChange={handleChange("cardNumber")} placeholder="Card Number" autoComplete="off" />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="idNumber">ID Number</label>
            <div className="login-field__control">
              <input id="idNumber" value={values.idNumber} onChange={handleChange("idNumber")} placeholder="ID Number" autoComplete="off" />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="firstName">First Name</label>
            <div className="login-field__control">
              <input id="firstName" value={values.firstName} onChange={handleChange("firstName")} placeholder="First Name" autoComplete="given-name" />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="lastName">Last Name</label>
            <div className="login-field__control">
              <input id="lastName" value={values.lastName} onChange={handleChange("lastName")} placeholder="Last Name" autoComplete="family-name" />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="address">Physical Address</label>
            <div className="login-field__control">
              <input id="address" value={values.address} onChange={handleChange("address")} placeholder="Physical Address" autoComplete="street-address" />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="phone">Phone Number</label>
            <div className="login-field__control">
              <input id="phone" type="tel" value={values.phone} onChange={handleChange("phone")} placeholder="Phone Number" autoComplete="tel" />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="email">Email</label>
            <div className="login-field__control">
              <input id="email" type="email" value={values.email} onChange={handleChange("email")} placeholder="Email" autoComplete="email" />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-field__control">
              <input id="password" type="password" value={values.password} onChange={handleChange("password")} placeholder="Create Password" autoComplete="new-password" />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="login-field__control">
              <input id="confirmPassword" type="password" value={values.confirmPassword} onChange={handleChange("confirmPassword")} placeholder="Confirm Password" autoComplete="new-password" />
            </div>
          </div>

          <button className="login-submit" type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Register"}
          </button>

          <p className="login-divider">or</p>

          <Link className="login-signup__link" to="/login">
            Back to login
          </Link>
        </form>
      </section>
    </main>
  );
}