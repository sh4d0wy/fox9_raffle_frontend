import { createFileRoute, Link } from '@tanstack/react-router'
import FeaturedSwiper from "../../components/home/FeaturedSwiper"
import SortDropdown from "../../components/home/SortDropdown"
import SearchBox from "../../components/home/SearchBox"
import { CryptoCard } from "../../components/common/CryptoCard"
import InfiniteScroll from "react-infinite-scroll-component"
import FilterModel from "../../components/home/FilterModel"
import { useRafflesStore } from "../../../store/rafflesStore"
import { useRaffles } from "../../../hooks/raffle/useRaffles"
import { useEffect, useMemo } from 'react'
import CryptoCardSkeleton from '@/components/skeleton/RafflesCardSkeleton'
import { TryToolsSection } from '@/components/home/TryToolsSection'
import { ToolsSection } from '@/components/home/ToolsSection'
import { useGlobalStore } from "store/globalStore";
import { useBuyRaffleTicketStore } from 'store/buyraffleticketstore';
import { useFiltersStore } from 'store/filters-store'
import { filterRaffles, getActiveFiltersList, hasActiveFilters, sortRaffles } from '@/utils/sortAndFilter'
import type { RaffleTypeBackend } from 'types/backend/raffleTypes'
import { NoRaffles } from '@/components/home/NoRaffles'

