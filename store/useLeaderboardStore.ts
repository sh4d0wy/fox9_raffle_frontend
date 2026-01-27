import { create } from "zustand";

export type LeaderboardTab = "Top Rafflers" | "Top Buyers";
export type SortFilter = "Raffles created" | "Tickets Sold" | "Volume";
export type TimeFilter = "All Time" | "2W" | "1D";

interface LeaderboardState {
  activeTab: LeaderboardTab;
  setActiveTab: (tab: LeaderboardTab) => void;

  sortFilter: SortFilter;
  setSortFilter: (filter: SortFilter) => void;

  timeFilter: TimeFilter;
  setTimeFilter: (filter: TimeFilter) => void;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  activeTab: "Top Rafflers",
  setActiveTab: (tab) => set({ activeTab: tab }),

  sortFilter: "Raffles created",
  setSortFilter: (filter) => set({ sortFilter: filter }),

  timeFilter: "All Time",
  setTimeFilter: (filter) => set({ timeFilter: filter }),
}));
