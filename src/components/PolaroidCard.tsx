import { cn } from "@/lib/utils";

interface PolaroidCardProps {
  image: string;
  caption?: string;
  className?: string;
  isMain?: boolean;
  zIndex?: number;
}

export default function PolaroidCard({
  image,
  caption,
  className,
  isMain = false,
  zIndex = 50,
}: PolaroidCardProps) {
  return (
    <div
      className={cn(
        "relative h-full w-70 sm:w-75 md:w-115",
        isMain && "transition-transform duration-300 hover:scale-105",
        className,
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
          alt={isMain ? caption || "Photo" : ""}
          className="absolute top-[3.5%] left-[3.5%] h-[83%] w-[93%] object-cover"
          aria-hidden={!isMain}
        />
      )}
      {caption && isMain && (
        <p className="text-primary text-2xs absolute bottom-[4%] left-1/2 min-w-[220px] -translate-x-1/2 px-4 text-center whitespace-nowrap md:bottom-[5%]">
          {caption}
        </p>
      )}
    </div>
  );
}