const sortingOptions = [
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

export const Route = createFileRoute('/raffles/')({
  component: RafflesPage,
})

function RafflesPage() {
  const { filter, setFilter } = useRafflesStore();
  const { data, fetchNextPage, hasNextPage, isLoading } = useRaffles(filter);
  const { sort, setSort, searchQuery, setSearchQuery } = useGlobalStore();
  const { setTicketQuantityById, getTicketQuantityById } = useBuyRaffleTicketStore();
  const {
    raffleType,
    selectedToken,
    selectedCollection,
    floorMin,
    floorMax,
    endTimeAfter,
    endTimeBefore,
    filtersApplied,
    clearFilter,
    resetFilters,
    setPageType,
  } = useFiltersStore();

  useEffect(() => {
    setPageType("raffles");
  }, [setPageType]);

  const filterOptions = {
    raffleType,
    selectedToken,
    selectedCollection,
    floorMin,
    floorMax,
    endTimeAfter,
    endTimeBefore,
  };

  const activeFilters = useMemo(() => {
    return getActiveFiltersList(filterOptions, "raffles");
  }, [raffleType, selectedToken, selectedCollection, floorMin, floorMax, endTimeAfter, endTimeBefore]);

  const showActiveFilters = filtersApplied && hasActiveFilters(filterOptions, "raffles");

  const raffles = useMemo(() => {
    let allRaffles = data?.pages.map((p) => p.items).flat() as unknown as RaffleTypeBackend[];
    if (!allRaffles) return [];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      allRaffles = allRaffles.filter((raffle) => 
        raffle.prizeData?.name?.toLowerCase().includes(query) ||
        raffle.prizeData?.symbol?.toLowerCase().includes(query) ||
        raffle.prizeData?.description?.toLowerCase().includes(query)
      );
    }
    
    if (filtersApplied && hasActiveFilters(filterOptions, "raffles")) {
      allRaffles = filterRaffles(allRaffles, filterOptions);
    }

    if (sort && sort !== "Sort") {
      allRaffles = sortRaffles(allRaffles, sort);
    }
    
    return allRaffles;
  }, [data, searchQuery, sort, filtersApplied, raffleType, selectedToken, selectedCollection, floorMin, floorMax, endTimeAfter, endTimeBefore]);
  
  useEffect(() => {
    setSearchQuery("");
    setSort("Sort");
  }, []);

  useEffect(() => {
    if (raffles) {
      raffles.forEach((r) => {
        if (getTicketQuantityById(r.id || 0) === 0) {
          setTicketQuantityById(r.id || 0, 1);
        }
      });
    }
  }, [raffles]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleClearAllFilters = () => {
    resetFilters();
    setSort("Sort");
  };

  const handleRemoveFilter = (filterId: string) => {
    clearFilter(filterId);
  };
  return (
    <main className="flex-1 font-inter bg-black-1100">
      <section className="w-full relative z-20 md:pt-48 pt-36">
    
        <div className="w-full max-w-[1440px] md:px-5 px-4 mx-auto">
          
          <div className="p-10 pb-2 md:pt-10 pt-5 px-0  relative">
       
            <div className="relative">
            <div className='absolute lg:-right-6 right-auto left-0 lg:top-[-200px] bottom-20 -z-10 flex items-center justify-center'>
              <img src="/images/hero-pattern.png" className='lg:w-[1000px] w-full' alt="no-img" />
              <div className="bg-yellow-1000 w-[300px] h-[300px] absolute blur-[200px] md:-mr-28 opacity-60"></div>
            </div>
           
            <FeaturedSwiper />

            </div>

          </div>
        </div>
      </section>

      <section className='w-full md:pt-8 pb-12'>
        <div className="w-full">
          <div className="max-w-[1360px] w-full mx-auto relative xl:pl-12 pl-6 pr-6">
            <div className="flex-1 flex flex-col lg:gap-16 gap-10">
            <div className="flex items-center md:flex-row flex-col justify-between md:gap-[50px] gap-6">
              <div className="inline-flex items-center md:flex-row flex-col md:gap-[30px] gap-4">
              <div className="flex items-center gap-4">
              <img src="/icons/lock-icon.svg" alt="" />
              <h3 className='text-[30px] font-museo-moderno font-medium text-white-1100'>Encrypted Security</h3>
              </div>
              <div className="flex-1 md:max-w-[360px] max-w-[90%]">
              <p className='text-xl lg:text-start text-center text-gray-1200 font-museo-moderno'>Our platform has a strict security system that is safe from name theft.</p>
              </div>
              </div>
              <img src="/images/line-style-1.png" alt="" />
            </div>

            <div className="flex items-center md:flex-row flex-col justify-between lg:gap-[50px] gap-6">
              <img src="/images/line-style-1.png" className='order-2 md:order-1' alt="" />
              <div className="flex items-center justify-end w-fit md:flex-row order-1 md:order-2 flex-col lg:max-w-[66.6%] max-w-[90%] md:gap-[30px] gap-4">
              <div className="flex items-center gap-4">
              <img src="/icons/wallet-icon.svg" alt="" />
              <h3 className='text-[30px] font-museo-moderno font-medium text-white-1100'>Fast Transaction</h3>
              </div>
              <div className="md:max-w-[50%]">
              <p className='text-xl lg:text-start text-center text-gray-1200 font-museo-moderno'>We have an easy, fast, and certainly not complicated purchase transaction flow.</p>
              </div>
              </div>
            </div>

            </div>
         </div>
        </div>
      </section>

      <TryToolsSection />

      <ToolsSection />

      <section className="w-full relative z-10 pt-10 md:pt-[122px] pb-32 md:pb-[160px]" id="raffles">
        <div className="w-full max-w-[1440px] px-4 md:px-5 mx-auto">
          <div className="w-full flex items-center justify-between gap-5 lg:gap-10 flex-wrap">
            <ul className="flex items-center bg-white/[15%] backdrop-blur-[27px] rounded-[40px] p-1 md:gap-4 gap-1.5">
              {["All Raffles", "My Raffles", "Past Raffles"].map((f, index) => (
                <li key={index}>
                  <button onClick={() => setFilter(f)} className={`md:text-base text-sm cursor-pointer  font-inter font-normal md:min-w-[115px] transition duration-300 hover:bg-primary-color hover:text-black-1000 text-black-1000 rounded-full py-3 px-3 leading-[19px]
                 ${filter === f ? 'bg-primary-color font-semibold text-black-1000' : 'bg-transparent text-gray-1200'}`}> {f}</button>
                </li>
              ))}
            </ul>

            <div className="flex lg:justify-end flex-1 gap-1.5 xs:gap-3 md:gap-5">
              <SearchBox onSearch={handleSearch} />
              <SortDropdown
                options={sortingOptions}
                selected={sort}
                onChange={(value) => setSort(value)}
              />
              <FilterModel />
            </div>
          </div>

          {showActiveFilters && activeFilters.length > 0 && (
            <div className="py-10 overflow-x-auto flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className='flex items-center gap-5'>
                  <p className="md:text-base text-white text-sm whitespace-nowrap font-black-1000 font-semibold font-inter">
                    Filters :
                  </p>

                  <ul className="flex items-center gap-4">
                    <li>
                      <div 
                        onClick={handleClearAllFilters}
                        className="border cursor-pointer group hover:border-primary-color transition duration-200 h-12 inline-flex items-center justify-center rounded-full border-gray-1100 px-5 py-3 gap-2"
                      >
                        <p className="md:text-base whitespace-nowrap text-sm font-inter font-medium text-white">
                          Clear All
                        </p>
                        <button className="cursor-pointer">
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
                            onClick={() => handleRemoveFilter(filterItem.id)}
                            className="cursor-pointer"
                          >
                            <img src="/icons/cross-icon.svg" className="min-w-4" alt="remove icon" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <CryptoCardSkeleton key={i} />
                ))}
            </div>
          ) : raffles.length > 0 ? (
            <InfiniteScroll
              dataLength={raffles.length}
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
              <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mt-12">
                {raffles.map((r) => (
                  <CryptoCard key={r.id} raffle={r} soldTickets={r.ticketSold || 0} />
                ))}
              </div>
            </InfiniteScroll>
          ) : (
            <NoRaffles />
          )}

        </div>
      </section>


    </main>
  )
}







export default RafflesPage;
