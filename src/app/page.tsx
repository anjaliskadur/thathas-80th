import Link from "next/link";
import { PhotoWall } from "@/components/marquee/photo-wall";
import { WelcomeCard } from "@/components/hero/welcome-card";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LinkButton } from "@/components/ui/button";
import { getPhotoWallImages } from "@/lib/get-photo-wall-images";
import { getSiteConfig } from "@/lib/get-site-config";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [wallImages, config] = await Promise.all([
    Promise.resolve(getPhotoWallImages()),
    getSiteConfig(),
  ]);

  return (
    <>
      <SiteHeader />

      <section className="relative min-h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
          <PhotoWall images={wallImages} />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_10%,var(--color-ink)_78%)]"
        />
        <div aria-hidden className="absolute inset-0 z-[1] bg-[var(--color-ink)]/20" />

        <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center gap-6 py-24">
          <WelcomeCard config={config} />
          <p className="max-w-md px-6 text-center text-sm text-[var(--color-stone)]">
            A few memories from over the years —{" "}
            <Link
              href="/photos"
              className="text-[var(--color-gold-soft)] underline-offset-4 hover:underline"
            >
              browse them all
            </Link>
            .
          </p>
        </div>
      </section>

      <section id="details" className="mx-auto max-w-3xl px-6 py-20 text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-[var(--color-stone)]">
          The details
        </span>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--color-gold-soft)]">
          When &amp; where
        </h2>

        <div className="mx-auto mt-10 grid gap-8 sm:grid-cols-2">
          <div className="hairline rounded-xl px-6 py-8">
            <p className="text-xs uppercase tracking-widest text-[var(--color-stone)]">
              Date &amp; time
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--color-ivory)]">
              {config.eventDateLabel}
            </p>
            <p className="text-[var(--color-stone)]">{config.eventTimeLabel}</p>
          </div>
          <div className="hairline rounded-xl px-6 py-8">
            <p className="text-xs uppercase tracking-widest text-[var(--color-stone)]">Venue</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--color-ivory)]">
              {config.venueName}
            </p>
            <p className="text-[var(--color-stone)]">{config.venueAddress}</p>
          </div>
        </div>

        <p className="mt-10 text-sm text-[var(--color-stone)]">
          Kindly RSVP by {config.rsvpDeadlineLabel}.
        </p>
        <LinkButton href="/rsvp" className="mt-6">
          RSVP now
        </LinkButton>
      </section>

      <section
        id="photos"
        className="border-t border-[var(--color-gold-dim)]/40 bg-[var(--color-ink-raised)]"
      >
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <span className="text-xs uppercase tracking-[0.35em] text-[var(--color-stone)]">
            Over the years
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--color-gold-soft)]">
            Photo gallery
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--color-stone)]">
            The wall behind the invitation is just a glimpse. Open the full gallery to browse
            every photo.
          </p>
          <LinkButton href="/photos" variant="outline" className="mt-8">
            See all photos
          </LinkButton>
        </div>
      </section>

      <section className="border-t border-[var(--color-gold-dim)]/40">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <span className="text-xs uppercase tracking-[0.35em] text-[var(--color-stone)]">
            Can&apos;t make it in person, or want to share a note?
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--color-gold-soft)]">
            Leave {config.honoreeShortName} a memory
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--color-stone)]">
            Share a photo, a video, or just a few words. Every message becomes part of a
            keepsake wall {config.honoreeShortName} can revisit long after the party ends.
          </p>
          <LinkButton href="/memory-wall" variant="outline" className="mt-8">
            Open the Memory Wall
          </LinkButton>
        </div>
      </section>

      <SiteFooter />

      <Link href="#details" className="sr-only">
        Skip photo wall
      </Link>
    </>
  );
}
