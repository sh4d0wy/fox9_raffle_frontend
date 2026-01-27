import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../../api/routes/userRoutes";
import { useWallet } from "@solana/wallet-adapter-react";

export const useMyProfile = (isAuthenticated: boolean) => {
  const { publicKey } = useWallet();  
  return useQuery({
    queryKey: ["my-profile", publicKey?.toBase58()],
    queryFn: getMyProfile,
    enabled: isAuthenticated && !!localStorage.getItem("authToken"),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

