import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import InputField from "../2components/InputField";
import PasswordField from "../2components/PasswordField";
import Button from "../2components/Button";
import BusIcon from "../2components/BusIcon";

import { register } from "../4services/authService";
import { validateRegisterForm, hasErrors, type RegisterFormErrors } from "../3utils/validators";

import "./Login.css";
import "./Register.css";

export default function Register() {
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
    const [fieldErrors, setFieldErrors] = useState<RegisterFormErrors>({});
    const [serverError, setServerError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function handleChange(field: keyof typeof values) {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setValues((prev) => ({ ...prev, [field]: e.target.value }));
            if (fieldErrors[field]) {
                setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        };
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setServerError("");

        const errors = validateRegisterForm(values);
        setFieldErrors(errors);
        if (hasErrors(errors)) return;

        setSubmitting(true);
        try {
            await register({
                cardNumber: values.cardNumber,
                idNumber: values.idNumber,
                firstName: values.firstName,
                lastName: values.lastName,
                address: values.address,
                phone: values.phone,
                email: values.email,
                password: values.password,
            });
            navigate("/home");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
            setServerError(message);
            setValues((prev) => ({ ...prev, password: "", confirmPassword: "" }));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="login-page register-page">
            {/* Top banner: crest logo + bus photo, same asset paths as Login */}
            <div className="login-top-banner">
                <img
                    src="/assets/tshwane-logo.jpeg"
                    alt="City of Tshwane"
                    className="login-top-banner__logo"
                />
                <img
                    src="/assets/bus-banner.jpeg"
                    alt="Tshwane Bus Services bus"
                    className="login-top-banner__photo"
                />
            </div>

            {/* Green dome hero */}
            <div className="login-hero register-hero">
                <div className="login-hero__icon">
                    <BusIcon size={72} />
                </div>
                <p className="login-hero__welcome register-hero__title">Create Your Account</p>
                <p className="login-hero__tagline">
                    Join Tshwane bus service
                    <br />
                    and travel with ease.
                </p>
            </div>

            {/* Form */}
            <form className="login-form register-form" onSubmit={handleSubmit} noValidate>
                {serverError && (
                    <p className="form-error" role="alert">
                        {serverError}
                    </p>
                )}

                <InputField
                    id="cardNumber"
                    label="Card Number"
                    value={values.cardNumber}
                    onChange={handleChange("cardNumber")}
                    error={fieldErrors.cardNumber}
                    placeholder="Card Number"
                    autoComplete="off"
                    pill
                    visuallyHideLabel
                />

                <InputField
                    id="idNumber"
                    label="ID Number"
                    value={values.idNumber}
                    onChange={handleChange("idNumber")}
                    error={fieldErrors.idNumber}
                    placeholder="ID Number"
                    autoComplete="off"
                    pill
                    visuallyHideLabel
                />

                <InputField
                    id="firstName"
                    label="First Name"
                    value={values.firstName}
                    onChange={handleChange("firstName")}
                    error={fieldErrors.firstName}
                    placeholder="First Name"
                    autoComplete="given-name"
                    pill
                    visuallyHideLabel
                />

                <InputField
                    id="lastName"
                    label="Last Name"
                    value={values.lastName}
                    onChange={handleChange("lastName")}
                    error={fieldErrors.lastName}
                    placeholder="Last Name"
                    autoComplete="family-name"
                    pill
                    visuallyHideLabel
                />

                <InputField
                    id="address"
                    label="Physical Address"
                    value={values.address}
                    onChange={handleChange("address")}
                    error={fieldErrors.address}
                    placeholder="Physical Address"
                    autoComplete="street-address"
                    pill
                    visuallyHideLabel
                />

                <InputField
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    value={values.phone}
                    onChange={handleChange("phone")}
                    error={fieldErrors.phone}
                    placeholder="Phone Number"
                    autoComplete="tel"
                    pill
                    visuallyHideLabel
                />

                <InputField
                    id="email"
                    label="Email"
                    type="email"
                    value={values.email}
                    onChange={handleChange("email")}
                    error={fieldErrors.email}
                    placeholder="Email"
                    autoComplete="email"
                    pill
                    visuallyHideLabel
                />

                <PasswordField
                    id="password"
                    label="Create Password"
                    value={values.password}
                    onChange={handleChange("password")}
                    error={fieldErrors.password}
                    placeholder="Create Password"
                    autoComplete="new-password"
                    pill
                    visuallyHideLabel
                />

                <PasswordField
                    id="confirmPassword"
                    label="Confirm Password"
                    value={values.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    error={fieldErrors.confirmPassword}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    pill
                    visuallyHideLabel
                />

                <Button type="submit" loading={submitting} pill>
                    <span className="btn__content">
                        Register
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

                <Link to="/login" className="btn btn--secondary btn--pill">
                    Back to login
                </Link>
            </form>
        </div>
    );
}
