import type { WallColumn } from "@/lib/photo-wall";

export function MarqueeColumn({ images, direction, duration, animationDelay }: WallColumn) {
  // Render the list twice back-to-back so translating exactly -50% loops seamlessly.
  const looped = [...images, ...images];

  return (
    <div className="marquee-col">
      <div
        className={`marquee-track dir-${direction}`}
        style={{
          animationDuration: `${duration}s`,
          animationDelay: `${animationDelay}s`,
        }}
      >
        {looped.map((src, i) => (
          <figure className="polaroid" key={`${src}-${i}`}>
            {/* Plain img: dozens of wall photos would overwhelm next/image's optimizer */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              width={280}
              height={350}
              className="aspect-[4/5] h-auto w-full select-none object-cover"
              draggable={false}
              loading={i < 4 ? "eager" : "lazy"}
              decoding="async"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
