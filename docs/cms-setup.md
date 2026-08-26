# CMS setup (developer, one time)

The content editor lives at `/admin` (Decap CMS). It reads/writes the JSON files
in `src/content/` and, because `publish_mode: editorial_workflow` is set, every
edit Laura saves opens a **pull request** on `cyberdreadx/divine_emergence` that
you review and merge. Merging triggers the normal auto-deploy.

Everything is already committed except one thing GitHub requires: an OAuth
handshake so the browser-based editor can authenticate against GitHub. Do this
once.

## 1. Create a GitHub OAuth App
- GitHub → Settings → **Developer settings** → **OAuth Apps** → **New OAuth App**
- Application name: `Divine Emergence CMS`
- Homepage URL: `https://divineemergence.org`
- Authorization callback URL: `https://<your-oauth-proxy-domain>/callback`
  (you'll get this domain in step 2)
- Save the **Client ID** and generate a **Client Secret**.

## 2. Deploy the tiny OAuth proxy (host-agnostic — works on Netlify or Vercel)
Recommended: the Cloudflare Worker `decap-proxy` (free, ~5 min, independent of
where the site is hosted).
- Repo: https://github.com/sterlingwes/decap-proxy (or Netlify's official
  `netlify-cms-github-oauth-provider` if you'd rather host on Netlify Functions)
- Set its env vars to the Client ID / Secret from step 1.
- Note the deployed domain, and set the OAuth App callback (step 1) to
  `https://<that-domain>/callback`.

## 3. Point the editor at the proxy
In `public/admin/config.yml`, add `base_url` (and `auth_endpoint` if the proxy
docs specify one) under `backend`:

```yaml
backend:
  name: github
  repo: cyberdreadx/divine_emergence
  branch: main
  base_url: https://<your-oauth-proxy-domain>
```

Commit and deploy.

## 4. Give Laura access
- Invite her GitHub account as a **collaborator** with write access
  (Settings → Collaborators). She needs a free GitHub account; the editor logs
  her in through it. She never sees code — only the `/admin` form fields.

## Testing locally without any of the above
`config.yml` has `local_backend: true`, so you can preview the editor UI without
OAuth:
```bash
npx decap-server         # in one terminal
npm run dev              # in another; open http://localhost:8080/admin  (Vite port)
```
This reads/writes your local files directly — handy for confirming fields look
right before wiring production auth.

## Adding more sections later
1. Extract the copy from the component into a `src/content/<name>.json` file and
   have the component import it (see `Hero.tsx` / `hero.json` for the pattern).
2. Add a matching `file` block under the `homepage` collection in `config.yml`
   with friendly field labels.
That's the whole loop. Currently wired: hero, story, breathwork, retreat,
mission, connect. Not yet wired: Navbar, Offerings (data in
`src/lib/offerings.tsx`), Reviews, Footer links, and the standalone detail pages.
```
