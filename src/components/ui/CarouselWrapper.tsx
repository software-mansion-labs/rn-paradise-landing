import {
  Carousel as BaseCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";

interface CarouselProps {
  data: {
    images?: string[];
  };
}

function ImageItem({ image, index }: { image: string; index: number }) {
  return (
    <CarouselItem className="basis-1/1 sm:basis-3/5 md:basis-2/6 lg:basis-1/4">
      <div className="group relative w-full aspect-[4/5] overflow-hidden transition-[clip-path] duration-500 ease-in-out md:[clip-path:inset(20%_0%_0%_0%)] md:hover:[clip-path:inset(0%_0%_0%_0%)]">
        <img
          src={image}
          alt={`Image ${index + 1}`}
          className="h-full w-full cursor-pointer object-cover transition-transform duration-500 ease-in-out md:group-hover:scale-105"
        />
      </div>
    </CarouselItem>
  );
}

export function Carousel({ data }: CarouselProps) {
  const images = data.images ?? [];
  return (
    <BaseCarousel
      className="relative w-full"
      opts={{ loop: true }}
      plugins={[
        AutoScroll({
          playOnInit: true,
          startDelay: 0,
          speed: 0.5,
          stopOnInteraction: false,
          //   stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {images.map((image, i) => (
          <ImageItem key={i} image={image} index={i} />
        ))}
      </CarouselContent>
    </BaseCarousel>
  );
}
