import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

function ResultIcon({ success }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {success ? (
        <path d="m5 12.5 4.2 4.2L19 6.8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <>
          <path d="M7 7 17 17" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M17 7 7 17" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    </svg>
  );
}

function formatCurrency(amount) {
  return `R ${Number(amount || 0).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function PaymentResult() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const status = state?.status || new URLSearchParams(window.location.search).get("status") || "failed";
  const success = status === "success";
  const amount = state?.amount;
  const reference = state?.reference;
  const newBalance = state?.newBalance;
  const message = state?.message;

  return (
    <main className="payment-result-page">
      <section className="payment-hero">
        <div className="payment-hero__icon">
          <ResultIcon success={success} />
        </div>
        <h1>Payment Result</h1>
        <p>Your card load request has been processed.</p>
      </section>

      <section className="payment-content">
        <svg className="payment-skyline" viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 260V170h21v-44h39v73h38v-35h18v-52h12v-25h12v25h20v88h31v-30h40v-22h42v72h116v-92h41V93h20v35h25v92h43v-165h63v165h34v-108h22v-28h31v136h42v-54h24v-35h31v89h36v-47h20v-28h28v75h39v-40h44v-31h33v71h33v40H0Z" />
        </svg>

        <div className={`payment-result-card ${success ? "is-success" : "is-failed"}`}>
          <div className="payment-result-card__mark">
            <ResultIcon success={success} />
          </div>

          <h1>{success ? "Payment Successful" : "Payment Unsuccessful"}</h1>
          <p>
            {success
              ? `${formatCurrency(amount)} has been loaded onto your card.`
              : message || "We could not complete the payment. Please try again."}
          </p>

          {success && newBalance !== undefined && (
            <p>Your new balance is {formatCurrency(newBalance)}.</p>
          )}

          {reference && (
            <p className="payment-result-card__reference">Reference: {reference}</p>
          )}

          <button className="payment-home-button" type="button" onClick={() => navigate("/")}>
            <HomeIcon />
            Back to Home
          </button>
        </div>
      </section>
    </main>
  );
}

export default PaymentResult;
