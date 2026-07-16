import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-gold-dim)]/40 py-10 text-center text-xs text-[var(--color-stone)]">
      <p>
        With love, the family of {siteConfig.honoreeName}
      </p>
      <p className="mt-1">
        Questions? Write to{" "}
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="text-[var(--color-gold-soft)] hover:underline"
        >
          {siteConfig.contactEmail}
        </a>
      </p>
    </footer>
  );
}
