import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TransactionsTable } from '../../components/auctions/TransactionsTable';
import { GumballPrizesTable } from '../../components/gumballs/GumballPrizesTable';
import { MoneybackTable } from '../../components/gumballs/MoneybackTable';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import QuantityBox from '@/components/gumballs/QuantityBox';
import { PrizeModal ,type Prize} from '@/components/gumballs/PrizeModal';
import { useGumballById } from 'hooks/gumball/useGumballsQuery';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToggleFavourite } from 'hooks/useToggleFavourite';
import { useQueryFavourites } from 'hooks/profile/useQueryFavourites';
import { useSpinGumball } from 'hooks/gumball/useSpinGumball';
import { useClaimGumballPrize } from 'hooks/gumball/useClaimGumballPrize';
import type { GumballBackendDataType, PrizeDataBackend } from 'types/backend/gumballTypes';
import { VerifiedTokens } from '@/utils/verifiedTokens';
import { useGetTotalPrizeValueInSol } from 'hooks/useGetTotalPrizeValueInSol';
import { GumballBouncingBalls } from '@/components/gumballs/GumballBouncingBalls';
import { DEFAULT_AVATAR } from 'store/userStore';
import { API_URL, NATIVE_SOL_MINT } from '@/constants';
import { DynamicCounter } from '@/components/common/DynamicCounter';
import { motion } from 'motion/react';
import SpinGumballPopup from '@/components/ui/popups/gumballs/SpinPopup';
import RevealPrizePopup from '@/components/ui/popups/gumballs/RevealPrizePopup';
import PageTimer from '@/components/common/PageTimer';
import { Loader } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useFetchUserToken, type UserToken } from 'hooks/useFetchUserToken';

export const Route = createFileRoute('/gumballs/$id')({
  component: GumballsDetails,
})
  
interface AvailablePrize extends PrizeDataBackend {
    remainingQuantity: number;
  }
