import React from "react";

export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary";
    loading?: boolean;
    disabled?: boolean;
}

/**
 * Button.tsx
 *
 * Generic primary/secondary button with a built-in loading state,
 * so pages don't each reinvent "disable while submitting".
 */
export default function Button({
    children,
    onClick,
    type = "button",
    variant = "primary",
    loading = false,
    disabled = false,
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`btn btn--${variant}${loading ? " btn--loading" : ""}`}
        >
            {loading ? "Please wait..." : children}
        </button>
    );
}
