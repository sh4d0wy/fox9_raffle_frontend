import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchGumballs } from "../api/GumballsApi"

export const useGumballsQuery = (filter: string) => {
  
  return useInfiniteQuery({
    queryKey: ["gumballs", filter],
    queryFn: ({ pageParam = 1 }) => fetchGumballs({ pageParam, filter }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })
}
