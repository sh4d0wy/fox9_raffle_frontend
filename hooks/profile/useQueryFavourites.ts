import { useQuery } from "@tanstack/react-query";
import { getAuctionFavourite, getGumballFavourite, getRaffleFavourite } from "../../api/routes/userRoutes";

export type MainFilter = "Rafflers" | "Gumballs" | "Auctions";
export type TabFilter = "created" | "purchased" | "favourite";

export const useQueryFavourites = (
    publicKey: string,
    mainFilter: MainFilter = "Rafflers",
    tabFilter: TabFilter = "created"
) => {
    
    const getFavouriteRaffle = useQuery({
        queryKey:["favourite-raffle",publicKey],
        queryFn:async ()=>{
            const response = await getRaffleFavourite(publicKey);
            return response.raffles;
        },
        enabled: !!publicKey && mainFilter === "Rafflers" ,
        staleTime: 60000,
    })
    const getFavouriteGumball = useQuery({
        queryKey:["favourite-gumball",publicKey],
        queryFn:async ()=>{
            const response = await getGumballFavourite(publicKey);
            return response.gumballs;
        },
        enabled: !!publicKey && mainFilter === "Gumballs" ,
        staleTime: 60000,
    })
    const getFavouriteAuction = useQuery({
        queryKey:["favourite-auction",publicKey],
        queryFn:async ()=>{
            const response = await getAuctionFavourite(publicKey);
            return response.auctions;
        },
        enabled: !!publicKey && mainFilter === "Auctions" ,
        staleTime: 60000,
    })
    return { getFavouriteRaffle, getFavouriteGumball, getFavouriteAuction };
}