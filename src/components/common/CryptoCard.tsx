import { useWallet } from "@solana/wallet-adapter-react";
import { Link } from "@tanstack/react-router";
import React, { useMemo, useState } from "react";
import type { RaffleTypeBackend } from "types/backend/raffleTypes";
import { DEFAULT_AVATAR, useUserStore } from "store/userStore";
import { API_URL } from "@/constants";
import { useBuyRaffleTicketStore } from "store/buyraffleticketstore";
import { useBuyRaffleTicket } from "hooks/raffle/useBuyRaffleTicket";
import { useToggleFavourite } from "hooks/useToggleFavourite";
import { useQueryFavourites } from "hooks/profile/useQueryFavourites";
import { useClaimTicketRaffle } from "hooks/raffle/useClaimTicketRaffle";
import { useCancelRaffle } from "hooks/raffle/useCancelRaffle";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { VerifiedTokens } from "@/utils/verifiedTokens";
import { DynamicCounter } from "./DynamicCounter";
import { motion } from "motion/react";

export interface CryptoCardProps {
  raffle: RaffleTypeBackend;
  soldTickets: number;
  isFavorite?: boolean;
  className?: string;
  category?: string;
  rafflesType?: string;
}

  type RaffleStep = "select" | "buy" | "done";


export const CryptoCard: React.FC<CryptoCardProps> = ({
  raffle,
  soldTickets,
  isFavorite = false,
  className,
  category = "General",
  rafflesType = "All Raffles",
}) => {
  const {publicKey} = useWallet();
  const { profilePictureVersion } = useUserStore();
  const isCurrentUser = raffle.createdBy === publicKey?.toString();
  const creatorAvatar = raffle.creator?.profileImage 
  ? `${API_URL}${raffle.creator.profileImage}?t=${isCurrentUser ? profilePictureVersion : ''}`
  : DEFAULT_AVATAR;
  const { buyTicket } = useBuyRaffleTicket();
  const {  getTicketQuantityById, updateTicketQuantityById } = useBuyRaffleTicketStore();
  const {favouriteRaffle} = useToggleFavourite(publicKey?.toString() || "");
  const {getFavouriteRaffle} = useQueryFavourites(publicKey?.toString() || "");
  const { claimTicket } = useClaimTicketRaffle();
  const { cancelRaffle } = useCancelRaffle();

  const toggleFavorite = async () => {
    favouriteRaffle.mutate({
      raffleId: raffle.id || 0,
    });
  };
  const MAX = raffle.maxEntries;

  const favorite = useMemo(() => {
    if(!getFavouriteRaffle.data || getFavouriteRaffle.data.length === 0) return false;
    return getFavouriteRaffle.data?.some((favourite) => favourite.id === raffle.id);
  }, [getFavouriteRaffle.data, raffle.id]);
  
  const decrease = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const previousQuantity = getTicketQuantityById(raffle.id || 0);
    updateTicketQuantityById(raffle.id || 0, Math.max(1, previousQuantity - 1));
    if(previousQuantity === 1){
      updateTicketQuantityById(raffle.id || 0, 1);
    }
  };

  const increase = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const previousQuantity = getTicketQuantityById(raffle.id || 0);
    updateTicketQuantityById(raffle.id || 0, Math.min(MAX, previousQuantity + 1));
    if(previousQuantity === MAX){
      updateTicketQuantityById(raffle.id || 0, MAX);
    }
  };
  const ticketPrice = useMemo(()=>{
    const price = raffle.ticketPrice;
    const decimals = VerifiedTokens.find((token) => token.address === raffle.ticketTokenAddress)?.decimals || 9;
    return price / 10 ** decimals;
  }, [raffle.ticketPrice, raffle.ticketTokenAddress]);

  const totalPriceTokens = useMemo(()=>{
    if(raffle.prizeData.type==="NFT"){
      return null;
    } 
    const price = raffle.prizeData?.amount || 0;
    const decimals = VerifiedTokens.find((token) => token.address === raffle.prizeData?.address)?.decimals || 9;
    return price / 10 ** decimals;
  }, [raffle.prizeData?.amount, raffle.prizeData?.address]);
  
  const ticketsBoughtByUser = useMemo(()=>{
    return raffle.raffleEntries?.find((entry) => entry.userAddress === publicKey?.toString())?.quantity || 0;
  }, [raffle.raffleEntries, publicKey?.toString()]);

  const remainingTickets = raffle?.ticketSupply - soldTickets;

  const canBuyRaffle = useMemo(()=>{
    return publicKey && raffle.createdBy !== publicKey.toString() && ticketsBoughtByUser < raffle.maxEntries && remainingTickets > 0 && raffle.state === "Active";
  }, [publicKey, raffle.createdBy, ticketsBoughtByUser, remainingTickets, raffle.state]);
  return (
   
    <motion.div 
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 100 }}
    transition={{ duration: 0.1 }}
    className={`bg-black-1300 backdrop-blur-[10px] rounded-[10px] p-3 pb-4 ${className}`}>

      <div className="w-full relative group overflow-hidden">
        <img
          src={raffle.prizeData?.image || ""}
          alt="featured-card"
          className={`w-full rounded-[12px] group-hover:scale-105 transition-all duration-300 md:h-[290px] h-[260px] ${raffle.prizeData?.type==="NFT" ? "h-[290px] object-cover" : "h-[260px] object-contain"}`}
        />
        <div className="w-full flex items-center justify-between pt-3">
          <div className="flex items-center gap-2">
            <img
              src={creatorAvatar}
              alt={raffle.creator?.twitterId || ""}
              className="w-6 h-6 rounded-full object-cover"
            />
            <h4 className="text-[13px] font-semibold font-inter text-white">
              {raffle.creator?.walletAddress.slice(0, 4) + "..." + raffle.creator?.walletAddress.slice(-4) || ""}
            </h4>
            {raffle.prizeData?.verified && (
              <img
                src="/icons/verified-icon.svg"
                alt="verified"
                className="w-5 h-5 text-primary-color"
              />
            )}
          </div>
        </div>
        <div className="w-full h-full flex max-h-[290px]  flex-col items-start justify-between py-4 px-3.5 md:px-1 xl:p-2 absolute top-0 left-0">
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

            <Link to="/raffles/$id"
              params={{ id: raffle.id?.toString() || "" }} className="w-full text-black-1000 transition duration-300 hover:opacity-90 flex items-center justify-center py-1.5 px-6 h-10 font-semibold font-inter bg-primary-color rounded-full">
              View raffle
            </Link>

          </div>

          <div className="w-full  h-full flex transition duration-300 group-hover:invisible group-hover:opacity-0 visible opacity-100 flex-col items-start justify-between">
            {/* <div className="w-full flex items-center ">
              <div className="inline-flex items-center justify-center px-2.5 md:py-2 py-1.5 divide-x divide-white/30 rounded-lg bg-black/60 border border-white/30">
                <p className="text-xs font-semibold font-inter uppercase text-white pr-1.5">
                  H
                </p>
                <p className="text-xs font-semibold font-inter uppercase text-white px-1.5">
                  M
                </p>
                <p className="text-xs font-semibold font-inter uppercase text-white pl-1.5">
                  S
                </p>
              </div>
            </div> */}
            <DynamicCounter endsAt={raffle.endsAt} status={raffle.state === "Active" ? "ACTIVE" : (raffle.state === "SuccessEnded" || raffle.state === "FailedEnded") ? "ENDED" : "CANCELLED"} />
            <div className="w-full flex items-center justify-between">
              <div className="inline-flex items-center justify-center px-[7px] xl:px-2.5 py-1 rounded-lg bg-black/60">
                <p className="text-xs font-semibold font-inter uppercase text-white">
                  VAL : <span>{raffle.prizeData.type==="NFT" ? (raffle.prizeData?.floor! / 10**9).toFixed(3) || 0 : raffle.val || 0}</span>
                </p>
              </div>

              <div className="flex items-center gap-[5px]">
                <div className="inline-flex items-center justify-center px-[7px] xl:px-2.5 py-1 rounded-lg bg-black/60">
                  <p className="text-xs font-semibold font-inter uppercase text-white">
                    TTV : <span>{raffle.ttv}</span>
                  </p>
                </div>
                <div className="inline-flex items-center justify-center px-[7px] xl:px-2.5 py-1 rounded-lg bg-black/60">
                  <p className="text-xs font-semibold font-inter uppercase text-white">
                    {raffle.roi > 0 ? `+${raffle.roi}` : raffle.roi}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Link to="/raffles/$id"
      params={{ id: raffle.id?.toString() || "" }}
    >
      <div className="w-full flex flex-col py-4">
        <div className="w-full flex items-center gap-5 justify-between">
          <h3 className="text-xl text-white font-bold font-inter">
            <span>{raffle.prizeData.type==="NFT" ? raffle.prizeData?.name.slice(0, 20) + "..." || "" : `${totalPriceTokens} ${raffle.prizeData?.symbol || ""}`}</span>
          </h3>

        </div>

        <div className="w-full flex flex-col mt-4 mb-[13px] items-center justify-between gap-1.5">
          <div className="w-full flex items-center justify-between gap-5">
            {raffle.ticketSupply !== soldTickets ? (
              <h4 className="md:text-base text-sm text-white font-inter font-semibold flex items-center gap-2">
                {remainingTickets}/{raffle.ticketSupply}
                <span className="text-xs text-primary-color font-inter">
                  Max Per Person: {MAX}
                </span>
              </h4>
            ) : (
              <h4 className="text-base text-orange-1100 font-semibold font-inter">
                SOLD OUT
              </h4>
            )}
            <h4 className="md:text-base text-sm text-white text-right font-inter font-semibold">
              <span>{ticketPrice}</span> {raffle.ticketTokenSymbol}
            </h4>
          </div>
          <div className="w-full flex items-center justify-between gap-5">
            <h4 className="md:text-sm text-xs text-gray-1200 font-inter">
              Tickets remaining
            </h4>
            <h4 className="md:text-sm text-xs text-gray-1200 text-right font-inter">
              Price per ticket
            </h4>
          </div>
        </div>

       {/* ACTION AREA */}
        {!publicKey && (
          <div className="w-full flex items-center justify-center wallet-btn-auto">
          <WalletMultiButton
            className="cursor-pointer transition duration-500
              bg-linear-to-r from-gray-1000 via-primary-color to-gray-1000
              hover:from-primary-color hover:via-primary-color hover:to-primary-color
              rounded-full h-10 flex items-center justify-center
              text-gray-1000 hover:text-black-1000
              text-sm md:text-base font-semibold font-inter"
          />
          </div>
        )}

        {canBuyRaffle && (
          <>
          <div className="w-full flex items-center sm:flex-row flex-col md:gap-1 gap-4">
            {/* Quantity */}
            
            <div className="flex w-full items-center justify-between py-2 px-3 border border-gray-1000 rounded-full">
              <button onClick={(e) => decrease(e)} className="min-w-6 h-6 cursor-pointer rounded-lg bg-primary-color">
                −
              </button>

              <input
                value={getTicketQuantityById(raffle.id || 0)}
                onChange={(e) =>
                  updateTicketQuantityById(raffle.id || 0, Math.min(MAX, Math.max(1, Number(e.target.value))))
                }
                className="outline-0 w-full text-center font-bold text-white bg-transparent"
                type="number"
              />

              <button onClick={(e) => increase(e)} className="min-w-6 h-6 cursor-pointer rounded-lg bg-primary-color">
                +
              </button>
            </div>

            {/* Buy */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                buyTicket.mutate({ raffleId: raffle.id || 0, ticketsToBuy: getTicketQuantityById(raffle.id || 0) })
              }}
              className="flex-1 h-11 bg-primary-color rounded-full
                flex items-center justify-center cursor-pointer
                text-black-1000 font-semibold px-4 py-2 gap-2 w-full md:w-fit text-sm md:text-base"
            >
              Buy 
              <div className="flex items-center gap-1">
              <span className=""> {getTicketQuantityById(raffle.id || 0) * ticketPrice} </span>
              <span className=""> {raffle.ticketTokenSymbol}</span>
              </div>
            </button>
          </div>
          </>
        )}

        {publicKey && publicKey.toString() === raffle.createdBy && raffle.state === "Active" && (
          <Link
            to={`/raffles/$id`}
            params={{ id: raffle.id?.toString() || "" }}
            className="w-full transition duration-500
              border border-gray-1000 rounded-full h-10
              flex items-center justify-center
              text-gray-1000 text-sm md:text-base font-semibold font-inter"
          >
            Your Raffle
          </Link>
        )}
        {publicKey && raffle.state !== "Active" && (
          <Link
            to={`/raffles/$id`}
            params={{ id: raffle.id?.toString() || "" }}
            className="w-full transition duration-500
              border border-gray-1000 rounded-full h-10
              flex items-center justify-center
              text-gray-1000 text-sm md:text-base font-semibold font-inter"
          >
            Raffle Ended
          </Link>
        )}

       {(publicKey && publicKey.toString() !== raffle.createdBy && ticketsBoughtByUser >= raffle.maxEntries) && (
        <Link
        to={`/raffles/$id`}
        params={{ id: raffle.id?.toString() || "" }}
        className="w-full transition duration-500
          border border-gray-1000 rounded-full h-10
          flex items-center justify-center
          text-gray-1000 text-sm md:text-base font-semibold font-inter"
      >
        Max Entries Reached
      </Link>
       )}
      </div>
    </Link>
    </motion.div>
  );
};
