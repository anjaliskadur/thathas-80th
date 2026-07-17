import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { RsvpForm } from "@/components/rsvp/rsvp-form";
import { siteConfig } from "@/lib/site-config";
import { getSiteConfig } from "@/lib/get-site-config";

export const metadata: Metadata = {
  title: `RSVP — ${siteConfig.honoreeName}'s ${siteConfig.eventTitle}`,
};

export const dynamic = "force-dynamic";

export default async function RsvpPage() {
  const config = await getSiteConfig();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-5 py-12 sm:px-6 sm:py-24">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.35em] text-[var(--color-stone)]">
            Kindly reply
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-gold-soft)] sm:mt-4 sm:text-4xl">
            RSVP
          </h1>
          <p className="mt-3 text-sm text-[var(--color-stone)] sm:mt-4 sm:text-base">
            Please respond by {config.rsvpDeadlineLabel} so we can plan accordingly.
          </p>
        </div>

        <div className="mt-10 sm:mt-12">
          <RsvpForm />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
