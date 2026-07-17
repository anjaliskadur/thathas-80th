import { LinkButton } from "@/components/ui/button";
import type { SiteConfig } from "@/lib/site-config";

export function WelcomeCard({ config }: { config: SiteConfig }) {
  return (
    <div className="relative mx-3 w-full max-w-xl rounded-2xl border border-[var(--color-gold-dim)] bg-[color-mix(in_srgb,var(--color-ink)_88%,transparent)] px-5 py-8 text-center shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-md sm:mx-4 sm:bg-[color-mix(in_srgb,var(--color-ink)_78%,transparent)] sm:px-12 sm:py-14">
      <span className="text-[0.65rem] uppercase tracking-[0.28em] text-[var(--color-stone)] sm:text-xs sm:tracking-[0.35em]">
        You&apos;re invited to celebrate
      </span>

      <h1 className="mt-3 font-[family-name:var(--font-display)] text-[2.15rem] leading-[1.15] text-[var(--color-gold-soft)] text-balance sm:mt-4 sm:text-5xl sm:leading-tight">
        {config.honoreeName}
      </h1>

      <p className="mt-2 font-[family-name:var(--font-display)] text-lg italic text-[var(--color-ivory)] sm:text-2xl">
        {config.eventTitle}
      </p>

      <div className="mx-auto mt-5 h-px w-16 bg-[var(--color-gold-dim)] sm:mt-6" />

      <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-[var(--color-stone)] sm:mt-6 sm:text-base">
        {config.hostingNote}
      </p>

      <dl className="mt-5 grid grid-cols-1 gap-1 text-sm text-[var(--color-ivory)] sm:mt-6 sm:text-base">
        <div>
          <dt className="sr-only">Date</dt>
          <dd>
            {config.eventDateLabel} · {config.eventTimeLabel}
          </dd>
        </div>
        <div>
          <dt className="sr-only">Venue</dt>
          <dd className="text-[var(--color-stone)]">{config.venueName}</dd>
        </div>
      </dl>

      <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-9 sm:flex-row sm:items-center">
        <LinkButton href="/rsvp" variant="solid" className="w-full sm:w-auto">
          RSVP
        </LinkButton>
        <LinkButton href="/memory-wall" variant="outline" className="w-full sm:w-auto">
          Visit the Memory Wall
        </LinkButton>
      </div>
    </div>
  );
}
