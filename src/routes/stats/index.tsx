import { createFileRoute, Link } from '@tanstack/react-router'
import Dropdown from '../../components/ui/Dropdown';
import { TopRafflersTable } from '../../components/leaderboard/TopRafflersTable';
import { HotCollectionsTable } from '../../components/leaderboard/HotCollectionsTable';
import { NoAuctions } from '../../components/auctions/NoAuctions';
import { useLeaderboardStore, type LeaderboardTab } from "../../../store/useLeaderboardStore";

export const Route = createFileRoute('/stats/')({
  component: Leaderboard,
})


  const options =[
    { label: "Raffles created", value: "Raffles created" },
    { label: "Tickets Sold", value: "Tickets Sold" },
    { label: "Volume", value: "Volume" },
  ]

  const options1 =[
  { label: "All Time", value: "All Time" },
  { label: "2W", value: "2W" },
  { label: "1D", value: "1D" },
]


  interface Column<T> {
  key: keyof T | string;                
  header: string;                        
  render?: (row: T) => React.ReactNode; 
  className?: string;                    
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
        {row.userImg && (
          <img
            src={row.userImg}
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
  { key: "volume", header: "Volume (SOL)" },
];


interface TopRaffle {
  rank: string;      
  avatar?: string;   
  userImg?: string;   
  user: string;
  raffles: number;
  tickets: number;
  volume: number;
}

const rafflersData: TopRaffle[] = [
  {
    rank: "01",
    avatar: "/images/ranked-1.svg",
    userImg: "/images/user-image-1.png",
    user: "@mjbreese613",
    raffles: 19164,
    tickets: 740354,
    volume: 245298,
  },
  {
    rank: "02",
    avatar: "/images/ranked-2.svg",
    userImg: "/images/user-image-1.png",
    user: "@ClarkOliiver",
    raffles: 19164,
    tickets: 740354,
    volume: 245298,
  },
  {
    rank: "03",
    avatar: "/images/ranked-3.svg",
    userImg: "/images/user-image-1.png",
    user: "@ArtueroY",
    raffles: 19164,
    tickets: 740354,
    volume: 245298,
  },
    {
    rank: "04",
    user: "@Art",
    userImg: "/images/user-image-1.png",
    raffles: 19164,
    tickets: 740354,
    volume: 245298,
  },
];


const buyersData: TopRaffle[] = [
  {
    rank: "01",
    avatar: "/images/ranked-1.svg",
    user: "@mjbreese",
    raffles: 19164,
    tickets: 740354,
    volume: 245298,
  },
  {
    rank: "02",
    avatar: "/images/ranked-2.svg",
    user: "@ClarkOliiver",
    raffles: 19164,
    tickets: 740354,
    volume: 245298,
  },
  {
    rank: "03",
    avatar: "/images/ranked-3.svg",
    user: "@ArtueroY",
    raffles: 19164,
    tickets: 740354,
    volume: 245298,
  },
    {
    rank: "04",
    user: "@ArtueroY",
    raffles: 19164,
    tickets: 740354,
    volume: 245298,
  },
];




function Leaderboard() {
  const {
    activeTab,
    setActiveTab,
  } = useLeaderboardStore();

  const tabNames: LeaderboardTab[] = ["Top Rafflers", "Top Buyers"];



  return (
    <main className='w-full bg-black-1400'>
        <section className='w-full md:pt-48 pt-36 pb-20 xl:pb-[100px]'>
            <div className="w-full max-w-[1440px] px-5 mx-auto">
                <div className="w-full flex flex-wrap gap-6 items-center justify-between mb-10">
                  <div className="">
                    <h1 className='text-[28px] font-semibold text-white font-inter mb-1'>Leaderboard</h1>
                    <p className='text-base text-cream-1000 font-inter'>Track your trading performance</p>
                  </div>
                  
                    <Link to={"/"}  className="text-base hidden transition duration-500 hover:opacity-90 bg-primary-color py-3 px-8 text-black-1000 text-center sm:inline-flex font-inter bg-1400 rounded-full py-">Buy tickets, earn Juice! 🥤</Link>
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
                    <Dropdown
                     className="md:w-auto w-full"
                         options={options1}
                         value={{ label: "All Time", value: "All Time" }}
                        onChange={(value) => {
                        console.log("Selected sort option:", value);
                        }}
                    />

                      <Dropdown
                       className="md:w-auto w-full md:text-base text-sm"
                         options={options}
                         value={{ label: "Raffles created", value: "Raffles created" }}
                        onChange={(value) => {
                        console.log("Selected sort option:", value);
                        }}
                    />

                  </div>                   
                </div>
                <div className="w-full flex items-start gap-5 xl:flex-row flex-col">

                <div className="w-full flex-1 max-w-full">

                  <div className="w-full text-white md:-mb-14 -mb-8 flex items-center justify-center md:gap-8 gap-4">
                
                      <div className="-mb-8">
                        <div className="py-3 flex items-center justify-center flex-col gap-3">
                          <img src="/images/top-user-3.png" className='w-[66px] border border-transparent h-[66px] rounded-[10px]' alt="" />
                          <h3 className='md:text-base text-sm font-semibold font-inter text-white text-center'>Brian Ngo</h3>
                        </div>
                        <div className="flex items-center justify-center">
                        <img src="/images/top-2.svg" alt="" />
                        <div className="absolute flex flex-col md:gap-2">
                          <h4 className='md:text-base text-sm text-white font-semibold font-inter text-center'>50,000</h4>
                          <p className='md:text-[13px] text-[10px] font-inter text-center text-white'>Volume (SOL)</p>
                        </div>
                        </div>
                      </div>

                         <div className="">
                        <div className="py-3 flex items-center justify-center flex-col gap-3">
                          <img src="/images/top-user-1.png" className='w-[66px] border border-primary-color h-[66px] rounded-[10px]' alt="" />
                          <h3 className='md:text-base text-sm font-semibold font-inter text-white text-center'>mjbreese613</h3>
                        </div>
                        <div className="flex items-center justify-center">
                        <img src="/images/top-1.svg" alt="" />
                        <div className="absolute flex flex-col md:gap-2">
                          <h4 className='md:text-base text-sm text-white font-semibold font-inter text-center'>100,000</h4>
                          <p className='md:text-[13px] text-[10px] font-inter text-center text-white'>Volume (SOL)</p>
                        </div>
                        </div>
                      </div>

                           <div className="-mb-12">
                        <div className="py-3 flex items-center justify-center flex-col gap-3">
                          <img src="/images/top-user-2.png" className='w-[66px] border border-transparent h-[66px] rounded-[10px]' alt="" />
                          <h3 className='md:text-base text-sm font-semibold font-inter text-white text-center'>David Do</h3>
                        </div>
                        <div className="flex items-center justify-center">
                        <img src="/images/top-3.svg" alt="" />
                        <div className="absolute flex flex-col md:gap-2">
                          <h4 className='md:text-base text-sm text-white font-semibold font-inter text-center'>30,000</h4>
                          <p className='md:text-[13px] text-[10px] font-inter text-center text-white'>Volume (SOL)</p>
                        </div>
                        </div>
                      </div>
                    

                  </div>
                <div className="relative z-10 mt-8">
                {activeTab === "Top Rafflers" && (
                rafflersData.length > 0 ? (
                  <TopRafflersTable
                    columns={columns}
                    data={rafflersData}
                    rowKey={(row) => row.user}
                  />
                ) : (
                  <NoAuctions />
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
                  <NoAuctions />
                )
              )}
              </div>


                </div>

                <div className="flex-1 max-w-full xl:max-w-[447px] xl:w-auto w-full">
                    <HotCollectionsTable/>
                </div>

                </div>


            </div>
       </section>

    </main>
  )}
