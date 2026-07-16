import React from "react";

export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary";
    pill?: boolean;
    loading?: boolean;
    disabled?: boolean;
}

/**
 * Button.tsx
 *
 * Generic primary/secondary button with a built-in loading state,
 * so pages don't each reinvent "disable while submitting".
 * `pill` switches on the fully-rounded style used on Login.
 */
export default function Button({
    children,
    onClick,
    type = "button",
    variant = "primary",
    pill = false,
    loading = false,
    disabled = false,
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`btn btn--${variant}${pill ? " btn--pill" : ""}${loading ? " btn--loading" : ""
                }`}
        >
            {loading ? "Please wait..." : children}
        </button>
    );
}
