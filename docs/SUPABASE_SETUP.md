# Shared enquiries (Supabase)

Visitors submit enquiries from the live site; you see them in **Admin → Enquiries** from any browser, with new rows appearing in near real time.

When Supabase env vars are set, **catalog, banners, and contact** load from `site_content` (not the browser). Admin saves go to Supabase; all devices see the same site.

## 1. Create a Supabase project

1. [supabase.com](https://supabase.com) → New project (free tier is enough).
2. **Project Settings → API** → copy **Project URL** and **anon public** key.

## 2. Create database tables

**SQL Editor** → run both scripts from this repo:

1. `supabase/enquiries.sql`
2. `supabase/site_content.sql` (products, categories, banners — shared for all visitors)

If `alter publication` errors because the table is already in realtime, ignore it and enable **Database → Replication** for `enquiries` if needed.

## 3. Create an admin user

**Authentication → Users → Add user** → email + password (this is what you use at `/iamadmin` when cloud is enabled).

## 4. Environment variables

Local (copy `.env.example` to `.env`):

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

**Cloudflare Pages** → your project → **Settings → Environment variables** → same names for Production (and Preview if you want).

Redeploy after adding variables.

## 5. Login behaviour

| Supabase configured? | `/iamadmin` login |
|---------------------|-------------------|
| No | `root` / `root` (local enquiries only) |
| Yes | Supabase admin **email** + **password** |

## Security note

The anon key is public in the browser; **Row Level Security** in `enquiries.sql` only allows inserts for everyone and **reads for signed-in users**. Do not disable RLS.
