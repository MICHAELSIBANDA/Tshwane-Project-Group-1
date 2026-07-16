/**
 * validators.ts
 *
 * Small, dependency-free validation helpers shared across the
 * auth/registration pages. Kept generic so PersonalInformation.tsx
 * and SignUp.tsx can reuse them too.
 */

import { detectIdentifierType } from "./identifierHelper";

export function isEmpty(value: string): boolean {
    return !value || value.trim().length === 0;
}

export interface LoginFormValues {
    identifier: string;
    password: string;
}

export interface LoginFormErrors {
    identifier?: string;
    password?: string;
}

/**
 * Validates the Login page's identifier + password fields.
 * Returns an object of field -> error message. Empty object means valid.
 */
export function validateLoginForm({ identifier, password }: LoginFormValues): LoginFormErrors {
    const errors: LoginFormErrors = {};

    if (isEmpty(identifier)) {
        errors.identifier = "Please enter your ID number or bus card number.";
    } else if (!detectIdentifierType(identifier)) {
        errors.identifier = "Enter a valid 13-digit ID number or a valid bus card number.";
    }

    if (isEmpty(password)) {
        errors.password = "Please enter your password.";
    }

    return errors;
}
/*
export function hasErrors(errorsObject: Record<string, unknown>): boolean {
    return Object.keys(errorsObject).length > 0;
}*/

export function hasErrors<T extends object>(errorsObject: T): boolean {
    return Object.keys(errorsObject).length > 0;
}