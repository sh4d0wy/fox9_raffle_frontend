import { create } from "zustand"
import { GumballsData } from "../data/gumballs-data"

interface State {
  gumballs: typeof GumballsData
  setGumballs: (data: typeof GumballsData) => void
  filter: string
  setFilter: (filter: string) => void
}

export const useGumballsStore = create<State>((set) => ({
  gumballs: GumballsData, 
  setGumballs: (data) => set({ gumballs: data }),
  filter: "All Gumballs",
  setFilter: (filter) => set({ filter }),   
}))
