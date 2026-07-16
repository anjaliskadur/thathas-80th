# Thatha's 80th — Damodar Kadambi's 80th Birthday Website

A single site for the family to RSVP guests and collect photos, videos, and
messages for Damodar Kadambi's 80th birthday, before and during the event.

## Tech stack (and why)

| Piece | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 (App Router) + TypeScript** | Deploys natively on Vercel, server + API routes in one project. |
| Styling | **Tailwind CSS v4** | Fast to build a consistent, distinctive design system with. |
| Database | **Vercel Postgres (Neon)** via **Prisma** | Relational, generous free tier, scales automatically, first-class Vercel integration, zero server to manage. |
| File storage | **Vercel Blob** | Built for exactly this: guests uploading photos/videos directly from the browser straight to storage (not through your server), which matters once videos start coming in. Public CDN URLs out of the box. |
| Animation | CSS keyframes for the photo wall (no JS scroll cost); Framer Motion available for anything else | Buttery on mobile, which is where most guests will be. |

**Why not just images/JSON files?** RSVPs and memory-wall posts need to be
editable/deletable per-submission and queried live — a real database is the
right tool. Vercel Blob is used only for the large binary files (photos/
videos); everything else (names, messages, RSVP status) lives in Postgres.

## Project structure

```
src/
  app/
    page.tsx                 # Homepage: photo wall + welcome card + details
    rsvp/page.tsx             # RSVP page
    memory-wall/page.tsx      # Memory wall page
    api/
      rsvp/route.ts           # POST create RSVP
      memories/route.ts       # GET list / POST create memory
      memories/[id]/route.ts  # PATCH edit / DELETE, gated by edit token
      upload/route.ts         # Authorizes direct-to-Blob uploads
  components/
    marquee/                  # The vertical alternating photo wall
    hero/                     # Center welcome card
    memory-wall/              # Upload form, grid, card (with edit/delete)
    rsvp/                     # RSVP form
    layout/                   # Header/footer
    ui/                       # Button, input, textarea, field wrapper
  lib/
    site-config.ts            # <-- edit event name/date/venue/copy here
    photo-wall.ts             # Photo list + column-splitting logic
    prisma.ts                 # DB client singleton
    edit-token.ts             # No-login edit-token generation/verification
    memory-tokens.ts          # Browser-side storage of a guest's own tokens
    validation.ts             # Zod schemas shared by forms + API routes
  types/index.ts
prisma/schema.prisma          # Rsvp + Memory models
public/photos/                # Photo wall images (placeholders included)
scripts/generate-placeholder-photos.mjs
```

## How editing/deleting memory wall posts works (no login required)

There are no user accounts. When someone submits a memory, the API generates
a random **edit token**, returns it once in the response, and the browser
saves it to `localStorage`. Only the database's **hash** of that token is
stored server-side. A memory only shows Edit/Delete buttons in a browser
that holds the matching token — which in practice means "the browser that
created it." This is intentionally lightweight for a family event site; see
"Admin moderation" below for a family-wide override.

### Admin moderation

Set `ADMIN_PASSCODE` in your environment. Any request to
`PATCH /api/memories/:id` or `DELETE /api/memories/:id` with header
`x-admin-passcode: <that value>` can edit/delete **any** entry — useful if
something inappropriate gets posted and the original poster's browser isn't
available. Example:

```bash
curl -X DELETE https://your-site.vercel.app/api/memories/MEMORY_ID \
  -H "x-admin-passcode: your-admin-passcode"
```

## Local setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a Postgres database**
   - In the Vercel dashboard: your project → **Storage** → **Create Database** → **Postgres**.
   - Once connected, Vercel exposes `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` — pull them locally:
     ```bash
     npx vercel link
     npx vercel env pull .env
     ```

3. **Create Blob storage**
   - Same **Storage** tab → **Create Database** → **Blob**. This adds `BLOB_READ_WRITE_TOKEN` to your env automatically (also pulled by the command above).

4. **Push the schema to your database**
   ```bash
   npm run db:push
   ```

5. **Run the dev server**
   ```bash
   npm run dev
   ```

## Deploying to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In Vercel: **New Project** → import the repo.
3. Attach the Postgres and Blob storage you created above to the project (Storage tab → Connect).
4. Add `ADMIN_PASSCODE` and `NEXT_PUBLIC_SITE_URL` (your production URL) as environment variables.
5. Deploy. `npm run build` runs `prisma generate` automatically first.
6. After the first deploy, run `npx prisma db push` once (locally, pointed at prod, or via a Vercel deploy hook) to create the tables in the production database.

## Customizing

- **Event details, names, copy:** edit `src/lib/site-config.ts` — every page pulls from this one file.
- **Real photos for the wall:** drop images into `public/photos/`, then update the file list in `src/lib/photo-wall.ts`. Portrait and landscape both work; mix freely. Remove the placeholder `memory-XX.svg` entries once you have real photos. Re-run `npm run generate:placeholders` any time you want to regenerate the placeholder set.
- **Number of marquee columns / speed:** `src/components/marquee/photo-wall.tsx` (`columnCount` prop) and `buildColumns()` in `src/lib/photo-wall.ts` (`baseDuration`).
- **Colors:** CSS variables at the top of `src/app/globals.css` (`--color-ink`, `--color-gold`, etc).
- **Upload size limits:** `MAX_IMAGE_BYTES` / `MAX_VIDEO_BYTES` in `src/app/api/upload/route.ts` and `src/components/memory-wall/memory-upload-form.tsx` (keep both in sync).

## Notes

- The photo wall currently uses generated placeholder cards (gold line-art on black) so the layout can be previewed immediately — see "Customizing" above to swap in real family photos.
- Mobile is treated as the primary experience throughout: single-column forms, large tap targets, and the marquee/hero are tuned for narrow viewports first.
- `prefers-reduced-motion` disables the marquee scroll for guests who have that OS setting on.
