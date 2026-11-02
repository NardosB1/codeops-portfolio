# DEPLOY.md — Vercel, and how to verify the live site

## 1. Before you push

```bash
npm install                 # creates package-lock.json: commit it
cp .env.example .env.local  # set SESSION_SECRET
npm run build               # must finish with no errors
npm run start               # click through once on http://localhost:3000
```

`.env.local` is git-ignored. Only `.env.example` is committed.

## 2. Push to its own repository

Addis Eats is one of your two submission repositories, so it gets its own repo (not a folder inside the course repo).

```bash
git init
git add .
git commit -m "Addis Eats"
git branch -M main
git remote add origin https://github.com/<you>/addis-eats.git
git push -u origin main
```

## 3. Import into Vercel

1. vercel.com → **Add New… → Project** → import the repository.
2. Framework preset: **Next.js** (detected automatically). Leave build and output settings alone.
3. **Environment Variables:** add `SESSION_SECRET` (a fresh value from the generator in the README) for **Production, Preview and Development**.
4. **Deploy.**
5. If you attach a custom domain, also add `NEXT_PUBLIC_SITE_URL=https://your.domain` and redeploy, so canonical links and the sitemap use it.

If you ever change `SESSION_SECRET`, every signed-in person is signed out. That is expected.

## 4. Verify the live site (Step 7)

Replace `YOUR-URL` with the deployed address. On Windows PowerShell use `curl.exe`, not `curl`.

**Security headers**
```bash
curl -sI https://YOUR-URL/ | grep -i -E "x-frame-options|x-content-type-options|referrer-policy|strict-transport|permissions-policy"
```
- [ ] All five headers appear. `x-powered-by` does **not**.

**Metadata in the real HTML (not the DOM)**
```bash
curl -s https://YOUR-URL/menu/kitfo | grep -o -E '<title>[^<]*</title>|<link rel="canonical"[^>]*>|<meta property="og:[a-z:]*" content="[^"]*"'
```
- [ ] Title is `Kitfo · Addis Eats`, canonical ends in `/menu/kitfo`, `og:title` and `og:image` are present and absolute (start with `https://`).

**Crawler files**
```bash
curl -s https://YOUR-URL/robots.txt
curl -s https://YOUR-URL/sitemap.xml | head -20
```
- [ ] `robots.txt` disallows `/api/`, `/orders`, `/checkout`, `/kitchen`, `/signin` and lists the sitemap.
- [ ] `sitemap.xml` lists `/`, `/menu` and 12 dish pages, and no private routes.

**Social card:** open `https://YOUR-URL/opengraph-image` and `https://YOUR-URL/menu/kitfo/opengraph-image` in a browser. Both show an image.

**Cookie flags:** sign in on the live site, DevTools → Application → Cookies → `session`.
- [ ] HttpOnly ✓, Secure ✓, SameSite Lax, Path `/`, expires in about 7 days. Screenshot into `AUTH.md` §4.

**Three layers, live**
- [ ] Private window → `/orders` redirects to `/signin?next=%2Forders`.
- [ ] Signed in as Almaz, `/kitchen` shows the 404 page. As Selam it shows the kitchen.
- [ ] `curl -i -X POST https://YOUR-URL/api/orders -H "Content-Type: application/json" -d "{}"` returns **401**.

**Build markers:** the route table in the Vercel build log must match `STRATEGY.md` (○ for `/`, `/menu`, `/cart`; ● for `/menu/[id]`; ƒ for the private routes).

**Performance:** run `PERF.md` §2 against `/menu` on this URL, and fill the Before column.

## 5. If something fails

| Symptom | Likely cause |
|---|---|
| Every private page shows a 500 | `SESSION_SECRET` missing or shorter than 32 characters in Vercel. Add it and redeploy. |
| Sign-in appears to work, then you are signed out | Cookie not saved: check the `Secure` flag is only set on HTTPS and that you are not on an `http://` preview URL. |
| An order you just placed shows 404 on its page | Another serverless instance answered. This is the in-memory store limitation in `FUTURE.md`, not a bug in the routes. |
| Canonical or sitemap URLs show `localhost` | `NEXT_PUBLIC_SITE_URL` is set wrongly, or you are viewing a build made without Vercel's system variables. |
