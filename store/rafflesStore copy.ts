import { create } from "zustand"
import { RafflesData } from "../data/raffles-data"

interface RafflesState {
  raffles: typeof RafflesData
  setRaffles: (data: typeof RafflesData) => void
  filter: string
  setFilter: (filter: string) => void
}

export const useRafflesStore = create<RafflesState>((set) => ({
  raffles: RafflesData, 
  setRaffles: (data) => set({ raffles: data }),
  filter: "All Raffles",
  setFilter: (filter) => set({ filter }),   
}))
