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
      {/* CSS grid (not columns) avoids hover reflow glitches on the top row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
          >
            <figure className="polaroid gallery-polaroid transition-shadow duration-200 group-hover:shadow-[0_10px_28px_rgba(0,0,0,0.55)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] h-auto w-full object-cover transition-[filter] duration-200 group-hover:brightness-110"
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
