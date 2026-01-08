import { cn } from "@/lib/utils";

const getOrdinalIndicator = (num: number): string => {
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${num}th`;
  }

  switch (lastDigit) {
    case 1:
      return `${num}st`;
    case 2:
      return `${num}nd`;
    case 3:
      return `${num}rd`;
    default:
      return `${num}th`;
  }
};

interface EditionBadgeProps {
  editionNumber: string;
  variant?: "default" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function EditionBadge({
  editionNumber,
  variant = "default",
  size = "md",
  className,
}: EditionBadgeProps) {
  const variantClasses = {
    default: "bg-primary text-white",
    secondary: "bg-badge-yellow text-primary",
  };

  const sizeClasses = {
    sm: "h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24",
    md: "h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28",
    lg: "h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32",
  };

  const textSizeClasses = {
    sm: {
      number: "text-md leading-none sm:text-lg md:text-xl",
      label: "text-2xs leading-none sm:text-xs",
    },
    md: {
      number: "text-xl leading-none",
      label: "text-xs leading-none",
    },
    lg: {
      number: "text-2xl leading-none sm:text-3xl md:text-4xl",
      label: "text-sm leading-none sm:text-base",
    },
  };

  if (!editionNumber) return null;

  return (
    <div
      className={cn(
        variantClasses[variant],
        "absolute flex rotate-[10deg] items-center justify-center rounded-full shadow-md",
        sizeClasses[size],
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center gap-0">
        <span className={cn(textSizeClasses[size].number)}>
          {getOrdinalIndicator(parseInt(editionNumber))}
        </span>
        <span className={cn(textSizeClasses[size].label)}>edition</span>
      </div>
    </div>
  );
}
