import { create } from "zustand";


interface Raffle {
  id: number;
  title: string;
  image: string;
  price: number;
}

interface GlobalStore {
  sort: string;
  filter: string;
  raffles: Raffle[];

  setSort: (val: string) => void;
  setFilter: (val: string) => void;
  setRaffles: (data: Raffle[]) => void;
}



interface NavbarState {
  isAuth: boolean;
  showSettingsModal: boolean;
  showNotificationModal: boolean;
  showMobileMenu: boolean;
  setAuth: (auth: boolean) => void;
  openSettings: () => void;
  closeSettings: () => void;
  openNotifications: () => void;
  closeNotifications: () => void;
  toggleMobileMenu: () => void;
}

interface AmountStore {
  amount: string;
  currency: string;
  setAmount: (value: string) => void;
  setCurrency: (value: string) => void;
}


export const useAmountStore = create<AmountStore>((set) => ({
  amount: "",
  currency: "SOL",
  setAmount: (value) => set({ amount: value }),
  setCurrency: (value) => set({ currency: value }),
}));

export const useGlobalStore = create<GlobalStore>((set) => ({
  sort: "Sort",
  filter: "",
  raffles: [],


  setSort: (val) => set({ sort: val }),
  setFilter: (val) => set({ filter: val }),
  setRaffles: (data) => set({ raffles: data }),
}));


export const useNavbarStore = create<NavbarState>((set) => ({
  isAuth: true,
  showSettingsModal: false,
  showNotificationModal: false,
  showMobileMenu: false,
  setAuth: (auth) => set({ isAuth: auth }),
  openSettings: () => set({ showSettingsModal: true }),
  closeSettings: () => set({ showSettingsModal: false }),
  openNotifications: () => set({ showNotificationModal: true }),
  closeNotifications: () => set({ showNotificationModal: false }),
  toggleMobileMenu: () => set((state) => ({ showMobileMenu: !state.showMobileMenu })),
}));