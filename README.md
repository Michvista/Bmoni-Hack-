# AKOKA

AKOKA is a UNILAG campus price intelligence and protected commerce demo built with SvelteKit. Students can compare campus price observations, browse provider listings, submit price observations, and create documented service agreements. Transaction payment steps are simulated; the app does not collect or hold money.

## Run locally

```sh
npm install
npm run dev
```

## Connect a backend API

The typed API client reads `PUBLIC_API_BASE_URL` from the environment when the app is built. Copy `.env.example` to `.env` and set the URL supplied by the backend developer before starting or building the frontend. Use the API root expected by the backend (for example, `https://api.example.com/api` if routes are under `/api`). If unset, the client targets this SvelteKit app's local `/api` demo endpoints.

```env
PUBLIC_API_BASE_URL=https://your-backend.example.com/api
```

The backend must allow browser requests from the frontend origin (CORS) when hosted separately. API request/response shapes are currently described by the TypeScript interfaces and `src/lib/api` modules.

**Integration status:** API modules exist for categories, listings, price insights and observations, vendors, transactions, reports, and moderation. The current screens still use `dbStore` directly for most reads and writes, and the local `/api` routes use the same browser demo store. Setting the URL alone therefore does not switch the entire UI to the backend; screen actions still need to be migrated to the corresponding API functions and authenticated as required by the backend.

## Product areas

- Campus price observations and confidence-based price insights.
- Like-for-like comparison rules by service category.
- Campus provider directory with category, zone, search, and budget filters.
- Documented transactions with scope, deliverables, due dates, milestones, and an event timeline.
- Simulated payment status, clearly marked as demo only.
- Observation moderation and report handling in the demo Trust Desk.
- Local browser persistence for demo data, with a reset action in the admin area.

## Commands

```sh
npm run check
npm run build
npm run preview
```
