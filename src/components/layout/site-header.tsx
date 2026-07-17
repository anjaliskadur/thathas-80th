"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  const pathname = usePathname();

  function handleBrandClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/") return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-gold-dim)]/40 bg-[var(--color-ink)]/85 backdrop-blur-md">
      <div className="flex w-full items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-4 lg:px-10">
        <Link
          href="/"
          onClick={handleBrandClick}
          className="shrink-0 font-[family-name:var(--font-display)] text-xs tracking-[0.18em] text-[var(--color-gold-soft)] uppercase sm:text-sm sm:tracking-[0.2em]"
        >
          {siteConfig.honoreeShortName}&apos;s 80th
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[11px] text-[var(--color-stone)] sm:gap-x-5 sm:text-sm">
          <Link href="/#details" className="hover:text-[var(--color-gold-soft)]">
            Details
          </Link>
          <Link href="/photos" className="hover:text-[var(--color-gold-soft)]">
            Photos
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
