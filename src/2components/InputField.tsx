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
    pill?: boolean;
    visuallyHideLabel?: boolean;
}

/**
 * InputField.tsx
 *
 * Generic labeled text input with inline error messaging.
 * Used for the identifier field on Login, and reusable across
 * SignUp / PersonalInformation too.
 *
 * `pill` switches on the rounded, filled style used on Login.
 * `visuallyHideLabel` keeps the label in the DOM for screen readers
 * but hides it visually, for designs (like Login) that only show
 * placeholder text inside the field.
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
    pill = false,
    visuallyHideLabel = false,
}: InputFieldProps) {
    return (
        <div className="field">
            <label
                htmlFor={id}
                className={`field-label${visuallyHideLabel ? " sr-only" : ""}`}
            >
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
                className={`field-input${pill ? " field-input--pill" : ""}${error ? " field-input--error" : ""
                    }`}
            />
            {error && (
                <p id={`${id}-error`} className="field-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
