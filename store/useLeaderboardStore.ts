import { create } from "zustand";

export type LeaderboardTab = "Top Rafflers" | "Top Buyers";
export type SortFilter = {
  label: string;
  value: "raffles" | "tickets" | "volume";
};
export type TimeFilter = {
  label: string;
  value: "all" | "7d" | "30d" | "90d" | "1y";
};

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

  sortFilter: { label: "Raffles created", value: "raffles" },
  setSortFilter: (filter: SortFilter) => set({ sortFilter: filter }),

  timeFilter: { label: "All Time", value: "all" },
  setTimeFilter: (filter) => set({ timeFilter: filter }),
}));
