import { useQuery } from "@tanstack/react-query";
import { getBoughtPnl, getSoldPnl } from "../../api/routes/statsRoutes";

export const usePnlStats = ({timeframe="daily", year=new Date().getFullYear()}:{timeframe:"daily"|"monthly"|"yearly", year:number}) => {
    const boughtPnl = useQuery({
        queryKey: ['bought-pnl', timeframe, year],
        queryFn: async () => await getBoughtPnl({timeframe, month:new Date().getMonth()+1, year}),
    });
    const soldPnl = useQuery({
        queryKey: ['sold-pnl', timeframe, year],
        queryFn: async () => await getSoldPnl({timeframe, month:new Date().getMonth()+1, year}),
    });
    return { boughtPnl, soldPnl };
}