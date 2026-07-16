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
      <div className="flex w-full items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <Link
          href="/"
          onClick={handleBrandClick}
          className="font-[family-name:var(--font-display)] text-sm tracking-[0.2em] text-[var(--color-gold-soft)] uppercase"
        >
          {siteConfig.honoreeShortName}&apos;s 80th
        </Link>
        <nav className="flex items-center gap-4 text-sm text-[var(--color-stone)] sm:gap-5">
          <Link href="/#details" className="hidden hover:text-[var(--color-gold-soft)] sm:inline">
            Details
          </Link>
          <Link href="/photos" className="hover:text-[var(--color-gold-soft)]">
            Photos
          </Link>
          <Link href="/rsvp" className="hover:text-[var(--color-gold-soft)]">
            RSVP
          </Link>
          <Link href="/memory-wall" className="hidden hover:text-[var(--color-gold-soft)] sm:inline">
            Memory Wall
          </Link>
        </nav>
      </div>
    </header>
  );
}
