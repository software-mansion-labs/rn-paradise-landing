import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "@/lib/utils";

interface ReservationAccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  stepIndex: number;
  title: string;
  currentStep: number;
  onStepClick: (step: number) => void;
}

function ReservationAccordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root data-slot="reservation-accordion" {...props} />
  );
}

function ReservationAccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="reservation-accordion-item"
      className={cn("border-gray-border border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function ReservationAccordionTrigger({
  className,
  stepIndex,
  title,
  currentStep,
  onStepClick,
  ...props
}: ReservationAccordionTriggerProps) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const stepNumber = stepIndex + 1;
  const isActive = stepIndex === currentStep;
  const isCompleted = stepIndex < currentStep;
  const isFuture = stepIndex > currentStep;
  const canNavigate = isCompleted;

  React.useEffect(() => {
    if (!isActive || !triggerRef.current) return;

    const scrollToTrigger = () => {
      if (!triggerRef.current) return;

      const headerHeight = 72;
      const rect = triggerRef.current.getBoundingClientRect();
      const targetPosition = rect.top + window.scrollY - headerHeight;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: "smooth",
      });
    };

    setTimeout(scrollToTrigger, 250); // wait for accordion to open
  }, [isActive]);

  const renderStepButton = () => {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (canNavigate) {
            onStepClick(stepIndex);
          }
        }}
        role="button"
        tabIndex={canNavigate ? 0 : -1}
        onKeyDown={(e) => {
          if (canNavigate && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            e.stopPropagation();
            onStepClick(stepIndex);
          }
        }}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
          isCompleted
            ? "border-primary bg-primary text-white"
            : isActive
              ? "border-primary text-primary bg-white"
              : "border-gray-border bg-white text-gray-400",
          canNavigate ? "cursor-pointer" : "cursor-not-allowed opacity-50",
          "h-10 w-10",
        )}
      >
        {stepNumber}
      </div>
    );
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    // block expanding future steps
    if (isFuture) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  };

  return (
    <AccordionPrimitive.Header className="flex w-full">
      <AccordionPrimitive.Trigger
        ref={triggerRef}
        data-slot="reservation-accordion-trigger"
        onClick={handleTriggerClick}
        disabled={isFuture}
        data-disabled={isFuture}
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex w-full items-center gap-8 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:no-underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {renderStepButton()}
        <h3 className="text-primary text-md flex-1 py-2 font-bold whitespace-nowrap">
          {title}
        </h3>
        {isCompleted && (
          <img
            src="/assets/reservation-icons/Edit.svg"
            alt="Edit"
            className="h-4 w-4 shrink-0"
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function ReservationAccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="reservation-accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export {
  ReservationAccordion,
  ReservationAccordionItem,
  ReservationAccordionTrigger,
  ReservationAccordionContent,
};
