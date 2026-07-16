# Implementation Next

This project is now partially connected to the backend at:

`https://group1-backend-prototype.onrender.com`

The UI pages exist, but the next work is to confirm the backend contracts and test the full user journey end to end.

## Immediate Checklist

1. Confirm backend endpoint contracts.
   - `GET /api/users/:govId/home`
   - `POST /api/pay`
   - `GET /api/verify/:reference`
   - Change password endpoint still needs to be confirmed.

2. Confirm stored user identity.
   - `Home.jsx` currently reads `gov_id` from `localStorage`.
   - Login must save `gov_id` after a successful login.
   - Logout already removes `gov_id`.

3. Test the payment initialization flow.
   - User enters email, card number, and Rand amount.
   - Frontend calls `POST /api/pay`.
   - Backend should create the Paystack transaction.
   - Backend should return `authorization_url`.
   - Frontend redirects the browser to that `authorization_url`.

4. Test the Paystack callback flow.
   - Paystack must redirect back to:
     `/payment/result?reference=PAYSTACK_REFERENCE`
   - `PaymentResult.jsx` reads the `reference`.
   - Frontend calls `GET /api/verify/:reference`.
   - Backend verifies the transaction with Paystack.
   - Backend updates the card balance only after successful verification.

5. Make verification idempotent.
   - If the same reference is verified twice, the balance must not be loaded twice.
   - Backend should store payment references and statuses.
   - A repeated successful reference should return a safe response such as `Already done`.

6. Improve result page data.
   - The current result page can show success/failure.
   - It does not yet receive a confirmed amount or updated balance from the verify endpoint.
   - Update the backend verify response to return structured JSON:

```json
{
  "status": "success",
  "amount": 100.0,
  "newBalance": 187.5,
  "reference": "PAYSTACK_REFERENCE"
}
```

7. Replace temporary change password behavior.
   - `changePassword` is still mocked in `userService.js`.
   - Add a backend endpoint for password changes.
   - Update the frontend service once the request and response shape is confirmed.

## Payment Flow Notes

The frontend should never contain Paystack secret keys.

Correct flow:

1. Frontend sends payment request to backend.
2. Backend calls Paystack initialize endpoint.
3. Frontend redirects user to Paystack checkout.
4. Paystack redirects user back to `/payment/result?reference=...`.
5. Frontend asks backend to verify that reference.
6. Backend verifies with Paystack.
7. Backend updates the card balance.
8. Frontend shows success or failure.

## Testing Before Demo

- Test login creates `localStorage.gov_id`.
- Test Home loads the correct name and balance.
- Test payment amount formatting with small and large amounts.
- Test payment initialization with a real email and card number.
- Test successful Paystack redirect back into the app.
- Test failed or cancelled Paystack payments.
- Test refreshing `/payment/result?reference=...`.
- Test logout clears the user and returns to login.

## Cleanup Later

- Move repeated skyline SVG into a shared component.
- Move repeated button/input styles into shared CSS.
- Add protected routes for all logged-in pages.
- Replace WIP auth pages with final styled forms.
- Store money values as cents where possible.
- Add loading states to backend-connected pages.
