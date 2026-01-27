import { AucationsCard } from '@/components/auctions/AucationsCard';
import { RafflersCard } from '@/components/cards/RafflersCard';
import { RafflersCardPurchased } from '@/components/cards/RafflersCardPurchased';
import { GumballsCard } from '@/components/gumballs/GumballsCard';
import { NoAuctions } from '@/components/home/NoAuctions';
import Dropdown from '@/components/ui/Dropdown';
import InputSwitch from '@/components/ui/Switch';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useCreatorProfileStore } from "../../../store/creatorProfile-store";
import { useCreatorProfileData } from "../../../hooks/useCreatorProfileData";
import { useState } from 'react';
import CryptoCardSkeleton from '@/components/skeleton/RafflesCardSkeleton';

export const Route = createFileRoute('/profile/')({
  component: CreateProfile,
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


function CreateProfile() {

 const {
    mainFilter,
    setMainFilter,
    rafflerFilter,
    setRafflerFilter,
    enabled,
    setEnabled,
  } = useCreatorProfileStore();

  const [activeRafflerTab, setActiveRafflerTab] = useState<'created' | 'purchased'>('created');

  const categoryMap: Record<string, "rafflers" | "gumballs" | "auctions"> = {
    Rafflers: "rafflers",
    Gumballs: "gumballs",
    Auctions: "auctions",
  };

  const { data, isLoading } = useCreatorProfileData(
    categoryMap[mainFilter],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rafflerFilter as any
  );

  const createdItems = data?.created ?? [];
  const purchasedItems = data?.purchased ?? [];


    const getFilterLabels = () => {
    switch (mainFilter) {
      case "Rafflers":
        return [
          { label: "Raffles Created", value: "created" },
          { label: "Raffles Purchased", value: "purchased" },
          { label: "Favourite Raffles", value: "favourite" },
          { label: "Followed Raffles", value: "followed" },
        ];
      case "Auctions":
        return [
          { label: "Auctions Created", value: "created" },
          { label: "Auctions Participated", value: "purchased" },
          { label: "Favourite Auctions", value: "favourite" },
          { label: "Followed Auctions", value: "followed" },
        ];
      case "Gumballs":
        return [
          { label: "Gumballs Created", value: "created" },
          { label: "Gumballs Purchased", value: "purchased" },
          { label: "Favourite Gumballs", value: "favourite" },
          { label: "Followed Gumballs", value: "followed" },
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
                            <Link to="/profile/change_profile_picture" className="absolute z-10 cursor-pointer -bottom-2 right-0 bg-black-1400 w-7 h-7 rounded-full flex items-center justify-center">
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

                        <div className="w-full flex items-center justify-center flex-wrap  gap-3.5">
                            <Link to={"/"}  className="border group hover:text-white transition duration-300 text-sm gap-2 hover:bg-black hover:border-black text-white font-semibold font-inter border-white rounded-full px-4 py-2.5 flex items-center justify-center" >
                              <img src="/icons/twitter-icon.svg" className="w-5 invert transition duration-300" alt="" />
                                Link Twitter
                            </Link>
                            <Link to={"/"}  className="border transition hover:bg-purple-1000 hover:border-purple-1000 hover:text-white text-sm gap-2 text-white font-semibold font-inter border-white rounded-full px-4 py-2.5 flex items-center justify-center" >
                              <img src="/icons/discord_svg.svg" className="w-5 " alt="" />
                                Link Discord
                            </Link>
                        </div>

                    </div>


                      <div className="w-full border space-y-2.5 border-gray-1100 rounded-[18px] md:p-5 p-3">
                        
                        <div className="flex flex-col gap-2">
                        {filters.map(filter => (
                       <button
                          key={filter.value}
                          onClick={() => {
                            setRafflerFilter(filter.value as 'created' | 'purchased' | 'favourite' | 'followed');
                            if (filter.value === 'created' || filter.value === 'purchased') {
                              setActiveRafflerTab(filter.value);
                            }
                          }}
                          className={`
                            text-sm cursor-pointer transition px-5 py-3 text-start border border-gray-1200 font-semibold font-inter w-full rounded-full
                            ${rafflerFilter === filter.value 
                              ? 'bg-primary-color text-black-1000 border-primary-color' 
                              : 'bg-transparent text-gray-1000 hover:text-white'}
                          `}
                        >
                          {filter.label}
                        </button>
                      ))}

                        </div>

                      </div>

                    <div className="w-full border border-gray-1100 rounded-[18px] p-5">
                        <h3 className="text-lg text-white font-semibold font-inter">
                            Raffle Stats
                        </h3>
                        <ul className="space-y-6 hidden">
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
                <div className="w-full flex flex-wrap gap-5 items-center justify-between">
                <ul className="flex bg-black-1000 rounded-full p-1 items-center gap-3">
                  {["Rafflers", "Auctions", "Gumballs"].map(tab => (
                  <li key={tab}>
                    <button
                      onClick={() => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        setMainFilter(tab as any);
                        setRafflerFilter("created"); 
                        setActiveRafflerTab("created");
                      }}
                      className={`text-base cursor-pointer hover:bg-primary-color font-inter font-medium transition duration-300 hover:text-black-1000 text-white rounded-full md:py-3 py-2 md:px-5 px-3 ${
                        mainFilter === tab ? "bg-primary-color !text-black-1000" : ""
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

                <div className="w-full my-10 flex items-center justify-between bg-black-1300 border border-gray-1100 rounded-[10px] px-5 py-3">
                    <p className='md:text-base text-sm font-inter font-semibold text-white'>Set as profile default page</p>
                    <InputSwitch
                      checked={enabled}
                      onChange={setEnabled}
                      />
                </div>

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
                      <div className={`grid ${activeRafflerTab === `purchased` ? `grid-cols-1` : `lg:grid-cols-3 md:grid-cols-2 grid-cols-1`} lg:gap-y-10 lg:gap-x-[26px] gap-4`}>
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
                            <AucationsCard {...card} />
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
        </section>
    </main>
  )
}
