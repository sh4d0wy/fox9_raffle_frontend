import { Link } from "@tanstack/react-router";
import React, { useState } from "react";

export interface AucationsCardProps {
  id: number;
  userName: string;
  userAvatar: string;
  heading: string;
  ProfileLink?: string;
  isFavorite?: boolean;
  currentBid: string;
  ReservePrice?: string;
  MainImage: string;
  AuctionTime: string;
  val: number;
  val2: string;
  Winner: string;
  WinnerBid: string;
  isWinner: boolean;
  verified?: boolean;
  isSold?: boolean;
  totalTickets: number;
  className?: string;
}

export const AucationsCard: React.FC<AucationsCardProps> = ({
  id,
  userName,
  userAvatar,
  isFavorite = false,
  isSold = false,
  currentBid,
  ReservePrice,
  heading,
  MainImage,
  AuctionTime,
  val,
  val2,
  Winner,
  WinnerBid,
  isWinner,
  verified = false,
  className,
}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const toggleFavorite = () => {
    setFavorite(!favorite);
  };

  return (
    <div className={`bg-black-1300 rounded-2xl w-full border border-transparent ${className} ${favorite ? 'border-yellow-1000' : 'border-transparent'}`}>
      {/* Head */}
      <div className="w-full flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <img
            src={userAvatar}
            alt={userName}
            className="w-7 h-7 rounded-full object-cover"
          />
          <h4 className="text-base font-semibold font-inter text-white">
            {userName}
          </h4>
        </div>
        <div className="relative inline-flex items-center justify-center">
          <img src="/images/polygon-shape.png" className="w-7" alt={'shape'} />
          <p className="text-xs font-semibold font-inter text-black-1000 absolute z-10">
            T5
          </p>
        </div>
      </div>

      <div className="w-full relative group">
        <div className="w-full px-3">
        <img
          src={MainImage}
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
                <p className="text-xs font-semibold font-inter text-white">
                  {AuctionTime}
                </p>
              </div>
            </div>

            <div className="w-full flex items-center gap-1.5">
              <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-black/60">
                <p className="text-xs font-semibold font-inter uppercase text-white">
                  <span>{val}</span>
                </p>
              </div>

              <div className="flex items-center gap-[5px]">
                <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-black/60">
                  <p className="text-xs font-semibold font-inter uppercase text-white">
                    ⍜ <span>{val2}</span>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col px-4 py-4 gap-7">
        <div className="w-full flex items-center gap-5 justify-between">
          <h3 className="2xl:text-2xl text-lg lg:text-xl text-white font-bold font-inter">
            {heading}
          </h3>

          {verified && (
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

        {!currentBid ?
        <div className="w-full flex flex-col items-center justify-between gap-1.5">
          <div className="w-full flex items-center justify-between gap-5">
            {(isWinner) ?
              <h4 className="md:text-base text-sm text-green-1100 font-inter font-semibold">
                {Winner}
              </h4>
              :
              <h4 className="text-base text-red-1000 font-semibold font-inter">No Winner</h4>
            }
            <h4 className="md:text-base text-sm text-green-1100 text-right font-inter font-semibold">
              {WinnerBid}
            </h4>
          </div>
          <div className="w-full flex items-center justify-between gap-5">
            <h4 className="md:text-sm text-xs text-gray-1200 font-inter">
              Winner
            </h4>
            {WinnerBid &&
              <h4 className="md:text-sm text-xs text-gray-1200 text-right font-inter">
                Winning bid
              </h4>}
          </div>
        </div>
        :
          <div className="w-full flex flex-col items-center justify-between gap-1.5">
          <div className="w-full flex items-center justify-between gap-5">
            {(isSold) ?
              <h4 className="md:text-base text-sm text-primary-color font-inter font-semibold">
                {currentBid}
              </h4>
              :
              <h4 className="text-base text-orange-1100 font-semibold font-inter">SOLD</h4>
            }
            <h4 className="md:text-base text-sm text-white text-right font-inter font-semibold">
              {ReservePrice}
            </h4>
          </div>
            {!isSold ?
          <div className="w-full flex items-center justify-between gap-5">
            <h4 className="md:text-sm text-xs text-gray-1200 font-inter">
              Status
            </h4>
            {WinnerBid &&
              <h4 className="md:text-sm text-xs text-gray-1200 text-right font-inter">
                Final Bid
              </h4>}
          </div>
            :
           <div className="w-full flex items-center justify-between gap-5">
            <h4 className="md:text-sm text-xs text-gray-1200 font-inter">
              Current Bid
            </h4>
            {WinnerBid &&
              <h4 className="md:text-sm text-xs text-gray-1200 text-right font-inter">
                Reserve Price
              </h4>}
          </div>}
        </div>
        
        }




      </div>
    </div>
  );
};
