import { createFileRoute, Link } from '@tanstack/react-router'
import { Disclosure } from '@headlessui/react'
import { useEffect, useMemo, useState } from 'react'
import { ParticipantsTable } from '../../components/auctions/ParticipantsTable'
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
import { Loader } from 'lucide-react'
import PageTimer from '@/components/common/PageTimer'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

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
  const { id } = Route.useParams();
  const { data: auction, isLoading } = useAuctionById(id || "");
  const { publicKey } = useWallet();
  const { favouriteAuction } = useToggleFavourite(publicKey?.toString() || "");
  const { getFavouriteAuction } = useQueryFavourites(
    publicKey?.toString() || ""
  );
  const { bidAuction } = useBidAuction();
  const { cancelAuction } = useCancelAuction();
  const [isBiddingAuction, setIsBiddingAuction] = useState(false);
  const [bidAmountInput, setBidAmountInput] = useState<string>("");
  
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

  useEffect(() => {
    if (!auction) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
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

      // Calculate countdown for Live/Upcoming
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
    }, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  const isFavorite = useMemo(
    () => getFavouriteAuction.data?.some((f) => f.id === Number(id)),
    [getFavouriteAuction.data, id]
  );

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
    return <div className="py-20 text-center bg-black-1400 text-white">Loading Auction...</div>;
  if (!auction)
    return (
      <main className="py-20 text-center text-3xl font-bold text-red-500">
        Auction not found!
      </main>
    );

  return (
  <main className='bg-black-1400'>
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
                        <h1 className='md:text-[28px] text-xl font-inter md:mt-6 my-5 md:mb-5 font-bold text-white'>{auction?.prizeName}</h1>
                      
                        <div className="flex relative items-start md:items-end md:flex-row flex-col md:gap-0 gap-5 justify-between pb-6 md:pb-8 border-b border-gray-1000">

                          <ul className="flex items-center gap-3 2xl:gap-5 flex-wrap">
                                <li>
                                <p className="md:text-sm text-xs inline-block px-2 sm:px-2.5 py-2 md:py-1.5 font-semibold text-center font-inter text-black-1000 bg-primary-color rounded-lg">
                                    FP: {(auction?.floorPrice!/(10**9)).toFixed(2)} SOL
                                </p>
                                </li>
                                <li>
                                <p className="md:text-sm text-xs inline-block px-2 sm:px-2.5 py-2 md:py-1.5 font-semibold text-center font-inter bg-gray-1000 text-white rounded-lg">
                                    Reserve Price: {parseFloat(auction?.reservePrice!)/(10**(VerifiedTokens.find((token)=>token.symbol===auction?.currency)?.decimals || 0))} {auction?.currency}
                                </p>
                                </li>
                                <li>
                                <p className="md:text-sm text-xs inline-block px-2 sm:px-2.5 py-2 md:py-1.5 font-semibold text-center font-inter bg-gray-1000 text-white rounded-lg">
                                    Highest Bid: {auction?.highestBidAmount!/(10**(VerifiedTokens.find((token)=>token.symbol===auction?.currency)?.decimals || 0))} {auction?.currency}
                                </p>
                                </li>
                          </ul>

                           <ul className="flex md:absolute right-0 items-center md:flex-col mx-auto bg-primary-color/20 gap-4 p-2 rounded-full ">
                                <li>
                                <button className="border bg-gray-1200 cursor-pointer w-12 h-12 md:py-2.5 gap-2.5 rounded-full text-sm md:text-base font-semibold font-inter text-white inline-flex items-center justify-center">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    >
                                    <path
                                        d="M12 5.50066L11.4596 6.02076C11.601 6.16766 11.7961 6.25066 12 6.25066C12.2039 6.25066 12.399 6.16766 12.5404 6.02076L12 5.50066ZM9.42605 18.3219C7.91039 17.1271 6.25307 15.9603 4.93829 14.4798C3.64922 13.0282 2.75 11.3345 2.75 9.13713H1.25C1.25 11.8026 2.3605 13.8361 3.81672 15.4758C5.24723 17.0866 7.07077 18.3752 8.49742 19.4999L9.42605 18.3219ZM2.75 9.13713C2.75 6.98626 3.96537 5.18255 5.62436 4.42422C7.23607 3.68751 9.40166 3.88261 11.4596 6.02076L12.5404 4.98056C10.0985 2.44355 7.26409 2.02542 5.00076 3.05999C2.78471 4.07295 1.25 6.42506 1.25 9.13713H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55954 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.13713H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.13713C22.75 6.42506 21.2153 4.07295 18.9992 3.05999C16.7359 2.02542 13.9015 2.44355 11.4596 4.98056L12.5404 6.02076C14.5983 3.88261 16.7639 3.68751 18.3756 4.42422C20.0346 5.18255 21.25 6.98626 21.25 9.13713H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219Z"
                                        fill="#212121"
                                    />
                                    </svg>
                                </button>
                                </li>

                                <li>
                                <button className="border bg-gray-1200 cursor-pointer w-12 h-12 md:py-2.5 gap-2.5 rounded-full text-sm md:text-base font-semibold font-inter text-white inline-flex items-center justify-center">
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
                          <div className="w-full flex items-center flex-col-reverse md:flex-row justify-between py-4 px-[26px] rounded-[20px] bg-primary-color/10">
                            <div className="inline-flex w-full md:w-fit flex-col gap-2.5">
                              <PageTimer targetDate={new Date(auction?.endsAt || "")} />
                                <p className="text-sm font-inter text-gray-1200 font-normal">
                                Time Left
                                </p>
                            </div>
                            <div className="flex-1 md:flex-none md:w-1/2 flex justify-between w-full pb-6 md:pb-0">
                            <div className="inline-flex flex-col gap-2.5">
                                <h3 className="md:text-xl w-full text-center font-semibold font-inter text-white">
                                {auction?.bidIncrementPercent}%
                                </h3>
                                <p className="font-inter text-gray-1200 text-sm font-normal">
                                Min Bid Increment
                                </p>
                            </div>

                            <div className="inline-flex flex-col gap-2.5">
                                <h3 className="md:text-xl text-base text-center font-semibold font-inter text-white">
                                {auction?.timeExtension} mins
                                </h3>
                                <p className="font-inter text-gray-1200 text-sm font-normal">
                                Time Extension
                                </p>
                            </div>
                            </div>
                            </div>
                            :
                            <>
                            {/*TODO: After auction ends*/}
                            <div className="w-full flex flex-col md:gap-10 gap-6 sm:py-[22px] pt-5 pb-4 px-4 sm:px-[26px] rounded-[20px] bg-black-1300">
                      <div className="sm:grid flex sm:gap-0 gap-6 flex-wrap justify-between grid-cols-2 sm:grid-cols-3 w-full">
                        <div className="inline-flex flex-1 flex-col gap-2.5 sm:w-auto w-[44%]">
                          <h3 className="md:text-xl text-base font-semibold text-primary-color font-inter">
                            115,762.5 vBLSH
                          </h3>
                          <p className="text-sm font-inter text-gray-1200 font-normal">
                            Winning bid
                          </p>
                        </div>
                        <div className="flex items-center md:pl-14 sm:w-auto w-[44%]">
                          <div className="inline-flex flex-col gap-2.5">
                            <h3 className="md:text-xl text-base font-semibold font-inter text-white">
                              09 Jan 25{" "}
                              <span className="text-gray-1200">|</span> 21:50
                            </h3>
                            <p className="font-inter text-gray-1200 text-sm font-normal">
                              Auction ended
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-end sm:w-auto w-[44%]">
                          <div className="inline-flex flex-col gap-2.5">
                            <h3 className="md:text-xl text-base font-semibold font-inter text-white">
                              5%
                            </h3>
                            <p className="font-inter text-sm font-normal text-gray-1200">
                              Min. bid increment
                            </p>
                          </div>
                        </div>
                        <div className="flex sm:hidden items-center justify-end sm:w-auto w-[44%]">
                          <div className="inline-flex flex-col gap-2.5">
                            <h3 className="md:text-xl text-base font-semibold font-inter text-white">
                              10 mins
                            </h3>
                            <p className="font-inter text-gray-1200 text-sm font-normal">
                              Time extension
                            </p>
                          </div>
                        </div>
                        <div className="flex sm:hidden items-center justify-start sm:w-auto w-[44%]">
                          <div className="inline-flex flex-col gap-2.5">
                            <h3 className="md:text-xl text-base font-semibold font-inter text-white">
                              100%
                            </h3>
                            <p className="font-inter text-gray-1200 text-sm font-normal">
                              Royalties
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="sm:grid grid-cols-3 w-full hidden">
                        <div className="flex flex-col gap-2.5">
                          <h3 className="md:text-xl text-base font-semibold font-inter text-white">
                            15 / 100
                          </h3>
                          <p className="font-inter text-gray-1200 text-sm font-normal">
                            Tickets Sold
                          </p>
                        </div>

                        <div className="flex items-center pl-14">
                          <div className="flex flex-col gap-2.5">
                            <h3 className="md:text-xl text-base font-semibold font-inter text-white">
                              0.118 SOL
                            </h3>
                            <p className="font-inter text-gray-1200 text-sm font-normal">
                              Ticket price
                            </p>
                          </div>
                        </div>

                        <div className=""></div>
                      </div>
                      <div className="w-full flex items-center justify-between p-2 rounded-[10px] bg-primary-color">
                        <div className="flex items-center gap-3.5">
                          <div className="md:w-[68px] w-12 h-12 md:h-[68px] rounded-lg bg-black-1300 flex items-center justify-center">
                            <img
                              src="/icons/crown_svg.svg"
                              alt="svg"
                              className="md:h-auto h-7"
                            />
                          </div>
                          <h3 className="md:text-2xl sm:text-xl text-base text-black-1000 font-semibold font-inter">
                            GKo6...kEgV
                          </h3>
                        </div>

                        <h4 className="sm:text-base text-xs text-black-1000 font-semibold font-inter px-4">
                          Auction winner
                        </h4>
                      </div>
                       </div>
                       </>
                            }
                            {!publicKey && 
                            <div className="w-full mt-6 flex items-center flex-col justify-center py-[18px] md:py-[22px] px-[26px] gap-4 md:gap-[26px] border border-primary-color rounded-[20px] bg-black-1300">
                                <h3 className="md:text-base text-sm text-gray-1200 font-inter font-medium text-center">
                                Please connect your wallet first to bid on this auction.
                                </h3>
                                <WalletMultiButton />
                            </div>
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
                            <></>
                            //  <ParticipantsTable/>
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
                
                                <ul className="flex items-center gap-6">
                                  <li>
                                    <a href="#">
                                      <img
                                        src="/icons/twitter-icon.svg"
                                        className="md:w-7 invert md:h-7 w-6 h-6 object-contain"
                                        alt=""
                                      />
                                    </a>
                                  </li>
                
                                  <li>
                                    <a href="#">
                                      {" "}
                                      <img
                                        src="/icons/mcp-server-icon.svg"
                                        className="md:w-7 invert md:h-7 w-6 h-6 object-contain"
                                        alt=""
                                      />
                                    </a>
                                  </li>
                                </ul>
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
