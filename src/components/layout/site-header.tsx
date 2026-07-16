import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-gold-dim)]/40 bg-[var(--color-ink)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-sm tracking-[0.2em] text-[var(--color-gold-soft)] uppercase"
        >
          {siteConfig.honoreeShortName}&apos;s 80th
        </Link>
        <nav className="flex items-center gap-5 text-sm text-[var(--color-stone)]">
          <Link href="/#details" className="hidden hover:text-[var(--color-gold-soft)] sm:inline">
            Details
          </Link>
          <Link href="/rsvp" className="hover:text-[var(--color-gold-soft)]">
            RSVP
          </Link>
          <Link href="/memory-wall" className="hover:text-[var(--color-gold-soft)]">
            Memory Wall
          </Link>
        </nav>
      </div>
    </header>
  );
}
