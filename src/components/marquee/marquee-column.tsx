import Image from "next/image";
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
            <Image
              src={src}
              alt=""
              width={280}
              height={350}
              className="h-auto w-full select-none"
              draggable={false}
              priority={i < 2}
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
