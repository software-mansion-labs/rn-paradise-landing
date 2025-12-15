import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface PolaroidPileProps {
  images: string[];
  stackCount?: number;
  caption?: string;
  className?: string;
  size?: number;
}

export default function PolaroidPile({
  images,
  stackCount = 5,
  caption,
  className,
  size = 1.15,
}: PolaroidPileProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * 5;
      const rotateY = ((centerX - x) / centerX) * 5;

      container.style.setProperty("--rotate-x", `${rotateX}deg`);
      container.style.setProperty("--rotate-y", `${rotateY}deg`);
    };

    const handleMouseLeave = () => {
      if (container) {
        container.style.setProperty("--rotate-x", "0deg");
        container.style.setProperty("--rotate-y", "0deg");
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const mainImage = images[0] || "";
  const stackImages = images.slice(1, stackCount) || [];

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
        "relative h-full w-115",
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
        <p className="text-primary absolute bottom-[5%] left-1/2 min-w-[220px] -translate-x-1/2 px-4 text-center text-sm font-medium whitespace-nowrap">
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
          transform: `perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg)) scale(${size})`,
          transformOrigin: "center",
        }}
      >
        {/* Stacked polaroids behind */}
        {stackImages.map((image, index) => {
          const rotation = (index + 1) * 3 - 6;
          const translateX = (index + 1) * 2 - 4;
          const translateY = (index + 1) * 2 - 4;
          const zIndex = stackCount - index;

          return (
            <div
              key={`stack-${index}`}
              className="absolute inset-0 transition-all duration-500 ease-out"
              style={{
                transform: `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`,
                zIndex,
                opacity: 0.7 - index * 0.1,
              }}
            >
              <PolaroidCard image={image} index={index} zIndex={zIndex} />
            </div>
          );
        })}

        {/* Main polaroid on top */}
        <div className="relative">
          <PolaroidCard image={mainImage} isMain zIndex={50} />
        </div>
      </div>
    </div>
  );
}
