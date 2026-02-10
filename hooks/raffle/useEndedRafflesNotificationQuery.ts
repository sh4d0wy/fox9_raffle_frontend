import {useQuery} from "@tanstack/react-query";
import { getEndedRafflesNotifications } from "../../api/routes/notificationRoutes";
import {useWallet} from "@solana/wallet-adapter-react";
import { useNavbarStore } from "../../store/globalStore";

export const useEndedRafflesNotificationQuery = () => {
    const {publicKey} = useWallet();
    const { isAuth } = useNavbarStore();
    const currentWallet = publicKey?.toBase58() ?? "";
    
    const isReady = isAuth && !!publicKey;

    return useQuery({
        queryKey: ["endedRafflesNotification", currentWallet],
        queryFn: async () => {
          const data = await getEndedRafflesNotifications();
          return data;
        },
        enabled: isReady,
        staleTime: 60000,
        refetchInterval: isReady ? 60000 : false
      })
}

