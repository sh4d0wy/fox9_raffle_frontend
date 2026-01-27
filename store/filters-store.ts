import { create } from "zustand";

export interface PersonOption {
  id: number;
  name: string;
}

interface FiltersStore {
  isFilterOpen: boolean;

  raffleType: "token" | "nft";

  selectedToken: PersonOption | null;
  selectedCollection: PersonOption | null;

  floorMin: string;
  floorMax: string;

  tierMin: string;
  tierMax: string;

  endTimeAfter: { date: string; time: string };
  endTimeBefore: { date: string; time: string };

  tokenOptions: PersonOption[];
  collectionOptions: PersonOption[];

  setFilterOpen: (val: boolean) => void;
  setRaffleType: (val: "token" | "nft") => void;
  setSelectedToken: (val: PersonOption | null) => void;
  setSelectedCollection: (val: PersonOption | null) => void;

  setFloorMin: (val: string) => void;
  setFloorMax: (val: string) => void;

  setTierMin: (val: string) => void;
  setTierMax: (val: string) => void;

  setEndTimeAfter: (date: string, time: string) => void;
  setEndTimeBefore: (date: string, time: string) => void;

  setTokenOptions: (options: PersonOption[]) => void;
  setCollectionOptions: (options: PersonOption[]) => void;

  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersStore>((set) => ({
  isFilterOpen: false,
  raffleType: "token",

  selectedToken: null,
  selectedCollection: null,

  floorMin: "",
  floorMax: "",

  tierMin: "",
  tierMax: "",

  endTimeAfter: { date: "", time: "" },
  endTimeBefore: { date: "", time: "" },

  tokenOptions: [],
  collectionOptions: [],

  setFilterOpen: (val) => set({ isFilterOpen: val }),
  setRaffleType: (val) => set({ raffleType: val }),
  setSelectedToken: (val) => set({ selectedToken: val }),
  setSelectedCollection: (val) => set({ selectedCollection: val }),

  setFloorMin: (val) => set({ floorMin: val }),
  setFloorMax: (val) => set({ floorMax: val }),
  setTierMin: (val) => set({ tierMin: val }),
  setTierMax: (val) => set({ tierMax: val }),
  setEndTimeAfter: (date, time) => set({ endTimeAfter: { date, time } }),
  setEndTimeBefore: (date, time) => set({ endTimeBefore: { date, time } }),

  setTokenOptions: (options) => set({ tokenOptions: options }),
  setCollectionOptions: (options) => set({ collectionOptions: options }),

  resetFilters: () =>
    set({
      raffleType: "token",
      selectedToken: null,
      selectedCollection: null,
      floorMin: "",
      floorMax: "",
      tierMin: "",
      tierMax: "",
      endTimeAfter: { date: "", time: "" },
      endTimeBefore: { date: "", time: "" },
    }),
}));
