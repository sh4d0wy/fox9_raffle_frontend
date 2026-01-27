import { QueryClient } from "@tanstack/react-query";

export const invalidateQueries = (queryClient: QueryClient, publicKey: string) => {
    queryClient.invalidateQueries({ queryKey: ["notification", publicKey] });
}

export const invalidateProfileQueries = (queryClient: QueryClient, publicKey: string) => {
    queryClient.invalidateQueries({ queryKey: ["notification", publicKey] });
    queryClient.invalidateQueries({ queryKey: ["profile-raffle-created", publicKey] });
    queryClient.invalidateQueries({ queryKey: ["profile-raffle-purchased", publicKey] });
    queryClient.invalidateQueries({ queryKey: ["profile-raffle-favourite", publicKey] });
    queryClient.invalidateQueries({ queryKey: ["profile-gumball-created", publicKey] });
    queryClient.invalidateQueries({ queryKey: ["profile-gumball-purchased", publicKey] });
    queryClient.invalidateQueries({ queryKey: ["profile-gumball-favourite", publicKey] });
    queryClient.invalidateQueries({ queryKey: ["profile-auction-created", publicKey] });
    queryClient.invalidateQueries({ queryKey: ["profile-auction-purchased", publicKey] });
    queryClient.invalidateQueries({ queryKey: ["profile-auction-favourite", publicKey] });
    queryClient.invalidateQueries({ queryKey: ["favourite-raffle", publicKey] });
    queryClient.invalidateQueries({ queryKey: ["favourite-gumball", publicKey] });
    queryClient.invalidateQueries({ queryKey: ["favourite-auction", publicKey] });
    queryClient.invalidateQueries({ queryKey: ["profile-raffle-stats", publicKey] });
    queryClient.invalidateQueries({ queryKey: ["profile-gumball-stats", publicKey] });
    queryClient.invalidateQueries({ queryKey: ["profile-auction-stats", publicKey] });
}