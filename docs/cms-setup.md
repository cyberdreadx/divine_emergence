# CMS setup (developer, one time)

The content editor lives at `/admin` (Decap CMS). It reads/writes the JSON files
in `src/content/` and, because `publish_mode: editorial_workflow` is set, every
edit Laura saves opens a **pull request** on `cyberdreadx/divine_emergence` that
you review and merge. Merging triggers the normal Netlify auto-deploy.

The site is hosted on **Netlify**, so Netlify runs the GitHub OAuth handshake for
us — no separate proxy/worker needed. (An external OAuth proxy is only required
for non-Netlify hosts.) Do this once:

## 1. Create a GitHub OAuth App  (~3 min)
- GitHub → your avatar → **Settings** → **Developer settings** → **OAuth Apps**
  → **New OAuth App**
- Application name: `Divine Emergence CMS`
- Homepage URL: `https://divineemergence.org`
- Authorization callback URL: `https://api.netlify.com/auth/done`
- **Register application** → copy the **Client ID** → **Generate a new client
  secret** → copy the secret.

## 2. Install the provider in Netlify  (~2 min)
- Netlify dashboard → the site that deploys this repo → **Site configuration** →
  **Access & security** → **OAuth** (a.k.a. "Authentication providers") →
  **Install provider** → **GitHub**
- Paste the **Client ID** and **Client Secret** from step 1 → **Save**.
- (Netlify occasionally moves this; if it's not under the site, search "OAuth" in
  site settings or check Team settings.)

## 3. config.yml  (already done — no change needed)
`public/admin/config.yml` already has the correct backend. Netlify's facilitation
means **no `base_url` is required**:
```yaml
backend:
  name: github
  repo: cyberdreadx/divine_emergence
  branch: main
```

## 4. Give Laura access  (~1 min)
- Repo → **Settings** → **Collaborators** → add Laura's GitHub username with
  **Write** access. She needs a free GitHub account; the editor logs her in
  through it. She never sees code — only the `/admin` form fields.

## 5. Test it
After this branch is merged and Netlify redeploys:
- Go to `https://divineemergence.org/admin` → **Login with GitHub** → authorize.
- You should see the **Homepage** collection. Make a small edit → **Save** →
  confirm it shows up as a pull request on the repo.

### Prerequisite to double-check
The Netlify site serving `divineemergence.org` must be the one connected to this
repo. In Netlify → that site → **Deploys**, you should see commits from
`cyberdreadx/divine_emergence`. If the domain currently points at a different or
older deploy, `/admin` won't appear until this repo is what deploys to it.

## Testing the editor locally without any OAuth
`config.yml` has `local_backend: true`:
```bash
npx decap-server        # terminal 1
npm run dev             # terminal 2, then open http://localhost:8080/admin
```
This reads/writes your local files directly — handy for confirming fields look
right before wiring production auth.

## Adding more sections later
1. Extract the copy from the component into a `src/content/<name>.json` file and
   have the component import it (see `Hero.tsx` / `hero.json` for the pattern).
   Route prose through `renderRichText` so `**gold**` / `*bright*` accents work.
2. Add a matching `file` block under the `homepage` collection in `config.yml`
   with friendly field labels.
Currently wired: hero, story, breathwork, retreat, mission, connect. Not yet
wired: Navbar, Offerings (`src/lib/offerings.tsx`), Reviews, Footer links, and
the standalone detail pages.
