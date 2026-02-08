import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { fetchAuctionById, fetchAuctions } from "../../api/AuctionsApi"
import type { AuctionTypeBackend } from "../../types/backend/auctionTypes"
import type { TransactionTypeBackend } from "../../types/backend/raffleTypes"

export const useAuctionsQuery = (filter: string , currentWallet: string) => {
  return useInfiniteQuery({
    queryKey: ["auctions", filter],
    queryFn: ({ pageParam = 1 }) => fetchAuctions({ pageParam, filter, currentWallet }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })
}

type AuctionTypeBackendExtended = AuctionTypeBackend & {
  status: string;
  creator: { walletAddress: string; twitterId?: string };
  bids: [];
  endingTransaction: TransactionTypeBackend | null;
};

export const useAuctionById = (id:string) => {
  return useQuery({
    queryKey: ["auction", id],
    queryFn: () => {
      const data = fetchAuctionById(id);
      return data as Promise<AuctionTypeBackendExtended>;
    },
    enabled: !!id,
    staleTime: 20000,
    refetchInterval: 20000,
  })
}