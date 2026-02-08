import { API_URL } from "@/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQueryFavourites } from "hooks/profile/useQueryFavourites";
import { Link } from "@tanstack/react-router";
import React, { useEffect, useMemo, useState } from "react";
import { DEFAULT_AVATAR, useUserStore } from "store/userStore";
import { useToggleFavourite } from "hooks/useToggleFavourite";
import { VerifiedTokens } from "@/utils/verifiedTokens";
import { motion } from "motion/react";

export interface AuctionsCardProps {
  id: number;
  prizeName: string;
  prizeImage: string;
  collectionName: string;
  collectionVerified: boolean;
  createdBy: string;
  startsAt: Date;
  endsAt: Date;
  reservePrice: string;
  currency: string;
  className?: string;
  highestBidAmount: number;
  highestBidderWallet: string;
  status: string;
  creator?: {
    walletAddress: string;
    twitterId?: string | null;
    profileImage?: string | null;
  };
}

export const AuctionsCard = (props:AuctionsCardProps) => {
  const {
    id,
    prizeName,
    prizeImage,
    collectionName,
    collectionVerified,
    createdBy,
    reservePrice,
    currency,
    className,
    highestBidAmount,
    highestBidderWallet,
    status,
    creator,
  } = props;
  const { publicKey } = useWallet();
  const { profilePictureVersion } = useUserStore();
  const isCurrentUser = createdBy === publicKey?.toString();
  const creatorAvatar = creator?.profileImage 
    ? `${API_URL}${creator.profileImage}?t=${isCurrentUser ? profilePictureVersion : ''}`
    : DEFAULT_AVATAR;
    
  const { favouriteAuction } = useToggleFavourite(publicKey?.toString() || "");
  const { getFavouriteAuction } = useQueryFavourites(
    publicKey?.toString() || ""
  );
  
  const [computedStatus, setComputedStatus] = useState<
    "UPCOMING" | "LIVE" | "COMPLETED" | "CANCELLED"
  >("UPCOMING");

  const currencyDecimals = useMemo(() => {
    if(currency==="SOL"){
      return 9
    }
    return (
      VerifiedTokens.find((token) => token.symbol === currency)?.decimals ?? 0
    );
  }, [currency]);
  console.log("reserverprice",reservePrice)
  useEffect(() => {
    const calculateStatus = () => {
      if (status === "CANCELLED") setComputedStatus("CANCELLED");
      else if (status === "INITIALIZED") setComputedStatus("UPCOMING");
      else if (
        status === "COMPLETED_SUCCESSFULLY" ||
        status === "COMPLETED_FAILED"
      )
        setComputedStatus("COMPLETED");
      else setComputedStatus("LIVE");
    };

    calculateStatus();
    const interval = setInterval(calculateStatus, 1000); // Update every second for accuracy
    return () => clearInterval(interval);
  }, [status]);

  const favorite = useMemo(() => {
    if (!getFavouriteAuction.data) return false;
    return getFavouriteAuction.data.some((f) => f.id === id);
  }, [getFavouriteAuction.data, id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    favouriteAuction.mutate({ auctionId: id });
  };

  const shorten = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  return (
    <Link to="/auctions/$id" params={{id:id.toString()}}>
    <motion.div 
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 100 }}
    transition={{ duration: 0.3 }}
    className={`bg-black-1300 hover:border-primary-color rounded-2xl w-full border border-transparent ${className} ${favorite ? 'border-yellow-1000' : 'border-transparent'}`}>
      {/* Head */}
      <div className="w-full flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <img
            src={creatorAvatar}
            alt={createdBy}
            className="w-7 h-7 rounded-full object-cover"
          />
          <h4 className="text-base font-semibold font-inter text-white">
            {createdBy.slice(0, 6)}...{createdBy.slice(-4)}
          </h4>
        </div>
        {/* <div className="relative inline-flex items-center justify-center">
          <img src="/images/polygon-shape.png" className="w-7" alt={'shape'} />
          <p className="text-xs font-semibold font-inter text-black-1000 absolute z-10">
            T5
          </p>
        </div> */}
      </div>

      <div className="w-full relative group overflow-hidden">
        <div className="w-full px-3 group-hover:scale-105 transition duration-300">
        <img
          src={prizeImage}
          alt="featured-card"
          className="w-full rounded-xl object-cover h-[290px]"
        />
        </div>

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

            <Link
              to="/auctions/$id"
              params={{ id: id.toString() }}
              className="w-full transition duration-300 hover:opacity-90 flex items-center justify-center py-1.5 px-6 h-11 text-black-1000 font-semibold font-inter bg-primary-color rounded-full"
            >
              View Auction
            </Link>

          </div>

          <div className="w-full  h-full flex transition duration-300 group-hover:invisible group-hover:opacity-0 visible opacity-100 flex-col items-start justify-between">
            <div className="w-full flex items-center justify-end">
              <div className="inline-flex items-center justify-center px-2.5 py-2 divide-x divide-white/30 rounded-lg bg-black/60 border border-white/30">
                <p className={`text-xs font-semibold font-inter ${computedStatus==="CANCELLED" || computedStatus ==="COMPLETED"?"text-red-500":"text-green-500"}`}>
                  {computedStatus}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col px-4 py-4 gap-3">
        <div className="w-full flex items-center gap-5 justify-between">
          <h3 className="2xl:text-xl text-lg lg:text-xl text-white font-bold font-inter">
            {`${prizeName.slice(0,15)}...`}
          </h3>

          {collectionVerified && (
            <div className="inline-flex gap-2.5 items-center">
              <img
                src="/icons/verified-icon.svg"
                alt="verified"
                className="w-5 h-5"
              />
              <p className="text-sm text-white font-semibold font-inter">
                Verified
              </p>
            </div>
          )}
        </div>

        {computedStatus==="COMPLETED" ?
        <div className="w-full flex flex-col items-center justify-between gap-1.5">
          <div className="w-full flex items-center justify-between gap-5">
            {(highestBidderWallet) ?
              <h4 className="md:text-base text-sm text-green-1100 font-inter font-semibold">
                {highestBidderWallet.slice(0, 6)}...{highestBidderWallet.slice(-4)}
              </h4>
              :
              <h4 className="text-base text-red-1000 font-semibold font-inter">No Winner</h4>
            }
            <h4 className="md:text-base text-sm text-green-1100 text-right font-inter font-semibold">
                {highestBidAmount/(10**currencyDecimals)} {currency}
            </h4>
          </div>
          <div className="w-full flex items-center justify-between gap-5">
            <h4 className="md:text-sm text-xs text-gray-1200 font-inter">
              Winner
            </h4>
            {highestBidAmount &&
              <h4 className="md:text-sm text-xs text-gray-1200 text-right font-inter">
                Winning bid
              </h4>}
          </div>
        </div>
        :
          <div className="w-full flex flex-col items-center justify-between gap-1.5">
          <div className="w-full flex items-center justify-between gap-5">
            {computedStatus==="UPCOMING" ?
            <h4 className="md:text-base text-sm text-primary-color font-inter font-semibold">
            UPCOMING
          </h4>:
          <h4 className="md:text-base text-sm text-primary-color font-inter font-semibold">
          {highestBidAmount || 0}
        </h4>
          }
              
              
            <h4 className="md:text-base text-sm text-white text-right font-inter font-semibold">
              {parseFloat(reservePrice)/(10**currencyDecimals)} {currency}
            </h4>
          </div>
            {computedStatus==="UPCOMING" ?
          <div className="w-full flex items-center justify-between gap-5">
            <h4 className="md:text-sm text-xs text-gray-1200 font-inter">
              Status
            </h4>
             
              <h4 className="md:text-sm text-xs text-gray-1200 text-right font-inter">
                Reserve Price
              </h4>
          </div>
            :
           <div className="w-full flex items-center justify-between gap-5">
            <h4 className="md:text-sm text-xs text-gray-1200 font-inter">
              Highest Bid
            </h4>
            {highestBidAmount &&
              <h4 className="md:text-sm text-xs text-gray-1200 text-right font-inter">
                Reserve Price
              </h4>}
          </div>}
        </div>
        
        }




      </div>
    </motion.div>
    </Link>
  );
};

