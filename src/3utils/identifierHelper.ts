/**
 * identifierHelper.ts
 *
 * The login field accepts either a South African ID Number or a
 * Tshwane Bus Services Card Number. Since the backend needs to know
 * which one it's dealing with, we detect the type on the frontend
 * before submitting.
 *
 * Rules used for detection:
 *  - SA ID Number: exactly 13 digits, numeric only (e.g. 9501015800086)
 *  - Bus Card Number: everything else that isn't empty (e.g. CARD12345678)
 *
 * If your card numbers follow a stricter pattern (fixed length, a
 * required prefix, etc.), tighten CARD_NUMBER_REGEX below to match -
 * this keeps a typo'd ID number from being silently treated as a card.
 */

export type IdentifierType = "ID_NUMBER" | "CARD_NUMBER";

export const IDENTIFIER_TYPES: { ID_NUMBER: IdentifierType; CARD_NUMBER: IdentifierType } = {
    ID_NUMBER: "ID_NUMBER",
    CARD_NUMBER: "CARD_NUMBER",
};

const SA_ID_REGEX = /^\d{13}$/;
// Loosely matches things like "CARD12345678" - adjust to your real card format.
const CARD_NUMBER_REGEX = /^[A-Za-z0-9]{6,20}$/;

/**
 * Strips surrounding whitespace so " 9501015800086 " still detects correctly.
 */
export function normalizeIdentifier(value: string): string {
    return (value || "").trim();
}

/**
 * Returns "ID_NUMBER", "CARD_NUMBER", or null if the value doesn't
 * look like either.
 */
export function detectIdentifierType(rawValue: string): IdentifierType | null {
    const value = normalizeIdentifier(rawValue);

    if (!value) return null;

    if (SA_ID_REGEX.test(value)) {
        return IDENTIFIER_TYPES.ID_NUMBER;
    }

    if (CARD_NUMBER_REGEX.test(value)) {
        return IDENTIFIER_TYPES.CARD_NUMBER;
    }

    return null;
}
