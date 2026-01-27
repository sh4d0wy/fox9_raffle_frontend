import { useQuery } from "@tanstack/react-query";
import {
  getAuctionCreated,
  getAuctionFavourite,
  getAuctionPurchased,
  getGumballCreated,
  getGumballFavourite,
  getGumballPurchased,
  getProfileAuctionStats,
  getProfileGumballStats,
  getProfileRaffleStats,
  getRaffleCreated,
  getRaffleFavourite,
  getRafflePurchased,
} from "../api/routes/userRoutes";

export type MainFilter = "Rafflers" | "Gumballs" | "Auctions";
export type TabFilter = "created" | "purchased" | "favourite";

export const useProfileStats = (
  publicKey: string,
  mainFilter: MainFilter = "Rafflers",
  tabFilter: TabFilter = "created"
) => {
  const isRaffles = mainFilter === "Rafflers";
  const isGumballs = mainFilter === "Gumballs";
  const isAuctions = mainFilter === "Auctions";

  // Only fetch stats for the active category
  const getRaffleStats = useQuery({
    queryKey: ["profile-raffle-stats", publicKey],
    queryFn: async () => {
      const raffleStats = await getProfileRaffleStats(publicKey);
      return raffleStats;
    },
    enabled: !!publicKey && isRaffles,
    staleTime: 60000,
  });
  const getGumballStats = useQuery({
    queryKey: ["profile-gumball-stats", publicKey],
    queryFn: async () => {
      const gumballStats = await getProfileGumballStats(publicKey);
      return gumballStats;
    },
    enabled: !!publicKey && isGumballs,
    staleTime: 60000,
  });
  const getAuctionStats = useQuery({
    queryKey: ["profile-auction-stats", publicKey],
    queryFn: async () => {
      const auctionStats = await getProfileAuctionStats(publicKey);
      return auctionStats;
    },
    enabled: !!publicKey && isAuctions,
    staleTime: 60000,
  });

  // Only fetch cards for the active category + tab
  const getRaffleCreatedCards = useQuery({
    queryKey: ["profile-raffle-created", publicKey],
    queryFn: async () => {
      const raffleCreated = await getRaffleCreated(publicKey);
      return raffleCreated.raffles;
    },
    enabled: !!publicKey && isRaffles && tabFilter === "created",
    staleTime: 60000,
    refetchInterval: 60000,
  });
  const getRafflePurchasedCards = useQuery({
    queryKey: ["profile-raffle-purchased", publicKey],
    queryFn: async () => {
      const rafflePurchased = await getRafflePurchased(publicKey);
      return rafflePurchased.raffles;
    },
    enabled: !!publicKey && isRaffles && tabFilter === "purchased",
    staleTime: 60000,
    refetchInterval: 60000,
  });
  const getRaffleFavouriteCards = useQuery({
    queryKey: ["profile-raffle-favourite", publicKey],
    queryFn: async () => {
      const raffleFavourite = await getRaffleFavourite(publicKey);
      return raffleFavourite.raffles;
    },
    enabled: !!publicKey && isRaffles && tabFilter === "favourite",
    staleTime: 60000,
    refetchInterval: 60000,
  });

  const getGumballCreatedCards = useQuery({
    queryKey: ["profile-gumball-created", publicKey],
    queryFn: async () => {
      const gumballCreated = await getGumballCreated(publicKey);
      return gumballCreated.gumballs;
    },
    enabled: !!publicKey && isGumballs && tabFilter === "created",
    staleTime: 60000,
    refetchInterval: 60000,
  });
  const getGumballPurchasedCards = useQuery({
    queryKey: ["profile-gumball-purchased", publicKey],
    queryFn: async () => {
      const gumballPurchased = await getGumballPurchased(publicKey);
      return gumballPurchased.gumballs;
    },
    enabled: !!publicKey && isGumballs && tabFilter === "purchased",
    staleTime: 60000,
    refetchInterval: 60000,
  });
  const getGumballFavouriteCards = useQuery({
    queryKey: ["profile-gumball-favourite", publicKey],
    queryFn: async () => {
      const gumballFavourite = await getGumballFavourite(publicKey);
      return gumballFavourite.gumballs;
    },
    enabled: !!publicKey && isGumballs && tabFilter === "favourite",
    staleTime: 60000,
    refetchInterval: 60000,
  });
  const getAuctionCreatedCards = useQuery({
    queryKey: ["profile-auction-created", publicKey],
    queryFn: async () => {
      const auctionCreated = await getAuctionCreated(publicKey);
      return auctionCreated.auctions;
    },
    enabled: !!publicKey && isAuctions && tabFilter === "created",
    staleTime: 60000,
    refetchInterval: 60000,
  });
  const getAuctionPurchasedCards = useQuery({
    queryKey: ["profile-auction-purchased", publicKey],
    queryFn: async () => {
      const auctionPurchased = await getAuctionPurchased(publicKey);
      return auctionPurchased.auctions;
    },
    enabled: !!publicKey && isAuctions && tabFilter === "purchased",
    staleTime: 60000,
    refetchInterval: 60000,
  });
  const getAuctionFavouriteCards = useQuery({
    queryKey: ["profile-auction-favourite", publicKey],
    queryFn: async () => {
      const auctionFavourite = await getAuctionFavourite(publicKey);
      return auctionFavourite.auctions;
    },
    enabled: !!publicKey && isAuctions && tabFilter === "favourite",
    staleTime: 60000,
    refetchInterval: 60000,
  });
  return {
    getRaffleStats,
    getGumballStats,
    getAuctionStats,
    getRaffleCreatedCards,
    getRafflePurchasedCards,
    getRaffleFavouriteCards,
    getGumballCreatedCards,
    getGumballPurchasedCards,
    getGumballFavouriteCards,
    getAuctionCreatedCards,
    getAuctionPurchasedCards,
    getAuctionFavouriteCards,
  };
};
