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
      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.35em] text-[var(--color-stone)]">
            Over the years
          </span>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[var(--color-gold-soft)]">
            Photo gallery
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[var(--color-stone)]">
            A few memories from over the years — browse them all here, or enjoy the
            scrolling wall on the home page.
          </p>
        </div>

        <div className="mt-14">
          <PhotoGallery images={images} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
