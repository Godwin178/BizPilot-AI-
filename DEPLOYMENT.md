# BizPilot AI deployment

## Prerequisites

- Node.js 20 or newer
- PostgreSQL 14 or newer
- SMTP credentials for verification and password-reset mail
- AI provider credentials
- Stripe secret and webhook signing secret

## Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL`, `APP_URL`, `SESSION_SECRET`, `SMTP_URL`, and `EMAIL_FROM`.
3. Set `AI_API_KEY` and `AI_MODEL` when enabling the assistant.
4. Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` when enabling billing.
5. Install dependencies with `npm install`.
6. Run migrations with `npm run migrate`.
7. Start the service with `npm start`.

The Stripe webhook endpoint is `/api/billing/webhook`. Configure Stripe to send checkout completion, subscription update/deletion, and invoice payment failure events. Webhook signatures are verified and duplicate event IDs are ignored.

## Verification checklist

- Confirm PostgreSQL is reachable and the migration completes.
- Register with an SMTP-enabled account and verify the email before login.
- Test password reset delivery and token expiry.
- Confirm records created by one account are not visible to another account.
- Test document PDF downloads after authentication.
- Configure the AI key and verify provider errors are surfaced without simulated responses.
- Use Stripe test mode and verify webhook events before enabling live mode.

Never commit `.env`, database credentials, API keys, webhook secrets, or SMTP passwords.
