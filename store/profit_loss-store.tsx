import { create } from "zustand";

export type TimeframeFilter = "daily" | "monthly" | "yearly";
export type ServiceFilter = "Raffle" | "Gumball";
export type CurrencyFilter = "Raffle" | "Gumball";

interface FiltersState {
  timeframe: TimeframeFilter;
  setTimeframe: (value: TimeframeFilter) => void;
  year: number;
  setYear: (value: number) => void;
  services: { name: ServiceFilter; active: boolean }[];
  toggleService: (name: ServiceFilter, active: boolean) => void;

  currency: CurrencyFilter;
  setCurrency: (value: CurrencyFilter) => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  timeframe: "daily",
  setTimeframe: (value) => set({ timeframe: value }),

  year: new Date().getFullYear(),
  setYear: (value) => set({ year: value }),

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
