import {useMutation, useQueryClient} from "@tanstack/react-query";
import { toggleAuctionFavourite, toggleGumballFavourite, toggleRaffleFavourite} from "../api/routes/userRoutes"
import {toast} from "react-toastify";

export const useToggleFavourite = (publicKey:string)=>{
    const queryClient = useQueryClient();

    const validateWallet = () => {
        if (!publicKey) {
            toast.error("Wallet not connected");
            return false;
        }
        return true;
    };

    const favouriteRaffle = useMutation({
        mutationKey:["favourite-raffle"],
        mutationFn:async (args:{
            raffleId:number
        })=>{
            if (!validateWallet()) {
                throw new Error("Validation failed");
            }
            await toggleRaffleFavourite(args.raffleId.toString());
            return args.raffleId;
        },
        onSuccess:(raffleId:number)=>{
            queryClient.invalidateQueries({queryKey:["favourite-raffle",publicKey]});
            queryClient.invalidateQueries({queryKey:["raffle",raffleId.toString()]});
            console.log("Toggle favourite raffle successful");
        },
        onError:(error: Error)=>{
            console.error(error);
            if (error.message !== "Validation failed") {
                toast.error("Failed to toggle favourite");
            }
        }
    })

    const favouriteGumball = useMutation({
        mutationKey:["favourite-gumball"],
        mutationFn:async (args:{
            gumballId:number
        })=>{
            if (!validateWallet()) {
                throw new Error("Validation failed");
            }
            await toggleGumballFavourite(args.gumballId.toString());
            return args.gumballId;
        },
        onSuccess:(gumballId:number)=>{
            queryClient.invalidateQueries({queryKey:["favourite-gumball",publicKey]});
            queryClient.invalidateQueries({queryKey:["gumball",gumballId.toString()]});
            console.log("Toggle favourite gumball successful");
        },
        onError:(error: Error)=>{
            console.error(error);
            if (error.message !== "Validation failed") {
                toast.error("Failed to toggle favourite");
            }
        }
    })
    const favouriteAuction = useMutation({
        mutationKey:["favourite-auction"],
        mutationFn:async (args:{
            auctionId:number
        })=>{
            if (!validateWallet()) {
                throw new Error("Validation failed");
            }
            await toggleAuctionFavourite(args.auctionId.toString());
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["favourite-auction",publicKey]});
            console.log("Toggle favourite auction successful");
        },
        onError:(error: Error)=>{
            console.error(error);
            if (error.message !== "Validation failed") {
                toast.error("Failed to toggle favourite");
            }
        }
    })
    return { favouriteRaffle, favouriteGumball, favouriteAuction };
}