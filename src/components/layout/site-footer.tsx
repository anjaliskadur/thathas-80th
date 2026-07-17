import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-gold-dim)]/40 px-5 py-8 text-center text-xs text-[var(--color-stone)] sm:py-10">
      <p>With love, the family of {siteConfig.honoreeName}</p>
      <p className="mt-2 break-words">
        Questions? Write to{" "}
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="text-[var(--color-gold-soft)] hover:underline"
        >
          {siteConfig.contactEmail}
        </a>
      </p>
      <p className="mt-3">
        <Link
          href="/admin"
          aria-label="Host"
          className="inline-flex min-h-11 min-w-11 items-center justify-center text-[var(--color-stone)]/20 hover:text-[var(--color-stone)]/60"
        >
          ·
        </Link>
      </p>
    </footer>
  );
}
