import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface TeamMemberCardProps {
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

function TeamMemberCard({
  name,
  role,
  company,
  image,
  bio,
  social,
}: TeamMemberCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Image flip container */}
      <div className="group relative overflow-visible">
        <div
          className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
          style={{ transformOrigin: "center center" }}
        >
          {/* Front face - image */}
          <div className="[backface-visibility:hidden]">
            <img src={image} alt={name} className="object-contain" />
          </div>

          {/* Back face - bio */}
          {bio && (
            <div
              className="absolute inset-0 flex [transform:rotateY(180deg)] items-center justify-center overflow-y-auto px-6 py-3 [backface-visibility:hidden] sm:items-start md:items-center md:py-6"
              style={{
                backgroundColor: "var(--color-brand-sea-blue-20)",
              }}
            >
              <p className="text-primary sm:text-2xs text-center text-sm md:text-xs">
                {bio}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-primary text-md text-center">{name}</h3>
          <p className="text-primary/80 text-2xs text-center">
            {role}, <br /> {company || "Software Mansion"}
          </p>
        </div>
        {social && (social.twitter || social.github) && (
          <div className="flex items-center justify-center gap-3 pt-2">
            {social.twitter && (
              <a
                href={social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/60 hover:text-primary transition-colors"
                aria-label={`${name}'s Twitter`}
              >
                <img
                  src="/assets/socials/twitter-black.svg"
                  alt="Twitter"
                  className="h-6 w-6 hover:opacity-80"
                />
              </a>
            )}
            {social.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/60 hover:text-primary transition-colors"
                aria-label={`${name}'s GitHub`}
              >
                <img
                  src="/assets/socials/github-black.svg"
                  alt="GitHub"
                  className="h-6 w-6 hover:opacity-80"
                />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
        align: "end",
        loop: true,
        containScroll: false,
        breakpoints: {
          "(max-width: 768px)": { align: "start" },
        },
      }}
    >
      <div className="relative overflow-hidden">
        <CarouselContent>
          {members.map((member, index) => (
            <CarouselItem
              key={index}
              className="flex basis-4/5 justify-center py-8 sm:basis-[calc((100%-1rem)/3)]"
            >
              <TeamMemberCard {...member} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Left and right gradient fade */}
        <div className="pointer-events-none absolute top-0 -left-1 z-10 h-full w-4 bg-gradient-to-r from-white to-transparent max-sm:hidden" />
        <div className="pointer-events-none absolute top-0 -right-1 z-10 h-full w-4 bg-gradient-to-l from-white to-transparent max-sm:hidden" />
      </div>
      <CarouselPrevious className="top-[150px] z-15 max-sm:hidden md:top-[230px]" />
      <CarouselNext className="top-[150px] z-15 max-sm:hidden md:top-[230px]" />
    </Carousel>
  );
}
