import { create } from "zustand";
import { RafflesData } from "../data/raffles-featured-data";

interface FeaturedRafflesStore {
  raffles: typeof RafflesData;
  loading: boolean;
  fetchRaffles: () => void;
}

export const useFeaturedRafflesStore = create<FeaturedRafflesStore>((set) => ({
  raffles: [],
  loading: true,
  fetchRaffles: () => {
    set({ loading: true });
    setTimeout(() => {
      set({ raffles: RafflesData, loading: false });
    }, 500);
  },
}));
