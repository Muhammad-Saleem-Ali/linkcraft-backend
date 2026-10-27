# iLearner Amazon Affiliate Program - Backend API

A high-performance Node.js & PostgreSQL backend powering the Amazon Affiliate Program platform, including real-time click tracking, collision-free attribution, earnings calculations, and an Admin Management Console.

---

## 🛠 Tech Stack

- **Runtime**: Node.js 18+ / 20+
- **Framework**: Express.js with TypeScript (`tsx` execution)
- **Database**: PostgreSQL 16 (Native, Zero-Docker)
- **Authentication**: JWT (`jsonwebtoken`) + `bcryptjs`
- **Real-Time**: Server-Sent Events (SSE) Event Hub
- **Security**: CORS, SQL parameterized queries, role-based authorization

---

## 🗄 PostgreSQL Database Architecture

The backend connects to PostgreSQL running on port `5433` (database: `ilearner_db`):

- **`users`**: Platform administrators and affiliate partners with commission rates, currently owed balances, lifetime earnings, bank payout info, and public store slugs.
- **`affiliate_links`**: Curated Amazon items with ASIN extraction, associate tags (`linkcraft-20`), real-time views and clicks counters, and status (`active` / `revoked`).
- **`link_clicks`**: Event log tracking timestamp, IP address, user-agent, and country for each click.
- **`earnings_reports`**: Monthly sales breakdown, units ordered, units shipped, returns, gross revenue, and partner cut.
- **`payouts`**: Affiliate payment requests, approval statuses (`pending`, `paid`), bank wire notes, and receipts.
- **`linked_accounts`**: WhatsApp bot paired numbers and accounts.
- **`pairing_codes`**: 6-digit WhatsApp pairing codes with 2-minute expiration.

---

## 🚀 Getting Started

### 1. Database Operations
```bash
# Start native PostgreSQL server
npm run db:start

# Run DDL schema migrations
npm run migrate

# Seed initial admin, partners, links, and reports
npm run seed

# Check database status or stop
npm run db:status
npm run db:stop
```

### 2. Start the Backend API
```bash
# Development mode with hot-reloading
npm run dev

# Build for production
npm run build
npm start
```

Base URL: `http://localhost:5000`

---

## 📡 API Endpoints

### 🔐 Authentication
- `POST /api/auth/login`: Authenticate admin or partner user.
- `POST /api/auth/register`: Register new partner account.
- `GET /api/auth/me`: Get authenticated user profile & balance.

### 🔗 Affiliate Links & Redirects
- `GET /api/links`: List all active affiliate links (supports `?country=...&search=...&username=...`).
- `POST /api/links`: Create new affiliate link from any Amazon URL or ASIN.
- `GET /api/links/:slug`: Get product showcase details for `/p/:slug`.
- `DELETE /api/links?slug=:slug`: Revoke an affiliate tracking link.
- `GET /r/:slug`: **Direct tracking redirect**. Increments views and clicks in PostgreSQL, adds Rs. 25 estimate to partner's owed balance, emits real-time event, and redirects to destination Amazon affiliate URL.

### 📊 Partner Dashboard
- `GET /api/dashboard/stats`: Key KPI metrics, conversion rate, owed balances, best performers.
- `GET /api/dashboard/chart?range=7days`: Dynamic dataset for 7-Day Trends, Monthly, Revenue, Top Products.
- `GET /api/dashboard/earnings`: Earnings reports breakdown by month and country.
- `GET /api/dashboard/payouts`: Payout transactions history and receipts.
- `POST /api/dashboard/payouts/request`: Request payout for currently owed balance.
- `PUT /api/dashboard/profile`: Update name, phone, bank info, and public store slug.
- `POST /api/dashboard/pairing-code`: Generate 6-digit WhatsApp bot pairing code.

### 🛡 Admin Dashboard Endpoints
- `GET /api/admin/overview`: Platform high-level overview metrics, top partners leaderboard.
- `GET /api/admin/users`: Searchable list of all partners with status filter (`all`, `active`, `pending`, `suspended`).
- `PUT /api/admin/users/:id/status`: Change partner status (`active`, `pending`, `suspended`).
- `PUT /api/admin/users/:id/commission`: Update partner commission rate split (e.g. 70%, 80%).
- `GET /api/admin/reports`: Monthly sales summaries, country breakdown (US, UK), and top affiliates.
- `GET /api/admin/payouts`: All affiliate payout requests.
- `POST /api/admin/payouts/:id/pay`: Authorize and mark payout as paid, automatically deducting from user's currently owed balance.
- `GET /api/admin/links`: Global links audit across all affiliate partners.

### ⚡ Real-Time SSE
- `GET /api/realtime`: Server-Sent Events stream broadcasting live link creation and click registrations.
