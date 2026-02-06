import { WRAPPED_SOL_MINT } from '@/constants';
import { VerifiedTokens } from '@/utils/verifiedTokens';
import { useGetTotalPrizeValueInSol } from 'hooks/useGetTotalPrizeValueInSol';
import { Link } from '@tanstack/react-router'
import { useGumballById } from 'hooks/gumball/useGumballsQuery';
import { useGetTokenPrice } from 'hooks/useGetTokenPrice';
import { useMemo, useState } from 'react';
import type { GumballBackendDataType } from 'types/backend/gumballTypes';
import { AddTokenModal } from '@/components/gumballs/AddTokenModal';
import { AddNftModal } from '@/components/gumballs/AddNftModal';

export const LoadPrizesTab = ({gumballId}: {gumballId: string}) => {
  const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState(false);
  const [isAddNftModalOpen, setIsAddNftModalOpen] = useState(false);
  const { data: gumball, isLoading } = useGumballById(gumballId) as { data: GumballBackendDataType, isLoading: boolean };

  const { totalValueInSol, isLoading: isPriceLoading, formattedValue } = useGetTotalPrizeValueInSol(gumball?.prizes);
  const {data: ticketTokenPrice} = useGetTokenPrice(gumball?.ticketMint);
  const {data: solPrice} = useGetTokenPrice(WRAPPED_SOL_MINT);

  const maxProceeds = useMemo(()=>{
    const ticketPriceInSol = (ticketTokenPrice?.price && solPrice?.price) ? ticketTokenPrice.price / solPrice.price : 0;
    const ticketPriceInToken = gumball?.isTicketSol?(parseFloat(gumball?.ticketPrice)/10**9) : parseFloat(ticketPriceInSol.toFixed(8)) * (Number(gumball?.ticketPrice) / (10**(VerifiedTokens.find((token: typeof VerifiedTokens[0]) => token.address === gumball?.ticketMint)?.decimals || 0)));
    const maxProceeds = Number(gumball?.maxPrizes) * parseFloat(ticketPriceInToken.toFixed(8));
    return maxProceeds.toFixed(7);
  },[gumball?.ticketPrice,  gumball?.ticketMint, ticketTokenPrice?.price, solPrice?.price])

  const maxROI = useMemo(() => {
    if (!gumball) return '0';
    const roi = (parseFloat(maxProceeds) - totalValueInSol) / parseFloat(maxProceeds) * 100;
    if (isNaN(roi) || roi === Infinity) return '0';
    return Math.max(roi, 0).toFixed(2); 
  }, [maxProceeds, totalValueInSol]);

  if (isLoading || !gumball) {
    return <div className='w-full'>
      <div className="flex items-center gap-5 border border-solid border-primary-color rounded-[10px] bg-primary-color/5 py-4 px-5">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 border border-solid border-primary-color rounded-full animate-spin"></div>
        </div>
      </div>
    </div>;
  }
  return (
    <div className='w-full'>
         <div className="flex items-center gap-5 border border-solid border-primary-color rounded-[10px] bg-primary-color/5 py-4 px-5">
            <div>
              <p className="md:text-lg text-base text-primary-color font-medium font-inter pb-2.5 leading-7">
                Load your prizes into the Gumball machine
              </p>
              <p className="md:text-lg text-sm font-medium text-white font-inter leading-7">
              You can load a mix of NFTs or Tokens from our verified list.
              </p>
            </div>
          </div>

          <div className="w-full grid md:grid-cols-4 grid-cols-2 gap-5">
            <div className="bg-black-1300 flex-1 border border-gray-1000 my-10  px-6 py-4 rounded-[10px] flex flex-col items-center justify-center">
                <h3 className='text-base text-white font-medium font-inter mb-5'>Price Loaded</h3>
                <h4 className='text-2xl font-bold font-inter text-white'>{gumball?.prizes.reduce((acc, prize) => acc + prize.quantity, 0)}/{gumball?.maxPrizes}</h4>
            </div>

               <div className="bg-black-1300 flex-1 border border-gray-1000 my-10  px-6 py-4 rounded-[10px] flex flex-col items-center justify-center">
                <h3 className='text-base text-white font-medium font-inter mb-[22px]'>Total Prize Value</h3>
                <h4 className='text-2xl font-bold font-inter text-white'>
                {isPriceLoading ? 'Loading...' : `${parseFloat(totalValueInSol.toFixed(6))} SOL`}
                </h4>
            </div>

               <div className="bg-black-1300 flex-1 border border-gray-1000 my-10  px-6 py-4 rounded-[10px] flex flex-col items-center justify-center">
                <h3 className='text-base text-white font-medium font-inter mb-[22px]'>Max Proceeds</h3>
                <h4 className='text-2xl font-bold font-inter text-white'>{parseFloat(maxProceeds)} SOL</h4>
            </div>

               <div className="bg-black-1300 flex-1 border border-gray-1000 my-10  px-6 py-4 rounded-[10px] flex flex-col items-center justify-center">
                <h3 className='text-base text-white font-medium font-inter mb-[22px]'>Max ROI</h3>
                <h4 className='text-2xl font-bold font-inter text-white'>
                {maxROI}%
                </h4>
            </div>

          </div>

          <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-[28px]">

               <div className="relative border-2 border-solid border-gray-1000 bg-black-1300 rounded-[20px]">
                   <div className="w-full p-5">
                    <h2 className='lg:text-xl text-lg text-primary-color font-bold font-inter'>NFTs</h2>
                    <div className="w-full flex items-center justify-center flex-col md:my-24 my-10">
                    <h4 className="font-inter mb-5 lg:mb-6 font-medium lg:text-xl text-lg text-white">
                    Add NFT prize
                    </h4>
                    <button
                    onClick={() => setIsAddNftModalOpen(true)}
                    className="text-black-1000 cursor-pointer font-semibold hover:from-primary-color hover:via-primary-color hover:to-primary-color text-sm lg:text-base leading-normal font-inter h-10 lg:h-11 rounded-full inline-flex items-center justify-center px-5 lg:px-[26px] transition duration-500 hover:opacity-90 bg-primary-color gap-2"
                    >
                    <span className="w-6 h-6 flex items-center justify-center">
                        <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            d="M0.75 6.75H12.75M6.75 0.75V12.75"
                              stroke="#000"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        </svg>
                    </span>
                    Add
                    </button>
                    </div>
                   </div>
                </div>

                <div className="relative border-2 border-solid border-gray-1000 bg-black-1300 rounded-[20px]">
                   <div className="w-full p-5">
                    <h2 className='lg:text-xl text-lg text-primary-color font-bold font-inter'>Tokens</h2>
                    <div className="w-full flex items-center justify-center flex-col md:my-24 my-10">
                    <h4 className="font-inter mb-5 lg:mb-6 font-medium lg:text-xl text-lg text-white">
                    Add Tokens prize
                    </h4>
                       <button
                    onClick={() => setIsAddTokenModalOpen(true)}
                    className="text-black-1000 cursor-pointer font-semibold hover:from-primary-color hover:via-primary-color hover:to-primary-color text-sm lg:text-base leading-normal font-inter h-10 lg:h-11 rounded-full inline-flex items-center justify-center px-5 lg:px-[26px] transition duration-500 hover:opacity-90 bg-primary-color gap-2"
                    >
                    <span className="w-6 h-6 flex items-center justify-center">
                        <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            d="M0.75 6.75H12.75M6.75 0.75V12.75"
                            stroke="#000"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        </svg>
                    </span>
                    Add
                    </button>
                    </div>
                   </div>

                </div>

            
                <AddTokenModal 
                  isOpen={isAddTokenModalOpen} 
                  onClose={() => setIsAddTokenModalOpen(false)}
                  gumballId={gumballId}
                  remainingPrizes={gumball?.totalTickets - (gumball?.prizesAdded || 0)}
                />

                <AddNftModal 
                  isOpen={isAddNftModalOpen} 
                  onClose={() => setIsAddNftModalOpen(false)}
                  gumballId={gumballId}
                />
          </div>


    </div>
  )
}
