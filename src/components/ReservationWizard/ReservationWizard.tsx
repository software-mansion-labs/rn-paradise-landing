import { useState } from "react";
import { useReservationStore } from "@/stores/reservationStore";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { ThankYouDialog } from "./ThankYouDialog";
import {
  ReservationAccordion,
  ReservationAccordionContent,
  ReservationAccordionItem,
  ReservationAccordionTrigger,
} from "./ReservationAccordion";
import { dateOptions } from "@/stores/reservationStore";

const steps = [
  {
    id: 0,
    title: "Choose your dates and select your room type.",
  },
  {
    id: 1,
    title: "Fill out the form.",
  },
  {
    id: 2,
    title: "Request a reservation.",
  },
];

export function ReservationWizard() {
  const {
    currentStep,
    setCurrentStep,
    reset,
    selectedDates,
    rooms,
    personalDetails,
  } = useReservationStore();
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = async () => {
    // Here you would typically submit to an API
    // For now, we'll just show the thank you dialog
    setShowThankYou(true);
    reset();
  };

  return (
    <>
      <div className="flex w-full flex-col">
        <ReservationAccordion
          type="single"
          value={currentStep.toString()}
          onValueChange={(value) => {
            if (value) {
              const stepNumber = Number(value);
              if (stepNumber < currentStep) {
                setCurrentStep(stepNumber);
              }
            }
          }}
          className="w-full"
        >
          {steps.map((step) => {
            const isStep3 = step.id === 2;

            return (
              <ReservationAccordionItem
                key={step.id}
                value={step.id.toString()}
              >
                <ReservationAccordionTrigger
                  stepIndex={step.id}
                  title={step.title}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
                <ReservationAccordionContent className="pl-18">
                  {isStep3 ? (
                    <Step3 onSubmit={handleSubmit} />
                  ) : step.id === 0 ? (
                    <Step1 />
                  ) : (
                    <Step2 />
                  )}
                </ReservationAccordionContent>
              </ReservationAccordionItem>
            );
          })}
        </ReservationAccordion>
      </div>

      <ThankYouDialog open={showThankYou} onOpenChange={setShowThankYou} />
    </>
  );
}
