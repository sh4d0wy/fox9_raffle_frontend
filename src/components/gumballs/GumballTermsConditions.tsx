import { useGumballAnchorProgram } from "hooks/gumball/useGumballAnchorProgram";
import { useMemo } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const GumballTermsConditions = () => {
  const {getGumballConfig} = useGumballAnchorProgram();
  const { data: gumballConfig, isLoading: isLoadingGumballConfig, isError: isErrorGumballConfig } = getGumballConfig;
  const creationFee = useMemo(() => {
    if (isLoadingGumballConfig || isErrorGumballConfig) return 0;
    const creationFee = gumballConfig?.creationFeeLamports.toNumber() ?? 0;
    return creationFee / LAMPORTS_PER_SOL;
  }, [gumballConfig, isLoadingGumballConfig, isErrorGumballConfig]);
  return (
    <div className="border border-gray-1100 rounded-[20px] pb-10 overflow-hidden">
        <h3 className="text-xl font-bold font-inter text-primary-color mb-[26px] px-5 py-4.5 bg-black-1300 border-b border-gray-1100">Terms & Conditions</h3>
        <ol className='list-decimal space-y-2 pl-3 lg:pr-10 pr-6'>
                          <li className="flex items-start gap-1.5">
                          <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              1.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter md:text-base text-sm leading-[160%]">You will be charged an up-front creation fee of {creationFee} SOL, which is non-refundable.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                          <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              2.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter md:text-base text-sm leading-[160%]">The prizes that do not get sold will be returned to you upon closing by claiming them from Gumball Studio.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                          <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              3.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter md:text-base text-sm leading-[160%]">You can specify the amount of time a Gumball runs at the creation of the Gumball. Gumballs require a minimum 24 hour run time.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                          <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              4.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter md:text-base text-sm leading-[160%]">You cannot end or cancel a Gumball once it has started.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                          <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              5.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter md:text-base text-sm leading-[160%]">The  will take a total of {((gumballConfig?.ticketFeeBps && (gumballConfig?.ticketFeeBps / 10000) * 100) || 0)}% commission fee from each Gumball sales.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                          <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              6.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter md:text-base text-sm leading-[160%]">Scheduled Gumballs will start at the scheduled date and time even if not all prizes have been added but won't be shown until at least 1 prize has been added.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                          <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              7.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter md:text-base text-sm leading-[160%]">Gumballs can be edited after creation but cannot be restarted once it is cancelled.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">     
                          <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              8.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter md:text-base text-sm leading-[160%]">Once one Gumball has sold, the machine cannot be closed until the specified end date.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">   
                          <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              9.
                            </span>
                                <p className="flex-1 w-full text-white font-medium font-inter md:text-base text-sm leading-[160%]">Gumball, its agents, directors, or officers shall not assume any liability or responsibility for your use of Gumball, promoting or marketing the Gumballs.
                            </p>
                          </li>
                        </ol>
    </div>
  )
}
