import { create } from "zustand";

type MainFilter = "Rafflers" | "Auctions" | "Gumballs";
type RafflerFilter = "created" | "purchased" | "favourite" | "followed";

interface CreatorProfileState {
  mainFilter: MainFilter;
  setMainFilter: (tab: MainFilter) => void;

  rafflerFilter: RafflerFilter;
  setRafflerFilter: (value: RafflerFilter) => void;

  enabled: boolean;
  setEnabled: (value: boolean) => void;
}

export const useCreatorProfileStore = create<CreatorProfileState>((set) => ({
  mainFilter: "Rafflers",
  setMainFilter: (tab) => set({ mainFilter: tab }),

  rafflerFilter: "created",
  setRafflerFilter: (value) => set({ rafflerFilter: value }),

  enabled: false,
  setEnabled: (value) => set({ enabled: value }),
}));
