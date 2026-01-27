import { useQuery } from "@tanstack/react-query";
import { getAnalyticsAverageTickets, getAnalyticsPurchases, getAnalyticsRaffles, getAnalyticsRaffleType, getAnalyticsUniqueBuyers, getAnalyticsVolume } from "../../api/routes/statsRoutes";
export const useAnalyticsStats = ({timeframe}:{timeframe:"day"|"week"|"month"|"year"}) => {
    const volume = useQuery({
        queryKey: ['analytics-volume', timeframe],
        queryFn: async () => await getAnalyticsVolume(timeframe),
    });  
    const raffles = useQuery({
        queryKey: ['analytics-raffles', timeframe],
        queryFn: async () => await getAnalyticsRaffles(7),
    });
    const purchases = useQuery({
        queryKey: ['analytics-purchases', timeframe],
        queryFn: async () => await getAnalyticsPurchases(7),
    });
    const averageTickets = useQuery({
        queryKey: ['analytics-average-tickets', timeframe],
        queryFn: async () => await getAnalyticsAverageTickets(timeframe),
    });
    const uniqueBuyers = useQuery({
        queryKey: ['analytics-unique-buyers', timeframe],
        queryFn: async () => await getAnalyticsUniqueBuyers(timeframe),
    });
    const raffleType = useQuery({
        queryKey: ['analytics-raffle-type', timeframe],
        queryFn: async () => await getAnalyticsRaffleType(timeframe),
    });
    return { volume, raffles, purchases, averageTickets, uniqueBuyers, raffleType };
}