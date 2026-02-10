import {useQuery} from "@tanstack/react-query";
import { getWinnningNotifications } from "../api/routes/notificationRoutes";
import {useWallet} from "@solana/wallet-adapter-react";
import { useNavbarStore } from "../store/globalStore";

export const useNotificationQuery =  ()=>{
    const {publicKey} = useWallet();
    const { isAuth } = useNavbarStore();
    const currentWallet = publicKey?.toBase58() ?? "";
    
    const isReady = isAuth && !!publicKey;


    return useQuery({
        queryKey: ["notification", currentWallet],
        queryFn: async () => {
          const data = await getWinnningNotifications();
          return data;
        },
        enabled: isReady,
        staleTime: 60000,
        refetchInterval: isReady ? 60000 : false
      })
}