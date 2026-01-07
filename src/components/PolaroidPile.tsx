import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface PolaroidPileProps {
  images: string[];
  stackCount?: number;
  caption?: string;
  className?: string;
  size?: number;
  rotationDirection?: "left" | "right";
}

export default function PolaroidPile({
  images,
  stackCount = 5,
  caption,
  className,
  size = 1.15,
  rotationDirection = "left",
}: PolaroidPileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(size);

  useEffect(() => {
    const container = containerRef.current;
    const mainCard = mainCardRef.current;
    if (!container || !mainCard) return;

    let rafId: number | null = null;
    let targetX = 0;
    let targetY = 0;

    const update = () => {
      mainCard.style.setProperty("--rotate-x", `${targetY}deg`);
      mainCard.style.setProperty("--rotate-y", `${targetX}deg`);
      rafId = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      targetX = ((centerX - x) / centerX) * 5;
      targetY = ((y - centerY) / centerY) * 5;

      if (!rafId) {
        rafId = requestAnimationFrame(update);
      }
    };

    const handleMouseLeave = () => {
      mainCard.style.setProperty("--rotate-x", "0deg");
      mainCard.style.setProperty("--rotate-y", "0deg");
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const mainImage = images[0] || "";
  const availableStackImages = images.slice(1);
  const neededStackCount = stackCount - 1;

  let stackImages: string[];
  if (availableStackImages.length >= neededStackCount) {
    stackImages = availableStackImages.slice(0, neededStackCount);
  } else {
    const lastImage =
      availableStackImages[availableStackImages.length - 1] || mainImage || "";
    const fillCount = neededStackCount - availableStackImages.length;
    stackImages = [
      ...availableStackImages,
      ...Array(fillCount).fill(lastImage),
    ];
  }

  const PolaroidCard = ({
    image,
    isMain = false,
    index = 0,
    zIndex = 50,
  }: {
    image?: string;
    isMain?: boolean;
    index?: number;
    zIndex?: number;
  }) => (
    <div
      className={cn(
        "relative h-full w-70 sm:w-75 md:w-115",
        isMain && "transition-transform duration-300 hover:scale-105",
      )}
      style={{ zIndex }}
    >
      <img
        src="/assets/polaroid-frame.svg"
        alt="Polaroid Frame"
        className={cn(
          "h-full w-full object-contain",
          isMain ? "drop-shadow-2xl" : "drop-shadow-lg",
        )}
        aria-hidden={!isMain}
      />
      {image && (
        <img
          src={image}
          alt={isMain ? "Previous edition photo" : ""}
          className="absolute top-[3.5%] left-[3.5%] h-[83%] w-[93%] object-cover"
          aria-hidden={!isMain}
        />
      )}
      {caption && isMain && (
        <p className="text-primary text-2xs absolute bottom-[4%] left-1/2 min-w-[220px] -translate-x-1/2 px-4 text-center font-medium whitespace-nowrap sm:text-sm md:bottom-[5%]">
          {caption}
        </p>
      )}
    </div>
  );

  return (
    <div className={cn("relative w-full max-w-xl md:max-w-2xl", className)}>
      <div
        ref={containerRef}
        className="relative h-full w-full"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
      >
        {/* Stacked polaroids behind */}
        {stackImages.map((image, index) => {
          const rotationMultiplier = rotationDirection === "right" ? 1 : -1;
          const baseRotation = (index + 1) * 2 - 6;
          const rotation = baseRotation * rotationMultiplier;
          const translateX = (index + 1) * 2 - 4;
          const translateY = (index + 1) * 2 - 4;
          const zIndex = index + 1;

          return (
            <div
              key={`stack-${index}`}
              className="pointer-events-none absolute inset-0 transition-all duration-500 ease-out"
              style={{
                transform: `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`,
                zIndex,
              }}
            >
              <PolaroidCard image={image} index={index} zIndex={zIndex} />
            </div>
          );
        })}

        {/* Main polaroid on top */}
        <div
          ref={mainCardRef}
          className="relative will-change-transform"
          style={{
            transform: `perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))`,
            transformOrigin: "center",
            zIndex: stackCount + 1,
          }}
        >
          <PolaroidCard image={mainImage} isMain zIndex={stackCount} />
        </div>
      </div>
    </div>
  );
}
