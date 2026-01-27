import { useQuery, UseQueryResult } from "@tanstack/react-query"

interface UseTanStackQueryProps<T> {
  queryKey: string | readonly unknown[]
  queryFn: () => Promise<T>
}


export const useTanStackQuery = <T>({ queryKey, queryFn }: UseTanStackQueryProps<T>): UseQueryResult<T> => {
  return useQuery<T>({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn,
  })
}
