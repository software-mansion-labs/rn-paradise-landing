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

export default function TeamMemberCard({
  name,
  role,
  company,
  image,
  bio,
  social,
}: TeamMemberCardProps) {
  return (
    <div className="flex max-w-80 flex-col gap-4">
      {/* Image flip container */}
      <div
        className="group relative max-h-100 w-full max-w-80"
        style={{ aspectRatio: "2/3", perspective: "1000px" }}
      >
        <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          {/* Front face - image */}
          <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden]">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Back face - bio */}
          {bio && (
            <div
              className="absolute inset-0 flex [transform:rotateY(180deg)] items-start justify-center overflow-y-auto p-6 [backface-visibility:hidden]"
              style={{
                backgroundColor: "var(--color-brand-sea-blue-20)",
              }}
            >
              <p className="text-primary text-center text-xs leading-relaxed">
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
