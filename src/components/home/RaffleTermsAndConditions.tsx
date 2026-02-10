import { useRaffleAnchorProgram } from "hooks/raffle/useRaffleAnchorProgram";
import { useMemo } from "react";

export const RaffleTermsAndConditions = ({supply}: {supply: string}) => {
    const {getRaffleConfig} = useRaffleAnchorProgram();
    const { data: raffleConfig, isLoading: isLoadingRaffleConfig, isError: isErrorRaffleConfig } = getRaffleConfig;
    const creationFee = useMemo(() => {
        if (isLoadingRaffleConfig || isErrorRaffleConfig) return 0;
        return raffleConfig?.creationFeeLamports.toNumber() ?? 0;
      }, [raffleConfig, isLoadingRaffleConfig, isErrorRaffleConfig]);
      const minTicketPercentage = useMemo(()=>{
        if(!supply) return '1%';
        return `${Math.ceil(((100+(parseInt(supply)-1))/parseInt(supply)))}%`;
      },[supply])
    return (
      <div className="border border-gray-1100 rounded-[20px] pb-10 overflow-hidden">
          <h3 className="text-xl font-bold font-inter text-primary-color mb-[26px] px-5 py-4.5 bg-black-1300 border-b border-gray-1100">Terms & Conditions</h3>
  
          <ul className="list-decimal space-y-4 pl-10 lg:pr-10 pr-6">
              <li className="md:text-base text-sm font-inter font-medium text-gray-1200">
              
                              <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%]">
                              A Raffle is a blockchain-based random draw service.
                              All results are finalized based on on-chain transactions and are irreversible.
                              </p>
              </li>
              <li className="md:text-base text-sm font-inter font-medium text-gray-1200">
             
                              <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] ">
                              Raffle tickets are final upon purchase and cannot be canceled or refunded.
                              Tickets are non-refundable even if the participant does not win.
                              </p>  </li>
              <li className="md:text-base text-sm font-inter font-medium text-gray-1200">
            
                              <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] ">
                              A single wallet may purchase between {minTicketPercentage} and up to {raffleConfig?.maximumWalletPct ?? 100}% of the total ticket supply, depending on the options set by the raffle creator.
                              Any attempt to bypass these limits may result in participation restrictions or account sanctions.
                              </p> </li>
              <li className="md:text-base text-sm font-inter font-medium text-gray-1200">
              
                              <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] ">
                              Winners are determined after the raffle ends, in accordance with smart contract logic and/or platform rules.
                              Rewards are distributed based on on-chain status, and display delays do not affect validity.
                              </p>  </li>
              <li className="md:text-base text-sm font-inter font-medium text-gray-1200">
             
                              <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] ">
                               Winners are determined after the raffle ends, in accordance with smart contract logic and/or platform rules.
  Rewards are distributed based on on-chain status, and display delays do not affect validity.
                              </p>  </li>
               <li className="md:text-base text-sm font-inter font-medium text-gray-1200">
              
                              <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] ">
                              The creator bears full responsibility for having lawful ownership and distribution rights to all NFTs or reward assets registered in the raffle.
                              </p> </li>
               <li className="md:text-base text-sm font-inter font-medium text-gray-1200">
              
                              <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] ">
                              Assets registered for a raffle are held in escrow until the raffle ends.
                              After completion, assets may be claimed by the winner or the creator according to the predefined conditions.
                              </p></li>
                              <li className="md:text-base text-sm font-inter font-medium text-gray-1200">
                              
                              <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] ">
                              Once a raffle is created, ticket quantity, pricing, duration, and conditions cannot be modified.
  All consequences resulting from configuration errors are solely the responsibility of the creator.
  
                              </p></li>
                              <li className="md:text-base text-sm font-inter font-medium text-gray-1200">
                              
                              <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] ">
                              Raffle proceeds are distributed automatically via smart contracts or platform logic.
                              Creators may not dispute or reverse settlement results.
                              </p></li>
                              <li className="md:text-base text-sm font-inter font-medium text-gray-1200">
                              
                              <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] ">
                              A {creationFee / 1e9} SOL creation fee is charged upon raffle creation.
                              This fee is non-refundable under all circumstances.
                              </p></li>
                              <li className="md:text-base text-sm font-inter font-medium text-gray-1200">
                              
                              <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] ">
                              A {((raffleConfig?.ticketFeeBps && (raffleConfig?.ticketFeeBps / 10000) * 100) || 0)}% fee is deducted from participant payments and is retained by the platform operator.
                              </p></li>
                              <li className="md:text-base text-sm font-inter font-medium text-gray-1200">
                              
                              <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] ">
                              Primary responsibility for raffle-related disputes lies with the creator.
                              The platform acts solely as a technical intermediary.
                              </p></li>
          </ul>
      </div>
    )
  }
  