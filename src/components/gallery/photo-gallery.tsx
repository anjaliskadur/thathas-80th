"use client";

import { useState } from "react";
import { PhotoLightbox } from "./photo-lightbox";

export function PhotoGallery({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <p className="text-center text-[var(--color-stone)]">
        Photos coming soon — check back after we add a few more memories.
      </p>
    );
  }

  return (
    <>
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="mb-4 block w-full break-inside-avoid text-left transition hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
          >
            <figure className="polaroid w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] h-auto w-full object-cover"
              />
            </figure>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <PhotoLightbox
          images={images}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onChange={setActiveIndex}
        />
      )}
    </>
  );
}
