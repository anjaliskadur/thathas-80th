import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PhotoGallery } from "@/components/gallery/photo-gallery";
import { getPhotoWallImages } from "@/lib/get-photo-wall-images";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Photos — ${siteConfig.honoreeName}'s ${siteConfig.eventTitle}`,
};

export default function PhotosPage() {
  const images = getPhotoWallImages();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-24">
        <div className="px-1 text-center sm:px-0">
          <span className="text-xs uppercase tracking-[0.35em] text-[var(--color-stone)]">
            Over the years
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-gold-soft)] sm:mt-4 sm:text-4xl">
            Photo gallery
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-stone)] sm:mt-4 sm:text-base">
            A few memories from over the years — browse them all here, or enjoy the
            scrolling wall on the home page.
          </p>
        </div>

        <div className="mt-10 sm:mt-14">
          <PhotoGallery images={images} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
