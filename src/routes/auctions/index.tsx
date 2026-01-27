import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import SearchBox from '../../components/home/SearchBox';
import SortDropdown from '../../components/home/SortDropdown';
import FilterModel from '../../components/home/FilterModel';
import { NoAuctions } from '../../components/auctions/NoAuctions';
import { AucationsCard } from '../../components/auctions/AucationsCard';
import { useAucationsStore } from 'store/auctions-store';
import { useAucationsQuery } from 'hooks/useAucationsQuery';
import { useGlobalStore } from 'store/globalStore';
import CryptoCardSkeleton from '@/components/skeleton/RafflesCardSkeleton';
import InfiniteScroll from 'react-infinite-scroll-component';




   const options =[
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


export const Route = createFileRoute('/auctions/')({
  component: Auctions,
})

function Auctions() {
      const { filter, setFilter } = useAucationsStore()
       const { data, fetchNextPage, hasNextPage, isLoading } = useAucationsQuery(filter)
       const { sort, setSort } = useGlobalStore();
     
       const aucations = data?.pages.flatMap((p) => p.items) || []
     
       const [filters, setFilters] = useState<string[]>([]);

       const activeFilters = [
      { id: "all", label: "All Auctions" },
      { id: "past", label: "Past Auctions" },
    ];


  return (  
  <main className="main font-inter bg-black-1400">
    <section className='w-full md:pt-48 pt-36 pb-20 md:pb-[120px]'>
       <div className="w-full max-w-[1440px] px-5 mx-auto">
        <div className="md:pb-16 pb-10">
        <h1 className='lg:text-[60px] text-4xl leading-tight text-white font-semibold font-inter'>Live Auctions Happening Now</h1>
        <p className='lg:text-xl text-base font-inter text-cream-1000'>Discover exclusive NFTs from top creators. Bid in real-time and own digital masterpieces.</p>
        </div>
            <div className="w-full flex items-center justify-between gap-5 lg:gap-10 flex-wrap">
                  <ul className="flex items-center bg-white/[15%] backdrop-blur-[27px] rounded-[40px] p-1 md:gap-4 gap-1.5">
                  {["All Auctions", "Past Auctions"].map((f, index) => (
                    <li key={index}>
                    <button onClick={() => setFilter(f)} className={`md:text-base text-sm cursor-pointer  font-inter font-normal min-w-[115px] transition duration-300 hover:bg-primary-color hover:text-black-1000 text-black-1000 rounded-full py-3 px-3 leading-[19px]
                    ${filter === f ? 'bg-primary-color font-semibold text-black-1000' : 'bg-transparent text-gray-1200'}`}> {f}</button>
                    </li>
                  ))}
              
                </ul>

                <div className="flex justify-start lg:justify-end gap-3.5 md:gap-5">
                
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
                  <FilterModel/>
                  </div>
                </div>
        
                {/* Filters List */}
                <div className="lg:py-7 py-5 overflow-x-auto flex gap-4">
                   <div className="hidden items-center gap-4">
                   {activeFilters.length > 0 && (
                  <>
                    <p className="md:text-base text-sm whitespace-nowrap font-black-1000 font-semibold font-inter">
                      Filters :
                    </p>

                    <ul className="flex items-center gap-4">
                      <li>
                        <div className="border group hover:border-black-1000 transition duration-200 h-12 inline-flex items-center justify-center rounded-full border-gray-1100 px-5 py-3 gap-2">
                          <p className="md:text-base whitespace-nowrap text-sm font-inter font-medium text-black-1000">
                            Clear All
                          </p>
                          <button
                            onClick={() => setFilter("")}
                            className="cursor-pointer"
                          >
                            <img src="/icons/cross-icon.svg" className='min-w-4' alt="cross icon" />
                          </button>
                        </div>
                      </li>

                    {activeFilters.map((filterItem) => (
                      <li key={filterItem.id}>
                      <div className="border group hover:border-black-1000 transition duration-200 h-12 inline-flex items-center justify-center rounded-full border-gray-1100 px-5 py-3 gap-2">
                        <p className="md:text-base whitespace-nowrap text-sm font-inter font-medium text-black-1000">
                          {filterItem.label}
                        </p>
                        <button
                          onClick={() => setFilters(filters.filter((f) => f !== filterItem.id))}
                          className="cursor-pointer"
                        >
                          <img src="/icons/cross-icon.svg" className='min-w-4' alt="remove icon" />
                        </button>
                      </div>
                    </li>
                      ))}
                  </ul>
                </>
              )}
              </div>
                  </div>
                
        
                {isLoading ? (
                <div className="flex items-center min-h-[60vh] justify-center">
                  <img src="/loading-vector.svg" alt="" />
                </div>
              ) : aucations.length > 0 ? (
                <InfiniteScroll
                  dataLength={aucations.length}
                  next={fetchNextPage}
                  hasMore={!!hasNextPage}
                  loader={
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
                      {Array(4)
                        .fill(0)
                        .map((_, i) => (
                          <CryptoCardSkeleton key={i} />
                        ))}
                    </div>
                  }
                >
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {aucations.map((r) => (
                      <AucationsCard key={r.id} {...r} />
                    ))}
                  </div>
                </InfiniteScroll>
              ) : (
                <NoAuctions />
              )}


       </div>
    </section>
  </main>

)}