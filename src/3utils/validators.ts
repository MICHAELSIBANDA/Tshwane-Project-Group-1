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

/**
 * Add this block to the existing src/3utils/validators.ts
 * (keep the existing isEmpty / validateLoginForm / hasErrors as-is —
 * this is new, additive code, not a replacement).
 */

export interface RegisterFormValues {
    cardNumber: string;
    idNumber: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterFormErrors {
    cardNumber?: string;
    idNumber?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ID_NUMBER_RE = /^\d{13}$/;
// South African local mobile format (0XXXXXXXXX). Adjust if you need to
// accept international format or landlines too.
const PHONE_RE = /^0\d{9}$/;

export function validateRegisterForm(values: RegisterFormValues): RegisterFormErrors {
    const errors: RegisterFormErrors = {};

    if (isEmpty(values.cardNumber)) {
        errors.cardNumber = "Please enter your bus card number.";
    }

    if (isEmpty(values.idNumber)) {
        errors.idNumber = "Please enter your ID number.";
    } else if (!ID_NUMBER_RE.test(values.idNumber.trim())) {
        errors.idNumber = "Enter a valid 13-digit ID number.";
    }

    if (isEmpty(values.firstName)) {
        errors.firstName = "Please enter your first name.";
    }

    if (isEmpty(values.lastName)) {
        errors.lastName = "Please enter your last name.";
    }

    if (isEmpty(values.address)) {
        errors.address = "Please enter your physical address.";
    }

    if (isEmpty(values.phone)) {
        errors.phone = "Please enter your phone number.";
    } else if (!PHONE_RE.test(values.phone.trim())) {
        errors.phone = "Enter a valid 10-digit phone number.";
    }

    if (isEmpty(values.email)) {
        errors.email = "Please enter your email address.";
    } else if (!EMAIL_RE.test(values.email.trim())) {
        errors.email = "Enter a valid email address.";
    }

    if (isEmpty(values.password)) {
        errors.password = "Please create a password.";
    } else if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters.";
    }

    if (isEmpty(values.confirmPassword)) {
        errors.confirmPassword = "Please confirm your password.";
    } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords don't match.";
    }

    return errors;
}
