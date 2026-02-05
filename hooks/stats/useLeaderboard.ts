import { useQuery } from "@tanstack/react-query";
import { getRafflerLeaderboard, getRaffleBuyerLeaderboard } from "../../api/routes/statsRoutes";


export const useLeaderboard = ({timeframe, sortFilter}:{timeframe:string, sortFilter:string}) => {
    const rafflerLeaderboard = useQuery({
        queryKey: ['raffler-leaderboard', timeframe, sortFilter],
        queryFn: async () => await getRafflerLeaderboard({timeframe, sortFilter}),
    });
    const raffleBuyerLeaderboard = useQuery({
        queryKey: ['raffle-buyer-leaderboard', timeframe, sortFilter],
        queryFn: async () => await getRaffleBuyerLeaderboard({timeframe, sortFilter}),
    });
    return { rafflerLeaderboard, raffleBuyerLeaderboard };
}