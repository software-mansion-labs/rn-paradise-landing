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
        loop: true,
        align: "start",
      }}
    >
      <CarouselContent className="-ml-4">
        {members.map((member, index) => (
          <CarouselItem key={index} className="basis-1/2 py-8 sm:basis-1/3">
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
      <CarouselPrevious className="top-[130px] max-sm:hidden md:top-[230px]" />
      <CarouselNext className="top-[130px] max-sm:hidden md:top-[230px]" />
    </Carousel>
  );
}
