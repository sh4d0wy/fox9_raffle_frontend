import { useQuery } from "@tanstack/react-query";
import { getBoughtPnl, getSoldPnl } from "../../api/routes/statsRoutes";

export const usePnlStats = ({timeframe}:{timeframe:string}) => {
    const boughtPnl = useQuery({
        queryKey: ['bought-pnl', timeframe],
        queryFn: async () => await getBoughtPnl(timeframe),
    });
    const soldPnl = useQuery({
        queryKey: ['sold-pnl', timeframe],
        queryFn: async () => await getSoldPnl(timeframe),
    });
    return { boughtPnl, soldPnl };
}