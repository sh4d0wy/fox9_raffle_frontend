import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useEffect } from 'react';
import SearchBox from '../../components/home/SearchBox';
import SortDropdown from '../../components/home/SortDropdown';
import FilterModel from '../../components/home/FilterModel';
import { NoAuctions } from '../../components/auctions/NoAuctions';
import { AuctionsCard } from '@/components/auctions/AuctionsCard';
import { useAucationsStore } from 'store/auctions-store';
import { useAuctionsQuery } from 'hooks/auction/useAuctionsQuery';
import { useGlobalStore } from 'store/globalStore';
import CryptoCardSkeleton from '@/components/skeleton/RafflesCardSkeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useFiltersStore } from 'store/filters-store';
import { filterAuctions, getActiveFiltersList, hasActiveFilters, type AuctionItem, sortAuctions } from '@/utils/sortAndFilter';
import { motion } from 'motion/react';
import { useWallet } from '@solana/wallet-adapter-react';
const options = [
  { label: "Recently Added", value: "Recently Added" },
  { label: "Expiring Soon", value: "Expiring Soon" },
  { label: "Price: Low to High", value: "Price: Low to High" },
  { label: "Price: High to Low", value: "Price: High to Low" },
  { label: "Floor: Low to High", value: "Floor: Low to High" },
  { label: "Floor: High to Low", value: "Floor: High to Low" },
];


export const Route = createFileRoute('/auctions/')({
  component: Auctions,
})

function Auctions() {
  const { filter, setFilter } = useAucationsStore();
  const { publicKey } = useWallet();
  const { data, fetchNextPage, hasNextPage, isLoading } = useAuctionsQuery(filter, publicKey?.toString() || "");
  const { sort, setSort, searchQuery, setSearchQuery } = useGlobalStore();

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
    setPageType("auctions");
  }, [setPageType]);

  const filterOptions = useMemo(
    () => ({
      raffleType,
      selectedToken,
      selectedCollection,
      floorMin,
      floorMax,
      endTimeAfter,
      endTimeBefore,
    }),
    [
      raffleType,
      selectedToken,
      selectedCollection,
      floorMin,
      floorMax,
      endTimeAfter,
      endTimeBefore,
    ]
  );
  const activeFilters = useMemo(() => {
    return getActiveFiltersList(filterOptions, "auctions");
  }, [filterOptions]);

  const showActiveFilters = hasActiveFilters(filterOptions, "auctions");

  const aucations = useMemo(() => {
    let allAuctions = data?.pages.flatMap((p) => p.items) || [];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      allAuctions = allAuctions.filter((auction) =>
        auction.prizeName?.toLowerCase().includes(query)
      );
    }

    if (filtersApplied && showActiveFilters) {
      allAuctions = filterAuctions(
        allAuctions as AuctionItem[],
        filterOptions
      ) as typeof allAuctions;
    }

    if (sort && sort !== "Sort") {
      allAuctions = sortAuctions(
        allAuctions as AuctionItem[],
        sort
      ) as typeof allAuctions;
    }

    return allAuctions;
  }, [
    data,
    searchQuery,
    sort,
    filtersApplied,
    showActiveFilters,
    filterOptions,
  ]);

  useEffect(() => {
    setSearchQuery("");
  }, []);
  return (  
  <main className="main font-inter bg-black-1400">
    <motion.section 
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 100 }}
    transition={{ duration: 0.3 }}
    className='w-full md:pt-48 pt-36 pb-20 md:pb-[120px]'>
       <div className="w-full max-w-[1360px] px-5 mx-auto">
        <div className="md:pb-16 pb-10">
        <h1 className='lg:text-[60px] text-4xl leading-tight text-white font-semibold font-inter'>Live Auctions Happening Now</h1>
        <p className='lg:text-xl text-base font-inter text-cream-1000'>Discover exclusive NFTs from top creators. Bid in real-time and own digital masterpieces.</p>
        </div>
            <div className="w-full flex items-center justify-between gap-5 lg:gap-10 flex-wrap">
                  <ul className="flex items-center bg-white/[15%] backdrop-blur-[27px] rounded-[40px] p-1 md:gap-4 gap-1.5">
                  {["All Auctions", "My Auctions","Past Auctions"].map((f, index) => (
                    <li key={index}>
                    <button onClick={() => setFilter(f)} className={`md:text-base text-sm cursor-pointer  font-inter font-normal min-w-[115px] transition duration-300 hover:bg-primary-color hover:text-black-1000 text-black-1000 rounded-full py-3 px-3 leading-[19px]
                    ${filter === f ? 'bg-primary-color font-semibold text-black-1000' : 'bg-transparent text-gray-1200'}`}> {f}</button>
                    </li>
                  ))}
              
                </ul>

                <div className="flex justify-start lg:justify-end gap-3.5 md:gap-5">
                
                <SearchBox
                placeholder="Search auctions..."
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
                  <FilterModel/>
                  </div>
                </div>
        
                {/* Filters List */}
                <div className="lg:py-7 py-5 overflow-x-auto flex gap-4">
                   <div className={`${showActiveFilters && filtersApplied ? 'flex' : 'hidden'} items-center gap-4`}>
                   {activeFilters.length > 0 && (
                  <>
                    <p className="md:text-base text-sm whitespace-nowrap font-black-1000 font-semibold font-inter">
                      Filters :
                    </p>

                    <ul className="flex items-center gap-4">
                      <li>
                        <div className="border group hover:border-black-1000 transition duration-200 h-12 inline-flex items-center justify-center rounded-full border-gray-1100 px-5 py-3 gap-2">
                          <p className="md:text-base whitespace-nowrap text-sm font-inter font-medium text-white">
                            Clear All
                          </p>
                          <button
                            onClick={() => resetFilters()}
                            className="cursor-pointer"
                          >
                            <img src="/icons/cross-icon.svg" className='min-w-4' alt="cross icon" />
                          </button>
                        </div>
                      </li>

                    {activeFilters.map((filterItem) => (
                      <li key={filterItem.id}>
                      <div className="border group hover:border-black-1000 transition duration-200 h-12 inline-flex items-center justify-center rounded-full border-gray-1100 px-5 py-3 gap-2">
                        <p className="md:text-base whitespace-nowrap text-sm font-inter font-medium text-white">
                          {filterItem.label}
                        </p>
                        <button
                          onClick={() => clearFilter(filterItem.id)}
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
                  style={{ overflow: 'visible' }}
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
                      <AuctionsCard key={r.id} {...r} id={r.id ?? 0} currency={r.currency} prizeName={r.prizeName ?? ""} prizeImage={r.prizeImage ?? ""} collectionName={r.collectionName ?? ""} reservePrice={r.reservePrice ?? ""} status={r.status ?? ""} />
                    ))}
                  </div>
                </InfiniteScroll>
              ) : (
                <NoAuctions />
              )}


       </div>
    </motion.section>
  </main>

)}