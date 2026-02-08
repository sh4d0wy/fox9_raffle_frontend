import { AuctionsCard } from '@/components/auctions/AuctionsCard';
import { RafflersCard } from '@/components/cards/RafflersCard';
import { RafflersCardPurchased } from '@/components/cards/RafflersCardPurchased';
import { GumballsCard } from '@/components/gumballs/GumballsCard';
import { NoAuctions } from '@/components/home/NoAuctions';
import Dropdown from '@/components/ui/Dropdown';
import InputSwitch from '@/components/ui/Switch';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useCreatorProfileStore } from "../../../store/creatorProfile-store";
import { useCreatorProfileData } from "hooks/profile/useCreatorProfileData";
import { useEffect, useMemo, useState } from 'react';
import CryptoCardSkeleton from '@/components/skeleton/RafflesCardSkeleton';
import { useWallet } from '@solana/wallet-adapter-react';
import { useUserStore } from 'store/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { useMyProfile } from 'hooks/profile/useMyProfile';
import { useProfileStats } from 'hooks/stats/useProfileStats';
import { useQueryFavourites } from 'hooks/profile/useQueryFavourites';
import { NoRaffles } from '@/components/home/NoRaffles';
import { CryptoCard } from '@/components/common/CryptoCard';
import { NoGumballs } from '@/components/gumballs/NoGumballs';
import { DEFAULT_AVATAR } from 'store/userStore';
import { Pencil } from 'lucide-react';
import { API_URL } from '@/constants';
import { motion } from 'motion/react';
import { GumballsCardPurchased } from '@/components/gumballs/GumballsCardPurchased';

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

  const baseSortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "Price: High to Low", value: "price_high" },
    { label: "Price: Low to High", value: "price_low" },
    { label: "Ending Soon", value: "ending_soon" },
  ];
  const rafflePurchasedSortOptions = [
    ...baseSortOptions,
    { label: "Unclaimed Prizes", value: "unclaimed_winner" },
  ];
