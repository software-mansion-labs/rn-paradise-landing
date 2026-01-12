import { create } from "zustand";

export interface DateOption {
  id: string;
  label: string;
  available: boolean;
}

export interface Room {
  id: string;
  name: string;
  descriptions: string[];
  price?: number;
  people_count?: number;
  selected: boolean;
}

export interface DateRoomAvailability {
  dateId: string;
  availableRoomIds: string[];
}

export interface PersonalDetails {
  name: string;
  email: string;
  company: string;
  needsInvoice: boolean;
  additionalNotes: string;
}

export interface ReservationData {
  accommodationNotes: string;
}

interface ReservationState {
  currentStep: number;
  selectedDates: string[];
  rooms: Room[];
  selectedRoomId: string | null;
  personalDetails: PersonalDetails;
  accommodationNotes: string;
  dateOptions: DateOption[];
  dateRoomAvailability: DateRoomAvailability[];
  setCurrentStep: (step: number) => void;
  setSelectedDates: (dates: string[]) => void;
  toggleRoom: (roomId: string) => void;
  updatePersonalDetails: (details: Partial<PersonalDetails>) => void;
  setAccommodationNotes: (notes: string) => void;
  initializeFromCMS: (data: {
    dateOptions: DateOption[];
    rooms: Omit<Room, "selected">[];
    dateRoomAvailability: DateRoomAvailability[];
  }) => void;
  reset: () => void;
}

const createRoomsFromCMS = (cmsRooms: Omit<Room, "selected">[]): Room[] => {
  return cmsRooms.map((room) => ({
    ...room,
    selected: false,
  }));
};

const defaultPersonalDetails: PersonalDetails = {
  name: "",
  email: "",
  company: "",
  needsInvoice: false,
  additionalNotes: "",
};

let initialRooms: Room[] = [];
let initialDateOptions: DateOption[] = [];
let initialDateRoomAvailability: DateRoomAvailability[] = [];

export const useReservationStore = create<ReservationState>()((set) => ({
  currentStep: 0,
  selectedDates: [],
  rooms: initialRooms,
  selectedRoomId: null,
  personalDetails: defaultPersonalDetails,
  accommodationNotes: "",
  dateOptions: initialDateOptions,
  dateRoomAvailability: initialDateRoomAvailability,
  setCurrentStep: (step) => set({ currentStep: step }),
  setSelectedDates: (dates) => {
    set((state) => {
      const newSelectedDate = dates[0];
      const previousDate = state.selectedDates[0];
      const dateChanged = newSelectedDate !== previousDate;

      if (dateChanged && state.selectedRoomId) {
        return {
          selectedDates: dates,
          selectedRoomId: null,
          rooms: state.rooms.map((room) => ({
            ...room,
            selected: false,
          })),
        };
      }
      return { selectedDates: dates };
    });
  },
  toggleRoom: (roomId) =>
    set((state) => {
      const isCurrentlySelected = state.selectedRoomId === roomId;

      return {
        selectedRoomId: isCurrentlySelected ? null : roomId,
        rooms: state.rooms.map((room) => ({
          ...room,
          selected: room.id === roomId ? !isCurrentlySelected : false,
        })),
      };
    }),
  updatePersonalDetails: (details) =>
    set((state) => ({
      personalDetails: { ...state.personalDetails, ...details },
    })),
  setAccommodationNotes: (notes) => set({ accommodationNotes: notes }),
  initializeFromCMS: (data) => {
    initialRooms = createRoomsFromCMS(data.rooms);
    initialDateOptions = data.dateOptions;
    initialDateRoomAvailability = data.dateRoomAvailability;

    set({
      rooms: initialRooms,
      dateOptions: initialDateOptions,
      dateRoomAvailability: initialDateRoomAvailability,
    });
  },
  reset: () =>
    set({
      currentStep: 0,
      selectedDates: [],
      rooms: initialRooms,
      selectedRoomId: null,
      personalDetails: defaultPersonalDetails,
      accommodationNotes: "",
      dateOptions: initialDateOptions,
      dateRoomAvailability: initialDateRoomAvailability,
    }),
}));
