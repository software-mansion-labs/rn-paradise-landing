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

export const dateOptions: DateOption[] = [
  { id: "date1", label: "26.04-3.05.2026", available: true },
  { id: "date2", label: "3.05-10.05.2026", available: true },
  { id: "date3", label: "10.05-17.05.2026", available: true },
];

interface ReservationState {
  currentStep: number;
  selectedDates: string[];
  rooms: Room[];
  personalDetails: PersonalDetails;
  accommodationNotes: string;
  setCurrentStep: (step: number) => void;
  setSelectedDates: (dates: string[]) => void;
  toggleRoom: (roomId: string) => void;
  updatePersonalDetails: (details: Partial<PersonalDetails>) => void;
  setAccommodationNotes: (notes: string) => void;
  reset: () => void;
}

const defaultRooms: Room[] = [
  {
    id: "private-bedroom-shared",
    name: "Private bedroom in a shared apartment ",
    descriptions: [
      "A 7-night stay in a private bedroom in a two-bedroom apartment.",
      "Shared bathroom and fully equipped kitchen (shared with 1 other guest).",
      "All meals and drinks included (breakfast, lunch, dinner, soft drinks).",
      "Access to workshops.",
    ],
    selected: false,
    price: 1800,
    people_count: 1,
  },
  {
    id: "private-bedroom-private-apartment",
    name: "Private bedroom with a private apartment",
    descriptions: [
      "A 7-night stay in a private bedroom in your own apartment.",
      "Private bathroom and fully equipped kitchen.",
      "All meals and drinks included (breakfast, lunch, dinner, soft drinks).",
      "Access to workshops.",
    ],
    selected: false,
    price: 2400,
    people_count: 1,
  },
  {
    id: "whole-apartment-two-bedrooms",
    name: "The whole apartment with two bedrooms",
    descriptions: [
      "A 7-night stay in a private two-bedroom apartment (for 2 people).",
      "Two private bedrooms, shared bathroom and fully equipped kitchen.",
      "All meals and drinks included (breakfast, lunch, dinner, soft drinks).",
      "Access to workshops.",
    ],
    selected: false,
    price: 4000,
    people_count: 2,
  },
  {
    id: "individual-offer-group",
    name: "Individual offer for bigger group reservation",
    descriptions: [
      "If you'd like to make a reservation for a group of more than two people, please contact us – we will prepare a personalized offer.",
    ],
    selected: false,
    people_count: 3,
  },
];

const defaultPersonalDetails: PersonalDetails = {
  name: "",
  email: "",
  company: "",
  needsInvoice: false,
  additionalNotes: "",
};

export const useReservationStore = create<ReservationState>()((set) => ({
  currentStep: 0,
  selectedDates: [],
  rooms: defaultRooms,
  personalDetails: defaultPersonalDetails,
  accommodationNotes: "",
  setCurrentStep: (step) => set({ currentStep: step }),
  setSelectedDates: (dates) => set({ selectedDates: dates }),
  toggleRoom: (roomId) =>
    set((state) => {
      const clickedRoom = state.rooms.find((r) => r.id === roomId);
      const isCurrentlySelected = clickedRoom?.selected ?? false;

      return {
        rooms: state.rooms.map((room) =>
          room.id === roomId
            ? { ...room, selected: !isCurrentlySelected }
            : { ...room, selected: false },
        ),
      };
    }),
  updatePersonalDetails: (details) =>
    set((state) => ({
      personalDetails: { ...state.personalDetails, ...details },
    })),
  setAccommodationNotes: (notes) => set({ accommodationNotes: notes }),
  reset: () =>
    set({
      currentStep: 0,
      selectedDates: [],
      rooms: defaultRooms,
      personalDetails: defaultPersonalDetails,
      accommodationNotes: "",
    }),
}));