function GumballsDetails() {
    const { id } = Route.useParams();
    const { data, isLoading, isError, refetch } = useGumballById(id || "");
    const gumball = data as GumballBackendDataType | undefined;
    const router = useRouter();
    const [prize,setPrize] = useState<Prize | null>(null);
    const [isPrizeClaimed, setIsPrizeClaimed] = useState(false);
    const [claimedPrizeIndex, setClaimedPrizeIndex] = useState<number | null>(null);
    const [unclaimedSpinId, setUnclaimedSpinId] = useState<number | null>(null);
    const { spinGumballFunction } = useSpinGumball();
    const { claimGumballPrizeFunction } = useClaimGumballPrize();
    const { publicKey } = useWallet();
    const { favouriteGumball } = useToggleFavourite(publicKey?.toString() || "");
    const { getFavouriteGumball } = useQueryFavourites(publicKey?.toString() || "","Gumballs");
    const { userVerifiedTokens, isLoading: isUserTokensLoading, error: userTokensError } = useFetchUserToken();
    const ticketToken = gumball?.isTicketSol ? NATIVE_SOL_MINT : gumball?.ticketMint;

    const balance = userVerifiedTokens.find((token:UserToken)=>token.address === ticketToken)?.balance || 0;
    
    const isFavorite = useMemo(() => getFavouriteGumball.data?.some(
      (favourite) => favourite.id === Number(id)
    ), [getFavouriteGumball.data, id]);
  

    const [tabs, setTabs] = useState([
        { name: "Gumball Prizes", active: true },
        // { name: "Your Prizes", active: false },
        ]);
  
    const isActive = gumball?.status === "ACTIVE";
  
    const MAX = 10;
    const [quantityValue, setQuantityValue] = useState<number>(1);
    
    const [isPrizeModalOpen, setIsPrizeModalOpen] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [shouldCheckForUnclaimedPrize, setShouldCheckForUnclaimedPrize] = useState(false);
    const hasCheckedInitialLoad = useRef(false);
    const availableGumballs = useMemo(() => {
      if (!gumball?.prizes) return [];
      
      const spinCountByPrizeIndex: Record<number, number> = {};
      gumball.spins?.forEach((spin) => {
          const prizeIndex = spin.prize?.prizeIndex;
        if (prizeIndex !== undefined && prizeIndex !== null) {
          spinCountByPrizeIndex[prizeIndex] = (spinCountByPrizeIndex[prizeIndex] || 0) + 1;
        }
      });
        
      return gumball.prizes
        .map((prize): AvailablePrize => ({
          ...prize,
          remainingQuantity: prize.quantity - (spinCountByPrizeIndex[prize.prizeIndex] || 0),
        }))
        .filter((prize) => prize.remainingQuantity > 0);
    }, [gumball?.prizes, gumball?.spins]);
    console.log("spins", gumball?.spins);
    const handleSpinClick = async () => {
      try {
        await spinGumballFunction.mutateAsync({ gumballId: parseInt(id || "") });
        setIsSpinning(true);
      } catch (error) {
        console.error('Failed to spin gumball:', error);
        setIsSpinning(false);
        setShouldCheckForUnclaimedPrize(false);
      }
    };
  
    const handleSpinComplete = () => {
      setIsSpinning(false);
      setShouldCheckForUnclaimedPrize(true);
    };
  
    const handleClaimPrize = async () => {
      try {
        if (!unclaimedSpinId) {
          console.error('No unclaimed spin ID found');
          return;
        }
        const result = await claimGumballPrizeFunction.mutateAsync({ 
          gumballId: parseInt(id || ""),
          spinId: unclaimedSpinId
        });
        setClaimedPrizeIndex(result.prizeIndex);
      } catch (error) {
        console.error('Failed to claim prize:', error);
      }
    };
  
    const { totalValueInSol, isLoading: isPrizeValueLoading, formattedValue: totalPrizeValueFormatted } = useGetTotalPrizeValueInSol(gumball?.prizes);
    const formatPrice = (price: string | undefined, isTicketSol: boolean | undefined) => {
      if (!price) return "0";
      if (isTicketSol) {
          const priceNum = parseFloat(price)/(10**9);
        return `${priceNum.toFixed(7)} `;
      }
      const numPrice = parseFloat(price)/ 10**(VerifiedTokens.find((token: typeof VerifiedTokens[0]) => token.address === gumball?.ticketMint)?.decimals || 0);
      return `${numPrice.toFixed(7)}`;
    };
  
    const progressPercent = gumball ? (gumball.ticketsSold / gumball.totalTickets) * 100 : 0;
    const truncateAddress = (address: string | undefined) => {
      if (!address) return "";
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };
  
      const decrease = () => {
          setQuantityValue((prev) => Math.max(1, prev - 1));
      };
  
      const increase = () => {
          setQuantityValue((prev) => Math.min(MAX, prev + 1));
      };
  
      const handleQuickSelect = (num: number) => {
          setQuantityValue(num);
      };
      
  
    useEffect(() => {
      if (isPrizeClaimed && gumball && claimedPrizeIndex !== null) {
        const prizeData = gumball.prizes.find(p => p.prizeIndex === claimedPrizeIndex);
        if (prizeData) {
          setPrize({
            gumballId: gumball.id,
            prizeIndex: prizeData.prizeIndex,
            prizeMint: prizeData.mint,
            ticketPrice: gumball.ticketPrice,
            ticketMint: gumball.ticketMint,
            isTicketSol: gumball.isTicketSol,
            prizeImage: prizeData.image || "",
            prizeAmount: prizeData.prizeAmount,
            isNft: prizeData.isNft
          });
        }
      }
    }, [isPrizeClaimed, gumball, claimedPrizeIndex]);
  
    useEffect(() => {
      if (claimGumballPrizeFunction.isSuccess && claimGumballPrizeFunction.data) {
        setIsPrizeClaimed(true);
        setIsSpinning(false);
        refetch();
      }
    }, [claimGumballPrizeFunction.isSuccess, claimGumballPrizeFunction.data, refetch]);
  
    const findUnclaimedSpin = () => {
      if (!gumball || !publicKey) return null;
      
      const userSpins = gumball.spins?.filter(
        (spin) => spin.spinnerAddress === publicKey.toString()
      ) || [];
      
      return userSpins
        .sort((a, b) => new Date(b.spunAt).getTime() - new Date(a.spunAt).getTime())
        .find((spin) => {
          const isUnclaimed = spin.isPendingClaim === true || spin.claimedAt === null;
          return isUnclaimed;
        }) || null;
    };
  
    useEffect(() => {
      hasCheckedInitialLoad.current = false;
    }, [id]);
  
    useEffect(() => {
      if (gumball && publicKey && !isSpinning && !hasCheckedInitialLoad.current && gumball.spins) {
        const unclaimedSpin = findUnclaimedSpin();
        if (unclaimedSpin) {
          setIsPrizeModalOpen(true);
          setIsPrizeClaimed(false);
          setPrize(null);
          setUnclaimedSpinId(unclaimedSpin.id);
        }
        
        hasCheckedInitialLoad.current = true;
      }
    }, [gumball, publicKey, isSpinning, id]);
  
    useEffect(() => {
      if (shouldCheckForUnclaimedPrize && gumball && publicKey && !isSpinning) {
        const unclaimedSpin = findUnclaimedSpin();
        if (unclaimedSpin) {
          setIsPrizeModalOpen(true);
          setIsPrizeClaimed(false);
          setPrize(null);
          setUnclaimedSpinId(unclaimedSpin.id);
        }
        
        setShouldCheckForUnclaimedPrize(false);
      }
    }, [shouldCheckForUnclaimedPrize, gumball, publicKey, isSpinning]);


    if (isLoading) {
        return (
          <main className="w-full min-h-[calc(100vh-300px)] flex items-center justify-center bg-black-1400">
            <div className="text-center">
              <Loader className="w-12 h-12 animate-spin text-primary-color mx-auto" />
            </div>
          </main>
        );
      }
    
      if (isError || !gumball) {
        return (
          <main className="w-full min-h-[calc(100vh-300px)] flex items-center justify-center bg-black-1400">
            <div className="text-center flex-col gap-2">
              <p className="text-2xl text-red-500 font-inter font-semibold">Gumball not found</p>
              <Link to={"/gumballs"} className='px-6 cursor-pointer transition duration-300 hover:opacity-80 inline-flex items-center gap-2 py-2.5 bg-gray-1000 rounded-full text-base font-semibold text-white'>
        <img src="/icons/back-arw.svg" className='invert' alt="" />
         Back
         </Link>
            </div>
          </main>
        );
      }
  return (
  <main className='bg-black-1400'>
    <div className="w-full pb-2 md:pb-16 md:pt-44 pt-36 max-w-[1440px] px-5 mx-auto">
        <Link to={"/gumballs"} className='px-6 cursor-pointer transition duration-300 hover:opacity-80 inline-flex items-center gap-2 py-2.5 bg-gray-1000 rounded-full text-base font-semibold text-white'>
        <img src="/icons/back-arw.svg" className='invert' alt="" />
         Back
         </Link>
    </div>
    <RevealPrizePopup
    isOpen={isPrizeClaimed}
    shouldEnableAutoClose={true}
    onClose={()=>{
      setIsPrizeModalOpen(false);
      setIsSpinning(false);
      setIsPrizeClaimed(false);
      setPrize(null);
      setClaimedPrizeIndex(null);
      setShouldCheckForUnclaimedPrize(false);
      setUnclaimedSpinId(null);
    }}
    prize={prize}
    />
    <SpinGumballPopup 
    isOpen={isPrizeModalOpen && !isPrizeClaimed}
    shouldEnableAutoClose={false}
    onClaimPrize={handleClaimPrize}
    isClaiming={claimGumballPrizeFunction.isPending}
    />
    <motion.section 
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -100 }}
    transition={{ duration: 0.3 }}
    className='w-full pb-20 pt-10 md:pt-0'>
        <div className="w-full max-w-[1440px] px-5 mx-auto">
            <div className="w-full flex gap-[20px] md:gap-8 md:flex-row flex-col">
                <div className="flex-1">
                    <div className="md:p-[18px] h-full p-3 bg-black-1300 rounded-[20px]">
                    <GumballBouncingBalls 
                          prizes={availableGumballs} 
                          isActive={isActive} 
                          status={gumball.status}
                          isSpinning={isSpinning}
                          onSpinComplete={handleSpinComplete}
                        />
                    </div>
                
                </div>

                <div className="flex-1 max-w-[467px] bg-black-1300 p-6 rounded-[20px]">
                    <div className="w-full">
                      <div className="w-full flex items-start md:items-center justify-between">
                        <h1 className='md:text-[28px] text-xl font-inter font-bold text-white'>{gumball.name?.slice(0, 20)+(gumball.name?.length > 20 ? "..." : "")}</h1>
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                            gumball.status === "ACTIVE" ? "bg-green-500 text-white" :
                            gumball.status === "COMPLETED_SUCCESSFULLY" || gumball.status === "COMPLETED_FAILED" ? "bg-red-600 text-white" :
                            gumball.status === "CANCELLED" ? "bg-red-600 text-white" :
                            "bg-yellow-600 text-white"
                          }`}>
                            {gumball.status === "ACTIVE" ? "Active" : (gumball.status === "COMPLETED_SUCCESSFULLY" || gumball.status === "COMPLETED_FAILED") ? "Ended" : gumball.status === "CANCELLED" ? "Cancelled" : "Not Started"}
                          </span>
                          </div>
                        <div className="w-full">
                            <div className="w-full flex items-center justify-between md:pt-5 py-6 md:pb-6">
                                <div className="flex w-full flex-row items-center justify-between">
                                    <div className="inline-flex flex-col gap-2">
                                      <p className='text-base font-inter font-normal text-white'>Creator</p>
                                      <div className="inline-flex items-center gap-2">
                                    <img src={gumball.creator.profileImage?API_URL+gumball.creator.profileImage:DEFAULT_AVATAR} className="w-10 h-10 rounded-full object-cover" alt="no" />
                                        <h4 className='md:text-lg text-sm text-white font-inter font-semibold'>{truncateAddress(gumball.creator.walletAddress)}</h4>
                                        </div>
                                    </div>
                                    <button 
                                  onClick={() => {
                                    favouriteGumball.mutate({
                                      gumballId: Number(id) || 0,
                                    });
                                  }}
                                  className={`border hover:bg-primary-color hover:border-primary-color transition duration-300 cursor-pointer px-3 py-3 gap-2.5 border-black-1000 rounded-full text-sm md:text-base font-semibold font-inter text-black-1000 inline-flex items-center justify-center ${
                                    isFavorite ? "bg-primary-color border-primary-color text-black-1000 transition duration-300 " : " text-white border-white"
                                  }`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path
                                      d="M12 5.50066L11.4596 6.02076C11.601 6.16766 11.7961 6.25066 12 6.25066C12.2039 6.25066 12.399 6.16766 12.5404 6.02076L12 5.50066ZM9.42605 18.3219C7.91039 17.1271 6.25307 15.9603 4.93829 14.4798C3.64922 13.0282 2.75 11.3345 2.75 9.13713H1.25C1.25 11.8026 2.3605 13.8361 3.81672 15.4758C5.24723 17.0866 7.07077 18.3752 8.49742 19.4999L9.42605 18.3219ZM2.75 9.13713C2.75 6.98626 3.96537 5.18255 5.62436 4.42422C7.23607 3.68751 9.40166 3.88261 11.4596 6.02076L12.5404 4.98056C10.0985 2.44355 7.26409 2.02542 5.00076 3.05999C2.78471 4.07295 1.25 6.42506 1.25 9.13713H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55954 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.13713H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.13713C22.75 6.42506 21.2153 4.07295 18.9992 3.05999C16.7359 2.02542 13.9015 2.44355 11.4596 4.98056L12.5404 6.02076C14.5983 3.88261 16.7639 3.68751 18.3756 4.42422C20.0346 5.18255 21.25 6.98626 21.25 9.13713H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                </button>
                                </div>  
                            </div>
                              {gumball.status==="ACTIVE" && 
                            <div className="w-full flex flex-col gap-4 md:flex-row items-center justify-start px-5 py-3 bg-primary-color/10 rounded-[20px] mb-4">
                              <p className='text-sm font-medium font-inter text-gray-1200 w-full'>Ends in</p>
                              <PageTimer targetDate={new Date(gumball.endTime)} />
                            </div>
                              }

                            <div className="w-full flex items-center justify-between py-4 px-5 rounded-[20px] bg-primary-color/10">
                                <div className="inline-flex flex-col gap-2.5">
                                    <p className='font-inter text-sm text-gray-1200'>Ticket Price </p>
                                    <h3 className='lg:text-[24px] text-lg font-semibold font-inter text-primary-color'>{parseFloat(formatPrice(gumball.ticketPrice, gumball.isTicketSol))}{gumball.isTicketSol ? " SOL" : VerifiedTokens.find((token: typeof VerifiedTokens[0]) => token.address === gumball.ticketMint)?.symbol}</h3>
                                </div>
                                
                            </div>

                            <div className="w-full">
                                {gumball.status === "ACTIVE" && publicKey?.toBase58()!==gumball.creatorAddress ? 
                                <div className="w-full mt-5">

                                    {/* <QuantityBox/> */}

                                <div className="w-full flex">
                                <PrimaryButton 
                                  onclick={handleSpinClick} 
                                  text={spinGumballFunction.isPending ? <Loader className="w-5 h-5 animate-spin text-black-1000" /> : isSpinning ? "Spinning..." : availableGumballs.length === 0 ? "No Prizes Available" : !publicKey ? "Connect Wallet" : gumball.ticketsSold===gumball.totalTickets ? "Sold Out" : "Press To Spin"}
                                  className='w-full h-12 flex items-center justify-center' 
                                  disabled={spinGumballFunction.isPending || isSpinning || availableGumballs.length === 0 || !publicKey || gumball.ticketsSold===gumball.totalTickets} 
                                />
                                </div>

                                <p className='md:text-base text-sm text-white font-medium font-inter pt-[18px] pb-10'>Your balance: </p>
                                </div>
                                :
                                gumball.creatorAddress !== publicKey?.toString() ?
                                <div className="w-full bg-red-500/60 rounded-full flex items-center justify-center h-12 my-10">
                                    <p className='text-base text-white text-center font-semibold font-inter'>
                                    {gumball.status === "CANCELLED" ? "Cancelled" : (gumball.status === "COMPLETED_SUCCESSFULLY" || gumball.status === "COMPLETED_FAILED") ? "Ended" : "Not Started Yet"}
                                    </p>
                                    
                                </div>
                                :
                                <div className="w-full bg-primary-color/10 rounded-xl flex items-center justify-center h-12 my-10">
                                <button 
                                onClick={() => router.navigate({ to: "/gumballs/create_gumballs/$id", params: { id: id } })}
                                className='text-base cursor-pointer transition duration-300 hover:scale-105 text-primary-color/60 text-center font-semibold font-inter'>
                                  Manage Gumball
                                </button>
                            </div>
                                }
                                <div className="w-full flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="w-full bg-gray-1000 rounded-full h-4 relative">
                                        <div 
                                              className="bg-primary-color rounded-full absolute left-0 top-0 h-4 transition-all duration-300" 
                                              style={{ width: `${Math.min(progressPercent, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="">
                                        <p className='md:text-base text-sm text-white font-medium font-inter'>{gumball.ticketsSold} / {gumball.totalTickets} sold</p>
                                    </div>

                                </div>

                            </div>


                        </div>

                    </div>
                </div>

            </div>
                <div className="w-full">
                    <ul className="inline-flex items-center bg-white/15 gap-3 2xl:gap-4 mb-6 mt-14 p-1 rounded-full sm:w-auto">
                                {tabs.map((tab, index) => (
                                <li key={index}>
                                    <button onClick={() => {
                                    const updatedTabs = tabs.map((t, i) => ({
                                        ...t,
                                        active: i === index,
                                    }));
                                    setTabs(updatedTabs);
                                    }
                                    } className={`md:text-base whitespace-nowrap text-sm cursor-pointer font-inter font-medium transition duration-300 hover:bg-primary-color hover:text-black-1000 text-white rounded-full py-2.5 md:py-3 px-4 ${tab.active ? 'bg-primary-color !text-black-1000' : 'text-black-1000'}`}>{tab.name}</button>
                                </li>
                                ))}
                            </ul>

                            {tabs[0].active &&
                            <div className="md:grid md:grid-cols-2 items-start gap-5">
                             <GumballPrizesTable prizes={availableGumballs}/>
                             <div className="flex-1 md:-mt-[60px] mt-10">
                                <span className='w-fit text-base font-medium text-center mb-6 text-black  px-5 md:-mt-4 py-3 rounded-full bg-primary-color flex items-center justify-center'>Recent Spins</span>
                             <MoneybackTable spins={gumball.spins}/>
                             </div>
                             </div>
                            }
                            


                </div>
        </div>
    </motion.section>
    {/* <PrizeModal
      isOpen={isPrizeModalOpen}
      onClose={() => {
        setIsPrizeModalOpen(false);
        setIsSpinning(false);
        setIsPrizeClaimed(false);
        setPrize(null);
        setClaimedPrizeIndex(null);
        setShouldCheckForUnclaimedPrize(false);
        setUnclaimedSpinId(null);
      }}
      prize={prize}
      onClaimPrize={handleClaimPrize}
      isClaimPending={claimGumballPrizeFunction.isPending}
      isClaimed={isPrizeClaimed} 
      canClose={isPrizeClaimed}
    /> */}
</main>
  )}
