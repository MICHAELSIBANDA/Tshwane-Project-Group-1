import React from "react";

export interface InputFieldProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    autoComplete?: string;
    disabled?: boolean;
}

/**
 * InputField.tsx
 *
 * Generic labeled text input with inline error messaging.
 * Used for the identifier field on Login, and reusable across
 * SignUp / PersonalInformation too.
 */
export default function InputField({
    id,
    label,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
    autoComplete,
    disabled = false,
}: InputFieldProps) {
    return (
        <div className="field">
            <label htmlFor={id} className="field-label">
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                disabled={disabled}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`field-input${error ? " field-input--error" : ""}`}
            />
            {error && (
                <p id={`${id}-error`} className="field-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
