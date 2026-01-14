import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TeamMemberCard from "@/components/TeamMemberCard";

interface TeamMember {
  name: string;
  role: string;
  company?: string;
  image: string;
  bio?: string;
  social?: {
    twitter?: string;
    github?: string;
  };
}

interface TeamCarouselProps {
  members: TeamMember[];
}

export default function TeamCarousel({ members }: TeamCarouselProps) {
  return (
    <Carousel
      className="relative mx-auto w-full max-w-[1000px]"
      opts={{
        align: "center",
        loop: true,
      }}
    >
      <div className="relative -mx-4">
        <CarouselContent className="">
          {members.map((member, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 py-8 sm:basis-[calc((100%-2rem)/3)]"
            >
              <div className="overflow-visible">
                <TeamMemberCard
                  name={member.name}
                  role={member.role}
                  company={member.company}
                  image={member.image}
                  bio={member.bio}
                  social={member.social}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Left and right gradient fade */}
        <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-4 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-4 bg-gradient-to-l from-white to-transparent" />
      </div>
      <CarouselPrevious className="top-[130px] z-15 max-sm:hidden md:top-[230px]" />
      <CarouselNext className="md:top-[230px top-[230px] z-15 max-sm:hidden" />
    </Carousel>
  );
}
