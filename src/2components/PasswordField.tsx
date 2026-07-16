import React, { useState } from "react";

export interface PasswordFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    autoComplete?: string;
    disabled?: boolean;
    pill?: boolean;
    visuallyHideLabel?: boolean;
}

/**
 * PasswordField.tsx
 *
 * Same idea as InputField, but with a show/hide toggle since users
 * expect that on a password box.
 */
export default function PasswordField({
    id,
    label,
    value,
    onChange,
    error,
    placeholder = "Enter your password",
    autoComplete = "current-password",
    disabled = false,
    pill = false,
    visuallyHideLabel = false,
}: PasswordFieldProps) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="field">
            <label
                htmlFor={id}
                className={`field-label${visuallyHideLabel ? " sr-only" : ""}`}
            >
                {label}
            </label>
            <div className="password-field-wrapper">
                <input
                    id={id}
                    name={id}
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={`field-input${pill ? " field-input--pill" : ""}${error ? " field-input--error" : ""
                        }`}
                />
                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? "Hide password" : "Show password"}
                    tabIndex={0}
                >
                    {visible ? "Hide" : "Show"}
                </button>
            </div>
            {error && (
                <p id={`${id}-error`} className="field-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
