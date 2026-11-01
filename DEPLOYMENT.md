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

## Environment variables

Set these in the Vercel project under Settings → Environment Variables, and in `.env` for local development. Values below are formats and sources, not secrets to commit:

- `PORT`: local HTTP port, normally `3000`; Vercel does not require it.
- `APP_URL`: deployed HTTPS origin, for example `https://your-project.vercel.app`; used in email links and Stripe return URLs.
- `DATABASE_URL`: PostgreSQL connection URI from the selected provider, in the form `postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require`.
- `SESSION_SECRET`: randomly generated 32-byte-or-longer secret; generate with a password manager or secure random generator.
- `SMTP_URL`: SMTP URI from the mail provider, such as `smtps://USER:PASSWORD@HOST:465`.
- `EMAIL_FROM`: verified sender address, for example `BizPilot AI <no-reply@your-domain.com>`.
- `AI_API_URL`: provider chat-completions endpoint; OpenAI-compatible default is `https://api.openai.com/v1/chat/completions`.
- `AI_API_KEY`: API key created in the selected AI provider account.
- `AI_MODEL`: model identifier enabled for that provider, such as `gpt-4o-mini`.
- `STRIPE_SECRET_KEY`: Stripe Dashboard → Developers → API keys; use a test key before launch.
- `STRIPE_WEBHOOK_SECRET`: Stripe Dashboard → Developers → Webhooks → endpoint signing secret.
- `ADMIN_EMAIL`: email that should receive the server-assigned administrator role at registration.

No PostgreSQL vendor is hardcoded. The application requires a PostgreSQL 14+ compatible provider; Vercel Postgres, Neon, Supabase, Render, and managed AWS PostgreSQL are compatible when they provide a standard connection URI. Production connections use SSL.

## Verification checklist

- Confirm PostgreSQL is reachable and the migration completes.
- Register with an SMTP-enabled account and verify the email before login.
- Test password reset delivery and token expiry.
- Confirm records created by one account are not visible to another account.
- Test document PDF downloads after authentication.
- Configure the AI key and verify provider errors are surfaced without simulated responses.
- Use Stripe test mode and verify webhook events before enabling live mode.

Never commit `.env`, database credentials, API keys, webhook secrets, or SMTP passwords.
