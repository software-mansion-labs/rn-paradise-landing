import { useReservationStore } from "@/stores/reservationStore";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface Step3Props {
  onSubmit: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export function Step3({ onSubmit, isSubmitting = false, error }: Step3Props) {
  const {
    selectedDates,
    rooms,
    selectedRoomId,
    dateOptions,
    personalDetails,
    accommodationNotes,
    setCurrentStep,
  } = useReservationStore();

  const selectedRoom = selectedRoomId
    ? rooms.find((r) => r.id === selectedRoomId)
    : null;
  const selectedDateLabels = selectedDates
    .map((dateId) => dateOptions.find((d) => d.id === dateId)?.label)
    .filter(Boolean) as string[];

  return (
    <div className="flex w-full flex-col gap-6">
      <p className="text-primary text-xs leading-[150%]">
        We'll send you payment and event details – we'll confirm your
        reservation once enough participants sign up.
      </p>

      <div className="flex flex-col gap-4">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <Button
            onClick={onSubmit}
            size="xl"
            disabled={isSubmitting}
            className="max-sm:order-2"
          >
            {isSubmitting ? "Submitting..." : "Submit request"}
          </Button>
          <div className="flex items-center gap-2 max-sm:order-1">
            <Info className="color-primary/80 h-5 w-5" />
            <p className="text-primary/80 text-2xs">
              We'll get back to you within 5 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
