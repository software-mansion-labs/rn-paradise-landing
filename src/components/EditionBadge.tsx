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
  editionNumber: number;
  variant?: "default" | "secondary";
  className?: string;
}

export default function EditionBadge({
  editionNumber,
  variant = "default",
  className,
}: EditionBadgeProps) {
  const variantClasses = {
    default: "bg-primary text-beige-light",
    secondary: "bg-badge-yellow text-primary",
  };

  if (!editionNumber) return null;

  return (
    <div
      className={cn(
        variantClasses[variant],
        "absolute flex h-16 w-16 rotate-[10deg] items-center justify-center rounded-full shadow-md sm:h-19 sm:w-19 md:h-22 md:w-22",
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center gap-0">
        <span className="text-md sm:text-md leading-none">
          {getOrdinalIndicator(editionNumber)}
        </span>
        <span className="text-2xs leading-none sm:text-xs">edition</span>
      </div>
    </div>
  );
}
