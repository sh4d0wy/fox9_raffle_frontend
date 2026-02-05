import { createFileRoute, Link } from '@tanstack/react-router'
import Dropdown from '../../components/ui/Dropdown';
import { TopRafflersTable } from '../../components/leaderboard/TopRafflersTable';
import { HotCollectionsTable } from '../../components/leaderboard/HotCollectionsTable';
import { useLeaderboardStore, type LeaderboardTab, type SortFilter, type TimeFilter } from "../../../store/useLeaderboardStore";
import { useLeaderboard } from 'hooks/stats/useLeaderboard';
import { NoRaffles } from '@/components/home/NoRaffles';
import StatsDropdown from '@/components/stats/StatsDropdown';
import { motion } from 'motion/react';
export const Route = createFileRoute('/stats/')({
  component: Leaderboard,
})


const options = [
  { label: "Raffles created", value: "raffles" },
  { label: "Tickets Sold", value: "tickets" },
  { label: "Volume", value: "volume" },
];

const options1 = [
  { label: "All Time", value: "all" },
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "1Y", value: "1y" },
];



interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface RafflerLeaderboardItem {
  rank: number;
  raffles: number;
  ticketsSold: number;
  twitterId: string | null;
  volume: number;
  walletAddress: string;
}

interface BuyerLeaderboardItem {
  rank: number;
  raffles: number;
  tickets: number;
  twitterId: string | null;
  volume: number;
  walletAddress: string;
  won: number;
}

interface LeaderboardResponse<T> {
  message: string;
  leaderboard: T[];
  limit: number;
  page: number;
  total: number;
}

interface TopRaffle {
  rank: string;
  avatar?: string;
  user: string;
  raffles: number;
  tickets: number;
  volume: string;
}

const columns: Column<TopRaffle>[] = [
  {
    key: "rank",
    header: "Rank",
    render: (row) =>
        <p className="text-base text-white font-medium font-inter">
          {row.rank}
        </p>
  },
  {
    key: "user",
    header: "User",
    render: (row) => (
      <div className="flex items-center gap-2">
        {row.avatar && (
          <img
            src={row.avatar}
            className="w-8 h-8 rounded-full object-cover"
            alt={row.user}
          />
        )}
        <span className="text-base text-white font-medium font-inter">
          {row.user}
        </span>
      </div>
    ),
  },
  { key: "raffles", header: "Raffles" },
  { key: "tickets", header: "Tickets Sold" },
  { key: "volume", header: "Volume (USDT)" },
];


// const rafflersData: TopRaffle[] = [
//   {
//     rank: "01",
//     avatar: "/images/ranked-1.svg",
//     userImg: "/images/user-image-1.png",
//     user: "@mjbreese613",
//     raffles: 19164,
//     tickets: 740354,
//     volume: 245298,
//   },
//   {
//     rank: "02",
//     avatar: "/images/ranked-2.svg",
//     userImg: "/images/user-image-1.png",
//     user: "@ClarkOliiver",
//     raffles: 19164,
//     tickets: 740354,
//     volume: 245298,
//   },
//   {
//     rank: "03",
//     avatar: "/images/ranked-3.svg",
//     userImg: "/images/user-image-1.png",
//     user: "@ArtueroY",
//     raffles: 19164,
//     tickets: 740354,
//     volume: 245298,
//   },
//     {
//     rank: "04",
//     user: "@Art",
//     userImg: "/images/user-image-1.png",
//     raffles: 19164,
//     tickets: 740354,
//     volume: 245298,
//   },
// ];


// const buyersData: TopRaffle[] = [
//   {
//     rank: "01",
//     avatar: "/images/ranked-1.svg",
//     user: "@mjbreese",
//     raffles: 19164,
//     tickets: 740354,
//     volume: 245298,
//   },
//   {
//     rank: "02",
//     avatar: "/images/ranked-2.svg",
//     user: "@ClarkOliiver",
//     raffles: 19164,
//     tickets: 740354,
//     volume: 245298,
//   },
//   {
//     rank: "03",
//     avatar: "/images/ranked-3.svg",
//     user: "@ArtueroY",
//     raffles: 19164,
//     tickets: 740354,
//     volume: 245298,
//   },
//     {
//     rank: "04",
//     user: "@ArtueroY",
//     raffles: 19164,
//     tickets: 740354,
//     volume: 245298,
//   },
// ];

const getRankAvatar = (rank: number): string | undefined => {
  if (rank === 1) return "/images/ranked-1.svg";
  if (rank === 2) return "/images/ranked-2.svg";
  if (rank === 3) return "/images/ranked-3.svg";
  return undefined;
};

const formatVolume = (lamports: number): string => {
  const sol = lamports;
  return sol.toString();
};

