import { VerifiedTokens } from "@/utils/verifiedTokens";
import { Link } from "@tanstack/react-router";
import React, { useMemo } from "react";
import type { GumballBackendDataType } from "../../../types/backend/gumballTypes";
import { PrizeCollage } from "./PrizeCollage";
import { motion } from "motion/react";

export interface GumballsCardPurchasedProps {
  gumball: GumballBackendDataType & {
    userSpins?: number;
    spinsBought?: number;
    totalSpent?: number;
  };
  className?: string;
}

export const GumballsCardPurchased: React.FC<GumballsCardPurchasedProps> = ({
  gumball,
  className,
}) => {
  const {
    id,
    name = "Untitled Gumball",
    creatorAddress = "",
    totalTickets = 0,
    ticketsSold = 0,
    ticketPrice = "0",
    totalPrizeValue = "0",
    prizes = [],
    ticketMint,
    userSpins,
    spinsBought = 0,
    spins = [],
  } = gumball || {};

  const remainingTickets = (totalTickets || 0) - (ticketsSold || 0);

  const mainImage = useMemo(() => {
    const prizeWithImage = prizes?.find((prize) => prize.image);
    return prizeWithImage?.image || "/images/gumballs/sol-img-frame.png";
  }, [prizes]);

  const tokenDecimals = gumball?.isTicketSol ? 9 : VerifiedTokens.find((token) => token.address === ticketMint)?.decimals || 0;
  const tokenSymbol = gumball?.isTicketSol ? "SOL" : VerifiedTokens.find((token) => token.address === ticketMint)?.symbol || "SOL";

  const pricePerTicketNum = parseFloat(ticketPrice) || 0;
  
  // Calculate total spent based on spins bought
  const userSpinsCount = userSpins || spins?.length || 0;
  const totalSpent = userSpinsCount * pricePerTicketNum;

  // Calculate win rate if user has spins
  const prizesWon = useMemo(() => {
    if (!spins || spins.length === 0) return 0;
    return spins.filter((spin) => parseFloat(spin.prizeAmount) > 0).length;
  }, [spins]);

  const displayAddress = useMemo(() => {
    if (!creatorAddress) return "Unknown";
    return `${creatorAddress.slice(0, 4)}...${creatorAddress.slice(-4)}`;
  }, [creatorAddress]);

  return (
    <motion.div
    initial={{ opacity: 0.5, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`bg-transparent w-full transition duration-300 border border-gray-1100 rounded-2xl ${className || ''}`}
    >
      <div className="w-full flex gap-5 p-5 sm:flex-row flex-col">
        {/* <img
          src={mainImage}
          alt={name}
          className="object-cover w-[109px] h-[109px] rounded-lg"
        /> */}
        <PrizeCollage
              prizes={prizes}
              className="w-[109px] h-[109px] rounded-lg object-cover"
              rotation={-35}
              gridSize={3}
            />
        <div className="flex-1">
          <div className="flex w-full items-center justify-between">
            <h3 className="xl:text-2xl text-xl text-white font-bold font-inter">
              {name}
            </h3>

            <Link
              to="/gumballs/$id"
              params={{ id: id.toString() }}
              className="w-10 h-10 transition duration-300 hover:opacity-90 flex items-center justify-center text-white font-semibold font-inter bg-primary-color rounded-md"
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 4.16665L13.3333 9.99998L7.5 15.8333"
                  stroke="#212121"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          <div className="w-full gap-6 flex justify-between mt-6 md:flex-row flex-col">
            <div className="flex flex-col gap-1.5">
              <div className="inline-flex gap-2.5 items-center">
                <p className="text-sm text-white font-semibold font-inter">
                  Total Prizes: {prizes.length} 
                </p>
              </div>

              <p className="text-sm font-medium text-primary-color font-inter">
                {displayAddress}
              </p>
            </div>

            <p className="text-base mt-auto text-primary-color font-medium font-inter">
              {tokenSymbol}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-1100"></div>
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 md:gap-10 p-5">
        <div>
          <h4 className="text-sm mb-1.5 text-gray-1200 font-inter">
            Tickets remaining
          </h4>
          {totalTickets !== ticketsSold ? (
            <h4 className="md:text-base text-sm text-white font-inter font-medium">
              {remainingTickets}/{totalTickets}
            </h4>
          ) : (
            <h4 className="text-base text-red-1000 font-semibold font-inter">
              SOLD OUT
            </h4>
          )}
        </div>

        <div className="flex-1">
          <h4 className="text-sm mb-1.5 text-gray-1200 font-inter">Price per Spin</h4>
          <h4 className="md:text-base text-sm text-white font-inter font-medium">
            <span>{(pricePerTicketNum / 10 ** tokenDecimals).toFixed(8).replace(/0+$/, '')}</span> {tokenSymbol}
          </h4>
        </div>

        <div className="flex-1">
          <h4 className="text-sm mb-1.5 text-gray-1200 font-inter">
            Spins Bought
          </h4>
          <h4 className="md:text-base text-sm text-white font-inter font-medium">
            <span>{userSpinsCount}</span>
          </h4>
        </div>

        <div className="flex-1">
          <h4 className="text-sm mb-1.5 text-gray-1200 font-inter">Prizes Won</h4>
          <h4 className="md:text-base text-sm text-white font-inter font-medium">
            <span>{userSpins}</span> Prizes
          </h4>
        </div>

        <div className="flex-1">
          <h4 className="text-sm mb-1.5 text-gray-1200 font-inter">Spent</h4>
          <h4 className="md:text-base text-sm text-white font-inter font-medium">
            <span>{(totalSpent / 10 ** tokenDecimals).toFixed(8).replace(/0+$/, '')}</span> {tokenSymbol}
          </h4>
        </div>
      </div>
    </motion.div>
  );
};

