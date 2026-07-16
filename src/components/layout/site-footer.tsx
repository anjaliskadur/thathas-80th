import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-gold-dim)]/40 py-10 text-center text-xs text-[var(--color-stone)]">
      <p>With love, the family of {siteConfig.honoreeName}</p>
      <p className="mt-1">
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
          className="text-[var(--color-stone)]/20 hover:text-[var(--color-stone)]/60"
        >
          ·
        </Link>
      </p>
    </footer>
  );
}
