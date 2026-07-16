import Link from "next/link";
import { PhotoWall } from "@/components/marquee/photo-wall";
import { WelcomeCard } from "@/components/hero/welcome-card";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LinkButton } from "@/components/ui/button";
import { getPhotoWallImages } from "@/lib/photo-wall";
import { siteConfig } from "@/lib/site-config";

export default function HomePage() {
  const wallImages = getPhotoWallImages();

  return (
    <>
      <SiteHeader />

      <section className="relative min-h-[100svh] overflow-hidden">
        {/* Full-bleed alternating polaroid columns sit behind the welcome card */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <PhotoWall images={wallImages} />
        </div>
        {/* Soft vignette — keeps the card readable without hiding the wall */}
        <div
          aria-hidden
          className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_10%,var(--color-ink)_78%)]"
        />
        <div aria-hidden className="absolute inset-0 z-[1] bg-[var(--color-ink)]/20" />

        <div className="relative z-10 flex min-h-[100svh] items-center justify-center py-24">
          <WelcomeCard />
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
            <p className="text-xs uppercase tracking-widest text-[var(--color-stone)]">Date &amp; time</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--color-ivory)]">
              {siteConfig.eventDateLabel}
            </p>
            <p className="text-[var(--color-stone)]">{siteConfig.eventTimeLabel}</p>
          </div>
          <div className="hairline rounded-xl px-6 py-8">
            <p className="text-xs uppercase tracking-widest text-[var(--color-stone)]">Venue</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--color-ivory)]">
              {siteConfig.venueName}
            </p>
            <p className="text-[var(--color-stone)]">{siteConfig.venueAddress}</p>
          </div>
        </div>

        <p className="mt-10 text-sm text-[var(--color-stone)]">
          Kindly RSVP by {siteConfig.rsvpDeadlineLabel}.
        </p>
        <LinkButton href="/rsvp" className="mt-6">
          RSVP now
        </LinkButton>
      </section>

      <section className="border-t border-[var(--color-gold-dim)]/40 bg-[var(--color-ink-raised)]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <span className="text-xs uppercase tracking-[0.35em] text-[var(--color-stone)]">
            Can&apos;t make it in person, or want to share a note?
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--color-gold-soft)]">
            Leave {siteConfig.honoreeShortName} a memory
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--color-stone)]">
            Share a photo, a video, or just a few words. Every message becomes part of a
            keepsake wall {siteConfig.honoreeShortName} can revisit long after the party ends.
          </p>
          <LinkButton href="/memory-wall" variant="outline" className="mt-8">
            Open the Memory Wall
          </LinkButton>
        </div>
      </section>

      <SiteFooter />

      {/* Skip link target for keyboard users bypassing the marquee */}
      <Link href="#details" className="sr-only">
        Skip photo wall
      </Link>
    </>
  );
}
