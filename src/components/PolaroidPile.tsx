import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import EditionBadge from "@/components/EditionBadge";
import PolaroidCard from "@/components/PolaroidCard";

type Card = {
  id: string;
  image: string;
};

interface PolaroidPileProps {
  images: string[];
  caption?: string;
  className?: string;
  size?: number;
  rotationDirection?: "left" | "right";
  editionNumber?: number;
}

const THROW_DISTANCE = 100;
const THROW_DURATION = 500;

export default function PolaroidPile({
  images,
  caption,
  className,
  size = 1.15,
  rotationDirection = "left",
  editionNumber,
}: PolaroidPileProps) {
  const [cardStack, setCardStack] = useState<Card[]>(() =>
    images
      .slice()
      .reverse()
      .map((image, i) => ({
        id: `${image}-${i}-${Date.now()}`,
        image,
      })),
  );

  const handleThrowComplete = (cardId: string) => {
    setCardStack((prev) => {
      // remove thrown card
      const remaining = prev.filter((c) => c.id !== cardId);

      const thrownCard = prev.find((c) => c.id === cardId);
      if (!thrownCard) return remaining;

      const currentImageIndex = images.indexOf(thrownCard.image);
      const nextImageIndex = (currentImageIndex + 1) % images.length;

      // add new card to bottom
      return [
        {
          id: `${images[nextImageIndex]}-${Date.now()}-${Math.random()}`,
          image: images[nextImageIndex],
        },
        ...remaining,
      ];
    });
  };

  return (
    <div className={cn("relative mx-auto overflow-visible", className)}>
      <div
        className="relative h-[300px] w-70 sm:h-[325px] sm:w-75 md:h-[505px] md:w-115"
        style={{
          transform: `scale(${size})`,
          transformOrigin: "center",
        }}
      >
        {cardStack.map((card, index) => {
          const isTop = index === cardStack.length - 1;
          const reverseIndex = cardStack.length - 1 - index;
          const rotationMultiplier = rotationDirection === "right" ? 1 : -1;

          const rotation = ((reverseIndex + 1) * 2 - 6) * rotationMultiplier;
          const translateX = (reverseIndex + 1) * 2 - 4;
          const translateY = (reverseIndex + 1) * 2 - 4;

          return (
            <PolaroidCardEntity
              key={card.id}
              card={card}
              isTop={isTop}
              caption={caption}
              zIndex={index + 1}
              rotation={rotation}
              translateX={translateX}
              translateY={translateY}
              onThrowComplete={handleThrowComplete}
              showEdition={isTop}
              editionNumber={editionNumber}
            />
          );
        })}
      </div>
    </div>
  );
}

interface PolaroidCardEntityProps {
  card: Card;
  isTop: boolean;
  caption?: string;
  zIndex: number;
  rotation: number;
  translateX: number;
  translateY: number;
  onThrowComplete: (cardId: string) => void;
  showEdition?: boolean;
  editionNumber?: number;
}

function PolaroidCardEntity({
  card,
  isTop,
  caption,
  zIndex,
  rotation,
  translateX,
  translateY,
  onThrowComplete,
  showEdition,
  editionNumber,
}: PolaroidCardEntityProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isThrown, setIsThrown] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const dragRef = useRef({
    isActive: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  // tilt effect for top card
  useEffect(() => {
    if (!isTop || isDragging || isThrown || !cardRef.current) return;

    const el = cardRef.current;
    let rafId: number | null = null;
    let targetX = 0;
    let targetY = 0;

    const update = () => {
      el.style.setProperty("--rotate-x", `${targetY}deg`);
      el.style.setProperty("--rotate-y", `${targetX}deg`);
      rafId = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
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
      el.style.setProperty("--rotate-x", "0deg");
      el.style.setProperty("--rotate-y", "0deg");
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isTop, isDragging, isThrown]);

  // dragg effect for top card
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isTop) return;
    e.preventDefault();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    dragRef.current = {
      isActive: true,
      startX: clientX,
      startY: clientY,
      currentX: 0,
      currentY: 0,
    };
    setIsDragging(true);
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!dragRef.current.isActive) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    dragRef.current.currentX = clientX - dragRef.current.startX;
    dragRef.current.currentY = clientY - dragRef.current.startY;

    setDragOffset({
      x: dragRef.current.currentX,
      y: dragRef.current.currentY,
    });
  };

  const handleDragEnd = () => {
    if (!dragRef.current.isActive) return;

    const distance = Math.sqrt(
      dragRef.current.currentX ** 2 + dragRef.current.currentY ** 2,
    );

    if (distance > THROW_DISTANCE) {
      const velocityMultiplier = 2;
      const velocityX = dragRef.current.currentX * velocityMultiplier;
      const velocityY = dragRef.current.currentY * velocityMultiplier;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const finalX =
        Math.abs(velocityX) > viewportWidth
          ? velocityX > 0
            ? viewportWidth + 200
            : -viewportWidth - 200
          : velocityX;
      const finalY =
        Math.abs(velocityY) > viewportHeight
          ? velocityY > 0
            ? viewportHeight + 200
            : -viewportHeight - 200
          : velocityY;

      setIsThrown(true);
      setIsDragging(false);
      setDragOffset({ x: finalX, y: finalY });

      setTimeout(() => {
        onThrowComplete(card.id);
      }, THROW_DURATION);
    } else {
      setDragOffset({ x: 0, y: 0 });
      setIsDragging(false);
    }

    dragRef.current.isActive = false;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => handleDragMove(e);
    const handleMouseUp = () => handleDragEnd();
    const handleTouchMove = (e: TouchEvent) => handleDragMove(e);
    const handleTouchEnd = () => handleDragEnd();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute inset-0 will-change-transform",
        isTop && "cursor-grab active:cursor-grabbing",
        !isTop && "pointer-events-none",
        isDragging && "cursor-grabbing",
      )}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      style={{
        zIndex: isTop ? 100 : zIndex,
        transform: isThrown
          ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.15}deg)`
          : isDragging
            ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.15}deg) scale(1.05)`
            : isTop
              ? `perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))`
              : `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`,
        transformOrigin: "center",
        transition: isDragging
          ? "none"
          : isThrown
            ? "transform 0.5s ease-out, opacity 0.5s ease-out"
            : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
        opacity:
          isThrown &&
          (Math.abs(dragOffset.x) > 300 || Math.abs(dragOffset.y) > 300)
            ? 0
            : 1,
      }}
    >
      <div className="relative">
        <PolaroidCard
          image={card.image}
          caption={caption}
          isMain={isTop}
          zIndex={zIndex}
        />
        {showEdition && editionNumber && (
          <EditionBadge
            editionNumber={editionNumber}
            className="absolute top-[-7%] left-[-14%] z-50"
            variant="secondary"
          />
        )}
      </div>
    </div>
  );
}
