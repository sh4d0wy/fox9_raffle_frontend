import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchAucations } from "../api/AucationsApi"

export const useAucationsQuery = (filter: string) => {
  return useInfiniteQuery({
    queryKey: ["aucations", filter],
    queryFn: ({ pageParam = 1 }) => fetchAucations({ pageParam, filter }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })
}
