import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";
export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

const LATEST_NEWS_ID = "v0.5.0";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Workshops", href: "#workshops" },
  { name: "Venue", href: "#venue" },
  { name: "Instructors", href: "#team" },
  { name: "Previous edition", href: "#previous-edition" },
  { name: "FAQ", href: "#faq" },
];

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, ...props }, ref) => {
    const [isScrolled, setIsScrolled] = useState(true);
    const [activeTheme, setActiveTheme] = useState("light");

    const localHeaderRef = useRef<HTMLElement>(null);
    useImperativeHandle(ref, () => localHeaderRef.current!);

    return (
      <header
        ref={localHeaderRef}
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
          activeTheme === "dark"
            ? "bg-primary text-white"
            : "text-primary bg-white",
          isScrolled
            ? activeTheme === "dark"
              ? "border-b border-white/40"
              : "border-b border-black/10"
            : "border-b border-transparent",
          className,
        )}
        {...props}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1360px] items-center justify-between px-7 sm:px-8">
          <a href="#hero" className="flex items-center gap-2 pt-10">
            <img
              src="/assets/logo-swm-white.svg"
              alt="Software Mansion"
              className="h-16 w-32"
            />
          </a>

          <nav className="mx-auto hidden items-center justify-center gap-10 md:flex">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "font-aeonik text-md justify-center font-normal",
                  "transition-all hover:scale-105",
                  activeTheme === "dark"
                    ? "hover:text-slate-300"
                    : "hover:text-primary/70",
                  "last:hidden",
                  "lg:last:block",
                )}
                onClick={() => {
                  window.location.href = item.href;
                }}
              >
                <div className="flex items-center justify-center gap-1">
                  {item.name}
                </div>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5 sm:gap-10">
            <a
              href="#reservation"
              className={cn(
                "font-aeonik text-md font-normal underline underline-offset-2",
                activeTheme === "dark"
                  ? "hover:text-slate-300"
                  : "hover:text-primary/70",
              )}
            >
              Book now
            </a>
          </div>
        </div>
      </header>
    );
  },
);

Header.displayName = "Header";

export { Header };
