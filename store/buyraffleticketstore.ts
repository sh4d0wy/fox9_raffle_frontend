import { create } from "zustand"

interface State {
  ticketQuantity:number
  setTicketQuantity: (quantity:number) => void
  ticketQuantityById:{
    raffleId:number,
    quantity:number,
  }[];
  setTicketQuantityById: (raffleId:number, quantity:number) => void;
  getTicketQuantityById: (raffleId:number) => number;
  updateTicketQuantityById: (raffleId:number, quantity:number) => void;
}

export const useBuyRaffleTicketStore = create<State>((set, get) => ({
  ticketQuantity: 1,  
  setTicketQuantity: (quantity) => set({ ticketQuantity: quantity }),
  ticketQuantityById: [],
  setTicketQuantityById: (raffleId, quantity) => set({ ticketQuantityById: [...get().ticketQuantityById, { raffleId, quantity }] }),
  getTicketQuantityById: (raffleId) => get().ticketQuantityById.find((item) => item.raffleId === raffleId)?.quantity ?? 1,
  updateTicketQuantityById: (raffleId, quantity) => {
    const existing = get().ticketQuantityById.find((item) => item.raffleId === raffleId);
    if (existing) {
      set({ ticketQuantityById: get().ticketQuantityById.map((item) => item.raffleId === raffleId ? { ...item, quantity } : item) });
    } else {
      set({ ticketQuantityById: [...get().ticketQuantityById, { raffleId, quantity }] });
    }
  },
}))
