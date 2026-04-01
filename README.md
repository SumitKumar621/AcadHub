# AcadHub — Structured Learning Platform with Analytics

A comprehensive learning platform featuring organized books with chapters, video lessons, user authentication, route protection, and real-time analytics tracking. Built with **Next.js 16.2.1**, **TypeScript**, **PostgreSQL**, and **Tailwind CSS**.

**GitHub:** [SumitKumar621/AcadHub](https://github.com/SumitKumar621/AcadHub)

---

## Features

✨ **Learning System**
- 📚 Organized books with multiple chapters
- 🎥 Video lessons with watch duration tracking
- 📝 Rich text content with markdown support
- 🎯 Action buttons (Mark Complete, Download Notes, Take Quiz, Ask Question, Bookmark)

🔐 **Authentication & Security**
- User registration and login
- JWT token-based authentication
- HttpOnly secure cookies
- Password hashing with PBKDF2
- Route protection middleware

📊 **Analytics Dashboard**
- Real-time user interaction tracking
- Button click analytics
- Video watch time metrics
- Content engagement scoring
- Interactive data tables with expandable rows

---

## Quick Start

```bash
# Clone repository
git clone https://github.com/SumitKumar621/AcadHub.git
cd AcadHub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your DATABASE_URL and GEMINI_API_KEY to .env.local

# Run database migrations
node migrations/run.js

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create `.env.local` in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/acadhub

# API Keys
GEMINI_API_KEY=your_gemini_api_key_here

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Environment
NODE_ENV=development
```

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/              # Authentication routes
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   ├── register/
│   │   │   ├── me/
│   │   │   └── profile/
│   │   └── analytics/         # Analytics tracking
│   │       ├── pageview/
│   │       ├── click/
│   │       ├── watch/
│   │       └── dashboard/
│   ├── login/                 # Login page
│   ├── dashboard/             # Main dashboard
│   ├── books/                 # Learning center
│   │   ├── page.tsx          # Books listing
│   │   ├── [bookId]/         # Chapter selection
│   │   │   └── [chapterId]/  # Chapter content
│   ├── analytics/             # Analytics dashboard
│   ├── profile/               # User profile
│   └── layout.tsx
├── components/                # Reusable components
│   ├── Sidebar.tsx
│   ├── Navbar.tsx
│   ├── VideoPlayer.tsx
│   ├── ActionButton.tsx
│   ├── QuizModal.tsx
│   ├── Askquestionmodal.tsx
│   ├── PageViewTracker.tsx
│   └── ...
├── lib/
│   ├── AuthContext.tsx        # Auth provider
│   ├── auth.ts                # JWT & password utils
│   ├── db.ts                  # Database connection
│   ├── content.ts             # Learning content data
│   ├── session.ts
│   └── ...
└── globals.css
├── middleware.ts              # Route protection
└── migrations/                # Database setup
```

---

## Database Schema

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics - Append-only event logs
CREATE TABLE page_views (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50),
  content_id VARCHAR(50),
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE video_watch_events (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50),
  video_id VARCHAR(50),
  content_id VARCHAR(50),
  watched_seconds INT,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE button_clicks (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50),
  button_label VARCHAR(100),
  content_id VARCHAR(50),
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pre-aggregated for fast dashboard reads
CREATE TABLE engagement_scores (
  content_id VARCHAR(50) PRIMARY KEY,
  button_clicks INT DEFAULT 0,
  watch_seconds INT DEFAULT 0,
  page_views INT DEFAULT 0,
  score FLOAT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/me              - Get current user
POST   /api/auth/logout          - Logout user
PUT    /api/auth/profile         - Update profile
```

### Analytics
```
POST   /api/analytics/pageview   - Track page view
POST   /api/analytics/click      - Track button click
POST   /api/analytics/watch      - Track video watch
GET    /api/analytics/dashboard  - Get analytics data
```

---

## Protected Routes

These routes require authentication:
- `/dashboard` - Main dashboard
- `/books` - Learning content
- `/books/[bookId]` - Book chapters
- `/books/[bookId]/[chapterId]` - Chapter content
- `/analytics` - Analytics dashboard
- `/profile` - User profile

Public routes:
- `/login` - Login page
- `/api/auth/*` - Auth endpoints

Middleware automatically redirects unauthorized users to `/login`.

---

## Authentication Flow

```
User Registration → Verify Email → Login
                                      ↓
                              JWT Token Generated
                              (HttpOnly Cookie)
                                      ↓
                              Access Protected Routes
                                      ↓
                              Middleware Validates Token
                                      ↓
                              Route Protection
                                      ↓
                              Logout (Clear Cookie)
```

---

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

---

## Deployment

### Deploy to Render
1. Push code to GitHub
2. Create new Web Service on [Render](https://render.com/)
3. Connect to your GitHub repository
4. Configure build and start commands:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Add environment variables in Render dashboard:
   - `DATABASE_URL`
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
   - `NODE_ENV=production`
6. Deploy (automatic on push)

### Deploy to Railway
1. Push code to GitHub
2. Connect Railway to repository
3. Add environment variables:
   - `DATABASE_URL`
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
4. Deploy

### Deploy to Other Platforms
#### Vercel
1. Connect GitHub repository
2. Add environment variables
3. Deploy (automatic on push)

#### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables

---

## Key Features Explained

### 🔐 Route Protection
- Server-side middleware checks JWT tokens
- Client-side auth guards prevent unauthorized access
- Automatic redirect to login for protected routes

### 📊 Analytics System
- Real-time event tracking
- Append-only database logs
- Pre-aggregated engagement scores
- Interactive dashboard with charts

### 🎓 Learning Content
- Structured books with chapters
- Video integration with tracking
- Rich text content
- Progress tracking

### 👤 User Management
- Secure registration
- Password hashing
- Profile updates
- Session management

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16.2.1, React 19, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, Node.js |
| Database | PostgreSQL |
| Authentication | JWT, bcrypt/PBKDF2 |
| Styling | CSS Modules, Tailwind CSS |
| Deployment | Railway, Vercel, Netlify |

---

## Performance Optimizations

- ⚡ Server-side rendering (SSR) for SEO
- 🎯 Static generation for content pages
- 🗜️ CSS modules for scoped styling
- 📦 Code splitting and lazy loading
- 🔄 Database query optimization
- 💾 Pre-aggregated analytics data

---

## Security Features

- 🔐 PBKDF2 password hashing
- 🛡️ JWT token authentication
- 🍪 HttpOnly cookies
- 🚫 CSRF protection via middleware
- ✔️ Input validation
- 🔒 Secure environment variables

---

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## Roadmap

- [ ] Quiz system with scoring
- [ ] Certificate generation
- [ ] Discussion forums
- [ ] Peer review system
- [ ] Progress tracking and streaks
- [ ] Mobile app
- [ ] AI-powered recommendations
- [ ] Social features
- [ ] Advanced analytics

---

## License

MIT License - see LICENSE file for details

---

## Support

For support, open an issue on GitHub or contact [support@acadhub.com](mailto:support@acadhub.com)

---

## Author

**Sumit Kumar**
- GitHub: [@SumitKumar621](https://github.com/SumitKumar621)
- Project: [AcadHub](https://github.com/SumitKumar621/AcadHub)

---

## Acknowledgments

- Next.js team
- PostgreSQL community
- All contributors
- Open source community

### Why this shape?

**Event tables are append-only.** Analytics events should never be updated — immutability lets you audit, replay, and backfill. Each row is a fact: something happened at a point in time.

**Aggregates are written eagerly.** The dashboard queries `click_counts_agg` and `engagement_scores` directly — both are `O(rows)` reads with no `GROUP BY`. The trade-off is a slightly heavier write path (two upserts per event inside a transaction), but this is negligible at any realistic event rate and completely avoids expensive read-time aggregation.

Without this, a `COUNT(*) GROUP BY content_id, button_label` on `button_clicks` scans the full event table on every dashboard load — fine at 10k rows, painful at 10M.

---

## Architecture

```
Browser
  │
  ├── /books/[bookId]/[chapterId]   → Server Component (SSR)
  │     ├── VideoPlayer              → Client Component (tracks watch time)
  │     ├── ActionButton             → Client Component (tracks clicks)
  │     └── PageViewTracker          → Client Component (fires on mount)
  │
  └── /analytics                    → Server Component (ISR, revalidates every 30s)

API Routes (Next.js)
  POST /api/analytics/click          → insert event + upsert aggregate
  POST /api/analytics/watch          → insert event + upsert score
  POST /api/analytics/pageview       → insert event + upsert score
  GET  /api/analytics/dashboard      → read aggregates (used by external consumers)

PostgreSQL (via pg Pool, singleton)
```

### Key decisions

**Next.js App Router with ISR on the dashboard.**  
The analytics page is a server component that reads directly from PostgreSQL. It uses `revalidate = 30`, meaning Next.js caches the rendered page and rebuilds it in the background every 30 seconds. This gives dashboard viewers near-real-time data without a database query on every page load.

**Single pg Pool, declared as a global.**  
Next.js hot-reloads modules in development, which would create a new connection pool on every change. Declaring the pool on `global` prevents pool exhaustion during development while still using the singleton pattern in production.

**Transactions on writes.**  
Each analytics event write uses a transaction: the raw event row and the aggregate upsert succeed or fail together. This keeps the aggregate table consistent with the event log at all times.

**`navigator.sendBeacon` for video unmount.**  
When a user navigates away while a video is playing, the component's cleanup fires `navigator.sendBeacon` — a non-blocking fire-and-forget HTTP POST that survives page unloads. A regular `fetch` in a `useEffect` cleanup is unreliable on navigation.

**Minimum watch threshold (3 seconds).**  
Watch events shorter than 3 seconds are discarded at the API layer. This filters accidental clicks and ensures `avg_seconds` reflects genuine engagement rather than noise.

---

## Analytics: Three Metrics

### A — Button Click Tracking
Fields: `user_id`, `button_label`, `content_id`, `clicked_at`  
Dashboard shows: click counts grouped by content page and button label, with relative activity bars.

### B — Video Watch Time
Fields: `user_id`, `video_id`, `content_id`, `watched_seconds`, `recorded_at`  
One row per watch session (play → pause or navigate away). Dashboard shows total and average watch time per video.

### C — Content Engagement Score (custom)
**Business question it answers:** *Which content pages are actually driving learning, not just being opened?*

Page views alone don't distinguish a learner who read every word and completed the quiz from one who bounced after two seconds. The engagement score is a composite:

| Signal | Points |
|--------|--------|
| Page view | +5 |
| Button click | +10 |
| Second of video watched | +0.5 |

This weights active signals (clicking, watching) more heavily than passive ones (visiting). A page with 10 views but zero clicks and zero watch time scores 50. A page with 5 views, 3 quiz attempts, and 60 seconds of video scores 5×5 + 3×10 + 60×0.5 = 85. The score is maintained in a denormalised `engagement_scores` table, updated on every event write.

---

## Performance decisions

- **Indexed event tables:** `(content_id, button_label)` on `button_clicks` and `video_id` on `video_watch_events` support any future per-content or per-video drill-down queries.
- **Aggregates avoid GROUP BY at read time:** `click_counts_agg` is the primary dashboard source for clicks — no scan of the raw event table.
- **ISR caches the dashboard page:** `revalidate = 30` means a burst of dashboard visitors hits the CDN cache, not the database.
- **Connection pooling:** `pg.Pool` with `max: 10` handles concurrent requests without exhausting database connections.
- **At scale:** The next step would be a job queue (e.g. BullMQ) to buffer high-frequency events in Redis and flush to PostgreSQL in batches, decoupling write latency from HTTP response time.

---

## Deployment

**Recommended: Vercel (frontend) + Railway (PostgreSQL)**

1. Push to GitHub
3. Create a PostgreSQL database on [railway.app](https://railway.app)
4. Add `DATABASE_URL` to Vercel environment variables
5. Run `npm run db:migrate` once against your production database

---

## Collaborator

`kartik150704` has been added as a GitHub collaborator.
