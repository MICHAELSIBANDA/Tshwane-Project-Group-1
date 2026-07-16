import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import FormHeader from "../2components/FormHeader";
import InputField from "../2components/InputField";
import PasswordField from "../2components/PasswordField";
import Button from "../2components/Button";

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
        // Clear the field-level error as soon as the user starts fixing it.
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
            // Keep the identifier so the user doesn't have to retype it,
            // but clear the password for safety on a failed attempt.
            setPassword("");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <FormHeader
                    title="Welcome back"
                    subtitle="Log in to manage your Tshwane Bus Services account."
                />

                <form onSubmit={handleSubmit} noValidate>
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
                        placeholder="e.g. 9501015800086 or CARD12345678"
                        autoComplete="username"
                    />

                    <PasswordField
                        id="password"
                        label="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        error={fieldErrors.password}
                    />

                    <Button type="submit" loading={submitting}>
                        Log In
                    </Button>
                </form>

                <p className="login-signup-prompt">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
