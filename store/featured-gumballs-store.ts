import { create } from "zustand";
import { GumballsFeaturedData } from "../data/gumballs-featured-data";

interface FeaturedGumballsStore {
  gumballs: typeof GumballsFeaturedData;
  loading: boolean;
  fetchGumballs: () => void;
}

export const useFeaturedRafflesStore = create<FeaturedGumballsStore>((set) => ({
  gumballs: [],
  loading: true,
  fetchGumballs: () => {
    set({ loading: true });
    setTimeout(() => {
      set({ gumballs: GumballsFeaturedData, loading: false });
    }, 500);
  },
}));
