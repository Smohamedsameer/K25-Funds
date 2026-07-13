# NidhiTrack — Monthly Fund Collection Management System

A full-stack scaffold: **React + Vite + Tailwind** frontend, **Spring Boot 3 (Java 21)** backend,
**MySQL** database, **JWT** auth with role-based access (`ROLE_ADMIN` / `ROLE_MEMBER`).

This is a working foundation covering the core flows from the spec — auth, member management,
monthly contributions with a demo payment flow, admin dashboard with charts, reports, and
announcements. A few of the "extra features" listed in the original brief (WhatsApp/SMS
reminders, Razorpay webhook verification, DB backup/restore, Docker, Swagger polish, full test
suite) are stubbed with comments showing where to plug them in — wiring all of those in as well
would roughly triple the codebase, so they're left as clearly marked extension points rather than
half-finished integrations.

## Project layout

```
fund-collection-app/
├── backend/     Spring Boot API (Java 21, Maven)
└── frontend/    React + Vite + Tailwind SPA
```

## Backend setup

1. Create a MySQL database (or let Hibernate create it — `createDatabaseIfNotExist=true` is set):
   ```sql
   CREATE DATABASE fund_collection_db;
   ```
2. Edit `backend/src/main/resources/application.properties`:
   - `spring.datasource.username` / `spring.datasource.password` → your MySQL credentials
   - `app.jwt.secret` → generate your own 256-bit base64 secret for production
3. Run it:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   (or open in IntelliJ/VS Code and run `FundCollectionApplication`)
4. On first run, a default admin is seeded automatically:
   - **username:** `admin`
   - **password:** `Admin@123`
   Change this password immediately in a real deployment.
5. API runs on `http://localhost:8080`. Swagger UI: `http://localhost:8080/swagger-ui.html`.

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if needed
npm run dev
```

Runs on `http://localhost:5173`. The dev build has already been verified to compile cleanly.

## Default login flow

- **Home page** → "Login" (member) or "Admin Login"
- Log in as `admin` / `Admin@123` to reach `/admin` and add real members via **Members → Add Member**
- New members get an auto-generated `MEM00xx` ID and a default password (`Member@123` unless you set one), which they can use at `/login`

## What's implemented

**Backend**
- JWT auth (`/api/auth/login`, `/api/auth/admin-login`), BCrypt password hashing, role-based `@PreAuthorize`
- Member CRUD + search + reset password (`/api/members`)
- Contribution payments incl. demo auto-approval flow, unique per member/month/year (`/api/payments`)
- Monthly/yearly aggregate reports (`/api/reports`)
- Announcements CRUD (`/api/announcements`)
- Global exception handler → consistent JSON error shape
- CORS configured for the Vite dev server

**Frontend**
- Landing page (navbar, hero, stats, footer) — the "passbook" themed design from earlier
- Member login & Admin login (separate pages/flows, remember me, show/hide password)
- Member dashboard: profile card, this month's contribution status, pay button
- Payment page: method selector (Razorpay/UPI/Card/Net Banking/Demo) → receipt screen
- Payment history table with status badges
- Admin dashboard: stat cards, Paid vs Pending pie chart, yearly bar chart, recent payments
- Admin Members page: search, add/edit modal, delete, reset password
- Admin Payments page: filter, CSV export, delete
- Admin Reports page: monthly snapshot + yearly breakdown + CSV export
- Admin Announcements: create/edit/delete, shown to members via `/api/announcements`

## Clearly marked extension points (not yet wired)

- Real Razorpay integration (currently all methods, including "Razorpay", auto-approve like demo — swap in signature verification + webhook in `PaymentService.payContribution`)
- Email OTP for forgot-password (`ForgotPassword.jsx` posts nowhere yet — add `POST /api/auth/forgot-password`)
- `PUT /api/auth/change-password` (Settings page UI exists, endpoint doesn't)
- PDF receipt/report generation (currently uses browser print / CSV export as a stand-in)
- WhatsApp/SMS reminders, DB backup/restore, refresh-token rotation endpoint, Dockerfiles, unit tests

## Roles

| Role | Access |
|---|---|
| `ROLE_ADMIN` | Full access: members, all payments, reports, announcements, settings |
| `ROLE_MEMBER` | Own profile, own payments, pay contribution, view announcements |
