# PWRI Plant Monitoring — v2.0

Full-stack water treatment plant monitoring app.

**Frontend:** React + Vite + Tailwind + Supabase
**Backend:** Vercel Serverless Python Functions + MongoDB Atlas
**Auth:** Supabase Auth with Row-Level Security

---

## Deploy to Vercel (5 minutes)

### 1. Set up Supabase
- Create project at https://app.supabase.com
- Run all SQL from supabase/migrations/ via the SQL Editor
- Copy Project URL + Anon Key from Settings → API

### 2. Set up MongoDB Atlas (free tier)
- Create cluster at https://cloud.mongodb.com
- Create database `pwri` and a readWrite user
- Copy the connection string

### 3. Deploy
```bash
npm install -g vercel
vercel login
vercel --prod
```

Or connect your GitHub repo in the Vercel dashboard with:
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/dist`
- Root Directory: `.`

### 4. Add Environment Variables in Vercel

| Variable | Description |
|---|---|
| VITE_SUPABASE_URL | https://xxx.supabase.co |
| VITE_SUPABASE_PUBLISHABLE_KEY | Supabase anon key |
| SUPABASE_URL | Same as above |
| SUPABASE_ANON_KEY | Same as above |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role key |
| OPENAI_API_KEY | sk-... |
| OPENAI_MODEL | gpt-4o-mini |
| MONGODB_URI | mongodb+srv://... |
| MONGO_DB_NAME | pwri |
| CRON_SECRET | Any 32+ char random string |

---

## Local Development

```bash
cd frontend && npm install
cp ../.env.example ../.env.local
# Edit .env.local with your credentials

# Option A: Vercel CLI (API functions run locally)
vercel dev

# Option B: Frontend only (point at production API)
VITE_API_URL=https://your-app.vercel.app npm run dev
```

---

## What Changed in v2.0

### Vercel-Native Backend (api/ directory)
- Python serverless functions replace the old FastAPI server
- No separate hosting needed
- emergentintegrations replaced with direct OpenAI API calls
- PyMongo (sync) used instead of Motor for Vercel compatibility

### Frontend Improvements
- src/lib/api.ts — fully typed API client with retry + abort support
- Dark mode via next-themes (ThemeProvider + ThemeToggle)
- Live AlertsFeed component auto-refreshes every 60 seconds
- React Query DevTools in development
- Zod downgraded to v3 (hookform compatibility)
- lovable-tagger removed (Replit-only dep)

### Bug Fixes
- Supabase placeholder URL no longer silently fails
- AuthProvider race condition fixed
- XLSX parse endpoint handles empty files correctly
- Compliance thresholds correctly fall back to global scope
