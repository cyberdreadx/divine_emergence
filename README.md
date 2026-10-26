# Divine Emergence

Marketing site for Divine Emergence — Laura's psychospiritual practice in South
Florida offering breathwork, private coaching, psychedelic-assisted support, and
immersive retreats.

Built with Vite, React, TypeScript, Tailwind CSS, and shadcn/ui. Site content
(offerings, retreat, events) lives in `src/lib/`, so copy can be edited in one
place. Bookings route to GoHighLevel; the newsletter posts to a GoHighLevel
webhook configured in `src/lib/site.ts`.

## Local development

```sh
npm install
npm run dev      # start the dev server on http://localhost:8080
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run test     # run unit tests (vitest)
```

## Project layout

- `src/pages/` — routed pages (home, offering detail, events, ebook)
- `src/components/` — homepage sections and shared UI
- `src/lib/offerings.tsx` — all offering + retreat content
- `src/lib/events.ts` — upcoming events list
- `src/lib/site.ts` — brand constants, booking + newsletter endpoints
- `public/` — static assets (favicons, offering images, OG image)

## Link previews (social sharing)

Each page has its own share title, description and image, so a shared link
previews the page it points to. Settings live in `scripts/share-pages.mjs`;
`npm run build` bakes them into each page's HTML. After changing a photo or
card wording, regenerate the cards with `node scripts/make-share-images.mjs`
and commit `public/share/`.
