import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../services/userService";
import "./ChangePassword.css";

function getStoredGovId() {
  return localStorage.getItem("gov_id") || "";
}

function LockIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="10" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 14v2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ hidden }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      {hidden && <path d="M4 20 20 4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />}
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 6 9 12l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PasswordField({ id, label, value, placeholder, visible, onToggle, onChange }) {
  return (
    <label className="password-field" htmlFor={id}>
      <span className="password-field__label">{label}</span>
      <span className="password-field__control">
        <LockIcon className="password-field__lock" />
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          className="password-field__toggle"
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={onToggle}
        >
          <EyeIcon hidden={!visible} />
        </button>
      </span>
    </label>
  );
}

function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visibleFields, setVisibleFields] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const rules = useMemo(
    () => [
      { label: "At least 8 characters", met: newPassword.length >= 8 },
      { label: "One uppercase letter", met: /[A-Z]/.test(newPassword) },
      { label: "One lowercase letter", met: /[a-z]/.test(newPassword) },
      { label: "One number", met: /\d/.test(newPassword) },
      { label: "One special character", met: /[^A-Za-z0-9]/.test(newPassword) },
    ],
    [newPassword],
  );

  const passedRules = rules.filter((rule) => rule.met).length;
  const passwordsMatch = confirmPassword.length === 0 || newPassword === confirmPassword;
  const canSubmit =
    currentPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword &&
    passedRules === rules.length &&
    !submitting;

  const strengthLabel = passedRules <= 2 ? "Weak" : passedRules <= 4 ? "Medium" : "Strong";

  function toggleVisibility(field) {
    setVisibleFields((fields) => ({ ...fields, [field]: !fields[field] }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!canSubmit) {
      setMessage("Please complete all password requirements first.");
      return;
    }

    try {
      setSubmitting(true);
      const govId = getStoredGovId();

      if (!govId) {
        throw new Error("User identity is missing. Please log in again.");
      }

      await changePassword({ govId, currentPassword, newPassword });
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(error.message || "Unable to update password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="change-password">
      <section className="change-password__hero">
        <div className="change-password__lock">
          <LockIcon />
        </div>
        <h1>Change Password</h1>
        <p>
          Update your password to keep
          <br />
          your account secure.
        </p>
      </section>

      <section className="change-password__content">
        <svg className="change-password__skyline" viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 260V170h21v-44h39v73h38v-35h18v-52h12v-25h12v25h20v88h31v-30h40v-22h42v72h116v-92h41V93h20v35h25v92h43v-165h63v165h34v-108h22v-28h31v136h42v-54h24v-35h31v89h36v-47h20v-28h28v75h39v-40h44v-31h33v71h33v40H0Z" />
        </svg>

        <form className="change-password__form" onSubmit={handleSubmit}>
          <PasswordField
            id="current-password"
            label="Current Password"
            value={currentPassword}
            placeholder="Enter your current password"
            visible={visibleFields.current}
            onToggle={() => toggleVisibility("current")}
            onChange={setCurrentPassword}
          />

          <PasswordField
            id="new-password"
            label="New Password"
            value={newPassword}
            placeholder="Enter your new password"
            visible={visibleFields.next}
            onToggle={() => toggleVisibility("next")}
            onChange={setNewPassword}
          />

          <div className="password-strength">
            <p>Password must be at least 8 characters long</p>
            <div className="password-strength__bars" aria-hidden="true">
              {[0, 1, 2, 3].map((bar) => (
                <span
                  key={bar}
                  className={bar < Math.min(passedRules, 4) ? "is-active" : ""}
                />
              ))}
            </div>
            <p>Strength: {strengthLabel}</p>
          </div>

          <PasswordField
            id="confirm-password"
            label="Confirm New Password"
            value={confirmPassword}
            placeholder="Confirm your new password"
            visible={visibleFields.confirm}
            onToggle={() => toggleVisibility("confirm")}
            onChange={setConfirmPassword}
          />

          {!passwordsMatch && (
            <p className="change-password__message is-error">Passwords do not match.</p>
          )}

          <div className="password-rules">
            <p>Password must contain:</p>
            <ul>
              {rules.map((rule) => (
                <li key={rule.label} className={rule.met ? "is-met" : ""}>
                  <span>{rule.met ? "✓" : ""}</span>
                  {rule.label}
                </li>
              ))}
            </ul>
          </div>

          {message && <p className="change-password__message">{message}</p>}

          <button className="change-password__submit" type="submit" disabled={!canSubmit}>
            <LockIcon />
            {submitting ? "Updating..." : "Update Password"}
          </button>

          <button className="change-password__cancel" type="button" onClick={() => navigate(-1)}>
            <ArrowLeftIcon />
            Cancel
          </button>
        </form>
      </section>
    </main>
  );
}

export default ChangePassword;
