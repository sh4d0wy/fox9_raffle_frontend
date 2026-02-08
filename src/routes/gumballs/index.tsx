import { createFileRoute, Link } from '@tanstack/react-router'
import SearchBox from '../../components/home/SearchBox';
import SortDropdown from '../../components/home/SortDropdown';
import FilterModel from '../../components/home/FilterModel';
import FeaturedSwiper from '../../components/gumballs/FeaturedSwiper';
import { GumballsCard } from '../../components/gumballs/GumballsCard';
import { ToolsSection } from '@/components/home/ToolsSection';
import { TryToolsSection } from '@/components/home/TryToolsSection';
import { useGumballsQuery } from "../../../hooks/gumball/useGumballsQuery"
import { useGlobalStore } from "../../../store/globalStore";
import CryptoCardSkeleton from '@/components/skeleton/RafflesCardSkeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useMemo, useState } from 'react';
import { NoGumballs } from '@/components/gumballs/NoGumballs';
import { useFiltersStore } from 'store/filters-store';
import { filterGumballs, getActiveFiltersList, hasActiveFilters, sortGumballs } from '@/utils/sortAndFilter';
import type { GumballBackendDataType } from 'types/backend/gumballTypes';
import { motion } from 'motion/react';
import { useGumballsStore } from 'store/gumballs-store';



export const Route = createFileRoute('/gumballs/')({
  component: Gumballs,
})



const options = [
  { label: "Recently Added", value: "Recently Added" },
  { label: "Expiring Soon", value: "Expiring Soon" },
  { label: "Selling out soon", value: "Selling out soon" },
  { label: "Price: Low to High", value: "Price: Low to High" },
  { label: "Price: High to Low", value: "Price: High to Low" },
  { label: "Floor: Low to High", value: "Floor: Low to High" },
  { label: "Floor: High to Low", value: "Floor: High to Low" },
]



function Gumballs() {


  const { filter, setFilter } = useGumballsStore()
  const { data, fetchNextPage, hasNextPage, isLoading } = useGumballsQuery(filter)
  const { sort, setSort ,searchQuery,setSearchQuery} = useGlobalStore();



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
    setPageType("gumballs");
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
    return getActiveFiltersList(filterOptions, "gumballs");
  }, [raffleType, selectedToken, selectedCollection, floorMin, floorMax, endTimeAfter, endTimeBefore]);

  const showActiveFilters = hasActiveFilters(filterOptions, "gumballs");

  const gumballs = useMemo(() => {
    let allGumballs = (data?.pages.flatMap((p) => p.items) || []) as GumballBackendDataType[];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      allGumballs = allGumballs.filter((gumball) =>
        gumball.name?.toLowerCase().includes(query)
      );
    }

    if (filtersApplied && showActiveFilters) {
      allGumballs = filterGumballs(allGumballs, filterOptions);
    }

    if (sort && sort !== "Sort") {
      allGumballs = sortGumballs(allGumballs, sort);
    }

    return allGumballs;
  }, [data, searchQuery, sort, filtersApplied, raffleType, selectedToken, selectedCollection, floorMin, floorMax, endTimeAfter, endTimeBefore]);
  useEffect(() => {
    setSearchQuery("");
  }, []);

  useEffect(() => {
    if (!isLoading && gumballs.length === 0 && hasNextPage) {
      fetchNextPage();
    }
  }, [isLoading, gumballs.length, hasNextPage, fetchNextPage]);

  return (

    <main className="main font-inter bg-black-1100">

      <motion.section 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.3 }}
      className='w-full pt-10 md:pt-[122px] pb-24 md:pb-[90px] z-10 relative'>
        <div className="w-full max-w-[1360px] px-4 mx-auto">
        <div className="w-full md:pb-12 pb-10 mt-10">
        <h1 className='lg:text-[60px] text-4xl leading-tight text-white font-semibold font-inter'>Gumball Spins & Rewards</h1>
        <p className='lg:text-xl text-base font-inter text-cream-1000'>Spin the gumball and win exciting prizes</p>
        </div>
          <div className="flex-1 flex items-center justify-between lg:gap-10 gap-5 flex-col lg:flex-row">
            <div className="overflow-x-auto md:overflow-hidden lg:w-1/2 w-full">
              <ul className="inline-flex items-center bg-white/[15%] backdrop-blur-[27px] rounded-[40px] p-1 md:gap-3 gap-1.5">
                {["All Gumballs", "My Gumballs", "Past Gumballs"].map((f, index) => (
                  <li key={index}>
                  <button onClick={() => setFilter(f)} className={`md:text-base text-sm cursor-pointer  font-inter font-normal md:min-w-[115px] transition duration-300 hover:bg-primary-color hover:text-black-1000 text-black-1000 rounded-full py-3 px-3 leading-[19px]
                 ${filter === f ? 'bg-primary-color font-semibold text-black-1000' : 'bg-transparent text-gray-1200'}`}> {f}</button>
                </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end md:gap-5 gap-3">
            <SearchBox
                placeholder="Search gumballs..."
                value={searchQuery}
                onSearch={(value) => {
                  setSearchQuery(value);
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
              {activeFilters.length > 0 && (
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
                          onClick={() => resetFilters()}
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
                            onClick={() => clearFilter(filterItem.id)}
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
              style={{ overflow: 'visible' }}
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
                  <GumballsCard key={r.id} gumball={r} />
                ))}
              </div>
            </InfiniteScroll>
          ) : (
            <NoGumballs />
          )}


        </div>
      </motion.section>
    </main>
  )
}
