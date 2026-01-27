import { useQuery } from "@tanstack/react-query";
import { getRafflerLeaderboard, getRaffleBuyerLeaderboard } from "../api/routes/statsRoutes";


export const useLeaderboard = () => {
    const rafflerLeaderboard = useQuery({
        queryKey: ['raffler-leaderboard'],
        queryFn: async () => await getRafflerLeaderboard(),
    });
    const raffleBuyerLeaderboard = useQuery({
        queryKey: ['raffle-buyer-leaderboard'],
        queryFn: async () => await getRaffleBuyerLeaderboard(),
    });
    return { rafflerLeaderboard, raffleBuyerLeaderboard };
}