function CreateProfile() {
  const {
    mainFilter,
    setMainFilter,
    rafflerFilter,
    setRafflerFilter,
    activeRafflerTab,
    setActiveRafflerTab,
    enabled,
    setEnabled,
    sortOption,
    setSortOption,
  } = useCreatorProfileStore();

  const { publicKey } = useWallet();
  
  const { 
    profilePicture, 
    setProfilePicture, 
    isUploadingProfilePicture, 
    setIsUploadingProfilePicture,
    setProfilePictureError,
    updateProfilePictureVersion
  } = useUserStore();
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const isAuthenticated = !!publicKey && !!localStorage.getItem("authToken");
  const { data: profileData } = useMyProfile(isAuthenticated);

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
        ];
      case "Auctions":
        return [
          { label: "Auctions Created", value: "created" },
          { label: "Auctions Participated", value: "purchased" },
          { label: "Favourite Auctions", value: "favourite" },
        ];
      case "Gumballs":
        return [
          { label: "Gumballs Created", value: "created" },
          { label: "Gumballs Purchased", value: "purchased" },
          { label: "Favourite Gumballs", value: "favourite" },
        ];
      default:
        return [];
    }
  };

  const filters = getFilterLabels();
  const {
    getRaffleStats,
    getGumballStats,
    getAuctionStats,
    getRaffleCreatedCards,
    getRafflePurchasedCards,
    getGumballCreatedCards,
    getGumballPurchasedCards,
    getAuctionCreatedCards,
    getAuctionPurchasedCards,
  } = useProfileStats(
    publicKey?.toBase58() ?? "",
    mainFilter as "Rafflers" | "Gumballs" | "Auctions",
    rafflerFilter as "created" | "purchased" | "favourite"
  );
  const { getFavouriteRaffle, getFavouriteGumball, getFavouriteAuction } =
  useQueryFavourites(
    publicKey?.toBase58() ?? "",
    mainFilter as "Rafflers" | "Gumballs" | "Auctions",
    rafflerFilter as "created" | "purchased" | "favourite"
  );
  const raffleStats = getRaffleStats.data?.stats;
  const gumballStats = getGumballStats.data?.stats;
  const auctionStats = getAuctionStats.data?.stats;
  const raffleCreatedCards = getRaffleCreatedCards.data ?? [];
  const rafflePurchasedCards = getRafflePurchasedCards.data ?? [];
  const gumballCreatedCards = getGumballCreatedCards.data ?? [];
  const gumballPurchasedCards = getGumballPurchasedCards.data ?? [];
  const auctionCreatedCards = getAuctionCreatedCards.data ?? [];
  const auctionPurchasedCards = getAuctionPurchasedCards.data ?? [];

  const favouriteRaffles = getFavouriteRaffle.data;
  const favouriteGumballs = getFavouriteGumball.data;
  const favouriteAuctions = getFavouriteAuction.data;

  const sortItems = <T extends Record<string, any>>(items: T[], isRafflePurchased = false): T[] => {
    if (!items || items.length === 0) return items;
    
    if (sortOption === "unclaimed_winner" && isRafflePurchased) {
      return [...items]
        .filter((item) => item.isWinner === true && item.hasClaimed === false)
        .sort((a, b) => {
          return new Date(b.createdAt || b.created_at || 0).getTime() - new Date(a.createdAt || a.created_at || 0).getTime();
        });
    }
    
    return [...items].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt || b.created_at || 0).getTime() - new Date(a.createdAt || a.created_at || 0).getTime();
        case "oldest":
          return new Date(a.createdAt || a.created_at || 0).getTime() - new Date(b.createdAt || b.created_at || 0).getTime();
        case "price_high":
          return (b.ticketPrice || b.reservePrice || b.spinPrice || 0) - (a.ticketPrice || a.reservePrice || a.spinPrice || 0);
        case "price_low":
          return (a.ticketPrice || a.reservePrice || a.spinPrice || 0) - (b.ticketPrice || b.reservePrice || b.spinPrice || 0);
        case "ending_soon":
          return new Date(a.endDate || a.end_date || a.endTime || 0).getTime() - new Date(b.endDate || b.end_date || b.endTime || 0).getTime();
        default:
          return 0;
      }
    });
  };

  const sortedRaffleCreatedCards = useMemo(() => sortItems(raffleCreatedCards), [raffleCreatedCards, sortOption]);
  const sortedRafflePurchasedCards = useMemo(() => sortItems(rafflePurchasedCards, true), [rafflePurchasedCards, sortOption]);
  const sortedGumballCreatedCards = useMemo(() => sortItems(gumballCreatedCards), [gumballCreatedCards, sortOption]);
  const sortedGumballPurchasedCards = useMemo(() => sortItems(gumballPurchasedCards), [gumballPurchasedCards, sortOption]);
  const sortedAuctionCreatedCards = useMemo(() => sortItems(auctionCreatedCards), [auctionCreatedCards, sortOption]);
  const sortedAuctionPurchasedCards = useMemo(() => sortItems(auctionPurchasedCards), [auctionPurchasedCards, sortOption]);
  const sortedFavouriteRaffles = useMemo(() => sortItems(favouriteRaffles ?? []), [favouriteRaffles, sortOption]);
  const sortedFavouriteGumballs = useMemo(() => sortItems(favouriteGumballs ?? []), [favouriteGumballs, sortOption]);
  const sortedFavouriteAuctions = useMemo(() => sortItems(favouriteAuctions ?? []), [favouriteAuctions, sortOption]);

  const currentSortOptions = useMemo(() => {
    if (mainFilter === "Rafflers" && activeRafflerTab === "purchased") {
      return rafflePurchasedSortOptions;
    }
    return baseSortOptions;
  }, [mainFilter, activeRafflerTab]);

  const currentSortLabel = currentSortOptions.find(opt => opt.value === sortOption)?.label || "Sort Entries";
  
  useEffect(() => {
    if (profileData?.user?.profileImage) {
      // Add cache-busting timestamp to ensure fresh image is loaded
      const fullImageUrl = `${API_URL}${profileData.user.profileImage}?t=${Date.now()}`;
      setProfilePicture(fullImageUrl);
    } else if (profileData?.user) {
      setProfilePicture(DEFAULT_AVATAR);
    }
  }, [profileData, setProfilePicture]);

  return (
      <main className="main font-inter bg-black-1400">
         <motion.section 
         initial={{ opacity: 0, y: 100 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -100 }}
         transition={{ duration: 0.3 }}
         className='w-full md:pt-48 pt-36 pb-[120px]'>
          <div className="w-full max-w-[1440px] px-5 mx-auto">
            <div className="w-full flex lg:flex-row flex-col gap-10">
                <div className="flex-1 space-y-6 md:max-w-[320px]">
                    <div className="w-full bg-black-1300 border flex items-center justify-center border-gray-1100 rounded-[18px] py-5">
                        <div className="w-full p-5">
                        <div className="w-full flex items-start justify-center ">
                          <div className="flex items-center justify-center w-full flex-col gap-3">
                            <div className="relative">
                            <img src={profilePicture || DEFAULT_AVATAR} className="w-[68px] h-[68px] rounded-full border-2 border-primary-color" alt="" />
                            <Link to='/profile/change_profile_picture' className="absolute z-10 cursor-pointer -bottom-2 right-0 bg-black-1400 w-7 h-7 rounded-full flex items-center justify-center">
                                  <Pencil className="w-4 h-4 text-white transition duration-300 hover:text-primary-color" />
                            </Link>
                            </div>
                           <h4 className='text-lg text-white font-inter font-semibold mt-2'>{publicKey?.toBase58().slice(0, 6)}...{publicKey?.toBase58().slice(-4)}</h4>
                          </div>
                        {/* <div className="flex items-center gap-4">
                                
                            <a href="#">
                                <img src="/icons/solana-sol-logo.svg" className="w-6 h-6" alt="" />
                            </a>
                         
                        </div> */}
                        </div>

                        </div>

                        {/* <div className="w-full border-t boredr-gray-1100 my-4"></div> */}

                        {/* <div className="w-full flex items-center justify-center flex-wrap  gap-3.5">
                            <Link to={"/"}  className="border group hover:text-white transition duration-300 text-sm gap-2 hover:bg-black hover:border-black text-white font-semibold font-inter border-white rounded-full px-4 py-2.5 flex items-center justify-center" >
                              <img src="/icons/twitter-icon.svg" className="w-5 invert transition duration-300" alt="" />
                                Link Twitter
                            </Link>
                            <Link to={"/"}  className="border transition hover:bg-purple-1000 hover:border-purple-1000 hover:text-white text-sm gap-2 text-white font-semibold font-inter border-white rounded-full px-4 py-2.5 flex items-center justify-center" >
                              <img src="/icons/discord_svg.svg" className="w-5 " alt="" />
                                Link Discord
                            </Link>
                        </div> */}

                    </div>

              <div className="w-full border space-y-2.5 border-gray-1100 rounded-[18px] md:p-5 p-3">
                <div className="flex flex-col gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => {
                        setRafflerFilter(
                          filter.value as "created" | "purchased" | "favourite"
                        );

                        setActiveRafflerTab(
                          filter.value as "created" | "purchased" | "favourite"
                        );
                      }}
                      className={`
                            text-sm cursor-pointer transition px-5 py-3 text-start font-semibold font-inter w-full rounded-full
                            ${
                              rafflerFilter === filter.value
                                ? "bg-primary-color text-black-1000"
                                : "bg-transparent text-white hover:bg-primary-color/40"
                            }
                          `}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full border space-y-2.5 border-gray-1100 rounded-[18px] md:p-5 p-3">

                <h3 className="text-lg text-white font-semibold font-inter">
                  {mainFilter === "Rafflers" && "Raffle Stats"}
                  {mainFilter === "Gumballs" && "Gumball Stats"}
                  {mainFilter === "Auctions" && "Auction Stats"}
                </h3>
                <ul className="mt-2">
                  {mainFilter === "Rafflers" && (
                    <>
                      <li className="flex items-center justify-between">
                        <p className="md:text-base text-sm font-medium font-inter text-start text-gray-1200">
                          Raffles Bought
                        </p>
                        <p className="md:text-base text-sm font-medium font-inter text-white text-right">
                          {raffleStats?.rafflesBought ?? 0}
                        </p>
                      </li>
                      <li className="flex items-center justify-between">
                        <p className="md:text-base text-sm font-medium font-inter text-start text-gray-1200">
                          Tickets Bought
                        </p>
                        <p className="md:text-base text-sm font-medium font-inter text-white text-right">
                          {raffleStats?.ticketsBought ?? 0}
                        </p>
                      </li>
                      <li className="flex items-center justify-between">
                        <p className="md:text-base text-sm font-medium font-inter text-start text-gray-1200">
                          Raffles Won
                        </p>
                        <p className="md:text-base text-sm font-medium font-inter text-white text-right">
                          {raffleStats?.rafflesWon ?? 0}
                        </p>
                      </li>
                      <li className="flex items-center justify-between">
                        {/* <p className="md:text-base text-sm font-medium font-inter text-start text-gray-1200">
                          Purchase Volume
                        </p>
                        <p className="md:text-base text-sm font-medium font-inter text-white text-right">
                          {raffleStats?.purchaseVolume ? (raffleStats?.purchaseVolume / 10 ** 9).toFixed(2) : 0}
                        </p> */}
                      </li>
                    </>
                  )}
                  {mainFilter === "Gumballs" && (
                    <>
                      <li className="flex items-center justify-between">
                        <p className="md:text-base text-sm font-medium font-inter text-start text-gray-1200">
                          Gumballs Created
                        </p>
                        <p className="md:text-base text-sm font-medium font-inter text-white text-right">
                          {gumballStats?.gumballsCreated ?? 0}
                        </p>
                      </li>
                      <li className="flex items-center justify-between">
                        <p className="md:text-base text-sm font-medium font-inter text-start text-gray-1200">
                          Total Spins
                        </p>
                        <p className="md:text-base text-sm font-medium font-inter text-white text-right">
                          {gumballStats?.totalSpins ?? 0}
                        </p>
                      </li>
                      <li className="flex items-center justify-between">
                        {/* <p className="md:text-base text-sm font-medium font-inter text-start text-gray-1200">
                          Gumball Volume
                        </p>
                        <p className="md:text-base text-sm font-medium font-inter text-white text-right">
                          {gumballStats?.totalVolumeSpent ? (gumballStats?.totalVolumeSpent / 10 ** 9).toFixed(2) : 0}
                        </p> */}
                      </li>
                    </>
                  )}
                  {mainFilter === "Auctions" && (
                    <>
                      <li className="flex items-center justify-between">
                        <p className="md:text-base text-sm font-medium font-inter text-start text-gray-1200">
                          Auctions Participated
                        </p>
                        <p className="md:text-base text-sm font-medium font-inter text-white text-right">
                          {auctionStats?.auctionsParticipated ?? 0}
                        </p>
                      </li>
                      <li className="flex items-center justify-between">
                        <p className="md:text-base text-sm font-medium font-inter text-start text-gray-1200">
                          Auctions Won
                        </p>
                        <p className="md:text-base text-sm font-medium font-inter text-white text-right">
                          {auctionStats?.auctionsWon ?? 0}
                        </p>
                      </li>
                      <li className="flex items-center justify-between">
                        <p className="md:text-base text-sm font-medium font-inter text-start text-gray-1200">
                          Total bids
                        </p>
                        <p className="md:text-base text-sm font-medium font-inter text-white text-right">
                          {auctionStats?.totalBids ?? 0}
                        </p>
                      </li>
                      <li className="flex items-center justify-between">
                        {/* <p className="md:text-base text-sm font-medium font-inter text-start text-gray-1200">
                          Total Volume
                        </p>
                        <p className="md:text-base text-sm font-medium font-inter text-black-1000 text-right">
                          {(auctionStats?.totalVolumeBid)?((auctionStats?.totalVolumeBid)/10**9).toFixed(2) : 0}
                        </p> */}
                      </li>
                    </>
                  )}
                </ul>

              </div>
{/* 
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
                        </div> */}

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
                  options={currentSortOptions}
                  value={{ label: currentSortLabel, value: sortOption }}
                  onChange={(value) => {
                    setSortOption(value.value as "newest" | "oldest" | "price_high" | "price_low" | "ending_soon" | "unclaimed_winner");
                  }}
                />
                </div>

                {/* <div className="w-full my-10 flex items-center justify-between bg-black-1300 border border-gray-1100 rounded-[10px] px-5 py-3">
                    <p className='md:text-base text-sm font-inter font-semibold text-white'>Set as profile default page</p>
                    <InputSwitch
                      checked={enabled}
                      onChange={setEnabled}
                      />
                </div> */}
            

             
              <div className="flex-1 md:mt-5 mt-2">

              {/* <div className="w-full my-10 flex items-center justify-between bg-gray-1400 border border-gray-1100 rounded-[10px] px-5 py-3">
                <p className="md:text-base text-sm font-inter font-semibold text-black-1000">
                  Set as profile default page
                </p>
                <InputSwitch checked={enabled} onChange={setEnabled} />
              </div> */}

              <div className="w-full">
                {mainFilter === "Rafflers" && (
                  <>
                    {getRaffleCreatedCards.isLoading ? (
                      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <CryptoCardSkeleton key={i} />
                        ))}
                      </div>
                    ) : (activeRafflerTab === "purchased"
                        ? sortedRafflePurchasedCards
                        : activeRafflerTab === "favourite"
                          ? sortedFavouriteRaffles
                          : sortedRaffleCreatedCards
                      ).length < 1 ? (
                      <NoRaffles />
                    ) : (
                      <div
                        className={`grid ${
                          activeRafflerTab === `purchased`
                            ? `grid-cols-1`
                            : activeRafflerTab === `favourite`
                              ? `grid-cols-3`
                              : `lg:grid-cols-3 md:grid-cols-2 grid-cols-1`
                        } lg:gap-y-10 lg:gap-x-[26px] gap-4`}
                      >
                        {activeRafflerTab === "purchased"
                          ? sortedRafflePurchasedCards.map((card: any) => (
                              <RafflersCardPurchased key={card.id} {...card} isWinner={card.isWinner} hasClaimed={card.hasClaimed} />
                            ))
                          : activeRafflerTab === "favourite"
                            ? sortedFavouriteRaffles?.map((card: any) => (
                                <CryptoCard
                                  key={card.id}
                                  raffle={card}
                                  soldTickets={card.ticketSold}
                                />
                              ))
                            : sortedRaffleCreatedCards.map((card: any) => (
                                <CryptoCard
                                key={card.id}
                                raffle={card}
                                soldTickets={card.ticketSold}
                                category="created"
                              />
                              ))}
                      </div>
                    )}
                  </>
                )}

                {mainFilter === "Auctions" && (
                  <>
                    {getAuctionCreatedCards.isLoading ? (
                      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <CryptoCardSkeleton key={i} />
                        ))}
                      </div>
                    ) : (activeRafflerTab === "purchased"
                        ? sortedAuctionPurchasedCards
                        : activeRafflerTab === "favourite"
                          ? sortedFavouriteAuctions
                          : sortedAuctionCreatedCards
                      ).length < 1 ? (
                      <NoAuctions />
                    ) : (
                      <div
                        className={`grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1
                        lg:gap-y-10 lg:gap-x-[26px] gap-4`}
                      >
                        {activeRafflerTab === "purchased"
                          ? sortedAuctionPurchasedCards.map((r: any) => (
                              <AuctionsCard
                                key={r.id}
                                {...r}
                                id={r.id ?? 0}
                                prizeName={r.prizeName ?? ""}
                                prizeImage={r.prizeImage ?? ""}
                                collectionName={r.collectionName ?? ""}
                                reservePrice={r.reservePrice ?? ""}
                              />
                            ))
                          : activeRafflerTab === "favourite"
                            ? sortedFavouriteAuctions?.map((r: any) => (
                                <AuctionsCard
                                  key={r.id}
                                  {...r}
                                  id={r.id ?? 0}
                                  prizeName={r.prizeName ?? ""}
                                  prizeImage={r.prizeImage ?? ""}
                                  collectionName={r.collectionName ?? ""}
                                  reservePrice={r.reservePrice ?? ""}
                                />
                              ))
                            : sortedAuctionCreatedCards.map((r: any) => (
                                <AuctionsCard
                                  key={r.id}
                                  {...r}
                                  id={r.id ?? 0}
                                  prizeName={r.prizeName ?? ""}
                                  prizeImage={r.prizeImage ?? ""}
                                  collectionName={r.collectionName ?? ""}
                                  reservePrice={r.reservePrice ?? ""}
                                />
                              ))}
                      </div>
                    )}
                  </>
                )}

                {mainFilter === "Gumballs" && (
                  <>
                    {getGumballCreatedCards.isLoading ||
                    getGumballPurchasedCards.isLoading ? (
                      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <CryptoCardSkeleton key={i} />
                        ))}
                      </div>
                    ) : (activeRafflerTab === "purchased"
                        ? sortedGumballPurchasedCards
                        : activeRafflerTab === "favourite"
                          ? sortedFavouriteGumballs
                          : sortedGumballCreatedCards
                      ).length < 1 ? (
                      <NoGumballs/>
                    ) : (
                      <div
                        className={`grid ${
                          activeRafflerTab === "purchased"
                            ? "grid-cols-1"
                            : "lg:grid-cols-3 md:grid-cols-2 grid-cols-1"
                        } lg:gap-y-10 lg:gap-x-[26px] gap-4`}
                      >
                        {activeRafflerTab === "purchased"
                          ? sortedGumballPurchasedCards.map((card: any) => (
                              <GumballsCardPurchased
                                key={card.id}
                                gumball={card}
                              />
                            ))
                          : activeRafflerTab === "favourite"
                            ? sortedFavouriteGumballs?.map((card: any) => (
                                <GumballsCard key={card.id} gumball={card} />
                              ))
                            : sortedGumballCreatedCards.map((card: any) => (
                              // <GumballsCard key={card.id} gumball={card} />
                              
                                <GumballsCard
                                  key={card.id}
                                  gumball={card}
                                  type="created"
                                />
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
        </motion.section>
    </main>
  )
}
