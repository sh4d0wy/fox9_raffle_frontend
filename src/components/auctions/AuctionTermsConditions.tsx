import { useAuctionAnchorProgram } from "hooks/auction/useAuctionAnchorProgram";
import { useMemo } from "react";

export const AuctionTermsConditions = () => {
  const {getAuctionConfig} = useAuctionAnchorProgram();
  const { data: auctionConfig, isLoading: isLoadingAuctionConfig, isError: isErrorAuctionConfig } = getAuctionConfig;
  const creationFee = useMemo(() => {
    if (isLoadingAuctionConfig || isErrorAuctionConfig) return 0;
    return auctionConfig?.creationFeeLamports.toNumber() ?? 0;
  }, [auctionConfig, isLoadingAuctionConfig, isErrorAuctionConfig]);
  return (
    <div className="border border-gray-1100 rounded-[20px] pb-10 overflow-hidden">
        <h3 className="text-xl font-bold font-inter text-primary-color mb-[26px] px-5 py-4.5 bg-black-1300 border-b border-gray-1100">Terms & Conditions</h3>
                        <ul className="list-decimal space-y-4 pl-10 lg:pr-10 pr-6">
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              1.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            An Auction is conducted through an open bidding process, where the highest bidder at the end of the auction becomes the winner.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              2.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            All bids are executed via blockchain transactions and cannot be canceled.
                            Only when a higher bid is placed will the previous bid amount be returned.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              3.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                              Refunds resulting from higher bids are processed automatically through on-chain logic.
The platform is not responsible for refund delays, fee deductions, or network-related issues.

                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              4.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            The on-chain state at the auction’s end constitutes the final and legally binding result.
                            UI display discrepancies have no legal effect.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              5.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            Network fees are not controlled by the platform and are non-refundable.

                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              6.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            The creator is fully responsible for the ownership, authenticity, and non-infringement of all assets listed in the auction.

                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              7.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            Upon finalization, escrowed assets are automatically transferred to the winning bidder.
                            The creator may not refuse or block the transfer.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              8.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            Primary responsibility for auction-related disputes lies with the creator.
                            The platform acts solely as a technical intermediary.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              9.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            A {creationFee / 1e9} SOL creation fee applies to auction creation and is non-refundable.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              10.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            A {((auctionConfig?.commissionBps && (auctionConfig?.commissionBps / 10000) * 100) || 0)}% fee is deducted from participant payments and retained by the platform operator.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              11.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                              Once one Auction has sold, the machine cannot be
                              closed until the specified end date.
                            </p>
                          </li>
                        </ul>
    </div>
  )
}
