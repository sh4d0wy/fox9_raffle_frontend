import { createFileRoute, Link } from '@tanstack/react-router'
import { Disclosure } from '@headlessui/react'
import { useEffect, useMemo, useState } from 'react'
import { ParticipantsTable } from '../../components/home/ParticipantsTable'
import { TransactionsTable } from '../../components/auctions/TransactionsTable'
import { TermsConditions } from '../../components/auctions/TermsConditions'
import { AucationsData } from "../../../data/aucations-data";
import { PrimaryLink2 } from '@/components/ui/PrimaryLink2'
import { useAuctionById } from 'hooks/auction/useAuctionsQuery'
import { useWallet } from '@solana/wallet-adapter-react'
import { useToggleFavourite } from 'hooks/useToggleFavourite'
import { useQueryFavourites } from 'hooks/profile/useQueryFavourites'
import { useBidAuction } from "hooks/auction/useBidAuction";
import {useCancelAuction } from "hooks/auction/useCancelAuction";
import { VerifiedTokens } from '@/utils/verifiedTokens'
import { toast } from 'react-toastify'
import { DEFAULT_AVATAR } from 'store/userStore'
import { API_URL } from '@/constants'
import { VerifiedNftCollections } from '@/utils/verifiedNftCollections'
import { useNftMetadata } from 'hooks/useNftMetadata'
import type { NftMetadata } from 'hooks/useNftMetadata'
import { HeartIcon, Loader } from 'lucide-react'
import PageTimer from '@/components/common/PageTimer'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { AuctionParticipants } from '@/components/auctions/AuctionParticipants'
import AuctionEndedPopup from '@/components/ui/popups/auction/AuctionEndedPopup'
import ConfirmBidPopup from '@/components/ui/popups/auction/ConfirmBidPopup'
import ToolTip from '@/components/common/ToolTip'

export const Route = createFileRoute('/auctions/$id')({
  component: AuctionDetails,
})

const getNftSections = (nftMetadata: NftMetadata | null | undefined, auctionData: any) => {
  const traits: { label: string; value: string }[] = [];
  const details: { label: string; value: string }[] = [];

  if (nftMetadata?.attributes && Array.isArray(nftMetadata.attributes)) {
    nftMetadata.attributes.slice(0, 5).forEach((attr) => {
      if (attr.trait_type && attr.value !== undefined) {
        traits.push({
          label: attr.trait_type,
          value: String(attr.value),
        });
      }
    });
  }

  if (nftMetadata?.mintAddress) {
    details.push({
      label: 'Mint Address',
      value: `${nftMetadata.mintAddress.slice(0, 6)}...${nftMetadata.mintAddress.slice(-6)}`,
    });
  }

  if (nftMetadata?.collection?.name) {
    details.push({
      label: 'Collection',
      value: nftMetadata.collection.name,
    });
  } else if (auctionData?.collectionName) {
    details.push({
      label: 'Collection',
      value: auctionData.collectionName,
    });
  }

  if (nftMetadata?.creators && nftMetadata.creators.length > 0) {
    const primaryCreator = nftMetadata.creators[0];
    details.push({
      label: 'Creator',
      value: `${primaryCreator.address.slice(0, 6)}...${primaryCreator.address.slice(-6)}`,
    });
  }

  if (nftMetadata?.owner) {
    details.push({
      label: 'Owner',
      value: `${nftMetadata.owner.slice(0, 6)}...${nftMetadata.owner.slice(-6)}`,
    });
  }

  if (nftMetadata?.symbol) {
    details.push({
      label: 'Symbol',
      value: nftMetadata.symbol,
    });
  }

  if (nftMetadata?.royalty && nftMetadata.royalty > 0) {
    details.push({
      label: 'Royalty',
      value: `${nftMetadata.royalty}%`,
    });
  }

  if (nftMetadata?.externalUrl) {
    details.push({
      label: 'External URL',
      value: nftMetadata.externalUrl,
    });
  }

  return [
    { title: 'Traits', items: traits },
    { title: 'Details', items: details },
  ].filter(section => section.items.length > 0);
};
 
