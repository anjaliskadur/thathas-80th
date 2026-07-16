import { LinkButton } from "@/components/ui/button";
import type { SiteConfig } from "@/lib/site-config";

export function WelcomeCard({ config }: { config: SiteConfig }) {
  return (
    <div className="relative mx-4 w-full max-w-xl rounded-2xl border border-[var(--color-gold-dim)] bg-[color-mix(in_srgb,var(--color-ink)_78%,transparent)] px-6 py-10 text-center shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-md sm:px-12 sm:py-14">
      <span className="text-xs uppercase tracking-[0.35em] text-[var(--color-stone)]">
        You&apos;re invited to celebrate
      </span>

      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight text-[var(--color-gold-soft)] text-balance sm:text-5xl">
        {config.honoreeName}
      </h1>

      <p className="mt-2 font-[family-name:var(--font-display)] text-xl italic text-[var(--color-ivory)] sm:text-2xl">
        {config.eventTitle}
      </p>

      <div className="mx-auto mt-6 h-px w-16 bg-[var(--color-gold-dim)]" />

      <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-[var(--color-stone)] sm:text-base">
        {config.hostingNote}
      </p>

      <dl className="mt-6 grid grid-cols-1 gap-1 text-sm text-[var(--color-ivory)] sm:text-base">
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

      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
