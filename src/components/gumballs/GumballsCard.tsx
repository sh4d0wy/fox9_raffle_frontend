import { VerifiedTokens } from "@/utils/verifiedTokens";
import { useWallet } from "@solana/wallet-adapter-react";
import { Link } from "@tanstack/react-router";
import { useQueryFavourites } from "hooks/profile/useQueryFavourites";
import { useToggleFavourite } from "hooks/useToggleFavourite";
import React, { useMemo, useState } from "react";
import type { GumballBackendDataType } from "types/backend/gumballTypes";
import { PrizeCollage } from "./PrizeCollage";
import { DynamicCounter } from "../common/DynamicCounter";
import { useGetTotalPrizeValueInSol } from "hooks/useGetTotalPrizeValueInSol";
import { DEFAULT_AVATAR } from "store/userStore";
import { API_URL } from "@/constants";
import { HeartIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";

export interface GumballsCardProps {
  gumball: GumballBackendDataType;
  isFavorite?: boolean;
  className?: string;
  type?: "gumball" | "created";
}

export const GumballsCard: React.FC<GumballsCardProps> = ({
  gumball,
  isFavorite = false,
  type = "gumball",
  className,
}) => {

  const { publicKey } = useWallet();
  const { favouriteGumball } = useToggleFavourite(publicKey?.toString() || "");
  const { getFavouriteGumball } = useQueryFavourites(publicKey?.toString() || "", "Gumballs");
  const {
    id,
    name = "Untitled Gumball",
    creatorAddress = "",
    endTime = new Date().toISOString(),
    totalTickets = 0,
    ticketsSold = 0,
    ticketMint = "",
    ticketPrice = "0",
    isTicketSol = false,
    totalPrizeValue = "0",
    prizes = [],
    creator
  } = gumball || {};



  const toggleFavorite =  () => {
    favouriteGumball.mutate({
      gumballId: id,
    });
  };

  const favorite = useMemo(() => {
    console.log("getFavouriteGumball.data",getFavouriteGumball.data)
    if(!getFavouriteGumball.data || getFavouriteGumball.data.length === 0) return false;
    return getFavouriteGumball.data?.some((favourite) => favourite.id === id);
  }, [getFavouriteGumball.data, id]);

   const { totalValueInSol, isLoading: isPrizeValueLoading, formattedValue: totalPrizeValueFormatted } = useGetTotalPrizeValueInSol(gumball?.prizes);
   const remainingTickets = (totalTickets || 0) - (ticketsSold || 0);
   
   const val = useMemo(() => {
     return parseFloat(totalPrizeValueFormatted) || 0;
   }, [totalPrizeValueFormatted]);
 
   const displayAddress = useMemo(() => {
     if (!creatorAddress) return "Unknown";
     return `${creatorAddress.slice(0, 4)}...${creatorAddress.slice(-4)}`;
   }, [creatorAddress]);
 
   const pricePerTicket = useMemo(() => {
     if (isTicketSol) {
       return (parseFloat(ticketPrice)/10**9).toFixed(7).trim().replace(/\.?0+$/, "");
     }
     return (parseFloat(ticketPrice)/10**(VerifiedTokens.find((token) => token.address === ticketMint)?.decimals || 0)).toFixed(7).trim().replace(/\.?0+$/, "");
   }, [ticketPrice, ticketMint, isTicketSol]);
 
   const evValue = useMemo(() => {
     const prizeVal = parseFloat(totalPrizeValueFormatted) || 0;
     const maxProceeds = totalTickets * parseFloat(pricePerTicket);
     if (maxProceeds === 0) return "0.00";
     return `${((prizeVal / maxProceeds)*100).toFixed(2)}%` ;
   }, [totalPrizeValueFormatted, totalTickets, pricePerTicket]);
   console.log("favourite",favorite)
   
 
  return (
    <motion.div 
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 100 }}
    transition={{ duration: 0.1 }}
    className={`bg-black-1300 w-full border border-transparent transition duration-300 hover:border-primary-color  backdrop-blur-[10px] rounded-[10px] p-3 pt-0 pb-2 ${className}`}>
      <div className="w-full flex items-center justify-between py-3">
        <div className="flex items-center gap-4">
          <img
            src={creator.profileImage?(API_URL+creator.profileImage) : DEFAULT_AVATAR}
            alt={displayAddress}
            className="w-6 h-6 rounded-full object-cover"
          />
          <h4 className="text-sm font-semibold font-inter text-white">
            {displayAddress}
          </h4>
        </div>
        <div className="relative flex items-center justify-end">
            {/* <img src="/images/home/polygon-shape.svg" alt={'shape'} /> */}
            {gumball.status === "ACTIVE" && (
              <p className="text-xs font-semibold font-inter text-green-500 border border-gray-300 rounded-lg px-4 py-1  absolute z-10">
                Active
              </p>
            )}
            {gumball.status === "CANCELLED" && (
              <p className="text-xs font-semibold font-inter text-red-500 border border-gray-300 rounded-lg px-4 py-1  absolute z-10">
                Cancelled
              </p>
            )}
          </div>
      </div>

      <div className="w-full relative group rounded-lg overflow-hidden">
            <PrizeCollage
              prizes={prizes}
              className="w-full h-[300px] group-hover:scale-105 transition duration-300"
              rotation={-35}
              gridSize={3}
            />

        <div className="w-full h-full flex flex-col items-start justify-between p-4 absolute top-0 left-0">
          <div className="w-full h-full transition duration-300 group-hover:visible group-hover:opacity-100 invisible opacity-0 absolute left-0 p-4 top-0 flex flex-col items-start justify-between">

            <button onClick={toggleFavorite} className="bg-black/60 ml-auto cursor-pointer rounded-lg inline-flex items-center justify-center p-2.5">

            {!favorite ?
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="#FFD400"
                  viewBox="0 0 256 256"
                >
                  <path d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z" />
                </svg>

                :
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="#FFD400"
                  viewBox="0 0 256 256"
                >
                  <path d="M240,102c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,228.66,16,172,16,102A62.07,62.07,0,0,1,78,40c20.65,0,38.73,8.88,50,23.89C139.27,48.88,157.35,40,178,40A62.07,62.07,0,0,1,240,102Z" />
                </svg>
              }

            </button>

            <div className="w-full">
              {type==="gumball" ? (
                <Link
                  to="/gumballs/$id"
                  params={{ id: id.toString() }}
                  className="w-full transition duration-300 hover:opacity-90 flex items-center justify-center py-1.5 px-6 h-11 text-black-1000 font-semibold font-inter bg-primary-color rounded-full" >
                  View Gumball
                </Link>
              ) : (
                <Link
                  to="/gumballs/create_gumballs/$id"
                  params={{ id: id.toString() }}
                  className="w-full transition duration-300 hover:opacity-90 flex items-center justify-center py-1.5 px-6 h-11 text-black-1000 font-semibold font-inter bg-primary-color rounded-full" >
                  Gumball Studio
                </Link>
              )}
            </div>

          </div>

          <div className="w-full  h-full flex transition duration-300 group-hover:invisible group-hover:opacity-0 visible opacity-100 flex-col items-start justify-between">
            
            <DynamicCounter endsAt={new Date(endTime)} status={gumball.status == "ACTIVE" ? "ACTIVE" : gumball.status === "CANCELLED" ? "CANCELLED" : "ENDED"} />

            <div className="w-full flex items-center  gap-1.5 justify-end">
              <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-black/60">
                <p className="text-xs font-semibold font-inter uppercase text-white">
                  EV : <span>{evValue}</span>
                </p>
              </div>

              <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-black/60">
                <p className="text-xs font-semibold font-inter uppercase text-white">
                  VAL : <span>{val/10**(VerifiedTokens.find((token) => token.address === gumball.ticketMint)?.decimals || 0)}</span>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col px-2 py-4 gap-2">
        <div className="w-full flex items-center gap-5 justify-between">
          <h3 className="md:text-2xl text-lg text-white font-bold font-inter">
            {name}
          </h3>

        </div>

        <div className="w-full flex flex-col items-center justify-between gap-1.5">
          <div className="w-full flex items-center justify-between ">
            {(totalTickets !== ticketsSold) ?
              <h4 className="md:text-base text-sm text-white font-inter font-semibold">
                {remainingTickets}/{totalTickets}
              </h4>
              :
              <h4 className="text-sm text-red-1000 font-semibold font-inter">SOLD OUT</h4>
            }
            <h4 className="md:text-base text-sm text-white text-right font-inter font-semibold">
              <span>{pricePerTicket} {gumball.isTicketSol ? "SOL" : VerifiedTokens.find((token) => token.address === gumball.ticketMint)?.symbol || "SOL"}</span>
            </h4>
          </div>
          <div className="w-full flex items-center justify-between gap-5">
            <h4 className="text-xs text-gray-1200 font-inter">
              Gumballs remaining
            </h4>
            <h4 className="text-xs text-gray-1200 text-right font-inter">
              Price
            </h4>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
