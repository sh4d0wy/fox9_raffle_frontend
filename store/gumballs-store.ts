import { create } from "zustand"
import { GumballsData } from "../data/gumballs-data"

interface State {
  gumballs: typeof GumballsData
  setGumballs: (data: typeof GumballsData) => void
  filter: string
  setFilter: (filter: string) => void
}

export const useRafflesStore = create<State>((set) => ({
  gumballs: GumballsData, 
  setGumballs: (data) => set({ gumballs: data }),
  filter: "Featured",
  setFilter: (filter) => set({ filter }),   
}))
