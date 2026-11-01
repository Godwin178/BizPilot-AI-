# BizPilot AI

BizPilot AI is a business management SaaS with a responsive dashboard, PostgreSQL-backed authenticated API, AI assistant integration, document workspace, CRM, tasks, finance, marketing tools, subscriptions, email verification, password reset, PDF export, and admin controls.

## Run

Copy `.env.example` to `.env`, provision PostgreSQL, configure SMTP, AI, and Stripe credentials, then run `npm start`. The initial migration runs before the server listens. The local `.env` is excluded from version control. The app intentionally fails closed for AI and payment actions until credentials are configured; it never reports simulated success.

## Security

Set a strong `SESSION_SECRET`. User data is scoped by authenticated session in the API layer. Configure a real persistent database and payment provider before production deployment.
