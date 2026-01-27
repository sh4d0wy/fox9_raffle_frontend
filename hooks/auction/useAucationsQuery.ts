import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchAuctions } from "../../api/AuctionsApi"

export const useAucationsQuery = (filter: string) => {
  return useInfiniteQuery({
    queryKey: ["aucations", filter],
    queryFn: ({ pageParam = 1 }) => fetchAuctions({ pageParam, filter }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })
}
