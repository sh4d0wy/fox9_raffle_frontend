import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { fetchGumballById, fetchGumballs } from "../../api/GumballsApi"
import type { GumballBackendDataType } from "../../types/backend/gumballTypes"
import { useWallet } from "@solana/wallet-adapter-react";

export const useGumballsQuery = (filter: string) => {
  const { publicKey } = useWallet();  
  return useInfiniteQuery({
    queryKey: ["gumballs", filter],
    queryFn: ({ pageParam = 1 }) => fetchGumballs({ pageParam, filter, currentWallet: publicKey?.toBase58() ?? "" }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })
}

export const useGumballById = (id:string) => {
  return useQuery({
    queryKey: ["gumball", id],
    queryFn: () => {
      const data = fetchGumballById(id);
      return data as Promise<GumballBackendDataType>;
    },
    enabled: !!id,
    staleTime: 5000,
  })
}