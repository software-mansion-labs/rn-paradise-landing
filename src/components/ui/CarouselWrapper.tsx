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
    <CarouselItem className="md:basis-2/5 lg:basis-1/4">
      <div className="relative h-80 w-full overflow-hidden">
        <img
          src={image}
          alt={`Image ${index + 1}`}
          className="absolute bottom-0 left-0 h-[26rem] w-full cursor-pointer object-cover transition-all duration-[650ms] ease-[cubic-bezier(.785,.135,.15,.86)] [clip-path:inset(45%_0%_0%_0%)] hover:scale-105 hover:[clip-path:inset(0%_0%_0%_0%)]"
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
          speed: 1,
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
