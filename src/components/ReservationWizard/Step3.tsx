import { useReservationStore, dateOptions } from "@/stores/reservationStore";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface Step3Props {
  onSubmit: () => void;
}

export function Step3({ onSubmit }: Step3Props) {
  const {
    selectedDates,
    rooms,
    personalDetails,
    accommodationNotes,
    setCurrentStep,
  } = useReservationStore();

  const selectedRooms = rooms.filter((r) => r.selected);
  const selectedDateLabels = selectedDates
    .map((dateId) => dateOptions.find((d) => d.id === dateId)?.label)
    .filter(Boolean) as string[];

  return (
    <div className="flex w-full flex-col gap-6">
      <p className="text-primary text-sm leading-[150%]">
        We'll send you payment and event details – we'll confirm your
        reservation once enough participants sign up.
      </p>

      <div className="flex items-center gap-6">
        <Button onClick={onSubmit} size="xl">
          Submit request
        </Button>
        <div className="flex items-center gap-2">
          <Info className="color-primary/80 h-5 w-5" />
          <p className="text-primary/80 text-sm">
            We'll get back to you within 5 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
