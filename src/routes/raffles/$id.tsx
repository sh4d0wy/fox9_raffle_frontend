import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ParticipantsTable } from '@/components/home/ParticipantsTable';
import { TransactionsTable } from '@/components/auctions/TransactionsTable';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import QuantityBox from '@/components/home/QuantityBox';
import { useClaimTicketRaffle } from 'hooks/raffle/useClaimTicketRaffle';
import { useCancelRaffle } from 'hooks/raffle/useCancelRaffle';
import { useRaffleById, useRaffleWinnersWhoClaimedPrize } from 'hooks/raffle/useRaffles';
import { useWallet } from '@solana/wallet-adapter-react';
import { useBuyRaffleTicket } from 'hooks/raffle/useBuyRaffleTicket';
import { useBuyRaffleTicketStore } from 'store/buyraffleticketstore';
import { useClaimRafflePrize } from 'hooks/raffle/useClaimRafflePrize';
import { useQueryFavourites } from 'hooks/profile/useQueryFavourites';
import { useToggleFavourite } from 'hooks/useToggleFavourite';
import { useCreateRaffleStore } from 'store/createRaffleStore';
import { CrownIcon, HeartIcon, Loader, Globe2Icon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { VerifiedNftCollections } from '@/utils/verifiedNftCollections';
import { API_URL } from '@/constants';
import { VerifiedTokens } from '@/utils/verifiedTokens';
import PageTimer from '@/components/common/PageTimer';
import { FaXTwitter } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { useNftMetadata } from 'hooks/useNftMetadata';
import BuyTicketPopup from '@/components/ui/popups/raffle/BuyTicketPopup';
import { RaffleTermsAndConditions } from '@/components/home/RaffleTermsAndConditions';

export const Route = createFileRoute('/raffles/$id')({
  component: RouteComponent,
})


import type { NftMetadata } from 'hooks/useNftMetadata';
import RaffleEndedPopup from '@/components/ui/popups/raffle/RaffleEndedPopup';
import { motion } from 'motion/react';
import ToolTip from '@/components/common/ToolTip';

const getNftSections = (nftMetadata: NftMetadata | null | undefined, prizeData: any) => {
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
  } else if (prizeData?.collection) {
    const collectionName = VerifiedNftCollections.find(
      (c) => c.address === prizeData.collection
    )?.name;
    details.push({
      label: 'Collection',
      value: collectionName || `${prizeData.collection.slice(0, 6)}...${prizeData.collection.slice(-6)}`,
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

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: raffle, isLoading } = useRaffleById(id || "");
  const { publicKey } = useWallet();
  const { buyTicket } = useBuyRaffleTicket();
  const { ticketQuantity } = useBuyRaffleTicketStore();
  const { cancelRaffle } = useCancelRaffle();
  const { claimPrize } = useClaimRafflePrize();
  const { claimTicket } = useClaimTicketRaffle();
  const [maxTicketsBought, setMaxTicketsBought] = useState(false);
  const DEFAULT_AVATAR = "/icons/user-avatar.png";
  const [ttvTooltipOpen, setTTVTooltipOpen] = useState(false);
  const [prizeValueTooltipOpen, setPrizeValueTooltipOpen] = useState(false);
  const [roiTooltipOpen, setRoiTooltipOpen] = useState(false);

  const { data: winnersWhoClaimedPrize } = useRaffleWinnersWhoClaimedPrize(id || "");
  const [showWinnersModal, setShowWinnersModal] = useState(false);
  const { showBuyTicketPopup, setShowBuyTicketPopup, showRaffleEndedPopup, setShowRaffleEndedPopup } = useCreateRaffleStore();
  const nftMintAddress = raffle?.prizeData?.type === "NFT" ? raffle?.prizeData?.mintAddress : undefined;
  const { data: nftMetadata, isLoading: isNftMetadataLoading } = useNftMetadata(nftMintAddress);
  
  const nftSections = useMemo(() => {
    if (raffle?.prizeData?.type !== "NFT") return [];
    return getNftSections(nftMetadata, raffle?.prizeData);
  }, [nftMetadata, raffle?.prizeData]);

  const router = useRouter();
  const { favouriteRaffle } = useToggleFavourite(publicKey?.toString() || "");
  const { getFavouriteRaffle } = useQueryFavourites(
    publicKey?.toString() || ""
  );
  const [tabs, setTabs] = useState([
    { name: "Participants", active: true },
    { name: "Transactions", active: false },
    { name: "Terms & Conditions", active: false },
  ]);

  const isFavourite = useMemo(() => {
    console.log("getFavouriteRaffle", getFavouriteRaffle.data);
    const favourite = getFavouriteRaffle?.data?.find((favourite) => favourite.id === Number(raffle?.id));
    console.log("favourite", favourite);
    return favourite ? true : false;
  }, [getFavouriteRaffle, raffle?.id]);
  console.log("isFavourite", isFavourite);
  const shouldBeDisabled = useMemo(() => {
    return cancelRaffle.isPending ||
      (raffle?.ticketSold && raffle?.ticketSold > 0) ||
      (raffle?.state?.toLowerCase() !== "active" && raffle?.state?.toLowerCase() !== "failedended")
  }, [raffle?.ticketSold, raffle?.state, cancelRaffle.isPending]);

  const shouldTicketClaimVisible = useMemo(() => {
    return raffle?.state?.toLowerCase() === "successended";
  }, [raffle?.ticketAmountClaimedByCreator, raffle?.state]);

  const isActive = useMemo(() => {
    return (
      raffle?.state !== "SuccessEnded" &&
      raffle?.state !== "FailedEnded"
    );
  }, [raffle?.state]);

  const maxTickets = useMemo(() => {
    if (raffle) {
      console.log("maxTickets", raffle?.maxEntries, raffle?.ticketSupply, raffle?.ticketSold);
      return Math.min(raffle?.maxEntries!, (raffle?.ticketSupply! - raffle?.ticketSold!));
    } else {
      return 0;
    }
  }, [raffle])

  const isBuyTicketDisabled = useMemo(() => {
    if ((raffle?.raffleEntries?.filter((entry) => entry.userAddress === publicKey?.toString())[0]?.quantity ?? 0) == raffle?.maxEntries!) {
      setMaxTicketsBought(true);
      return true;
    }
    if (raffle?.ticketSold && raffle?.ticketSold == raffle?.ticketSupply) {
      return true;
    }
    if (raffle?.state?.toLowerCase() === "successended") {
      return true;
    }
    return false;
  }, [raffle?.state, raffle?.maxEntries, raffle?.ticketSupply, raffle?.ticketSold]);

  const isEndingConditionMet = useMemo(() => {
    if (!raffle) return false;

    const isActive = raffle.state?.toLowerCase() === "active";
    if (!isActive) return false;

    // Check if all tickets are sold
    const allTicketsSold = raffle.ticketSold !== undefined &&
      raffle.ticketSupply !== undefined &&
      raffle.ticketSold >= raffle.ticketSupply;

    // Check if end time has passed
    const endTimePassed = raffle.endsAt ? new Date(raffle.endsAt).getTime() <= Date.now() : false;

    return allTicketsSold || endTimePassed;
  }, [raffle?.state, raffle?.ticketSold, raffle?.ticketSupply, raffle?.endsAt]);

  useEffect(() => {
    if (isEndingConditionMet && !showRaffleEndedPopup && raffle?.state?.toLowerCase() === "active") {
      setShowRaffleEndedPopup(true);
    }else if(raffle?.state?.toLowerCase() === "successended" || raffle?.state?.toLowerCase() === "failedended"){
      setShowRaffleEndedPopup(false);
    }
  }, [isEndingConditionMet, showRaffleEndedPopup,raffle?.state]);  

  const [TimeExtension] = useState(true)


  if (isLoading) {
    return (
      <main className="bg-black py-20 h-[calc(100vh-300px)] text-center text-3xl font-bold text-red-500 w-full flex items-center justify-center">
        <Loader className="w-15 h-15 animate-spin text-primary-color" />
      </main>
    );
  }

  if (!raffle) {
    return (
      <main className="bg-black py-20 h-[calc(100vh-300px)] flex items-center justify-center gap-2 flex-col text-center text-3xl font-bold text-red-500">
        Raffle not found!
        <Link to={"/raffles"} className='px-6 cursor-pointer transition duration-300 hover:opacity-80 inline-flex items-center gap-2 py-2.5 bg-gray-1000 rounded-full text-base font-semibold text-white'>
        <img src="/icons/back-arw.svg" className='invert' alt="" />
         Back
         </Link>
      </main>
    );
  }



  return (
    <main className='bg-black-1400'>
      <div className="w-full md:pb-4 md:pt-44 pt-36 max-w-[1440px] px-5 mx-auto">
        <Link to={"/raffles"} className='px-6 cursor-pointer transition duration-300 hover:opacity-80 inline-flex items-center gap-2 py-2.5 bg-gray-1000 rounded-full text-base font-semibold text-white'>
        <img src="/icons/back-arw.svg" className='invert' alt="" />
         Back
         </Link>
      </div>
      <BuyTicketPopup isOpen={showBuyTicketPopup && !isEndingConditionMet && raffle?.state?.toLowerCase() === "active"} onClose={() => setShowBuyTicketPopup(false)} />
      <RaffleEndedPopup isOpen={showRaffleEndedPopup} shouldEnableAutoClose={false} />
      <motion.section 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.3 }}
      className='w-full pb-20'>
        
        <div className="w-full py-5 md:py-10 max-w-[1440px] px-5 mx-auto">
          <div className="w-full flex gap-6 md:gap-10 xl:flex-row flex-col">
            <div className="flex-1 max-w-full xl:max-w-[450px] overflow-hidden">
              <div className="rounded-xl relative overflow-hidden">
                <img src={raffle?.prizeData?.image}
                  className={`w-full md:h-[450px] h-[361px] rounded-[12px] hover:scale-105 transition-all duration-300 ${raffle?.prizeData?.type === "NFT" ? "object-cover" : "object-contain"}`}
                />
              </div>
              {raffle.prizeData.type === "NFT" && (
                <div className="w-full pb-7 pt-6 md:py-10 hidden md:flex items-center justify-between">
                  <div className="flex items-center gap-3 2xl:gap-5">
                    <img
                      src={VerifiedNftCollections.find((collection) => collection.address === raffle?.prizeData.collection)?.image}
                      className="w-12 h-12 object-contain rounded-full"
                      alt=""
                    />
                    <h3 className="md:text-[28px] text-lg font-bold text-white font-inter">
                      {VerifiedNftCollections.find((collection) => collection.address === raffle?.prizeData.collection)?.name}
                    </h3>
                  </div>

                  <ul className="flex items-center gap-2">
                    <li>
                      <a href={VerifiedNftCollections.find((collection) => collection.address === raffle?.prizeData.collection)?.twitter}>
                      <FaXTwitter className="w-7 h-7 object-contain text-white" />
                      </a>
                    </li>

                    <li>
                      <a href={VerifiedNftCollections.find((collection) => collection.address === raffle?.prizeData.collection)?.website}>
                        {" "}
                        <Globe2Icon className="w-7 h-7 object-contain text-white" />
                      </a>
                    </li>
                  </ul>
                </div>
              )}
              <div className="w-full space-y-5 hidden md:block">
                {raffle.prizeData.type === "NFT" && nftSections.length > 0 ? (
                  isNftMetadataLoading ? (
                    <div className="w-full py-10 flex items-center justify-center">
                      <Loader className="w-8 h-8 animate-spin text-primary-color" />
                    </div>
                  ) : nftSections.map((section, index) => (
                    <Disclosure
                      as="div"
                      key={section.title}
                      defaultOpen={index === 0}
                      className="w-full py-4 md:py-6 px-5 border border-gray-1100 rounded-[20px]"
                    >
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`flex items-center justify-between w-full text-base md:text-xl font-bold font-inter text-white ${open ? "text-primary-color" : ""
                              }`}
                          >
                            <span>{section.title}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={16}
                              height={9}
                              viewBox="0 0 16 9"
                              fill="none"
                              className={`${open ? `rotate-180` : ``
                                } transition-transform`}
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
                  ))) : (
                  <></>
                )}
              </div>

            </div>
            <div className="flex-1">
              <div className="w-full">
                <h4 className='text-sm text-primary-color font-inter font-medium'>Raffle prize • {raffle?.numberOfWinners} winner</h4>
                <h1 className='md:text-[28px] text-xl font-inter md:mt-6 my-5 md:mb-5 font-bold text-white'>{raffle?.prizeData?.type === "NFT" ? raffle?.prizeData?.name : `${(raffle?.prizeData?.amount ?? 0) / (10 ** (raffle?.prizeData?.decimals || 0))} ${raffle?.prizeData?.symbol}`}</h1>
                <div className="flex relative items-start md:items-center md:flex-row flex-col md:gap-0 gap-5 justify-between pb-6 md:pb-8 border-b border-gray-1000">
                  <ul className="flex items-center gap-3 2xl:gap-5 flex-wrap">
                    <li className="relative group cursor-help" onMouseEnter={() => setPrizeValueTooltipOpen(true)} onMouseLeave={() => setPrizeValueTooltipOpen(false)}>
                      <p className="md:text-sm text-xs inline-block px-2 sm:px-2.5 py-2 md:py-1.5 font-semibold text-center font-inter text-black-1000 bg-primary-color rounded-lg">
                        {raffle?.prizeData?.type === "NFT" ? "Floor Price: " : "Prize Value: "}

                        {raffle?.prizeData?.type === "NFT" ? raffle?.prizeData?.floor! / 10 ** 9 : raffle?.val ?? 0} {" "}
                         <span>SOL</span>
                      </p>
                      <ToolTip 
                      label={raffle?.prizeData?.type === "NFT" ? "Floor Price" : "Prize Value"} 
                      isOpen={prizeValueTooltipOpen} 
                      children={
                        <p className="text-white text-sm font-inter">
                          {raffle?.prizeData?.type === "NFT" ? "Floor Price is the lowest price of the NFT in the collection." : "Prize Value is the value of the prize in SOL."}
                        </p>} />
                    </li>
                    <li className="relative group cursor-help" onMouseEnter={() => setTTVTooltipOpen(true)} onMouseLeave={() => setTTVTooltipOpen(false)}>
                      <p className="md:text-sm text-xs inline-block px-2 sm:px-2.5 py-2 md:py-1.5 font-semibold text-center font-inter bg-gray-1000 text-white  rounded-lg">
                        TTV: {parseFloat(raffle?.ttv.toFixed(6))} {" "} SOL
                      </p>
                      <ToolTip label="TTV" isOpen={ttvTooltipOpen} children={
                        <p className="text-white text-sm font-inter">
                          TTV is Ticket To Value. It is the max value in SOL that can be earned by creator if all tickets are sold.
                        </p>} />
                    </li>
                    <li className="relative group cursor-help" onMouseEnter={() => setRoiTooltipOpen(true)} onMouseLeave={() => setRoiTooltipOpen(false)}>
                      <p className="md:text-sm text-xs inline-block px-2 sm:px-2.5 py-2 md:py-1.5 font-semibold text-center font-inter bg-gray-1000 text-white  rounded-lg">
                        {raffle?.roi > 0 ? "+" : ""}{raffle?.roi}%
                      </p>
                      <ToolTip label="ROI" isOpen={roiTooltipOpen} className='w-40' children={
                        <p className="text-white text-sm font-inter">
                          ROI is Return On Investment. It is the percentage of profit earned by creator if all tickets are sold.
                        </p>} />
                    </li>
                  </ul>

                  <ul className="flex md:absolute bottom-[33px] right-0 items-center md:flex-col mx-auto bg-primary-color/20 gap-4 p-2 rounded-full ">
                    <li>
                      <button onClick={() => favouriteRaffle.mutate({ raffleId: Number(raffle?.id) })} className="border bg-gray-1200 cursor-pointer w-12 h-12 md:py-2.5 gap-2.5 rounded-full text-sm md:text-base font-semibold font-inter text-white inline-flex items-center justify-center">
                        <HeartIcon className={`w-6 h-6 ${isFavourite ? "text-gray-900/40 fill-primary-color" : "text-black"}`} />
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
                        src={raffle?.creator?.profileImage ? API_URL + raffle?.creator?.profileImage : DEFAULT_AVATAR}
                        className="w-10 h-10 rounded-full object-cover"
                        alt="no"
                      />

                      <div className="">
                        <p className="text-xs md:pb-0 pb-1 font-inter font-normal text-gray-1200">
                          Raffler
                        </p>
                        <h4 className="text-base text-white font-inter font-semibold">
                          {raffle?.creator?.walletAddress.slice(0, 4) + "..." + raffle?.creator?.walletAddress.slice(-4) || ""}
                        </h4>
                      </div>
                    </div>

                  </div>
                  {isActive ? (
                    <div className="w-full flex items-center flex-col-reverse md:flex-row justify-between py-4 px-[26px] rounded-[20px] bg-primary-color/10">
                      <div className="inline-flex w-full md:w-fit flex-col gap-2.5">
                        <PageTimer targetDate={new Date(raffle?.endsAt || "")} />
                        <p className="text-sm font-inter text-gray-1200 font-normal">
                          Time Left
                        </p>
                      </div>
                      <div className="flex-1 md:flex-none md:w-1/2 flex justify-between w-full pb-6 md:pb-0">
                        <div className="inline-flex flex-col gap-2.5">
                          <h3 className="md:text-xl font-semibold font-inter text-white">
                            {raffle?.ticketSold} / {raffle?.ticketSupply}
                          </h3>
                          <p className="font-inter text-gray-1200 text-sm font-normal">
                            Tickets Sold
                          </p>
                        </div>

                        <div className="inline-flex flex-col gap-2.5">
                          <h3 className="md:text-xl text-base font-semibold font-inter text-white">
                            {raffle?.ticketPrice /
                              10 **
                              (VerifiedTokens.find(
                                (token) =>
                                  token.address === raffle?.ticketTokenAddress
                              )?.decimals || 0)}{" "}
                            {
                              VerifiedTokens.find(
                                (token) =>
                                  token.address === raffle?.ticketTokenAddress
                              )?.symbol
                            }
                          </h3>
                          <p className="font-inter text-gray-1200 text-sm font-normal">
                            Ticket price
                          </p>
                        </div>
                      </div>
                    </div>) : (
                    <>
                      <div className="w-full rounded-3xl bg-primary-color/10 border border-primary-color border-t-4 p-4 md:p-6">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-4">
                          <CrownIcon className="w-6 h-6 text-primary-color fill-primary-color" />
                          <p className="text-white text-lg font-bold font-inter flex items-center gap-2">Raffle Winners</p>
                        </div>

                        {/* Winners Cards - Horizontal Scroll */}
                        {raffle?.winners?.length! > 1 ? (
                          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                            {raffle?.winners?.slice(0, 3).map((winner, index) => {

                              return (
                                <div
                                  key={index}
                                  className={`shrink-0 flex items-center gap-3 bg-black-1300 rounded-xl px-4 py-3 min-w-[200px] border-2 ${'border-primary-color'}`}
                                >
                                  <div className="relative">
                                    <img
                                      src={winner?.profileImage ? API_URL + winner?.profileImage : DEFAULT_AVATAR}
                                      className={`w-12 h-12 rounded-full object-cover border-2 ${'border-primary-color'}`}
                                      alt="winner"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-white truncate">
                                      {winner?.walletAddress?.slice(0, 4)}...{winner?.walletAddress?.slice(-4)}
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                      Won with {raffle.raffleEntries?.find(
                                        (entry) => entry.userAddress === winner?.walletAddress
                                      )?.quantity || 0} Ticket(s)
                                    </p>
                                  </div>
                                  <div className={`w-8 h-8 rounded-lg ${'bg-primary-color'} flex items-center justify-center`}>
                                    <span className="text-sm font-bold text-black-1000">#{index + 1}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="w-full rounded-xl px-2 md:px-4 py-3 flex items-center justify-start  md:justify-center md:gap-3 ">
                            <div className="relative">
                              <img
                                src={raffle?.winners?.[0]?.profileImage ? API_URL + raffle?.winners?.[0]?.profileImage : DEFAULT_AVATAR}
                                className="md:w-12 md:h-12 w-10 h-10 rounded-full object-cover border-2 border-primary-color"
                                alt="winner"
                              />
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center w-full ">
                              <h3 className="md:text-xl text-base font-bold text-white truncate">
                                {raffle?.winners?.[0]?.walletAddress?.slice(0, 6)}....{raffle?.winners?.[0]?.walletAddress?.slice(-6)}
                              </h3>
                              <p className="md:text-xl text-base font-semibold text-white">
                                Won with {raffle.raffleEntries?.find(
                                  (entry) => entry.userAddress === raffle?.winners?.[0]?.walletAddress
                                )?.quantity || 0} Ticket(s)
                              </p>
                            </div>

                          </div>

                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-2">
                          {raffle?.winners && raffle.winners.length > 1 && (
                            <button
                              className="flex-1 py-3 px-4 bg-primary-color/20  text-primary-color font-semibold rounded-xl border border-primary-color hover:bg-primary-color/30 transition-colors"
                              onClick={() => setShowWinnersModal(true)}
                            >
                              View All Winners ({raffle.winners.length})
                            </button>
                          )}
                          {raffle?.winners?.length! > 0 &&
                            raffle.winners?.some(
                              (winners) => winners.walletAddress === publicKey?.toBase58()
                            ) && (
                              <button
                                className="flex-1 py-3 px-4 bg-primary-color text-black font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                onClick={() => {
                                  claimPrize.mutate({
                                    raffleId: Number(raffle?.id) || 0,
                                  });
                                }}
                                disabled={((winnersWhoClaimedPrize && winnersWhoClaimedPrize?.some(
                                  (winner) => winner.sender === publicKey?.toBase58()
                                )) || claimPrize.isPending)}
                              >
                                {claimPrize.isPending ? <Loader className="w-5 h-5 animate-spin" /> : "Claim Your Prize"}
                              </button>
                            )}
                        </div>
                      </div>

                      {/* Winners Modal */}
                      {showWinnersModal && (
                        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                          <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                              <div className="flex items-center gap-2">
                                {/* <img src="/icons/winner-icon.svg" alt="winner" className="w-6 h-6" /> */}
                                <h2 className="text-white text-lg font-bold">Raffle Winners</h2>
                              </div>
                              <button
                                onClick={() => setShowWinnersModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </button>
                            </div>

                            {/* Modal Body - Scrollable List */}
                            <div className="overflow-y-auto max-h-[60vh]">
                              <div className="border-l-4 border-primary-color">
                                {raffle?.winners?.map((winner, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-4 px-4 py-3 border-b border-gray-800 last:border-b-0"
                                  >
                                    {/* Position Number */}
                                    <span className="text-gray-400 font-semibold w-6 text-center">#{index + 1}</span>

                                    {/* Profile Image */}
                                    <img
                                      src={winner?.profileImage ? API_URL + winner?.profileImage : DEFAULT_AVATAR}
                                      className="w-10 h-10 rounded-full object-cover"
                                      alt="winner"
                                    />

                                    {/* Winner Info */}
                                    <div className="flex-1">
                                      <h3 className="text-white font-semibold text-sm">
                                        {winner?.walletAddress?.slice(0, 4)}...{winner?.walletAddress?.slice(-4)}
                                      </h3>
                                      <p className="text-gray-400 text-xs">
                                        Won with {raffle.raffleEntries?.find(
                                          (entry) => entry.userAddress === winner?.walletAddress
                                        )?.quantity || 0} Ticket(s)
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {!publicKey && (
                    <div className="w-full mt-6 flex items-center flex-col justify-center py-[18px] md:py-[22px] px-[26px] gap-4 md:gap-[26px] border border-gray-1100 rounded-[20px] text-white!">
                      <h3 className="md:text-base text-sm text-white font-inter font-medium text-center">
                        Please connect your wallet first to enter a raffle.
                      </h3>
                    </div>
                  )}
                  {(publicKey && publicKey.toBase58() !== raffle?.createdBy && raffle.state?.toLowerCase() === "active" && !isEndingConditionMet) &&
                    <div className="w-full mt-6 bg-black-1300 px-6 py-4 pb-8 border border-primary-color rounded-[20px]">

                      <div className="w-full items-center grid lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 md:gap-[80px] gap-6">
                        <QuantityBox max={maxTickets || 0} />
                        <div className="flex items-center gap-4 justify-center">
                          <div className="w-full h-full flex items-center ">
                            <PrimaryButton
                              className="w-full py-3 h-full mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isBuyTicketDisabled || buyTicket.isPending || showBuyTicketPopup}
                              text={buyTicket.isPending ? <Loader className="w-5 h-5 animate-spin" /> : isBuyTicketDisabled ? maxTicketsBought ? "Max Tickets Bought" : "Sold Out" : 
                                `Buy for ${parseFloat(((raffle?.ticketPrice /
                                10 **
                                (VerifiedTokens.find(
                                  (token) =>
                                    token.address === raffle?.ticketTokenAddress
                                )?.decimals || 0)) * ticketQuantity).toFixed(6))
                                } ${VerifiedTokens.find(
                                  (token) =>
                                    token.address === raffle?.ticketTokenAddress
                                )?.symbol
                                }`}
                              onclick={() => {
                                buyTicket.mutate({
                                  raffleId: raffle?.id || 0,
                                  ticketsToBuy: ticketQuantity,
                                });
                              }}
                            />
                          </div>

                        </div>

                      </div>

                    </div>
                  }

                  {publicKey && publicKey.toBase58() === raffle?.createdBy && (
                    <div className="w-full mt-6">
                      <div className="w-full bg-primary-color/10 border border-primary-color border-t-4 rounded-3xl items-center flex flex-col gap-5 justify-center py-2">
                        <div className='w-full flex items-center justify-between gap-3 border-b border-primary-color/20 px-10 py-2 pt-3'>
                          {/* <ShieldIcon className='w-8 h-8 text-white fill-white' /> */}
                          <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 11H16C15.47 15.11 12.72 18.78 9 19.92V11ZM9 11H2V5.3L9 2.19M9 0L0 4V10C0 15.55 3.84 20.73 9 22C14.16 20.73 18 15.55 18 10V4L9 0Z" fill="white" />
                          </svg>

                          <h3 className="text-xl font-bold w-full text-left font-inter text-white">
                            Administrator
                          </h3>
                        </div>
                        <div className="w-full md:mb-5 px-10">
                          <div className='w-full flex flex-col items-center justify-center py-2 pb-5 gap-2'>
                            <div className='w-full flex items-center justify-between gap-3 '>
                              <p className='text-md font-inter text-white/60 font-medium'>
                                Current Status
                              </p>
                              <p className={`text-md font-bold font-inter ${raffle?.state?.toLowerCase() === "active" ? "text-green-500" : (raffle?.state?.toLowerCase() === "successended" || raffle?.state?.toLowerCase() === "failedended") ? "text-red-500" : raffle?.state?.toLowerCase() === "cancelled" ? "text-red-500" : "text-gray-1200"} `}>
                                {raffle?.state?.toLowerCase() === "active" ? "Active" : (raffle?.state?.toLowerCase() === "successended" || raffle?.state?.toLowerCase() === "failedended" ? "Ended" : raffle?.state?.toLowerCase() === "cancelled" ? "Cancelled" : "Active")}
                              </p>
                            </div>
                            <div className='w-full flex items-center justify-between gap-3 '>
                              <p className='text-md font-inter text-white/60 font-medium'>
                                Total Earnings
                              </p>
                              <p className={`text-md font-medium font-inter text-white `}>
                                {raffle?.ticketSold ? (raffle?.ticketSold * raffle?.ticketPrice) / 10 ** (VerifiedTokens.find(
                                  (token) =>
                                    token.address === raffle?.ticketTokenAddress
                                )?.decimals || 0) : 0} {VerifiedTokens.find(
                                  (token) =>
                                    token.address === raffle?.ticketTokenAddress
                                )?.symbol}
                              </p>
                            </div>
                          </div>
                          {
                            shouldTicketClaimVisible ? (
                              <PrimaryButton
                                className="w-full h-[54px]"
                                text={claimTicket.isPending ? <Loader className="w-5 h-5 animate-spin" /> : "Claim Ticket Amount"}
                                disabled={claimTicket.isPending || raffle?.ticketAmountClaimedByCreator}
                                onclick={() => {
                                  claimTicket.mutate(raffle?.id || 0);
                                }}
                              />
                            ) : (
                              <PrimaryButton
                                className={`w-full bg-red-800! border-none! text-white! h-[54px] ${shouldBeDisabled ? "opacity-50 cursor-not-allowed" : ""} `}
                                text={cancelRaffle.isPending ? <Loader className="w-5 h-5 animate-spin" /> : "Cancel Raffle"}
                                disabled={shouldBeDisabled}
                                onclick={() => {
                                  cancelRaffle.mutate(raffle?.id || 0);
                                }}
                              />
                            )
                          }

                        </div>
                      </div>
                    </div>
                  )}

                  <div className="w-full">
                    <div className="w-full overflow-x-auto">
                      <ul className="inline-flex items-center bg-white/15 gap-3 2xl:gap-4 mb-6 mt-10 p-1 rounded-full sm:w-auto">
                        {tabs.map((tab: { name: string; active: boolean }, index: number) => (
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
                      <ParticipantsTable
                        participants={raffle?.raffleEntries}
                        ticketSupply={raffle?.ticketSupply || 0}
                      />
                    }

                    {tabs[1].active &&
                      <TransactionsTable transactions={raffle?.raffleEntries?.flatMap((entry) => entry.transactions) || []} />
                    }

                    {tabs[2].active &&
                      <RaffleTermsAndConditions supply={raffle?.ticketSupply.toString() || "0"} />
                    }

                  </div>
                  {raffle.prizeData.type === "NFT" && (
                    <>
                <div className="w-full pb-7 pt-6 md:py-10 flex md:hidden items-center justify-between">
                  <div className="flex items-center gap-3 2xl:gap-5">
                    <img
                      src={VerifiedNftCollections.find((collection) => collection.address === raffle?.prizeData.collection)?.image}
                      className="w-12 h-12 object-contain rounded-full"
                      alt=""
                    />
                    <h3 className="md:text-[28px] text-lg font-bold text-white font-inter">
                      {VerifiedNftCollections.find((collection) => collection.address === raffle?.prizeData.collection)?.name}
                    </h3>
                  </div>

                  <ul className="flex items-center gap-2">
                    <li>
                      <a href={VerifiedNftCollections.find((collection) => collection.address === raffle?.prizeData.collection)?.twitter}>
                      <FaXTwitter className="w-7 h-7 object-contain text-white" />
                      </a>
                    </li>

                    <li>
                      <a href={VerifiedNftCollections.find((collection) => collection.address === raffle?.prizeData.collection)?.website}>
                        {" "}
                        <Globe2Icon className="w-7 h-7 object-contain text-white" />
                      </a>
                    </li>
                  </ul>
                </div>
                 <div className="w-full space-y-5 hidden md:block">
                 {raffle.prizeData.type === "NFT" && nftSections.length > 0 ? (
                   isNftMetadataLoading ? (
                     <div className="w-full py-10 flex items-center justify-center">
                       <Loader className="w-8 h-8 animate-spin text-primary-color" />
                     </div>
                   ) : nftSections.map((section, index) => (
                     <Disclosure
                       as="div"
                       key={section.title}
                       defaultOpen={index === 0}
                       className="w-full py-4 md:py-6 px-5 border border-gray-1100 rounded-[20px]"
                     >
                       {({ open }) => (
                         <>
                           <Disclosure.Button
                             className={`flex items-center justify-between w-full text-base md:text-xl font-bold font-inter text-white ${open ? "text-primary-color" : ""
                               }`}
                           >
                             <span>{section.title}</span>
                             <svg
                               xmlns="http://www.w3.org/2000/svg"
                               width={16}
                               height={9}
                               viewBox="0 0 16 9"
                               fill="none"
                               className={`${open ? `rotate-180` : ``
                                 } transition-transform`}
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
                   ))) : (
                   <></>
                 )}
               </div>
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
