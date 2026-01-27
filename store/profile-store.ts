import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ----------------------------- Profile Types ----------------------------- */

interface SocialLinks {
  twitter?: string;
  discord?: string;
  website?: string;
}

interface ProfileStats {
  // Raffle Stats
  rafflesCreated: number;
  ticketsSold: number;
  salesVolume: number;
  rafflesBought: number;
  ticketsBought: number;
  rafflesWon: number;
  purchaseVolume: number;
  // Gumball Stats
  gumballsBought: number;
  gumballsCreated: number;
  gumballsWon: number;
  gumballVolume: number;
  // Auction Stats
  auctionsParticipated: number;
  auctionsCreated: number;
  auctionsWon: number;
  auctionVolume: number;
}

interface UserProfile {
  publicKey: string;
  username: string;
  avatar?: string;
  bio?: string;
  socialLinks: SocialLinks;
  foxStaked: boolean;
  isVerified: boolean;
  stats: ProfileStats;
  followers: number;
  following: number;
  createdAt?: string;
}

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearProfile: () => void;

  // Social Links
  updateSocialLinks: (links: Partial<SocialLinks>) => void;

  // Stats
  updateStats: (stats: Partial<ProfileStats>) => void;
}

/* ----------------------------- Default Values ----------------------------- */

const defaultStats: ProfileStats = {
  // Raffle Stats
  rafflesCreated: 0,
  ticketsSold: 0,
  salesVolume: 0,
  rafflesBought: 0,
  ticketsBought: 0,
  rafflesWon: 0,
  purchaseVolume: 0,
  // Gumball Stats
  gumballsBought: 0,
  gumballsCreated: 0,
  gumballsWon: 0,
  gumballVolume: 0,
  // Auction Stats
  auctionsParticipated: 0,
  auctionsCreated: 0,
  auctionsWon: 0,
  auctionVolume: 0,
};

/* ----------------------------- Profile Store ----------------------------- */

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      isLoading: false,
      error: null,

      setProfile: (profile) => set({ profile, error: null }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...updates }
            : null,
        })),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearProfile: () => set({ profile: null, error: null }),

      updateSocialLinks: (links) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                socialLinks: { ...state.profile.socialLinks, ...links },
              }
            : null,
        })),

      updateStats: (stats) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                stats: { ...state.profile.stats, ...stats },
              }
            : null,
        })),
    }),
    {
      name: "fox-profile-storage",
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);

/* ----------------------------- Exports ----------------------------- */

export type { UserProfile, SocialLinks, ProfileStats };
export { defaultStats };

