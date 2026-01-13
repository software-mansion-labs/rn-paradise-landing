import { useReservationStore } from "@/stores/reservationStore";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { RoomCard } from "./RoomCard";

export function Step1() {
  const {
    selectedDates,
    rooms,
    selectedRoomId,
    dateOptions,
    dateRoomAvailability,
    setSelectedDates,
    toggleRoom,
    setCurrentStep,
    accommodationNotes,
    setAccommodationNotes,
  } = useReservationStore();

  const selectedDate = selectedDates[0];
  const availability = selectedDate
    ? dateRoomAvailability.find((a) => a.dateId === selectedDate)
    : null;
  const availableRooms = availability
    ? rooms.filter((room) => availability.availableRoomIds.includes(room.id))
    : [];

  const handleNext = () => {
    if (selectedDates.length > 0 && selectedRoomId) {
      setCurrentStep(1);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <p className="text-primary text-xs">
        Not all dates are guaranteed – select all that work for you:
      </p>

      <ToggleGroup
        type="single"
        value={selectedDates[0] || ""}
        onValueChange={(value) => setSelectedDates(value ? [value] : [])}
        className="flex flex-wrap gap-2"
      >
        {dateOptions.map((date) => (
          <ToggleGroupItem
            key={date.id}
            value={date.id}
            disabled={!date.available}
            className={cn(!date.available && "cursor-not-allowed opacity-50")}
          >
            {date.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {selectedDate && (
        <div className="flex flex-col gap-4">
          <h4 className="text-primary text-sm">Available rooms:</h4>
          {availableRooms.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
                slidesToScroll: 1,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-6 items-stretch">
                {availableRooms.map((room) => (
                  <CarouselItem
                    key={room.id}
                    className="flex min-w-0 basis-4/5 pl-6 sm:basis-3/5 md:basis-2/5"
                  >
                    <RoomCard
                      room={room}
                      onToggle={() => toggleRoom(room.id)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <p className="text-primary/80 text-xs">
              No rooms available for this date.
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="text-primary text-xs leading-[150%]">
          <p>We also offer additional accommodation options for couples:</p>
          <ol className="list-inside list-decimal pl-4">
            <li>
              Share a bed with someone from your group who will also attend the
              workshops (+1000€).
            </li>
            <li>
              Share a bed with someone who won't attend the workshops (+500€).
            </li>
          </ol>
          <p>If you're interested let us know!</p>
        </div>

        <textarea
          id="accommodation-note"
          value={accommodationNotes}
          onChange={(e) => setAccommodationNotes(e.target.value)}
          placeholder="Write something..."
          rows={2}
          className="text-primary border-primary placeholder:text-primary/50 resize-none rounded-sm border px-4 py-3 text-xs placeholder:text-xs focus:outline-none"
        />
      </div>

      <div className="flex justify-start pt-4">
        <Button
          onClick={handleNext}
          disabled={selectedDates.length === 0 || !selectedRoomId}
          size="lg"
        >
          Next step →
        </Button>
      </div>
    </div>
  );
}
