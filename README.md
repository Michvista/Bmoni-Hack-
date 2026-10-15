# AKOKA

AKOKA is a SvelteKit campus commerce frontend for price comparison, vendor discovery, documented agreements, and moderation. The frontend is prepared to connect to an AKOKA backend. The fintech provider must be integrated by that backend; provider credentials must never be exposed in browser code.

## How the app is meant to work

1. A student browses comparable campus listings and verified price observations, then reviews the category, unit, location, source, sample count, confidence, and available price trend.
2. A student submits a recent price observation. It enters the moderation workflow; it should affect trusted price summaries only after backend verification.
3. A student signs in, drafts an agreement with a vendor, and records price, scope, deliverables, turnaround, due date, milestones, and cancellation terms.
4. Both parties progress the agreement. The buyer can start a payment through the backend only after the agreement is accepted. The backend creates the provider checkout session and reports its verified status to the frontend.
5. The vendor records work and deliverables. The student confirms completion or raises an issue. Reports and evidence go to authorized moderators.
6. Vendors manage their offers and agreements in their portal. Moderators review reports, observations, and listings in the admin portal.

Payment status in the UI is informational and comes from the backend. AKOKA does not claim to hold funds or provide escrow. See the [BMONI Nigeria API documentation](https://embedded-docs.bmoni.com/markets/nigeria/); the backend team must decide and implement the provider-side flow and expose an AKOKA API contract.

## Current frontend feature inventory

| Area | Frontend status | Backend / integration dependency |
| --- | --- | --- |
| Landing page, category/listing discovery, campus zones, vendor profiles | Implemented | Live listing/vendor data requires configured API |
| Like-for-like price comparison, confidence, observation history chart | Implemented; chart uses real observation dates and does not invent trend points | Live verified observations and insight calculations require API data |
| Observation submission | Form validates and submits to the API; there is no local fallback or fake receipt image | Requires authenticated `POST /price-observations`; receipt attachment for a price observation needs a secure upload contract |
| Sign-in, registration, sign-out | Pages and API client calls exist; admin is not self-registerable | Backend must implement cookie/session auth routes and return the documented user shape |
| Role-aware student, vendor, admin layouts | Routes are separated and client-side role gates are present | This is navigation/UI gating only; backend must enforce permissions on every protected endpoint |
| Student and vendor portal pages | Pages load account data through API services; vendors can create and edit their listings | Vendor account must be linked to a vendor profile and the API must scope results to the signed-in user |
| Agreements, milestones, evidence, disputes | Forms/actions call the API; there is no local fallback | Backend must implement authorized agreement, milestone, evidence, event, and report endpoints and enforce valid state transitions |
| Payment checkout | Checkout handoff/status client exists at `/payments/checkout` and `/payments/:id`; only the signed-in buyer can start it in the UI | These endpoints are contracts for the AKOKA backend, not BMONI calls. Backend must validate the buyer/agreement, create provider checkout, verify callbacks/webhooks, and return status. No provider secret belongs in this app. |
| Transaction-verified reviews | Buyer can submit a 1–5 rating and comment after a completed transaction | Backend must enforce completed-transaction eligibility, one review per transaction, and return `review_submitted` on transaction reads |
| Admin moderation | Queue and moderation controls call the API | Backend must provide admin-authenticated moderation queue and mutation endpoints and enforce admin permissions |
| Toasts and form feedback | Existing forms show validation, success, and error messages | Server validation and stable error response format are required for connected mode |

The frontend contains no seeded catalog or transaction data and does not fall back to local writes. When `PUBLIC_API_BASE_URL` is unset, API requests fail with a clear configuration error and the UI shows an error or empty state; real data and successful mutations require the backend. Sign-in, registration, payment, and secure evidence upload require the backend routes below. The payment screen is intended for the real fintech checkout flow through the AKOKA backend; payment completion must be confirmed by the backend after provider verification, never by a browser redirect alone.

## Routes and access

| Route | Intended access |
| --- | --- |
| `/`, `/compare`, `/listings`, `/vendors/:id` | Public discovery |
| `/sign-in`, `/register` | Public; registration permits student/vendor only |
| `/student` | Student portal |
| `/vendor` | Vendor portal |
| `/transactions`, `/transactions/:id` | Signed-in student/vendor |
| `/admin` | Admin/moderator |

The `RequireRole` component improves the frontend experience but is not a security boundary. The backend must authorize users and records independently. `GET /transactions` must return only records the authenticated user may access (or enforce equivalent server-side scoping); client-side filtering is not access control.

## Backend API contract to agree

Set `PUBLIC_API_BASE_URL` to the **AKOKA backend** origin/base path, not the BMONI provider URL. The current client expects JSON, cookie credentials, and errors with `message` or `error` fields. Confirm and adapt these paths/payloads with the backend team before integration:

```text
GET    /auth/me
POST   /auth/login                   { email, password }
POST   /auth/register                { name, email, password, role, phone?, campus_zone? }
POST   /auth/logout

GET    /categories
GET    /listings                     ?category=&area=&maxPrice=&search=
GET    /listings/:id
POST   /listings                    vendor session creates listing
PATCH  /listings/:id                owning vendor edits listing
GET    /vendors
GET    /vendors/:id
GET    /vendors/:id/reviews
GET    /price-insights               ?category=&itemSpec=
GET    /price-observations            ?category=
POST   /price-observations
POST   /reports
GET    /transactions
POST   /transactions                 buyer identity comes from authenticated session
GET    /transactions/:id
PATCH  /transactions/:id/agreement
GET    /transactions/:id/events
POST   /transactions/:id/events
PATCH  /transactions/:id/milestones/:milestoneId
POST   /transactions/:id/evidence    multipart form: file, title
POST   /transactions/:id/review      { rating, comment }; buyer only, completed transaction only

GET    /admin/moderation-queue
PATCH  /admin/moderation-queue/observation/:id
PATCH  /admin/moderation-queue/report/:id

POST   /payments/checkout             { transaction_id, return_url }
GET    /payments/:paymentId
```

These are the current frontend endpoint assumptions; confirm and adapt them with the backend developer. Responses are expected as raw JSON objects/arrays, not `{ data: ... }` envelopes. `GET /vendors/:id` returns `{ vendor, listings, reviews }`. The moderation queue returns `{ pendingObservations, reports, pendingTransactions, verifiedObservationCount? }`. Transaction responses include the vendor account owner ID as `vendor.user_id` and buyer-specific `review_submitted` state. The frontend sends evidence as multipart form data. The backend must derive buyer/reporter/actor/vendor identity from the authenticated session rather than trusting IDs supplied by the browser, scope reads, enforce listing ownership and review eligibility, and verify provider webhooks/callbacks before marking payment successful. Never trust a browser redirect as proof of payment.

## Local setup

```sh
npm install
npm run dev
```

Create `.env` or `.env.local` with the backend base URL when available:

```env
PUBLIC_API_BASE_URL=http://localhost:4000
```

For local integration, the backend developer can allow the frontend origin `http://localhost:5173`. Share the final hosted frontend origin with them before production release so they can configure CORS and any required payment return URL allowlist. You do not need a hosted frontend URL to begin local integration.

`PUBLIC_` values are shipped to the browser. Put only the AKOKA backend URL here; do not put BMONI API keys, secrets, or signing credentials in frontend environment variables.

## Project structure

```text
src/lib/api/             typed frontend API clients
src/lib/components/      reusable auth, navigation, insight, transaction, and UI components
src/lib/data/            static campus zone reference labels
src/lib/stores/          authenticated user state and notifications
src/lib/types/           shared frontend models
src/routes/              SvelteKit pages
```

## Validation

Run `npm run check` and `npm run build` before handoff. The project reports zero Svelte/TypeScript diagnostics; SvelteKit still emits configuration notices about the legacy alias setup.
