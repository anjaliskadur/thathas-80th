"use client";

import { useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function PhotoLightbox({
  images,
  index,
  onClose,
  onChange,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
}) {
  const src = images[index];
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) onChange(index - 1);
  }, [hasPrev, index, onChange]);

  const goNext = useCallback(() => {
    if (hasNext) onChange(index + 1);
  }, [hasNext, index, onChange]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, goPrev, goNext]);

  if (!src) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-10 inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-ivory)] hover:bg-white/10 sm:right-4 sm:top-4"
      >
        <X className="h-6 w-6" />
      </button>

      {hasPrev && (
        <button
          type="button"
          aria-label="Previous photo"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-1 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-[var(--color-ivory)] hover:bg-white/10 sm:left-4 sm:h-14 sm:w-14"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          aria-label="Next photo"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-1 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-[var(--color-ivory)] hover:bg-white/10 sm:right-4 sm:h-14 sm:w-14"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}

      <figure
        className="relative mx-10 max-h-[90svh] max-w-5xl sm:mx-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="max-h-[80svh] w-auto max-w-full rounded-sm object-contain shadow-2xl sm:max-h-[85svh]"
        />
        <figcaption className="mt-3 text-center text-sm text-[var(--color-stone)]">
          {index + 1} / {images.length}
        </figcaption>
      </figure>
    </div>
  );
}
