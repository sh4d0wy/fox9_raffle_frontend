import { AuctionsCard } from '@/components/auctions/AuctionsCard';
import { RafflersCard } from '@/components/cards/RafflersCard';
import { RafflersCardPurchased } from '@/components/cards/RafflersCardPurchased';
import { GumballsCard } from '@/components/gumballs/GumballsCard';
import { NoAuctions } from '@/components/common/NoAuctions';
import Dropdown from '@/components/ui/Dropdown';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useCreatorProfileStore } from "../../../store/creatorProfile-store";
import { useCreatorProfileData } from "../../../hooks/profile/useCreatorProfileData";
import CryptoCardSkeleton from '@/components/skeleton/RafflesCardSkeleton';
import { useState } from 'react';

export const Route = createFileRoute('/profile/user_profile')({
  component: RouteComponent,
})




const raffleStats = [
  { label: "Raffles Created", value: 804 },
  { label: "Tickets Sold", value: 42646 },
  { label: "Sales Volume", value: 2650.1 },
  { label: "Raffles Bought", value: 5 },
  { label: "Tickets Bought", value: 15 },
  { label: "Raffles Won", value: 1 },
  { label: "1/Purchase Volume", value: 15 },
];

   const options1 =[
          { label: "Raffles created", value: "Raffles created" },
          { label: "Tickets Sold", value: "Tickets Sold" },
          { label: "Volume", value: "Volume" },
        ]

