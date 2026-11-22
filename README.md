# SalonBook – Client

Next.js front end for the SalonBook salon appointment booking platform.

**Live website:** `<add live website link>` · **Server repository:** https://github.com/Rokon70/salonbook-server · **Client repository:** https://github.com/Rokon70/salonbook-client

## Important Features
- Public home and browse pages with **search, category filter and price sorting**
- Better Auth: email/password + Google sign in, password rules, role-based redirect
- Protected service details page with appointment booking (date + predefined time slots)
- Customer dashboard: overview, my appointments (details, cancel pending, **Pay Now with Stripe**), profile
- Admin dashboard: overview, manage services (image upload), appointments, users (block/unblock), transactions
- Server-side role checks in dashboard layouts + middleware; blocked users are locked out
- Toast notifications, loaders, empty/error states, fully responsive UI

## Technology Stack
Next.js (App Router), React, Tailwind CSS, Better Auth, MongoDB (adapter), react-hot-toast, lucide-react

## Installation
```bash
git clone https://github.com/Rokon70/salonbook-client.git
cd salonbook-client
npm install
cp .env.example .env.local   # fill in the values
```

## Run Locally
```bash
npm run dev     # http://localhost:3000
```
Start the server repository too (`http://localhost:5000`). Use the same MongoDB database in both.

### Creating the admin account
Admin accounts are never created from the public form. Sign up normally with the admin email, then in the server repo run:
```bash
npm run make-admin -- admin@example.com
```

## Required Environment Variables (names only)
`MONGODB_URI`, `MONGODB_DB`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_API_URL`

Google OAuth redirect URI: `<BETTER_AUTH_URL>/api/auth/callback/google`

## Deployment (Vercel)
Add the variables above in Vercel. Set the server's `CLIENT_URL` and `AUTH_URL` to this site's URL.
Routes work after refresh because the dashboard checks the session on the server, not only in the browser.
