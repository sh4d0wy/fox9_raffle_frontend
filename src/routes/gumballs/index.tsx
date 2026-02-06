import { createFileRoute, Link } from '@tanstack/react-router'
import SearchBox from '../../components/home/SearchBox';
import SortDropdown from '../../components/home/SortDropdown';
import FilterModel from '../../components/home/FilterModel';
import FeaturedSwiper from '../../components/gumballs/FeaturedSwiper';
import { GumballsCard } from '../../components/gumballs/GumballsCard';
import { ToolsSection } from '@/components/home/ToolsSection';
import { TryToolsSection } from '@/components/home/TryToolsSection';
import { useRafflesStore } from "../../../store/gumballs-store"
import { useGumballsQuery } from "../../../hooks/gumball/useGumballsQuery"
import { useGlobalStore } from "../../../store/globalStore";
import CryptoCardSkeleton from '@/components/skeleton/RafflesCardSkeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from 'react';
import { NoGumballs } from '@/components/gumballs/NoGumballs';



export const Route = createFileRoute('/gumballs/')({
  component: Gumballs,
})



const options = [
  { label: "Recently Added", value: "Recently Added" },
  { label: "Expiring Soon", value: "Expiring Soon" },
  { label: "Selling out soon", value: "Selling out soon" },
  { label: "Price: Low to High", value: "Price: Low to High" },
  { label: "Price: High to Low", value: "Price: High to Low" },
  { label: "TTV/Floor: Low to High", value: "TTV/Floor: Low to High" },
  { label: "TTV/Floor: High to Low", value: "TTV/Floor: High to Low" },
  { label: "Floor: Low to High", value: "Floor: Low to High" },
  { label: "Floor: High to Low", value: "Floor: High to Low" },
]



function Gumballs() {


  const { filter, setFilter } = useRafflesStore()
  const { data, fetchNextPage, hasNextPage, isLoading } = useGumballsQuery(filter)
  const { sort, setSort } = useGlobalStore();

  const gumballs = data?.pages.flatMap((p) => p.items) || []

  const [filters, setFilters] = useState<string[]>([]);


  const activeFilters = [
    { id: "all", label: "All Gumballs" },
    { id: "past", label: "Past Gumballs" },
  ];


  return (

    <main className="main font-inter bg-black-1100">

      <section className='w-full pt-10 md:pt-[122px] pb-24 md:pb-[90px] z-10 relative'>
        <div className="w-full max-w-[1440px] px-4 mx-auto">
          <div className="flex-1 flex items-center justify-between lg:gap-10 gap-5 flex-col lg:flex-row">
            <div className="overflow-x-auto md:overflow-hidden lg:w-1/2 w-full">
              <ul className="inline-flex items-center bg-white/[15%] backdrop-blur-[27px] rounded-[40px] p-1 md:gap-3 gap-1.5">
                {["Featured", "All Gumballs", "Past Gumballs"].map((f, index) => (
                  <li key={index}>
                  <button onClick={() => setFilter(f)} className={`md:text-base text-sm cursor-pointer  font-inter font-normal md:min-w-[115px] transition duration-300 hover:bg-primary-color hover:text-black-1000 text-black-1000 rounded-full py-3 px-3 leading-[19px]
                 ${filter === f ? 'bg-primary-color font-semibold text-black-1000' : 'bg-transparent text-gray-1200'}`}> {f}</button>
                </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end md:gap-5 gap-3">
              <SearchBox
                onSearch={(value) => {
                  console.log("Searching for:", value);
                  // You can filter list, call API, etc.
                }}
              />
              <SortDropdown
                options={options}
                selected={sort}
                onChange={(value) => {
                  setSort(value);
                  console.log("Selected sort option:", value);
                }}
              />
              <FilterModel />
            </div>
          </div>

          {/* Filters List */}
       <div className="py-10 overflow-x-auto flex items-center gap-4">
            <div className=" items-center gap-4">
              {filters && (
                <div className='flex items-center gap-5'>
                  <p className="md:text-base text-white text-sm whitespace-nowrap font-black-1000 font-semibold font-inter">
                    Filters :
                  </p>

                  <ul className="flex items-center gap-4">
                    <li>
                      <div className="border cursor-pointer group hover:border-primary-color transition duration-200 h-12 inline-flex items-center justify-center rounded-full border-gray-1100 px-5 py-3 gap-2">
                        <p className="md:text-base whitespace-nowrap text-sm font-inter font-medium text-white">
                          Clear All
                        </p>
                        <button
                          onClick={() => setFilter("")}
                          className="cursor-pointer"
                        >
                          <img src="/icons/cross-icon.svg" className="min-w-4" alt="cross icon" />
                        </button>
                      </div>
                    </li>

                    {activeFilters.map((filterItem) => (
                      <li key={filterItem.id}>
                        <div className="border cursor-pointer group hover:border-primary-color transition duration-200 h-12 inline-flex items-center justify-center rounded-full border-gray-1100 px-5 py-3 gap-2">
                          <p className="md:text-base whitespace-nowrap text-sm font-inter font-medium text-white">
                            {filterItem.label}
                          </p>
                          <button
                            onClick={() => setFilters(filters.filter((f) => f !== filterItem.id))}
                            className="cursor-pointer"
                          >
                            <img src="/icons/cross-icon.svg" className="min-w-4" alt="remove icon" />
                          </button>
                        </div>
                      </li>
                    ))}

                  </ul>
                </div>
              )}
            </div>
          </div>


          {isLoading ? (
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <CryptoCardSkeleton key={i} />
                ))}
            </div>
          ) : gumballs.length > 0 ? (
            <InfiniteScroll
              dataLength={gumballs.length}
              next={fetchNextPage}
              hasMore={!!hasNextPage}
              loader={
                <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mt-5">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <CryptoCardSkeleton key={i} />
                    ))}
                </div>
              }
            >
              <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
                {gumballs.map((r) => (
                  <></>
                  // <GumballsCard key={r.id}  />
                ))}
              </div>
            </InfiniteScroll>
          ) : (
            <NoGumballs />
          )}


        </div>
      </section>
    </main>
  )
}
