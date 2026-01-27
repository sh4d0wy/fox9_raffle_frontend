import { Link } from "@tanstack/react-router";
import React, { useState } from "react";

export interface CryptoCardProps {
  id: number;
  userName: string;
  userAvatar: string;
  ProfileLink?: string;
  isFavorite?: boolean;
  isSelected?: boolean;
  MainImage: string;
  countdown: { hours: number; minutes: number; seconds: number };
  val: number;
  coins: string;
  buyCoins: string;
  ttv: number;
  growthPercent: number;
  verified?: boolean;
  totalTickets: number;
  soldTickets: number;
  pricePerTicket: number;
  className?: string;
  Url?: string;
}

  type RaffleStep = "select" | "buy" | "done";


export const CryptoCard: React.FC<CryptoCardProps> = ({
  id,
  userName,
  userAvatar,
  isFavorite = false,
  isSelected = false,
  MainImage,
  countdown,
  val,
  coins,
  buyCoins = "0.2",
  ttv,
  growthPercent,
  verified = false,
  totalTickets,
  soldTickets,
  pricePerTicket,
  className,
  Url = "#",
}) => {
  const remainingTickets = totalTickets - soldTickets;
  const [favorite, setFavorite] = useState(isFavorite);
  const [step, setStep] = useState<RaffleStep>(
  isSelected ? "done" : "select"
);

 const handleSelectWallet = () => {
  setStep("buy");
};

const handleBuySol = () => {
  setStep("done");
};


    const MAX = 100;
    const [quantityValue, setQuantityValue] = useState<number>(1);
  
    const decrease = () => {
      setQuantityValue((prev) => Math.max(1, prev - 1));
    };
  
    const increase = () => {
      setQuantityValue((prev) => Math.min(MAX, prev + 1));
    };

  return (
    <div className={`bg-black-1300 backdrop-blur-[10px] rounded-[10px] p-3 pb-4 ${className}`}>

      <div className="w-full relative group">
        <img
          src={MainImage}
          alt="featured-card"
          className="w-full rounded-[12px] object-cover md:h-[290px] h-[260px]"
        />
        <div className="w-full flex items-center justify-between pt-3">
          <div className="flex items-center gap-2">
            <img
              src={userAvatar}
              alt={userName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <h4 className="text-[13px] font-semibold font-inter text-white">
              {userName}
            </h4>
            {verified && (
              <img
                src="/icons/verified-icon.svg"
                alt="verified"
                className="w-5 h-5"
              />
            )}
          </div>
        </div>
        <div className="w-full h-full flex max-h-[290px]  flex-col items-start justify-between py-4 px-3.5 md:px-1 xl:p-2 absolute top-0 left-0">
          <div className="w-full h-full transition duration-300 group-hover:visible group-hover:opacity-100 invisible opacity-0 absolute left-0 p-4 top-0 flex flex-col items-start justify-between">
            <button onClick={() => setFavorite(!favorite)} className="bg-black/60 ml-auto cursor-pointer rounded-lg inline-flex items-center justify-center p-2.5">
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
              params={{ id: id.toString() }} className="w-full text-black-1000 transition duration-300 hover:opacity-90 flex items-center justify-center py-1.5 px-6 h-10 font-semibold font-inter bg-primary-color rounded-full">
              View raffle
            </Link>

          </div>

          <div className="w-full  h-full flex transition duration-300 group-hover:invisible group-hover:opacity-0 visible opacity-100 flex-col items-start justify-between">
            <div className="w-full flex items-center ">
              <div className="inline-flex items-center justify-center px-2.5 md:py-2 py-1.5 divide-x divide-white/30 rounded-lg bg-black/60 border border-white/30">
                <p className="text-xs font-semibold font-inter uppercase text-white pr-1.5">
                  {countdown.hours}H
                </p>
                <p className="text-xs font-semibold font-inter uppercase text-white px-1.5">
                  {countdown.minutes}M
                </p>
                <p className="text-xs font-semibold font-inter uppercase text-white pl-1.5">
                  {countdown.seconds}S
                </p>
              </div>
            </div>

            <div className="w-full flex items-center justify-between">
              <div className="inline-flex items-center justify-center px-[7px] xl:px-2.5 py-1 rounded-lg bg-black/60">
                <p className="text-xs font-semibold font-inter uppercase text-white">
                  VAL : <span>{val}</span>
                </p>
              </div>

              <div className="flex items-center gap-[5px]">
                <div className="inline-flex items-center justify-center px-[7px] xl:px-2.5 py-1 rounded-lg bg-black/60">
                  <p className="text-xs font-semibold font-inter uppercase text-white">
                    TTV : <span>{ttv}</span>
                  </p>
                </div>
                <div className="inline-flex items-center justify-center px-[7px] xl:px-2.5 py-1 rounded-lg bg-black/60">
                  <p className="text-xs font-semibold font-inter uppercase text-white">
                    +{growthPercent}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col py-4">
        <div className="w-full flex items-center gap-5 justify-between">
          <h3 className="text-xl text-white font-bold font-inter">
            <span>{coins}</span>
          </h3>

        </div>

        <div className="w-full flex flex-col mt-4 mb-[13px] items-center justify-between gap-1.5">
          <div className="w-full flex items-center justify-between gap-5">
            {totalTickets !== soldTickets ? (
              <h4 className="md:text-base text-sm text-white font-inter font-semibold">
                {remainingTickets}/{totalTickets}
              </h4>
            ) : (
              <h4 className="text-base text-orange-1100 font-semibold font-inter">
                SOLD OUT
              </h4>
            )}
            <h4 className="md:text-base text-sm text-white text-right font-inter font-semibold">
              <span>{pricePerTicket}</span> SOL
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
        {step === "select" && (
          <button
            onClick={handleSelectWallet}
            className="w-full cursor-pointer transition duration-500
              bg-linear-to-r from-gray-1000 via-primary-color to-gray-1000
              hover:from-primary-color hover:via-primary-color hover:to-primary-color
              rounded-full h-10 flex items-center justify-center
              text-gray-1000 hover:text-black-1000
              text-sm md:text-base font-semibold font-inter"
          >
            Select Wallet
          </button>
        )}

        {step === "buy" && (
          <div className="w-full flex items-center sm:flex-row flex-col gap-4">
            {/* Quantity */}
            <div className="flex flex-1 items-center justify-between py-2 px-3 border border-gray-1000 rounded-full">
              <button onClick={decrease} className="min-w-8 h-8 rounded-lg bg-primary-color">
                −
              </button>

              <input
                value={quantityValue}
                onChange={(e) =>
                  setQuantityValue(
                    Math.min(MAX, Math.max(1, Number(e.target.value)))
                  )
                }
                className="outline-0 w-full text-center font-bold text-white bg-transparent"
                type="number"
              />

              <button onClick={increase} className="min-w-8 h-8 rounded-lg bg-primary-color">
                +
              </button>
            </div>

            {/* Buy */}
            <button
              onClick={handleBuySol}
              className="flex-1 h-11 bg-primary-color rounded-full
                flex items-center justify-center gap-1
                text-black-1000 font-semibold"
            >
              Buy • <span>{buyCoins} SOL</span>
            </button>
          </div>
        )}

        {step === "done" && (
          <Link
            to={Url}
            className="w-full transition duration-500
              border border-gray-1000 rounded-full h-10
              flex items-center justify-center
              text-gray-1000 text-sm md:text-base font-semibold font-inter"
          >
            Your Raffle
          </Link>
        )}

       
      </div>
    </div>
  );
};
