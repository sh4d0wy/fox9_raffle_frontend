import { create } from "zustand";

/* ----------------------------- Global Types ----------------------------- */

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
  searchQuery: string;

  setSort: (val: string) => void;
  setFilter: (val: string) => void;
  setRaffles: (data: Raffle[]) => void;
  setSearchQuery: (val: string) => void;
}

interface NavbarState {
  isAuth: boolean;
  walletAddress: string | null;

  showSettingsModal: boolean;
  showNotificationModal: boolean;
  showMobileMenu: boolean;

  setAuth: (auth: boolean, address?: string | null) => void;
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

/* ----------------------------- Amount Store ----------------------------- */

export const useAmountStore = create<AmountStore>((set) => ({
  amount: "",
  currency: "SOL",
  setAmount: (value) => set({ amount: value }),
  setCurrency: (value) => set({ currency: value }),
}));

/* ----------------------------- Global Store ----------------------------- */

export const useGlobalStore = create<GlobalStore>((set) => ({
  sort: "Sort",
  filter: "",
  raffles: [],
  searchQuery: "",

  setSort: (val) => set({ sort: val }),
  setFilter: (val) => set({ filter: val }),
  setRaffles: (data) => set({ raffles: data }),
  setSearchQuery: (val) => set({ searchQuery: val }),
}));

/* ----------------------------- Navbar Store ----------------------------- */

export const useNavbarStore = create<NavbarState>((set) => ({
  isAuth: false, // wallet is source of truth
  walletAddress: null,

  showSettingsModal: false,
  showNotificationModal: false,
  showMobileMenu: false,

  setAuth: (auth, address = null) =>
    set({
      isAuth: auth,
      walletAddress: address,
    }),

  openSettings: () => set({ showSettingsModal: true }),
  closeSettings: () => set({ showSettingsModal: false }),

  openNotifications: () => set({ showNotificationModal: true }),
  closeNotifications: () => set({ showNotificationModal: false }),

  toggleMobileMenu: () =>
    set((state) => ({ showMobileMenu: !state.showMobileMenu })),
}));
