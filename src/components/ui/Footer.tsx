import ContentWrapper from "@/components/ContentWrapper";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

const socials = [
  {
    icon: "assets/socials/twitter.svg",
    href: "https://twitter.com/swmansion",
  },
  {
    icon: "assets/socials/facebook.svg",
    href: "https://www.facebook.com/SoftwareMansion/",
  },
  {
    icon: "assets/socials/github.svg",
    href: "https://github.com/software-mansion",
  },
  {
    icon: "assets/socials/instagram.svg",
    href: "https://www.instagram.com/swmansion/",
  },
  {
    icon: "assets/socials/youtube.svg",
    href: "https://www.youtube.com/c/SoftwareMansion",
  },
  {
    icon: "assets/socials/linkedin.svg",
    href: "https://www.linkedin.com/company/software-mansion/",
  },
  {
    icon: "assets/socials/dribble.svg",
    href: "https://dribbble.com/softwaremansion",
  },
  {
    icon: "assets/socials/discord.svg",
    href: "https://discord.com/invite/2gjSqPQc9Q",
  },
];

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <footer
        id="footer"
        ref={ref}
        className={cn(
          "bg-dark-cold relative bottom-0 w-full overflow-hidden",
          className,
        )}
        {...props}
      >
        <ContentWrapper>
          <div className="mx-auto flex w-full max-w-[1360px] items-center justify-between py-12 md:py-20">
            <div className="flex w-full items-center justify-between gap-8 text-white max-md:flex-col max-md:items-center max-md:gap-10">
              <div className="flex flex-col items-start gap-2">
                <h2 className="text-md font-bold md:text-[22px]">
                  Software Mansion S.A.
                </h2>
                <h3 className="text-sm font-normal">
                  ul. Zabłocie 43b
                  <br />
                  30-701 Kraków, Poland
                  <br />
                  NIP/VAT EU: PL6793131302
                </h3>
              </div>

              <div className="flex flex-col items-center gap-8 md:gap-14">
                <div className="flex items-center gap-2 md:gap-1">
                  {socials.map(({ icon, href }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-6 w-6 transform items-center justify-center rounded-full transition-all duration-300 ease-in-out hover:scale-120 hover:opacity-60 md:h-9 md:w-9"
                    >
                      <img
                        src={icon}
                        className="h-6 w-6"
                        alt={`${icon} icon`}
                        width="24"
                        height="24"
                      />
                    </a>
                  ))}
                </div>
                <p className="text-sm font-normal">
                  &copy; Software Mansion 2025.
                </p>
              </div>

              <a
                href="https://swmansion.com/"
                target="_blank"
                rel="noopener"
                className="flex-shrink-0 max-md:order-first"
              >
                <img
                  src="/assets/logo-swm-top-left.svg"
                  alt="Software Mansion"
                  className="h-20 w-36 md:h-28 md:w-48"
                />
              </a>
            </div>
          </div>
        </ContentWrapper>
      </footer>
    );
  },
);

Footer.displayName = "Footer";

export { Footer };
