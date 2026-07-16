import { useEffect, useState } from "react";
import {
  initializePayment,
  verifyPayment,
} from "../../services/paymentService";
import "./Payment.css";

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 9.5h18" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 14.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 7.5h14A2.5 2.5 0 0 1 21 10v8.5a2 2 0 0 1-2 2H4.5A2.5 2.5 0 0 1 2 18V10a2.5 2.5 0 0 1 2.5-2.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M6 7.5 15.5 3 18 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 12.5h5v4h-5a2 2 0 0 1 0-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function formatAmount(rawValue) {
  const digits = rawValue.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  const cents = Number(digits);

  return (cents / 100).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseAmount(formattedValue) {
  const digits = formattedValue.replace(/\D/g, "");
  return Number(digits) / 100;
}

export default function Payment() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const numericAmount = parseAmount(amount);

  const canSubmit =
    Number.isFinite(numericAmount) &&
    numericAmount > 0 &&
    !submitting;

  useEffect(() => {
    async function verify() {
      const reference = new URLSearchParams(window.location.search).get(
        "reference"
      );

      if (!reference) return;

      try {
        await verifyPayment(reference);

        setMessage("Payment completed successfully.");

        // Remove ?reference=... from the URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } catch (error) {
        console.error(error);
        setMessage("Payment verification failed.");
      }
    }

    verify();
  }, []);

  function handleAmountChange(event) {
    setAmount(formatAmount(event.target.value));
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");

    if (!canSubmit) {
      setMessage("Enter an amount greater than R0.00.");
      return;
    }

    try {
      setSubmitting(true);

      const result = await initializePayment(numericAmount);

      if (!result.authorization_url) {
        throw new Error("No payment URL returned.");
      }

      window.location.href = result.authorization_url;
    } catch (error) {
      console.error(error);

      setMessage(
        error.message || "Unable to initialize payment."
      );

      setSubmitting(false);
    }
  }

  return (
    <main className="payment-page">
      <section className="payment-hero">
        <div className="payment-hero__icon">
          <WalletIcon />
        </div>

        <h1>Load Funds</h1>

        <p>
          Enter the amount to load onto your Tshwane bus card.
        </p>
      </section>

      <section className="payment-content">
        <svg
          className="payment-skyline"
          viewBox="0 0 1000 260"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 260V170h21v-44h39v73h38v-35h18v-52h12v-25h12v25h20v88h31v-30h40v-22h42v72h116v-92h41V93h20v35h25v92h43v-165h63v165h34v-108h22v-28h31v136h42v-54h24v-35h31v89h36v-47h20v-28h28v75h39v-40h44v-31h33v71h33v40H0Z" />
        </svg>

        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="amount-field">
            <label htmlFor="payment-amount">Amount</label>

            <div className="amount-field__control">
              <span className="amount-field__currency">R</span>

              <input
                id="payment-amount"
                inputMode="decimal"
                autoComplete="off"
                value={amount}
                placeholder="0,00"
                onChange={handleAmountChange}
              />
            </div>
          </div>

          <p className="payment-hint">
            After you submit, you will be redirected to the secure
            Paystack checkout to complete the payment.
          </p>

          {message && (
            <p className="payment-message is-error">
              {message}
            </p>
          )}

          <button
            className="payment-submit"
            type="submit"
            disabled={!canSubmit}
          >
            <CardIcon />
            {submitting ? "Redirecting..." : "Load Card"}
          </button>
        </form>
      </section>
    </main>
  );
}