/**
 * authService.ts
 *
 * Talks to the backend auth endpoints. Swap BASE_URL / paths to match
 * your real API. Kept as plain fetch so it has no extra dependencies -
 * replace with axios if that's what the rest of the app uses.
 */

import type { IdentifierType } from "../3utils/identifierHelper";
import.meta.env.VITE_API_BASE_URL

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export interface LoginResponse {
    token: string;
    user: Record<string, unknown>;
}

/**
 * Logs a user in. Throws an Error with a user-facing message on failure.
 */
export async function login(
    identifier: string,
    identifierType: IdentifierType | null,
    password: string
): Promise<LoginResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            identifier,
            identifierType,
            password,
        }),
    });

    let data: any = null;
    try {
        data = await response.json();
    } catch {
        // Non-JSON response body - fall through to generic error handling below.
    }

    if (!response.ok) {
        const message =
            (data && (data.message || data.error)) ||
            "We couldn't log you in. Please check your details and try again.";
        throw new Error(message);
    }

    return data as LoginResponse;
}
