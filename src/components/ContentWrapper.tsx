import React from "react";
import { cn } from "@/lib/utils";

interface ContentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

const ContentWrapper = React.forwardRef<HTMLDivElement, ContentWrapperProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto flex w-full max-w-[552px] items-center justify-center max-sm:px-8 sm:w-[552px] sm:max-w-[552px] md:w-[960px] md:max-w-[960px] lg:w-[1360px] lg:max-w-[1360px]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ContentWrapper.displayName = "ContentWrapper";

export default ContentWrapper;
