import { create } from "zustand";

export interface PersonOption {
  id: number;
  name: string;
}

export type PageType = "raffles" | "gumballs" | "auctions";

interface FiltersStore {
  isFilterOpen: boolean;
  filtersApplied: boolean;
  pageType: PageType;

  raffleType: "token" | "nft";

  selectedToken: PersonOption | null;
  selectedCollection: PersonOption | null;

  floorMin: string;
  floorMax: string;

  endTimeAfter: { date: string; time: string };
  endTimeBefore: { date: string; time: string };

  tokenOptions: PersonOption[];
  collectionOptions: PersonOption[];

  setFilterOpen: (val: boolean) => void;
  setPageType: (val: PageType) => void;
  setRaffleType: (val: "token" | "nft") => void;
  setSelectedToken: (val: PersonOption | null) => void;
  setSelectedCollection: (val: PersonOption | null) => void;

  setFloorMin: (val: string) => void;
  setFloorMax: (val: string) => void;

  setEndTimeAfter: (date: string, time: string) => void;
  setEndTimeBefore: (date: string, time: string) => void;

  setTokenOptions: (options: PersonOption[]) => void;
  setCollectionOptions: (options: PersonOption[]) => void;

  applyFilters: () => void;
  clearFilter: (filterId: string) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersStore>((set) => ({
  isFilterOpen: false,
  filtersApplied: false,
  pageType: "raffles",
  raffleType: "token",

  selectedToken: null,
  selectedCollection: null,

  floorMin: "",
  floorMax: "",

  endTimeAfter: { date: "", time: "" },
  endTimeBefore: { date: "", time: "" },

  tokenOptions: [],
  collectionOptions: [],

  setFilterOpen: (val) => set({ isFilterOpen: val }),
  setPageType: (val) => set({ pageType: val }),
  setRaffleType: (val) => set({ raffleType: val }),
  setSelectedToken: (val) => set({ selectedToken: val }),
  setSelectedCollection: (val) => set({ selectedCollection: val }),

  setFloorMin: (val) => set({ floorMin: val }),
  setFloorMax: (val) => set({ floorMax: val }),
  setEndTimeAfter: (date, time) => set({ endTimeAfter: { date, time } }),
  setEndTimeBefore: (date, time) => set({ endTimeBefore: { date, time } }),

  setTokenOptions: (options) => set({ tokenOptions: options }),
  setCollectionOptions: (options) => set({ collectionOptions: options }),

  applyFilters: () => set({ filtersApplied: true, isFilterOpen: false }),
  
  clearFilter: (filterId) =>
    set((state) => {
      const updates: Partial<FiltersStore> = {};
      switch (filterId) {
        case "raffleType":
          updates.raffleType = "token";
          break;
        case "token":
          updates.selectedToken = null;
          break;
        case "collection":
          updates.selectedCollection = null;
          break;
        case "floor":
          updates.floorMin = "";
          updates.floorMax = "";
          break;
        case "endTimeAfter":
          updates.endTimeAfter = { date: "", time: "" };
          break;
        case "endTimeBefore":
          updates.endTimeBefore = { date: "", time: "" };
          break;
      }
      return { ...state, ...updates };
    }),

  resetFilters: () =>
    set({
      filtersApplied: false,
      raffleType: "token",
      selectedToken: null,
      selectedCollection: null,
      floorMin: "",
      floorMax: "",
      endTimeAfter: { date: "", time: "" },
      endTimeBefore: { date: "", time: "" },
    }),
}));
