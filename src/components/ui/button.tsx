import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer text-sm transition-all disabled:opacity-50 shrink-0 outline-none disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-hover rounded-md",
        secondary:
          "bg-badge-yellow text-primary hover:bg-badge-yellow/90 rounded-full",
        reservationNotSelected:
          "border-reservation-blue disabled:border-primary rounded-lg border px-14 py-5 text-xs text-white bg-reservation-blue",
        reservationSelected:
          "border-reservation-blue disabled:border-primary rounded-lg border px-14 py-5 text-xs",
      },
      size: {
        default: "px-6 h-14",
        lg: "px-12 h-14",
        xl: "px-12 py-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  const buttonClassName = cn(buttonVariants({ variant, size }), className);

  if (asChild) {
    return (
      <Comp data-slot="button" className={buttonClassName} {...props}>
        {children}
      </Comp>
    );
  }

  return (
    <Comp data-slot="button" className={buttonClassName} {...props}>
      <div className="flex items-center justify-center">{children}</div>
    </Comp>
  );
}

export { Button, buttonVariants };
