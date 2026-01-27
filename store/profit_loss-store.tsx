import { create } from "zustand";

export type TimeframeFilter = "Daily" | "Monthly" | "Yearly";
export type ServiceFilter = "Raffle" | "Gumball";
export type CurrencyFilter = "Raffle" | "Gumball";

interface FiltersState {
  timeframe: TimeframeFilter;
  setTimeframe: (value: TimeframeFilter) => void;

  services: { name: ServiceFilter; active: boolean }[];
  toggleService: (name: ServiceFilter, active: boolean) => void;

  currency: CurrencyFilter;
  setCurrency: (value: CurrencyFilter) => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  timeframe: "Daily",
  setTimeframe: (value) => set({ timeframe: value }),

  services: [
    { name: "Raffle", active: true },
    { name: "Gumball", active: false },
  ],
  toggleService: (name, active) =>
    set((state) => ({
      services: state.services.map((s) =>
        s.name === name ? { ...s, active } : s
      ),
    })),

  currency: "Raffle",
  setCurrency: (value) => set({ currency: value }),
}));
