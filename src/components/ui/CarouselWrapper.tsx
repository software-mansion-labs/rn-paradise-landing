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
      <div className="relative h-[26rem] w-full">
        <div className="group absolute bottom-0 h-[20rem] w-full overflow-hidden transition-[height] duration-[650ms] ease-[cubic-bezier(.785,.135,.15,.86)] md:hover:h-[26rem]">
          <img
            src={image}
            alt={`Image ${index + 1}`}
            className="absolute bottom-0 h-[24rem] w-full cursor-pointer object-cover object-bottom transition-transform duration-[650ms] ease-[cubic-bezier(.785,.135,.15,.86)] md:group-hover:scale-105"
          />
        </div>
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
