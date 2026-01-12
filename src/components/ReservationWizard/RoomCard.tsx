import { Button } from "@/components/ui/button";
import type { Room } from "@/stores/reservationStore";
import { parseToHtml } from "@/utils/textParser";

interface RoomCardProps {
  room: Room;
  onToggle: () => void;
}

export function RoomCard({ room, onToggle }: RoomCardProps) {
  const isIndividualOffer = !room.price;

  return (
    <div className="bg-reservation-blue-bright flex h-full w-full flex-col items-center justify-between px-14 py-16">
      <div className="flex flex-1 flex-col gap-6">
        <span className="text-primary text-lg font-bold">{room.name}</span>
        <span className="text-primary text-sm">
          <div className="flex items-center justify-center">
            {room.people_count && room.people_count > 1 ? (
              <div className="flex items-center gap-1.5">
                <img
                  src="/assets/reservation-icons/Person.svg"
                  alt="Person"
                  className="h-3 w-3"
                />
                <img
                  src="/assets/reservation-icons/Person.svg"
                  alt="Person"
                  className="h-3 w-3"
                />
                {isIndividualOffer && (
                  <img
                    src="/assets/reservation-icons/Plus.svg"
                    alt="Plus"
                    className="h-3 w-3"
                  />
                )}
              </div>
            ) : (
              <img
                src="/assets/reservation-icons/Person.svg"
                alt="Person"
                className="h-3 w-3"
              />
            )}
          </div>
        </span>
        <ul className="text-primary/80 text-sm">
          {room.descriptions &&
            room.descriptions.map((description) => (
              <li key={description}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: parseToHtml(description),
                  }}
                />
              </li>
            ))}
        </ul>
      </div>

      <div className="flex w-full flex-col gap-4 pt-4">
        <div className="flex items-center justify-center">
          {isIndividualOffer ? (
            <span className="text-primary text-md">Individual offer</span>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-primary text-lg font-bold">
                {room.price || 1000}€
              </span>
              <span className="text-primary text-md">
                <span className="text-primary text-sm">
                  /{" "}
                  {room.people_count === 1
                    ? "person"
                    : `${room.people_count} people`}
                </span>
              </span>
            </div>
          )}
        </div>

        <Button
          variant={
            room.selected ? "reservationSelected" : "reservationNotSelected"
          }
          size="default"
          onClick={onToggle}
          className="shrink-0"
        >
          {room.selected ? "Unselect" : "Select"}
        </Button>
      </div>
    </div>
  );
}
