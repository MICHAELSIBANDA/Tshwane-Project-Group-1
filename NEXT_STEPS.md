# Next Steps

## Payment Flow

The payment screens are currently wired to a mock service in `src/services/paymentService.js`. The UI is ready, but the real Paystack API has not been connected yet.

What needs to happen:

1. Replace the mock `submitPayment` logic with a backend API call.
   - The frontend should not call Paystack directly with secret keys.
   - Create a backend endpoint such as `POST /api/payments/initialize`.
   - Send the amount, user/card identifier, and customer details to that endpoint.

2. Backend initializes the Paystack transaction.
   - The backend should call Paystack's transaction initialize endpoint.
   - Paystack should return an authorization URL and transaction reference.
   - The backend should return those values to the frontend.

3. Frontend redirects the user to Paystack.
   - After the user clicks `Load Card`, redirect them to Paystack's authorization URL.
   - The current mock route to `/payment/result` should only be used for local testing.

4. Paystack redirects back to the app.
   - Configure the Paystack callback URL to return to a frontend route, for example:
     `/payment/result?reference=PAYSTACK_REFERENCE`
   - The result page should read the `reference` from the URL.

5. Verify the payment before updating the card.
   - The result page should call a backend endpoint such as:
     `GET /api/payments/verify/:reference`
   - The backend should verify the transaction with Paystack.
   - Only after Paystack confirms success should the backend update the user's card balance.

6. Show the final result.
   - If verification succeeds, show `Payment Successful`.
   - If verification fails, is abandoned, or Paystack returns an error, show `Payment Unsuccessful`.
   - The result page should always include a button back to Home.

Current local behavior:

- `/payment` formats the Rand amount as the user types.
- Clicking `Load Card` calls the mock `submitPayment`.
- The app then routes to `/payment/result` with success/failure data in router state.
- This is only a placeholder until the Paystack initialize and verify endpoints exist.

## Backend Work Needed

- Add authentication-aware payment endpoints.
- Store payment references and statuses.
- Prevent duplicate balance updates if the same reference is verified more than once.
- Validate minimum and maximum load amounts.
- Decide whether balances are stored in cents to avoid decimal rounding issues.
- Add server-side logging for failed payment attempts.

## Frontend Work Needed

- Replace mock payment navigation with redirect to Paystack authorization URL.
- Update `PaymentResult.jsx` to verify using the `reference` query parameter.
- Add loading state while the result page verifies the transaction.
- Add a clear retry action for failed payments.
- Show updated balance after successful verification.

## Other App Work

- Connect login/signup/change-password screens to real backend endpoints.
- Replace placeholder auth pages with styled forms.
- Add protected routes so user pages require login.
- Add persistent user session handling.
- Add error and loading states across all pages.
- Review mobile spacing after all screens are complete.