const shortenAddress = (address: string): string => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const mapRafflersToTableData = (data: LeaderboardResponse<RafflerLeaderboardItem> | undefined): TopRaffle[] => {
  if (!data?.leaderboard) return [];
  return data.leaderboard.map((item) => ({
    rank: String(item.rank).padStart(2, '0'),
    avatar: getRankAvatar(item.rank),
    user: item.twitterId ? `@${item.twitterId}` : shortenAddress(item.walletAddress),
    raffles: item.raffles,
    tickets: item.ticketsSold,
    volume: formatVolume(item.volume),
  }));
};

const mapBuyersToTableData = (data: LeaderboardResponse<BuyerLeaderboardItem> | undefined): TopRaffle[] => {
  if (!data?.leaderboard) return [];
  return data.leaderboard.map((item) => ({
    rank: String(item.rank).padStart(2, '0'),
    avatar: getRankAvatar(item.rank),
    user: item.twitterId ? `@${item.twitterId}` : shortenAddress(item.walletAddress),
    raffles: item.raffles,
    tickets: item.tickets,
    volume: formatVolume(item.volume),
  }));
};


function Leaderboard() {
  const {
    activeTab,
    setActiveTab,
    timeFilter,
    sortFilter,
    setTimeFilter,
    setSortFilter,
  } = useLeaderboardStore();

  const tabNames: LeaderboardTab[] = ["Top Rafflers", "Top Buyers"];
  const { rafflerLeaderboard, raffleBuyerLeaderboard } = useLeaderboard({timeframe: timeFilter.value, sortFilter: sortFilter.value});

  const rafflersData = mapRafflersToTableData(rafflerLeaderboard.data);
  const buyersData = mapBuyersToTableData(raffleBuyerLeaderboard.data);


  return (
    <main className='w-full bg-black-1400'>
        <motion.section 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.3 }}
        className='w-full md:pt-48 pt-36 pb-20 xl:pb-[100px]'>
            <div className="w-full max-w-[1440px] px-5 mx-auto">
                <div className="w-full flex flex-wrap gap-6 items-center justify-between mb-10">
                  <div className="">
                    <h1 className='text-[28px] font-semibold text-white font-inter mb-1'>Leaderboard</h1>
                    <p className='text-base text-cream-1000 font-inter'>Track your trading performance</p>
                  </div>
                  
                </div>
                <div className="w-full flex md:bg-primary-color/15 rounded-full p-2 items-center justify-between gap-5 mb-10 md:flex-nowrap flex-wrap">
                <ul className="md:inline-flex flex md:flex-initial flex-1 items-center bg-white/[15%] backdrop-blur-[27px] rounded-[40px] p-1 md:gap-3 gap-1.5">
                 {tabNames.map((tab) => (
                    <li key={tab} className='flex-1 sm:flex-none'>
                      <button
                        onClick={() => setActiveTab(tab)}
                        className={`md:text-base text-sm md:w-auto w-full cursor-pointer font-inter font-medium transition duration-300 hover:bg-primary-color hover:text-black-1000 text-white rounded-full py-2.5 md:py-3 md:px-5 px-3
                          ${activeTab === tab ? "bg-primary-color !text-black-1000" : ""}
                        `}
                      >
                        {tab}
                      </button>
                    </li>
                  ))}
                  </ul>
                  <div className="flex items-center sm:flex-row flex-col justify-center gap-3 md:gap-5 md:w-auto w-full">
                    <StatsDropdown
                      options={options1}
                      value={timeFilter}
                      onChange={(value) => {
                        setTimeFilter(value as TimeFilter);
                      }}
                    />

                      <StatsDropdown
                      options={options}
                      value={sortFilter}
                      onChange={(value) => {
                        setSortFilter(value as SortFilter);
                      }}
                    />

                  </div>                   
                </div>
                <div className="w-full flex items-start gap-5 xl:flex-row flex-col">

                <div className="w-full flex-1 max-w-full">

                <div className="relative z-10 mt-8">
                {activeTab === "Top Rafflers" && (
                rafflersData.length > 0 ? (
                  <TopRafflersTable
                    columns={columns}
                    data={rafflersData}
                    rowKey={(row) => row.user}
                  />
                ) : (
                  <NoRaffles />
                )
              )}

              {activeTab === "Top Buyers" && (
                buyersData.length > 0 ? (
                  <TopRafflersTable   
                    columns={columns}
                    data={buyersData}
                    rowKey={(row) => row.user}
                  />
                ) : (
                  <NoRaffles />
                )
              )}
              </div>


                </div>

                {/* <div className="flex-1 max-w-full xl:max-w-[447px] xl:w-auto w-full">
                    <HotCollectionsTable/>
                </div> */}

                </div>


            </div>
       </motion.section>

    </main>
  )}
