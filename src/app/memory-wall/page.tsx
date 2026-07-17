import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MemoryWall } from "@/components/memory-wall/memory-wall";
import { siteConfig } from "@/lib/site-config";
import { supabaseRest, toMemoryDTO, type MemoryRow } from "@/lib/supabase";
import type { MemoryDTO } from "@/types";

export const metadata: Metadata = {
  title: `Memory Wall — ${siteConfig.honoreeName}'s ${siteConfig.eventTitle}`,
};

export const dynamic = "force-dynamic";

export default async function MemoryWallPage() {
  const result = await supabaseRest<MemoryRow[]>(
    "/memories?select=id,author_name,message,media_url,media_type,created_at,updated_at&order=created_at.desc"
  );

  const initialMemories: MemoryDTO[] =
    result.error || !result.data ? [] : result.data.map(toMemoryDTO);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-24">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.35em] text-[var(--color-stone)]">
            For {siteConfig.honoreeShortName}
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-gold-soft)] sm:mt-4 sm:text-4xl">
            Memory Wall
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-stone)] sm:mt-4 sm:text-base">
            Share a photo, video, or message — whether you&apos;ll be there in person or
            celebrating from afar. You can edit or remove anything you add.
          </p>
        </div>

        <div className="mt-10 sm:mt-14">
          <MemoryWall initialMemories={initialMemories} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