function AuctionDetails() {
  const [floorPriceTooltipOpen, setFloorPriceTooltipOpen] = useState(false);
  const [bidIncrementPercentTooltipOpen, setBidIncrementPercentTooltipOpen] = useState(false);
  const [timeExtensionTooltipOpen, setTimeExtensionTooltipOpen] = useState(false);
  const { id } = Route.useParams();
  const { data: auction, isLoading } = useAuctionById(id || "");
  const { publicKey } = useWallet();
  const { favouriteAuction } = useToggleFavourite(publicKey?.toString() || "");
  const { getFavouriteAuction } = useQueryFavourites(
    publicKey?.toString() || "",
    "Auctions"
  );
  const [showConfirmBidPopup, setShowConfirmBidPopup] = useState(false);
  const { bidAuction } = useBidAuction();
  const { cancelAuction } = useCancelAuction();
  const [isBiddingAuction, setIsBiddingAuction] = useState(false);
  const [bidAmountInput, setBidAmountInput] = useState<string>("");
  
  const isCancellingAuction = useMemo(() => {
    return cancelAuction.isPending;
  }, [cancelAuction]);

  // NFT metadata for traits and details
  const nftMintAddress = auction?.prizeMint;
  const { data: nftMetadata, isLoading: isNftMetadataLoading } = useNftMetadata(nftMintAddress);
  
  const nftSections = useMemo(() => {
    if (!auction?.prizeMint) return [];
    return getNftSections(nftMetadata, auction);
  }, [nftMetadata, auction]);

  const isCreator = useMemo(() => {
    return publicKey && auction?.createdBy === publicKey.toString();
  }, [publicKey, auction?.createdBy]);
  const [tabs, setTabs] = useState([
    { name: "Participants", active: true },
    { name: "Terms & Conditions", active: false },
  ]);
  const shortenAddress = (addr: string) =>
    addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : "N/A";

  const currencyDecimals = useMemo(() => {
    return (
      VerifiedTokens.find((token) => token.symbol === auction?.currency)
        ?.decimals ?? 0
    );
  }, [auction?.currency]);

  const [computedStatus, setComputedStatus] = useState<
    "UPCOMING" | "LIVE" | "COMPLETED" | "CANCELLED"
  >("UPCOMING");
  const [timeLeft, setTimeLeft] = useState({ h: "00", m: "00", s: "00" });
  const [isEndingAuction, setIsEndingAuction] = useState(false);

  const showBidButton = !isCreator && computedStatus === "LIVE" && publicKey;
  const showCancelButton =
    isCreator &&
    computedStatus !== "COMPLETED" &&
    auction?.status !== "CANCELLED" &&
    auction?.bids?.length == 0;

  const endingTransaction = useMemo(() => {
    if(auction?.status === "COMPLETED_SUCCESSFULLY" || auction?.status === "COMPLETED_FAILED"){
      return auction?.endingTransaction?.transactionId;
    }
    return null;
  }, [auction?.status]);
  console.log("auction",auction)

  useEffect(() => {
    if (!auction) return;
    
    const updateTimerState = () => {
      const now = Date.now();
      const start = new Date(auction.startsAt).getTime();
      const end = new Date(auction.endsAt).getTime();

      if (auction.status === "CANCELLED") setComputedStatus("CANCELLED");
      else if (auction.status === "INITIALIZED") setComputedStatus("UPCOMING");
      else if (
        auction.status === "COMPLETED_SUCCESSFULLY" ||
        auction.status === "COMPLETED_FAILED"
      )
        setComputedStatus("COMPLETED");
      else setComputedStatus("LIVE");

      const target =
        now < start ? start : auction.status === "ACTIVE" ? end : 0;
      const distance = target - now;

      if (distance > 0) {
        const h = Math.floor(distance / (1000 * 60 * 60))
          .toString()
          .padStart(2, "0");
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          .toString()
          .padStart(2, "0");
        const s = Math.floor((distance % (1000 * 60)) / 1000)
          .toString()
          .padStart(2, "0");
        setTimeLeft({ h, m, s });
      } else {
        setTimeLeft({ h: "00", m: "00", s: "00" });
      }
      
      const timeExtensionMs = (auction.timeExtension ?? 0) * 60 * 1000;
      const shouldShowEndingPopup = 
        auction.status === "ACTIVE" && 
        now > end && 
        now < end + timeExtensionMs;
      setIsEndingAuction(shouldShowEndingPopup);
    };

    updateTimerState();
    
    const timer = setInterval(updateTimerState, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  const isFavorite = useMemo(() => {
    return getFavouriteAuction.data?.find((f) => f.id === Number(id)) ? true : false;
  }, [getFavouriteAuction, id]);

  // Calculate the minimum allowed bid
  const minBidInSol = useMemo(() => {
    if (!auction) return 0;

    // Convert base values from lamports to SOL
    const reserveInSol =
      Number(auction.reservePrice ?? 0) / Math.pow(10, currencyDecimals);
    const highestBidInSol =
      Number(auction.highestBidAmount ?? 0) / Math.pow(10, currencyDecimals);

    if (!auction.hasAnyBid) {
      return reserveInSol;
    }

    const incrementFactor = 1 + (auction.bidIncrementPercent ?? 0) / 100;
    return highestBidInSol * incrementFactor;
  }, [auction]);

  const isWrongBid = useMemo(() => {
    if (!bidAmountInput) {
      return true;
    } else {
      if (auction?.hasAnyBid) {
        return !(parseFloat(bidAmountInput) >= minBidInSol);
      }
      return !(parseFloat(bidAmountInput) > minBidInSol);
    }
  }, [bidAmountInput]);
  // Handle Bid Submission
  const handlePlaceBid = async () => {
    const amount = Number(bidAmountInput);

    if (isNaN(amount) || amount < minBidInSol) {
      if(auction?.hasAnyBid) {
        toast.error(`Your bid must be atleast ${minBidInSol.toFixed(5)} ${auction?.currency}`);
        return;
      } else {
        toast.error(`Your bid must be greater than ${minBidInSol.toFixed(5)} ${auction?.currency}`);
        return;
      }
    }

    try {
      setIsBiddingAuction(true);
      await bidAuction.mutateAsync({
        highestBidder: auction?.highestBidderWallet ?? "",
        auctionId: Number(id),
        bidAmount: Math.round(amount * Math.pow(10, currencyDecimals)), // Convert SOL to lamports
      });
      setBidAmountInput(""); // Clear input on success
    } catch (error) {
      console.error("Bid failed:", error);
    } finally {
      setIsBiddingAuction(false);
      setShowConfirmBidPopup(false);
    }
  };

  const handleCancelAuction = async () => {
    try {
      setIsBiddingAuction(true);
      await cancelAuction.mutateAsync({
        auctionId: Number(id),
      });
    } catch (error) {
      console.error("Cancel failed:", error);
    } finally {
      setIsBiddingAuction(false);
    }
  };

  if (isLoading)
    return <div className="py-20 text-center bg-black text-white h-[calc(100vh-300px)] flex items-center justify-center">
      <Loader className="w-12 h-12 animate-spin text-primary-color mx-auto" />
    </div>;
  if (!auction)
    return (
      <main className="py-20 text-center text-3xl h-[calc(100vh-300px)]  bg-black flex items-center justify-center font-bold text-red-500">
        Auction not found!
      </main>
    );

  return (
  <main className='bg-black-1400'>
    <AuctionEndedPopup isOpen={isEndingAuction} shouldEnableAutoClose={false} />
    <ConfirmBidPopup
    isOpen={showConfirmBidPopup}
    shouldEnableAutoClose={false}
    prizeName={auction?.prizeName || ""}
    prizeImage={auction?.prizeImage || ""}
    highestBidAmount={auction?.highestBidAmount || 0}
    bidAmount={Number(bidAmountInput)}
    currencyDecimals={currencyDecimals || 9}
    currency={auction?.currency || "SOL"}
    isBiddingAuction={isBiddingAuction}
    onConfirm={handlePlaceBid}
    onCancel={() => setShowConfirmBidPopup(false)}
    />
    <div className="w-full md:pb-4 md:pt-44 pt-36 max-w-[1440px] px-5 mx-auto">
        <Link to={"/auctions"} className='px-6 cursor-pointer transition duration-300 hover:opacity-80 inline-flex items-center gap-2 py-2.5 bg-gray-1000 rounded-full text-base font-semibold text-white'>
        <img src="/icons/back-arw.svg" className='invert' alt="" />
         Back
         </Link>
    </div>

    <section className='w-full pb-20'>
        <div className="w-full py-10 max-w-[1440px] px-5 mx-auto">
            <div className="w-full flex gap-6 md:gap-10 xl:flex-row flex-col">
              {/*Left section*/}
                <div className="flex-1 max-w-full xl:max-w-[450px]">
                  <div className="bg-black-1300 p-4 rounded-xl">
                    <img src={auction?.prizeImage}
                    className="w-full md:h-[450px] h-[361px] object-cover rounded-[12px]"
                    />
                  </div>
                     
                    <div className="w-full pb-7 pt-6 md:py-10 hidden md:flex items-center justify-between">
                        <div className="flex items-center gap-3 2xl:gap-5">
                            <img  src={VerifiedNftCollections.find((item)=>item.name===auction?.collectionName)?.image} className='w-12 h-12 rounded-full object-cover' alt="" />
                            <h3 className='md:text-2xl text-lg font-bold text-white font-inter'>{auction?.collectionName}</h3>
                        </div>

                        <ul className='flex items-center bg-primary-color/20 rounded-full p-2 gap-6'>
                            <li>
                                <a href={VerifiedNftCollections.find((item)=>item.name===auction?.collectionName)?.twitter}><img src="/icons/twitter-icon.svg" className='w-7 invert h-7 object-contain' alt="" /></a>
                            </li>

                                <li>
                                <a href={VerifiedNftCollections.find((item)=>item.name===auction?.collectionName)?.website}> <img src="/icons/mcp-server-icon.svg" className='w-7 invert h-7 object-contain' alt="" /></a>
                            </li>
                        </ul>

                    </div>
                 <div className="w-full space-y-5 hidden md:block">
                    {nftSections.length > 0 ? (
                      isNftMetadataLoading ? (
                        <div className="w-full py-10 flex items-center justify-center">
                          <Loader className="w-8 h-8 animate-spin text-primary-color" />
                        </div>
                      ) : nftSections.map((section, index) => (
                        <Disclosure as="div" key={section.title} defaultOpen={index === 0} className="w-full py-4 md:py-6 px-5 border border-gray-1100 rounded-[20px] transition duration-300">
                        {({ open }) => (
                            <>
                            <Disclosure.Button className={`flex items-center justify-between w-full text-base md:text-xl font-bold font-inter text-white ${
                                open ? 'text-primary-color!' : ''}`}>
                                <span>{section.title}</span>
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={9}
                                viewBox="0 0 16 9"
                                fill="none"
                                className={`${open ? 'rotate-180' : ''} transition-transform`}
                                >
                                <path
                                    d="M15 1L8 8L1 1"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                </svg>
                            </Disclosure.Button>

                            <Disclosure.Panel className="w-full">
                                <ul className="space-y-6 pt-6">
                                {section.items.map((item) => (
                                    <li key={item.label} className="flex items-center justify-between">
                                    <p className="md:text-base text-sm font-inter font-medium text-gray-1100/40">{item.label}</p>
                                    <p className="md:text-base text-sm font-inter font-medium text-white">{item.value}</p>
                                    </li>
                                ))}
                                </ul>
                            </Disclosure.Panel>
                            </>
                             )}
                        </Disclosure>
                      ))
                    ) : (
                      <></>
                    )}
                     </div>

                </div>
                {/*Right section*/}
                <div className="flex-1">
                    <div className="w-full">
                        <h1 className='md:text-[28px] text-xl font-inter md:mt-6 my-5 md:mb-5 font-bold text-white'>{auction?.prizeName?.length! > 30 ? auction?.prizeName?.slice(0, 30) + "..." : auction?.prizeName}</h1>
                      
                        <div className="flex relative items-start md:items-end md:flex-row flex-col md:gap-0 gap-5 justify-between pb-6 md:pb-8 border-b border-gray-1000">

                          <ul className="flex items-center gap-3 2xl:gap-5 flex-wrap">
                                <li className="relative group cursor-help" onMouseEnter={() => setFloorPriceTooltipOpen(true)} onMouseLeave={() => setFloorPriceTooltipOpen(false)}>
                                <p className="md:text-sm text-xs inline-block px-2 sm:px-2.5 py-2 md:py-1.5 font-semibold text-center font-inter text-black-1000 bg-primary-color rounded-lg">
                                    FP: {(auction?.floorPrice!/(10**9)).toFixed(2)} SOL
                                </p>
                                <ToolTip label="Floor Price" isOpen={floorPriceTooltipOpen} children={
                                  <p className="text-white text-sm font-inter">
                                    Floor Price is the lowest price of the NFT in the collection.
                                  </p>} />
                                </li>
                                <li className="relative group cursor-help" onMouseEnter={() => setBidIncrementPercentTooltipOpen(true)} onMouseLeave={() => setBidIncrementPercentTooltipOpen(false)}>
                                <p className="md:text-sm text-xs inline-block px-2 sm:px-2.5 py-2 md:py-1.5 font-semibold text-center font-inter bg-gray-1000 text-white rounded-lg">
                                    INCR: {auction?.bidIncrementPercent}%
                                </p>
                                <ToolTip label="Bid Increment Percent" isOpen={bidIncrementPercentTooltipOpen} className='w-40' children={
                                  <p className="text-white text-sm font-inter">
                                    Bid Increment Percent is the percentage of the highest bid that the next bid must be greater than.
                                  </p>} />
                                </li>
                                <li className="relative group cursor-help" onMouseEnter={() => setTimeExtensionTooltipOpen(true)} onMouseLeave={() => setTimeExtensionTooltipOpen(false)}>
                                <p className="md:text-sm text-xs inline-block px-2 sm:px-2.5 py-2 md:py-1.5 font-semibold text-center font-inter bg-gray-1000 text-white rounded-lg">
                                    EXT: {auction?.timeExtension} mins
                                </p>
                                <ToolTip label="Time Extension" isOpen={timeExtensionTooltipOpen} className='w-40' children={
                                  <p className="text-white text-sm font-inter">
                                    Time Extension is the number of minutes the auction will be extended if there is a bid made while auction is about to end.
                                  </p>} />
                                </li>
                          </ul>

                           <ul className="flex md:absolute right-0 items-center md:flex-col mx-auto bg-primary-color/20 gap-4 p-2 rounded-full ">
                           <li>
                      <button onClick={() => favouriteAuction.mutate({ auctionId: Number(id) })} className="border bg-gray-1200 cursor-pointer w-12 h-12 md:py-2.5 gap-2.5 rounded-full text-sm md:text-base font-semibold font-inter text-white inline-flex items-center justify-center">
                        <HeartIcon className={`w-6 h-6 ${isFavorite ? "text-black fill-primary-color" : "text-black"}`} />
                      </button>
                    </li>

                    <li>
                      <button onClick={() => {
                        window.navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied to clipboard");
                      }} className="border bg-gray-1200 cursor-pointer w-12 h-12 md:py-2.5 gap-2.5 rounded-full text-sm md:text-base font-semibold font-inter text-white inline-flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M13.803 5.33333C13.803 3.49238 15.3022 2 17.1515 2C19.0008 2 20.5 3.49238 20.5 5.33333C20.5 7.17428 19.0008 8.66667 17.1515 8.66667C16.2177 8.66667 15.3738 8.28596 14.7671 7.67347L10.1317 10.8295C10.1745 11.0425 10.197 11.2625 10.197 11.4872C10.197 11.9322 10.109 12.3576 9.94959 12.7464L15.0323 16.0858C15.6092 15.6161 16.3473 15.3333 17.1515 15.3333C19.0008 15.3333 20.5 16.8257 20.5 18.6667C20.5 20.5076 19.0008 22 17.1515 22C15.3022 22 13.803 20.5076 13.803 18.6667C13.803 18.1845 13.9062 17.7255 14.0917 17.3111L9.05007 13.9987C8.46196 14.5098 7.6916 14.8205 6.84848 14.8205C4.99917 14.8205 3.5 13.3281 3.5 11.4872C3.5 9.64623 4.99917 8.15385 6.84848 8.15385C7.9119 8.15385 8.85853 8.64725 9.47145 9.41518L13.9639 6.35642C13.8594 6.03359 13.803 5.6896 13.803 5.33333Z"
                            fill="#212121"
                          />
                        </svg>
                      </button>
                    </li>
                          </ul>
                        </div>

                        <div className="w-full">
                          <div className="w-full flex items-center justify-between md:pt-7 py-6 md:pb-10">
                                      <div className="inline-flex gap-4">
                                        <img
                                            src={auction?.creator?.profileImage? API_URL+auction?.creator?.profileImage:DEFAULT_AVATAR}
                                            className="w-10 h-10 rounded-full object-cover"
                                            alt="no"
                                        />

                                        <div className="">
                                            <p className="text-xs md:pb-0 pb-1 font-inter font-normal text-gray-1200">
                                            Creator
                                            </p>
                                            <h4 className="text-base text-white font-inter font-semibold">
                                            {shortenAddress(auction?.createdBy)}
                                            </h4>
                                        </div>
                                        </div>
                                    </div>
                          {computedStatus === "LIVE" ?
                          <div className="flex flex-col items-center justify-between gap-4">
                          <div className="w-full flex items-center flex-col-reverse md:flex-row justify-between py-4 px-[26px] rounded-[20px] bg-primary-color/10">
                            <div className="inline-flex w-full md:w-fit flex-col gap-2.5">
                              <PageTimer targetDate={new Date(auction?.endsAt || "")} />
                                <p className="text-sm font-inter text-gray-1200 font-normal">
                                Time Left
                                </p>
                            </div>
                            <div className="flex-1 md:flex-none md:w-1/2 flex justify-between w-full pb-6 md:pb-0">
                            <div className="inline-flex flex-col gap-2.5">
                           
                                <h3 className="md:text-xl w-full px-4 py-2 text-primary-color text-center font-semibold font-inter ">
                                {parseFloat((auction?.highestBidAmount!/(10**(VerifiedTokens.find((token)=>token.symbol===auction?.currency)?.decimals || 0))).toFixed(6))} {auction?.currency}
                                </h3>
                                <p className="font-inter text-center text-gray-1200 text-sm font-normal">
                                Highest Bid
                                </p>
                            </div>

                            <div className="inline-flex flex-col gap-2.5">
                              
                                <h3 className={`md:text-xl text-base text-center font-semibold rounded-xl px-4 py-2 font-inter ${computedStatus === "LIVE" ? "bg-green-800/40 text-green-500 " : "text-red-500 bg-red-800/40"}`}>
                                {computedStatus.toUpperCase()}
                                </h3>
                                <p className="font-inter text-center text-gray-1200 text-sm font-normal">
                                Status
                                </p>
                             
                            </div>
                            </div>
                            </div>


                      <div className={`w-full flex flex-col gap-3 justify-between pt-8 pb-10 px-[26px] rounded-[20px] bg-[#1b1b21] border ${publicKey && publicKey.toBase58() === auction?.createdBy ? "border-red-800" : "border-primary-color"}`}>
                        {!publicKey ?
                        <div className="w-full flex items-center flex-col justify-center py-[18px] md:py-[22px] px-[26px] gap-4 md:gap-[26px] rounded-[20px] bg-black-1300">
                                <h3 className="md:text-base text-sm text-gray-1200 font-inter font-medium text-center">
                                Please connect your wallet first to bid on this auction.
                                </h3>
                                <WalletMultiButton />
                            </div>
                      
                      : publicKey.toBase58() === auction?.createdBy  ?
                      <div className="w-full flex items-center justify-center py-4 px-6 gap-4 rounded-[20px] bg-black-1300">
                            <button onClick={handleCancelAuction} disabled={isCancellingAuction} className={`w-full  bg-red-800 cursor-pointer text-white px-4 py-4 rounded-full text-sm md:text-base font-inter font-medium ${isCancellingAuction ? "opacity-50 cursor-not-allowed" : ""}`}>
                              {isCancellingAuction ? <Loader className="w-6 h-6 animate-spin text-white text-center mx-auto" /> : <span className="text-center mx-auto">Cancel Auction</span>}
                              </button>
                      </div>
                      :
                      <div className="flex flex-col items-start gap-2">
                        <label htmlFor="bid-amount" className="text-sm md:text-base font-inter text-white font-normal">
                        Enter Bid Amount ({auction?.currency})
                      </label>
                      <div className="flex flex-col md:flex-row items-center w-full gap-2">
                        <div className={`w-full md:w-2/3 relative ${isWrongBid && bidAmountInput !== "" ? "border-red-500" : ""}`}>
                        <div className={`w-full rounded-full py-1 border  ${isWrongBid && bidAmountInput !== "" ? "border-red-500" : "border-white/20"} flex items-center justify-between px-5`}>
                        <input 
                        type="number" 
                        value={bidAmountInput}
                        onChange={(e) => setBidAmountInput(e.target.value)}
                        step="0.0001"
                        disabled={isBiddingAuction}
                        className={`w-full h-full outline-none ${isWrongBid && bidAmountInput !== "" ? "border-red-500" : ""} py-2 rounded-full text-white text-base font-inter font-medium`} placeholder="0.00" />
                        <span className="text-primary-color text-sm font-inter font-medium">{auction?.currency}</span>
                        </div>
                        <p className={`text-[13px] text-gray-300 w-full px-5 absolute my-1 ${isWrongBid && bidAmountInput !== "" ? "text-red-500" : ""}`}>
                              {auction.hasAnyBid
                                ? `Your bid must be atleast ${parseFloat(minBidInSol.toFixed(6))}`
                                : `Your bid must be greater than ${parseFloat(minBidInSol.toFixed(6))}`}{" "}
                              {auction.currency}
                            </p>
                            </div>
                        <button
                        disabled={isBiddingAuction || isWrongBid}
                        onClick={()=>setShowConfirmBidPopup(true)}
                        className="w-full md:w-1/3 disabled:opacity-50 disabled:cursor-not-allowed bg-primary-color cursor-pointer text-black px-4 py-2 rounded-full text-sm md:text-base font-inter font-medium">
                          {isBiddingAuction ? <Loader className="w-6 h-6 animate-spin text-white text-center mx-auto" /> : <span className="text-center mx-auto">Place Bid</span>}
                        </button>
                      </div>
                    </div>

                      }
                        
                      
                      </div>
                    </div> 
                            :
                            computedStatus === "COMPLETED" ?
                            (
                              <>
                            <div className="w-full border border-primary-color flex flex-col md:gap-10 gap-6 sm:py-[22px] pt-5 pb-4 px-4 sm:px-[26px] rounded-[20px] bg-black-1300">
                      <div className=" flex sm:gap-3 justify-between flex-col w-full">
                        <div className="flex items-center justify-between gap-2.5 sm:w-auto w-full">
                          <p className="text-sm font-inter text-gray-1200 font-normal">
                            Winning bid
                          </p>
                          <h3 className="md:text-xl text-base font-semibold text-primary-color font-inter">
                            {auction?.highestBidAmount!/(10**(VerifiedTokens.find((token)=>token.symbol===auction?.currency)?.decimals || 0))} {auction?.currency}
                          </h3>
                          
                        </div>
                        <div className="flex items-center justify-between gap-2.5 sm:w-auto w-full">
                          <p className="font-inter text-gray-1200 text-sm font-normal">
                              Auction ended
                          </p>
                          <h3 className="md:text-xl text-base font-semibold font-inter text-white">
                            {new Date(auction?.endsAt || "").toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </h3>
                        </div>
                       

                      </div>
                      <div className="w-full flex items-center justify-between p-2 rounded-[10px] bg-primary-color">
                        <div className="flex items-center gap-3.5">
                          <div className="md:w-[68px] w-12 h-12 md:h-[68px] rounded-full flex items-center justify-center">
                            <img
                              src={auction?.highestBidder?.profileImage?API_URL+"/"+auction?.highestBidder?.profileImage:DEFAULT_AVATAR}
                              alt="winner"
                              className=" rounded-full object-cover"
                            />
                          </div>
                          <h3 className="md:text-2xl sm:text-xl text-base text-black-1000 font-semibold font-inter">
                            {shortenAddress(auction?.highestBidderWallet || "")}
                          </h3>
                        </div>

                        <h4 className="sm:text-base text-xs text-black-1000 font-semibold font-inter px-4">
                          Auction winner
                        </h4>
                      </div>
                       </div>
                       </>
                            ):
                            computedStatus === "CANCELLED" ?
                            (
                              <>
                              <div className="w-full flex items-center justify-center py-4 px-6 gap-4 rounded-[20px] bg-primary-color/10">
                                <h3 className="md:text-base text-sm text-primary-color font-inter font-medium text-center">
                                This auction has been cancelled by the creator.
                                </h3>
                              </div>
                              </>
                            ):computedStatus === "UPCOMING" &&
                            (
                              <>
                              <div className="flex flex-col items-center justify-between gap-4">
                          <div className="w-full flex items-center flex-col-reverse md:flex-row justify-between py-4 px-[26px] rounded-[20px] bg-primary-color/10">
                            <div className="inline-flex w-full md:w-fit flex-col gap-2.5">
                              <PageTimer targetDate={new Date(auction?.startsAt || "")} />
                                <p className="text-sm font-inter text-gray-1200 font-normal">
                                Time Left
                                </p>
                            </div>
                            <div className="flex-1 md:flex-none md:w-1/2 flex justify-between w-full pb-6 md:pb-0">
                            <div className="inline-flex flex-col gap-2.5">
                           
                                <h3 className="md:text-xl w-full px-4 py-2 text-primary-color text-center font-semibold font-inter ">
                                {parseFloat((auction?.highestBidAmount!/(10**(VerifiedTokens.find((token)=>token.symbol===auction?.currency)?.decimals || 0))).toFixed(6))} {auction?.currency}
                                </h3>
                                <p className="font-inter text-center text-gray-1200 text-sm font-normal">
                                Highest Bid
                                </p>
                            </div>

                            <div className="inline-flex flex-col gap-2.5">
                              
                                <h3 className={`md:text-xl text-base text-center font-semibold rounded-xl px-4 py-2 font-inter ${computedStatus === "UPCOMING" ? "bg-primary-color/10 text-primary-color " : "text-red-500 bg-red-800/40"}`}>
                                {computedStatus.toUpperCase()}
                                </h3>
                                <p className="font-inter text-center text-gray-1200 text-sm font-normal">
                                Status
                                </p>
                             
                            </div>
                            </div>
                            </div>


                      <div className={`w-full flex flex-col gap-3 justify-between pt-8 pb-10 px-[26px] rounded-[20px] bg-[#1b1b21] border ${publicKey && publicKey.toBase58() === auction?.createdBy ? "border-red-800" : "border-primary-color"}`}>
                        {!publicKey ?
                        <div className="w-full flex items-center flex-col justify-center py-[18px] md:py-[22px] px-[26px] gap-4 md:gap-[26px] rounded-[20px] bg-black-1300">
                                <h3 className="md:text-base text-sm text-gray-1200 font-inter font-medium text-center">
                                Please connect your wallet first to bid on this auction.
                                </h3>
                                <WalletMultiButton />
                            </div>
                      
                      : publicKey.toBase58() === auction?.createdBy  && computedStatus === "UPCOMING" ?
                      <div className="w-full flex items-center justify-center py-4 px-6 gap-4 rounded-[20px] bg-black-1300">
                            <button onClick={handleCancelAuction} disabled={isCancellingAuction} className={`w-full  bg-red-800 cursor-pointer text-white px-4 py-4 rounded-full text-sm md:text-base font-inter font-medium ${isCancellingAuction ? "opacity-50 cursor-not-allowed" : ""}`}>
                              {isCancellingAuction ? <Loader className="w-6 h-6 animate-spin text-white text-center mx-auto" /> : <span className="text-center mx-auto">Cancel Auction</span>}
                              </button>
                      </div>
                      :
                      <div className="w-full flex items-center justify-center py-4 px-6 gap-4 rounded-[20px] bg-black-1300">
                            <h3 className="md:text-base text-sm text-gray-1200 font-inter font-medium text-center">
                                Auction will start soon....
                            </h3>
                      </div>

                      }
                        
                      
                      </div>
                    </div> 
                              </>
                            )
                            }

                            <div className="w-full">
                                <div className="w-full overflow-x-auto">
                                <ul className="inline-flex items-center bg-white/15 gap-3 2xl:gap-4 mb-6 mt-10 p-1 rounded-full sm:w-auto">
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
                            </div>
                            {tabs[0].active &&
                             <AuctionParticipants
                          bids={auction.bids || []}
                          currency={auction.currency}
                        />
                            }

                            {tabs[1].active &&
                             <TermsConditions/>
                            }
                            
                            </div>


                        </div>
                    </div>
                </div>
                {/*Mobile section*/}
                    <div className="md:hidden block border-t border-solid border-gray-1100">
                              <div className="w-full pb-7 pt-6 md:py-10 flex items-center justify-between">
                                <div className="flex items-center gap-5 md:gap-3 2xl:gap-5">
                                  <img
                                    src={auction?.creator.profileImage?API_URL+auction.creator.profileImage:DEFAULT_AVATAR}
                                    className="w-12 h-12 rounded-full object-cover"
                                    alt=""
                                  />
                                  <h3 className="md:text-[28px] text-lg font-bold text-white font-inter">
                                    {shortenAddress(auction?.createdBy)}
                                  </h3>
                                </div>
                              </div>
                              <div className="w-full space-y-5">
                                {isNftMetadataLoading ? (
                                  <div className="w-full py-10 flex items-center justify-center">
                                    <Loader className="w-8 h-8 animate-spin text-primary-color" />
                                  </div>
                                ) : nftSections.map((section, index) => (
                                  <Disclosure
                                    as="div"
                                    key={section.title}
                                    defaultOpen={index === 0}
                                    className="w-full py-4 md:py-6 px-5 border border-gray-1100 rounded-[20px] transition duration-300"
                                  >
                                    {({ open }) => (
                                      <>
                                        <Disclosure.Button
                                          className={`flex items-center justify-between w-full text-base md:text-xl font-bold font-inter transition duration-300 ${
                                            open ? "text-primary-color" : "text-white"
                                          }`}
                                        >
                                          <span>{section.title}</span>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={16}
                                            height={9}
                                            viewBox="0 0 16 9"
                                            fill="none"
                                            className={`${open ? "rotate-180" : ""} transition-transform`}
                                          >
                                            <path
                                              d="M15 1L8 8L1 1"
                                              stroke="currentColor"
                                              strokeWidth={2}
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                        </Disclosure.Button>
                
                                        <Disclosure.Panel className="w-full">
                                          <ul className="space-y-6 pt-6">
                                            {section.items.map((item) => (
                                              <li
                                                key={item.label}
                                                className="flex items-center justify-between"
                                              >
                                                <p className="md:text-base text-sm font-inter font-medium text-gray-1100/40">
                                                  {item.label}
                                                </p>
                                                <p className="md:text-base text-sm font-inter font-medium text-white">
                                                  {item.value}
                                                </p>
                                              </li>
                                            ))}
                                          </ul>
                                        </Disclosure.Panel>
                                      </>
                                    )}
                                  </Disclosure>
                                ))}
                              </div>
                    </div>
            </div>
        </div>
    </section>
    
</main>
  )}
