import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchRaffles } from "../api/rafflesApi"

export const useRaffles = (filter: string) => {
  return useInfiniteQuery({
    queryKey: ["raffles", filter],
    queryFn: ({ pageParam = 1 }) => fetchRaffles({ pageParam, filter }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })
}
