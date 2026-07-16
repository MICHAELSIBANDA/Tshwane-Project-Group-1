import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import InputField from "../2components/InputField";
import PasswordField from "../2components/PasswordField";
import Button from "../2components/Button";
import BusIcon from "../2components/BusIcon";

import { login } from "../4services/authService";
import { detectIdentifierType } from "../3utils/identifierHelper";
import { validateLoginForm, hasErrors, type LoginFormErrors } from "../3utils/validators";

import "./Login.css";

export default function Login() {
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState<LoginFormErrors>({});
    const [serverError, setServerError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function handleIdentifierChange(e: React.ChangeEvent<HTMLInputElement>) {
        setIdentifier(e.target.value);
        if (fieldErrors.identifier) {
            setFieldErrors((prev) => ({ ...prev, identifier: undefined }));
        }
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
        if (fieldErrors.password) {
            setFieldErrors((prev) => ({ ...prev, password: undefined }));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setServerError("");

        const errors = validateLoginForm({ identifier, password });
        setFieldErrors(errors);
        if (hasErrors(errors)) return;

        const identifierType = detectIdentifierType(identifier);

        setSubmitting(true);
        try {
            await login(identifier, identifierType, password);
            navigate("/home");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Login failed. Please try again.";
            setServerError(message);
            setPassword("");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="login-page">
            {/* Top banner: crest logo + bus photo. Swap these src paths for the
          real assets - see the note below the code for where to put them. */}
            <div className="login-top-banner">
                <img
                    src="/assets/tshwane-logo.png"
                    alt="City of Tshwane"
                    className="login-top-banner__logo"
                />
                <img
                    src="/assets/bus-banner.jpg"
                    alt="Tshwane Bus Services bus"
                    className="login-top-banner__photo"
                />
            </div>

            {/* Green dome hero */}
            <div className="login-hero">
                <div className="login-hero__icon">
                    <BusIcon size={90} />
                </div>
                <h1 className="login-hero__brand">Tshwane</h1>
                <p className="login-hero__brand-sub">Bus Service</p>
                <p className="login-hero__welcome">Welcome!</p>
                <p className="login-hero__tagline">
                    Manage your bus card easily
                    <br />
                    and travel with ease
                </p>
            </div>

            {/* Form */}
            <form className="login-form" onSubmit={handleSubmit} noValidate>
                {serverError && (
                    <p className="form-error" role="alert">
                        {serverError}
                    </p>
                )}

                <InputField
                    id="identifier"
                    label="ID Number or Bus Card Number"
                    value={identifier}
                    onChange={handleIdentifierChange}
                    error={fieldErrors.identifier}
                    placeholder="Card number or ID number"
                    autoComplete="username"
                    pill
                    visuallyHideLabel
                />

                <PasswordField
                    id="password"
                    label="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    error={fieldErrors.password}
                    placeholder="Password"
                    pill
                    visuallyHideLabel
                />

                <Button type="submit" loading={submitting} pill>
                    <span className="btn__content">
                        Login
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M5 12h14M13 6l6 6-6 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </Button>

                <p className="login-divider">or</p>

                <Link to="/signup" className="btn btn--secondary btn--pill">
                    Register account
                </Link>
            </form>
        </div>
    );
}