function RouteComponent() {
      
 const {
    mainFilter,
    setMainFilter,
    rafflerFilter,
    setRafflerFilter,
  } = useCreatorProfileStore();

  const [activeRafflerTab, setActiveRafflerTab] = useState<'created' | 'purchased'>('created');

  const categoryMap: Record<string, "rafflers" | "gumballs" | "auctions"> = {
    Rafflers: "rafflers",
    Gumballs: "gumballs",
    Auctions: "auctions",
  };

  const { data, isLoading } = useCreatorProfileData(
    categoryMap[mainFilter],
    rafflerFilter as 'created' | 'purchased'
  );

  const createdItems = data?.created ?? [];
  const purchasedItems = data?.purchased ?? [];


    const getFilterLabels = () => {
    switch (mainFilter) {
      case "Rafflers":
        return [
          { label: "Raffles Created", value: "created" },
          { label: "Raffles Purchased", value: "purchased" },
        ];
      case "Auctions":
        return [
          { label: "Auctions Created", value: "created" },
          { label: "Auctions Participated", value: "purchased" },
        ];
      case "Gumballs":
        return [
          { label: "Gumballs Created", value: "created" },
          { label: "Gumballs Purchased", value: "purchased" },
        ];
      default:
        return [];
    }
  };

  const filters = getFilterLabels();



  return (
      <main className="main font-inter bg-black-1400">
         <section className='w-full md:pt-48 pt-36 pb-[120px]'>
          <div className="w-full max-w-[1440px] px-5 mx-auto">
            <div className="w-full flex lg:flex-row flex-col gap-7">
                <div className="flex-1 space-y-5 md:max-w-[320px]">
                    <div className="w-full bg-black-1300 border border-gray-1100 rounded-[18px] py-5">
                        <div className="w-full px-4">
                         <div className="w-full flex items-start justify-between gap-5">
                          <div className="flex items-center justify-center flex-col -mb-6">
                            <div className="relative">
                            <img src="/images/top-user-1.png" className="w-[68px] h-[68px] rounded-full border-2 border-primary-color" alt="" />
                            <Link to='/profile/change_profile_picture' className="absolute z-10 cursor-pointer -bottom-2 right-0 bg-black-1400 w-7 h-7 rounded-full flex items-center justify-center">
                              <img src="/images/edit-img-icon.png" alt="" />
                            </Link>
                            </div>
                           <h4 className='text-lg text-white font-inter font-semibold mt-2'>CedarElliottSr</h4>
                          </div>
                        <div className="flex items-center gap-4">
                                <a href="#">
                                <img src="/images/X-icon.com.svg" className="w-6 h-6" alt="" />
                            </a>
                            <a href="#">
                                <img src="/icons/solana-sol-logo.svg" className="w-6 h-6" alt="" />
                            </a>
                         
                        </div>
                        </div>

                      <div className="w-full flex items-center justify-end">

                        <a href="#" className="inline-flex items-center gap-2.5 font-semibold font-inter text-sm text-purple-1000">
                              <img src="/icons/discord_svg.svg" className="w-5 " alt="" />
                            <span>raffledao</span>
                        </a>
                        </div>
                        </div>

                        <div className="w-full border-t boredr-gray-1100 my-4"></div>

                        <div className="w-full flex items-center justify-center  gap-3.5">
                              <Link to={"/"} className={`h-11 text-base font-medium font-inter transition duration-300 px-6 py-2.5 bg-linear-to-r from-neutral-800 via-primary-color to-neutral-800 hover:from-primary-color hover:via-primary-color hover:to-primary-color rounded-full text-white inline-flex justify-center items-center gap-2.5`}
                              >
                                Follow
                              </Link>
                            <Link to={"/"}  className="border transition hover:opacity-80 text-sm gap-2.5 text-gray-1200 font-semibold font-inter border-gray-1200 rounded-full px-6 py-2.5 flex items-center justify-center" >
                                <svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM14.0303 6.96967C14.3232 7.26256 14.3232 7.73744 14.0303 8.0303L9.0303 13.0303C8.7374 13.3232 8.2626 13.3232 7.96967 13.0303L5.96967 11.0303C5.67678 10.7374 5.67678 10.2626 5.96967 9.9697C6.26256 9.6768 6.73744 9.6768 7.03033 9.9697L8.5 11.4393L10.7348 9.2045L12.9697 6.96967C13.2626 6.67678 13.7374 6.67678 14.0303 6.96967Z"
                                        fill="#BDBDBD"
                                    />
                                    </svg>

                                Fox Staked
                            </Link>

                        </div>

                    </div>


                      <div className="w-full border space-y-2.5 border-gray-1100 rounded-[18px] md:p-5 p-3">
                        
                        <div className="flex flex-col gap-2">
                         {filters.map(filter => (
                            <button
                                key={filter.value}
                                onClick={() => {
                                  setRafflerFilter(filter.value as 'created' | 'purchased');
                                  if (filter.value === 'created' || filter.value === 'purchased') {
                                    setActiveRafflerTab(filter.value);
                                  }
                                }}
                                className={`
                                  text-sm cursor-pointer transition px-5 py-3 text-start border border-gray-1200 font-semibold font-inter w-full rounded-full
                                  ${rafflerFilter === filter.value 
                                    ? 'bg-primary-color text-black-1000 border-transparent' 
                                    : 'bg-transparent text-gray-1000 hover:text-white'}
                                `}
                              >
                                {filter.label}
                              </button>
                            ))}
                        </div>

                      </div>

                    <div className="w-full border space-y-2.5 border-gray-1100 rounded-[18px] md:p-5 p-3">
                        <h3 className="text-lg text-white font-semibold font-inter mb-6">
                            Raffle Stats
                        </h3>
                        <ul className="space-y-6">
                            {raffleStats.map((stat, index) => (
                            <li key={index} className="flex items-center justify-between">
                                <p className="md:text-base text-sm font-medium font-inter text-start text-gray-1200">
                                {stat.label}
                                </p>
                                <p className="md:text-base text-sm font-medium font-inter text-white text-right">
                                {stat.value}
                                </p>
                            </li>
                            ))}
                        </ul>
                    </div>

                </div>
                <div className="flex-1">
                <div className="w-full flex flex-wrap gap-6 items-center justify-between">
                <ul className="flex items-center bg-black-1300 rounded-full p-1 gap-3 ">
                   {["Rafflers", "Auctions", "Gumballs"].map(tab => (
                  <li key={tab}>
                    <button
                      onClick={() => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        setMainFilter(tab as any);
                        setRafflerFilter("created"); 
                        setActiveRafflerTab("created");
                      }}
                      className={`text-base cursor-pointer hover:bg-primary-color hover:text-black-1000 text-white font-inter font-medium transition duration-300 rounded-full md:py-3 py-2 md:px-5 px-3 ${
                        mainFilter === tab ? "bg-primary-color text-black-1000!" : ""
                      }`}
                    >
                      {tab}
                    </button>
                  </li>
                ))}
                
                  </ul>

                  <Dropdown
                    options={options1}
                    value={{ label: "Sort Entries", value: "Sort Entries" }}
                    onChange={(value) => {
                    console.log("Selected option:", value);
                    }}
                    />
                </div>

                <div className="w-full pt-10">
             <div className="w-full">
                {mainFilter === "Rafflers" && (
                  <>
                    {isLoading ? (
                      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => <CryptoCardSkeleton key={i} />)}
                      </div>
                    ) : (activeRafflerTab === "purchased" ? purchasedItems : createdItems).length < 1 ? (
                      <NoAuctions />
                    ) : (
                      <div className={`grid ${activeRafflerTab === `purchased` ? `grid-cols-1` : `lg:grid-cols-3 md:grid-cols-2 grid-cols-1`} lg:gap-y-5 lg:gap-x-[26px] gap-4`}>
                        {(activeRafflerTab === "purchased" ? purchasedItems : createdItems).map(card => (
                          <div key={card.id} className="flex items-center justify-center">
                            {activeRafflerTab === "purchased" ? <RafflersCardPurchased {...card} /> : <RafflersCard {...card} />}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {mainFilter === "Auctions" && (
                  <>
                    {isLoading ? (
                      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => <CryptoCardSkeleton key={i} />)}
                      </div>
                    ) : createdItems.length < 1 ? (
                      <NoAuctions />
                    ) : (
                      <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-y-10 lg:gap-x-[26px] gap-4">
                        {createdItems.map(card => (
                          <div key={card.id} className="flex items-center justify-center">
                            <AuctionsCard {...card} />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {mainFilter === "Gumballs" && (
                  <>
                    {isLoading ? (
                      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => <CryptoCardSkeleton key={i} />)}
                      </div>
                    ) : createdItems.length < 1 ? (
                      <NoAuctions />
                    ) : (
                      <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-y-10 lg:gap-x-[26px] gap-4">
                        {createdItems.map(card => (
                          <div key={card.id} className="flex items-center justify-center">
                            <GumballsCard {...card} />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>


                </div>



                </div>

            </div>
          </div>
        </section>
    </main>
  )
}
