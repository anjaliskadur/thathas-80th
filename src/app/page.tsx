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
          className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-ink)_72%)] sm:bg-[radial-gradient(ellipse_at_center,transparent_10%,var(--color-ink)_78%)]"
        />
        <div aria-hidden className="absolute inset-0 z-[1] bg-[var(--color-ink)]/35 sm:bg-[var(--color-ink)]/20" />

        <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center gap-5 px-0 py-20 sm:gap-6 sm:py-24">
          <WelcomeCard config={config} />
          <p className="max-w-md px-5 text-center text-sm text-[var(--color-stone)] sm:px-6">
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

      <section id="details" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-14 text-center sm:px-6 sm:py-20">
        <span className="text-xs uppercase tracking-[0.35em] text-[var(--color-stone)]">
          The details
        </span>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--color-gold-soft)] sm:mt-4 sm:text-3xl">
          When &amp; where
        </h2>

        <div className="mx-auto mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-8">
          <div className="hairline rounded-xl px-5 py-6 sm:px-6 sm:py-8">
            <p className="text-xs uppercase tracking-widest text-[var(--color-stone)]">
              Date &amp; time
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-lg text-[var(--color-ivory)] sm:text-xl">
              {config.eventDateLabel}
            </p>
            <p className="text-[var(--color-stone)]">{config.eventTimeLabel}</p>
          </div>
          <div className="hairline rounded-xl px-5 py-6 sm:px-6 sm:py-8">
            <p className="text-xs uppercase tracking-widest text-[var(--color-stone)]">Venue</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-lg text-[var(--color-ivory)] sm:text-xl">
              {config.venueName}
            </p>
            <p className="text-[var(--color-stone)]">{config.venueAddress}</p>
          </div>
        </div>

        <p className="mt-8 text-sm text-[var(--color-stone)] sm:mt-10">
          Kindly RSVP by {config.rsvpDeadlineLabel}.
        </p>
        <LinkButton href="/rsvp" className="mt-5 w-full max-w-xs sm:mt-6 sm:w-auto">
          RSVP now
        </LinkButton>
      </section>

      <section
        id="photos"
        className="scroll-mt-20 border-t border-[var(--color-gold-dim)]/40 bg-[var(--color-ink-raised)]"
      >
        <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-6 sm:py-20">
          <span className="text-xs uppercase tracking-[0.35em] text-[var(--color-stone)]">
            Over the years
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--color-gold-soft)] sm:mt-4 sm:text-3xl">
            Photo gallery
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-stone)] sm:mt-4 sm:text-base">
            The wall behind the invitation is just a glimpse. Open the full gallery to browse
            every photo.
          </p>
          <LinkButton href="/photos" variant="outline" className="mt-7 w-full max-w-xs sm:mt-8 sm:w-auto">
            See all photos
          </LinkButton>
        </div>
      </section>

      <section className="border-t border-[var(--color-gold-dim)]/40">
        <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-6 sm:py-20">
          <span className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--color-stone)] sm:text-xs sm:tracking-[0.35em]">
            Can&apos;t make it in person, or want to share a note?
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--color-gold-soft)] sm:mt-4 sm:text-3xl">
            Leave {config.honoreeShortName} a memory
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-stone)] sm:mt-4 sm:text-base">
            Share a photo, a video, or just a few words. Every message becomes part of a
            keepsake wall {config.honoreeShortName} can revisit long after the party ends.
          </p>
          <LinkButton href="/memory-wall" variant="outline" className="mt-7 w-full max-w-xs sm:mt-8 sm:w-auto">
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
