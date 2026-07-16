//import React from "react";

export interface FormHeaderProps {
    title: string;
    subtitle?: string;
}

/**
 * FormHeader.tsx
 *
 * Logo + heading + optional subtext, shared across the auth pages
 * so Login / SignUp / PersonalInformation stay visually consistent.
 */
export default function FormHeader({ title, subtitle }: FormHeaderProps) {
    return (
        <div className="form-header">
            <img
                src="/assets/logo.svg"
                alt="Tshwane Bus Services"
                className="form-header__logo"
            />
            <h1 className="form-header__title">{title}</h1>
            {subtitle && <p className="form-header__subtitle">{subtitle}</p>}
        </div>
    );
}
