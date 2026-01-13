import { useState, useEffect, useRef } from "react";
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
import { Captcha } from "@/utils/recaptcha";
import type { CaptchaRef } from "@/utils/recaptcha";

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

interface ReservationWizardProps {
  reservationData?: string;
  siteKey?: string;
}

export function ReservationWizard({
  reservationData,
  siteKey = "",
}: ReservationWizardProps) {
  const {
    currentStep,
    setCurrentStep,
    reset,
    selectedDates,
    selectedRoomId,
    rooms,
    personalDetails,
    accommodationNotes,
    initializeFromCMS,
  } = useReservationStore();
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const captchaRef = useRef<CaptchaRef>(null);

  useEffect(() => {
    if (reservationData) {
      try {
        const data = JSON.parse(reservationData);
        initializeFromCMS({
          dateOptions: data.dateOptions,
          rooms: data.rooms,
          dateRoomAvailability: data.dateRoomAvailability,
        });
      } catch (error) {
        console.error("Failed to parse reservation data:", error);
      }
    }
  }, [reservationData, initializeFromCMS]);

  const handleSubmit = async () => {
    if (!selectedDates[0] || !selectedRoomId) {
      setSubmitError("Please complete all required fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!siteKey) {
        setSubmitError(
          "reCAPTCHA is not configured. Please contact the administrator.",
        );
        setIsSubmitting(false);
        return;
      }

      let recaptchaToken = "";
      if (captchaRef.current) {
        let readyRetries = 0;
        const maxReadyRetries = 30;
        while (
          readyRetries < maxReadyRetries &&
          !captchaRef.current.isReady()
        ) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          readyRetries++;
        }

        if (!captchaRef.current.isReady()) {
          setSubmitError(
            "reCAPTCHA is not ready. Please wait a moment and try again.",
          );
          setIsSubmitting(false);
          return;
        }

        let retries = 0;
        const maxRetries = 10;
        while (retries < maxRetries) {
          try {
            const token = await captchaRef.current.execute("submit");
            if (token) {
              recaptchaToken = token;
              break;
            }
          } catch (error) {
            // continue retrying
          }

          if (retries < maxRetries - 1) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            retries++;
          } else {
            break;
          }
        }
      } else {
        setSubmitError(
          "reCAPTCHA is not initialized. Please refresh the page and try again.",
        );
        setIsSubmitting(false);
        return;
      }

      if (!recaptchaToken) {
        setSubmitError(
          "reCAPTCHA verification failed. Please refresh the page and try again.",
        );
        setIsSubmitting(false);
        return;
      }

      const submitData = new FormData();
      submitData.append("name", personalDetails.name);
      submitData.append("email", personalDetails.email);
      if (personalDetails.company) {
        submitData.append("company", personalDetails.company);
      }
      submitData.append(
        "needsInvoice",
        personalDetails.needsInvoice.toString(),
      );
      if (personalDetails.additionalNotes) {
        submitData.append("additionalNotes", personalDetails.additionalNotes);
      }
      submitData.append("selectedDate", selectedDates[0]);
      submitData.append("selectedRoomId", selectedRoomId);
      if (accommodationNotes) {
        submitData.append("accommodationNotes", accommodationNotes);
      }
      submitData.append("recaptchaToken", recaptchaToken);

      const response = await fetch("/api/submit-reservation", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setShowThankYou(true);
        reset();
        if (captchaRef.current) {
          captchaRef.current.reset();
        }
      } else {
        setSubmitError(data.error || "Failed to submit reservation");
      }
    } catch (error) {
      setSubmitError(
        "An error occurred while submitting your reservation. Please try again.",
      );
      console.error("Reservation submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Captcha ref={captchaRef} siteKey={siteKey} />
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
                <ReservationAccordionContent className="sm:pl-18">
                  {isStep3 ? (
                    <Step3
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                      error={submitError}
                    />
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
