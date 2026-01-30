import { createFileRoute, Link } from '@tanstack/react-router'
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import DateSelector from '@/components/ui/DateSelector';
import TimeSelector from '@/components/ui/TimeSelector';
import FormInput from '@/components/ui/FormInput';
import InputSwitch from '@/components/ui/Switch';
import { useAucationsStore } from "../../../store/auctions-store";
import AmountWithDropdown from '@/components/auctions/AmountWithDropdown';
import { AgreeCheckbox } from '@/components/common/AgreeCheckbox';
import CreateTokenModel from '@/components/gumballs/CreateTokenModel';
import { useCreateAuction } from 'hooks/auction/useCreateAuction';
import { useAuctionAnchorProgram } from 'hooks/auction/useAuctionAnchorProgram';
import { useCreateRaffleStore } from 'store/createRaffleStore';
import { useGumballStore } from 'store/useGumballStore';
import { formatTimePeriod } from '@/utils/helpers';
import { useFetchUserNfts } from 'hooks/useFetchUserNfts';
import { calculateRent } from 'hooks/helpers';
import { useGetCollectionFP } from 'hooks/useGetCollectionFP';
import { VerifiedNftCollections } from '@/utils/verifiedNftCollections';
import clsx from 'clsx';
import { VerifiedTokens } from '@/utils/verifiedTokens';
import { Loader } from 'lucide-react';

export const Route = createFileRoute('/auctions/create_auctions')({
  component: CreateAucations,
})

function CreateAucations() {
  const { createAuction } = useCreateAuction();
  const { getAuctionConfig } = useAuctionAnchorProgram();
  const {
    openVerifiedCollectionsModal,
    agreedToTerms,
    setAgreedToTerms,
    isVerifiedCollectionsModalOpen,
    closeVerifiedCollectionsModal,
    collectionSearchQuery,
    setCollectionSearchQuery,
    endDate,
    setEndDate,
    endTimeHour,
    endTimeMinute,
    endTimePeriod,
    selectedDuration,
    setEndTimeHour,
    setEndTimeMinute,
    setEndTimePeriod,
    applyDurationPreset,
    getEndTimestamp,
  } = useCreateRaffleStore();

  const {
    startDate,
    startTimeHour,
    startTimeMinute,
    startTimePeriod,
    startType,
    setStartDate,
    setStartType,
    setStartTimeHour,
    setStartTimeMinute,
    setStartTimePeriod,
    getStartTimestamp,
  } = useGumballStore();

  const { collectionFPs, collectionFPMap } = useGetCollectionFP();
  const { data: auctionConfig, isLoading: isLoadingAuctionConfig, isError: isErrorAuctionConfig } = getAuctionConfig;
  const [rentFee, setRentFee] = useState(0);
  const [creationFee, setCreationFee] = useState(0);
  const [isCreatingAuction, setIsCreatingAuction] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const [basePrice, setBasePrice] = useState("");
  const [symbol, setSymbol] = useState("SOL");
  const [baseMint, setBaseMint] = useState("");
  const [bidIncrement, setBidIncrement] = useState("");
  const [timeExtension, setTimeExtension] = useState("");
  const [isPrizeModalOpen, setIsPrizeModalOpen] = useState(false);
  const [nftData, setNftData] = useState<{
    mint: string;
    name: string;
    image: string;
    collectionName: string;
    floorPrice: number;
  } | null>(null);

  const handleSelect = (address: string, symbol: string) => {
    setSymbol(symbol);
    setBaseMint(address);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isLoadingAuctionConfig || isErrorAuctionConfig) return;
    setCreationFee(auctionConfig?.creationFeeLamports.toNumber() ?? 0);
    async function fetchRentFee() {
      const rent = await calculateRent(188)
      const rentAta = await calculateRent(165);
      if (rent && rentAta)
      setRentFee(rent?.rentLamports + rentAta?.rentLamports);
    }
    fetchRentFee();
  }, [auctionConfig, isLoadingAuctionConfig, isErrorAuctionConfig]);

  const tabs = [
    { name: "Start Immediately", type: "manual" as const },
    { name: "Schedule Start", type: "schedule" as const },
  ];

  const today = useMemo(() => new Date(), []);

  const handleTimeChange = (
    hour: string,
    minute: string,
    period: "AM" | "PM"
  ) => {
    setEndTimeHour(hour);
    setEndTimeMinute(minute);
    setEndTimePeriod(period);
  };

  const handleAuctionCreate = async () => {
    try {
      setIsCreatingAuction(true);

      const isStartImmediately = startType === "manual";
      const currentTimestamp = Math.floor(Date.now() / 1000);
      
      let startTime: number;
      let endTime: number;
      
      if (isStartImmediately) {
        startTime = currentTimestamp;
        
        if (selectedDuration) {
          const durationHours = 
            selectedDuration === "24hr" ? 24 : 
            selectedDuration === "36hr" ? 36 : 
            selectedDuration === "48hr" ? 48 : 0;
          endTime = startTime + (durationHours * 60 * 60);
        } else {
          endTime = getEndTimestamp()!;
        }
      } else {
        startTime = getStartTimestamp()!;
        endTime = getEndTimestamp()!;
      }

      await createAuction.mutateAsync({
        startImmediately: isStartImmediately,
        startTime,
        endTime,
        baseBid: parseFloat(basePrice),
        bidMint: baseMint,
        isBidMintSol: symbol === "SOL" ? true : false,
        currency: symbol,
        minIncrement: parseInt(bidIncrement),
        prizeMint: nftData?.mint || "",
        timeExtension: parseInt(timeExtension),
        prizeName: nftData?.name || "",
        prizeImage: nftData?.image || "",
        collectionName: nftData?.collectionName || "",
        floorPrice: nftData?.floorPrice ?? 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingAuction(false);
    }
  };

  const [selectedNftId, setSelectedNftId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { userNfts, isLoading: isLoadingNfts } = useFetchUserNfts();

  // Mapping raw NFT data to a clean format
  const nfts = useMemo(() => {
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    return (userNfts || []).map((nft: any) => ({
      id: nft.id,
      name: nft.content.metadata.name,
      image: nft.content.links.image,
      floorPrice: collectionFPMap[nft.grouping[0].group_value],
      mint: nft.id,
    }));
  }, [userNfts, collectionFPMap]);

  // Filtered list based on search input
  const filteredNfts = useMemo(() => {
    if (!searchQuery.trim()) return nfts;
    const query = searchQuery.toLowerCase();
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    return nfts.filter((nft: any) => nft.name.toLowerCase().includes(query));
  }, [searchQuery, nfts]);

  // Toggle selection: if clicking the same one, deselect it
  const handleSelectNft = (id: string) => {
    setSelectedNftId((prevId) => (prevId === id ? null : id));
  };

  const handleAddPrizes = async () => {
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    const selectedNftData = nfts.find((nft: any) => nft.id === selectedNftId);

    if (!selectedNftData) return;

    // Constructed as a single object (or wrap in array if your API requires it)
    const prizeData = {
      mint: selectedNftData.mint,
      name: selectedNftData.name,
      image: selectedNftData.image,
      collectionName: collectionFPs[0]?.name || "",
      floorPrice: selectedNftData.floorPrice ?? 0,
    };

    console.log("prizeData", prizeData);

    setNftData(prizeData);
    handleClose();
  };

  const handleClose = () => {
    setSelectedNftId(null);
    setSearchQuery("");
    setIsPrizeModalOpen(false);
  };
  const isInvalidReservePrice = useMemo(() => {
    if (!basePrice) return false;
    return parseFloat(basePrice) <= 0;
  }, [basePrice]);
  
  const isInvalidBidIncrement = useMemo(() => {
    if (!bidIncrement) return false;
    return parseInt(bidIncrement) <= 0;
  }, [bidIncrement]);

  const isInvalidTimeExtension = useMemo(() => {
    if (!timeExtension) return false;
    return (parseInt(timeExtension)*60) < (auctionConfig?.minimumTimeExtension ?? 0) || (parseInt(timeExtension)*60) > (auctionConfig?.maximumTimeExtension ?? 0);
  }, [timeExtension, auctionConfig]);

  const timePeriod = useMemo(()=>{
    const minTimePeriod = formatTimePeriod(auctionConfig?.minimumAuctionPeriod ?? 0);
    const maxTimePeriod = formatTimePeriod(auctionConfig?.maximumAuctionPeriod ?? 0);
    return `${minTimePeriod} - ${maxTimePeriod}`;
  }, [auctionConfig]);

  const timeExtensionPeriod = useMemo(()=>{
    const minTimeExtension = formatTimePeriod(auctionConfig?.minimumTimeExtension ?? 0);
    const maxTimeExtension = formatTimePeriod(auctionConfig?.maximumTimeExtension ?? 0);
    return `${minTimeExtension} - ${maxTimeExtension}`;
  }, [auctionConfig]);

  const isEndTimePeriodInvalid = useMemo(() => {
    if (!endDate || !endTimeHour || !endTimeMinute) return false;
    
    let hour24 = parseInt(endTimeHour) || 12;
    if (endTimePeriod === "PM" && hour24 !== 12) {
      hour24 += 12;
    } else if (endTimePeriod === "AM" && hour24 === 12) {
      hour24 = 0;
    }
    
    const endDateTime = new Date(endDate);
    endDateTime.setHours(hour24, parseInt(endTimeMinute) || 0, 0, 0);
    
    let startSeconds: number;
    if (startType === "manual") {
      startSeconds = Math.floor(Date.now() / 1000);
    } else {
      startSeconds = getStartTimestamp() || Math.floor(Date.now() / 1000);
    }
    
    const endSeconds = Math.floor(endDateTime.getTime() / 1000);
    const diffSeconds = endSeconds - startSeconds;
    
    const minPeriod = auctionConfig?.minimumAuctionPeriod ?? 0;
    const maxPeriod = auctionConfig?.maximumAuctionPeriod ?? 0;
    
    if (diffSeconds < minPeriod || diffSeconds > maxPeriod) {
      return true;
    }
    
    return false;
  }, [endDate, endTimeHour, endTimeMinute, endTimePeriod, startType, getStartTimestamp, auctionConfig]);

  const isStartTimePeriodInvalid = useMemo(() => {
    if (startType !== "schedule") return false;
    if (!startDate || !startTimeHour || !startTimeMinute) return false;
    
    let hour24 = parseInt(startTimeHour) || 12;
    if (startTimePeriod === "PM" && hour24 !== 12) {
      hour24 += 12;
    } else if (startTimePeriod === "AM" && hour24 === 12) {
      hour24 = 0;
    }
    
    const startDateTime = new Date(startDate);
    startDateTime.setHours(hour24, parseInt(startTimeMinute) || 0, 0, 0);
    
    const nowSeconds = Math.floor(Date.now() / 1000);
    const startSeconds = Math.floor(startDateTime.getTime() / 1000);
    
    if (startSeconds <= nowSeconds) {
      return true;
    }
    
    return false;
  }, [startDate, startTimeHour, startTimeMinute, startTimePeriod, startType]);

  const filteredVerifiedCollections = useMemo(() => {
    if (!collectionSearchQuery.trim()) return VerifiedNftCollections;
    const query = collectionSearchQuery.toLowerCase();
    return VerifiedNftCollections.filter((collection) =>
      collection.name.toLowerCase().includes(query)
    );
  }, [collectionSearchQuery]);

console.log("startType", startType);
  return <div className='bg-black-1400'>
    
        <section className="md:pt-48 pt-36 pb-[60px] md:pb-[122px]">
        <div className="max-w-[1440px] mx-auto w-full px-4 lg:px-10">
          <div>
            <Link
              to={"/auctions"}
              className="bg-gray-1000 mb-10 rounded-[80px] inline-flex h-10 md:h-[49px] justify-center items-center pl-5 pr-3.5 md:px-6 gap-2 md:gap-2.5  md:text-base text-sm font-semibold text-white font-inter"
            >
              <span>
                <img src="/icons/back-arw.svg" className='invert' alt="" />
              </span>
              Back
            </Link>
            <div className="flex items-start md:flex-row flex-col gap-5 lg:gap-10">
              <div className="lg:w-2/6 md:w-2/5 w-full">
                <div className="flex items-start gap-10 pb-5">
                  <div className="w-full">
                 <div className="relative border-2 border-dashed border-gray-1000 h-[361px] lg:h-[450px] bg-black-1400 rounded-[20px] flex items-center justify-center flex-col">
                      <h4 className="font-inter mb-5 lg:mb-6 font-semibold lg:text-2xl text-lg text-white">
                        Add an NFT prize
                      </h4>
                      <button
                        onClick={()=> setIsPrizeModalOpen(true)}
                        className="cursor-pointer text-black-1300 hover:from-primary-color hover:via-primary-color hover:to-primary-color font-semibold text-sm lg:text-base leading-normal font-inter h-10 lg:h-11 rounded-full inline-flex items-center justify-center px-5 lg:px-[26px] transition duration-500 hover:opacity-90 bg-primary-color gap-2"
                      >
                        <span className="w-6 h-6 flex items-center justify-center">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.75 6.75H12.75M6.75 0.75V12.75"
                              stroke="#212121"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </span>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={openVerifiedCollectionsModal}
                    className="flex cursor-pointer w-full items-center justify-between border border-solid border-gray-1100 rounded-[20px] h-[60px] px-5"
                  >
                    <p className="text-white xl:text-lg text-base font-medium font-inter">
                      View all verified collections
                    </p>
                    <span>
                      <img src="/icons/right-arw.svg" className='invert' alt="" />
                    </span>
                  </button>
                </div>
              </div>
              <div className="lg:w-4/6 md:w-3/5 w-full">
                <div>
                  <div>
                    <div className="flex items-center justify-between gap-2.5 border border-solid border-gray-1100 rounded-[10px] h-12 px-5">
                      <div className="flex items-center gap-2.5">
                        <p className="md:text-base text-sm font-semibold text-white font-inter">
                          Start Immediately
                        </p>
                      </div>
                        <InputSwitch
                        checked={startType === "manual"}
                        onChange={()=> setStartType(startType === "manual" ? "schedule" : "manual")}
                        />
                    </div>
                    <div className="w-full my-10">
                    {startType === "schedule" && (
                        <div className="pb-10">
                          {isStartTimePeriodInvalid && (
                            <p className="md:text-sm text-xs font-medium font-inter text-red-500 pb-2.5">
                              Please select a valid start date and time (must be in the future)
                            </p>
                          )}
                          <div className="grid grid-cols-2 md:gap-5 gap-3">
                            <div className="">
                              <DateSelector
                                label="Start Date"
                                value={startDate}
                                onChange={setStartDate}
                                minDate={today}
                                disabled={isCreatingAuction}
                                className={isStartTimePeriodInvalid ? "invalid" : ""}
                              />
                            </div>
                            <div className="">
                              <TimeSelector
                                label="Start Time"
                                hour={startTimeHour}
                                minute={startTimeMinute}
                                period={startTimePeriod}
                                onTimeChange={(hour, minute, period) => {
                                  setStartTimeHour(hour);
                                  setStartTimeMinute(minute);
                                  setStartTimePeriod(period);
                                }}
                                disabled={isCreatingAuction}
                                hasValue={!!startDate}
                                isInvalid={isStartTimePeriodInvalid}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {isEndTimePeriodInvalid && (
                        <p className="md:text-sm text-xs font-medium font-inter text-red-500 pb-2.5">
                          Please select a valid date and time (Time period must be between {timePeriod})
                        </p>
                      )}
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="">
                          <DateSelector
                            label="Auction end date"
                            value={endDate}
                            onChange={setEndDate}
                            minDate={startType === "manual" ? today : startDate || today}
                            maxDate={startType === "manual" ? new Date(today.getTime() + (auctionConfig?.maximumAuctionPeriod ?? 0) * 1000) : new Date(startDate?.getTime()! + (auctionConfig?.maximumAuctionPeriod ?? 0) * 1000) || new Date(today.getTime() + (auctionConfig?.maximumAuctionPeriod ?? 0) * 1000)}
                            limit={timePeriod}
                            className={isEndTimePeriodInvalid ? "invalid" : ""}
                          />
                          {startType === "manual" && (
                            <ol className="flex items-center gap-4 pt-2.5">
                              {(["24hr", "36hr", "48hr"] as const).map(
                                (duration) => (
                                  <li key={duration} className="w-full">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        applyDurationPreset(duration)
                                      }
                                      className={`rounded-[7px] cursor-pointer px-2.5 h-10 flex items-center justify-center text-sm font-semibold font-inter text-black-1000 w-full transition-colors ${
                                        selectedDuration === duration
                                          ? "bg-primary-color text-black!"
                                        : "bg-[#1B1B21FA] hover:bg-primary-color/30 text-white"
                                      }`}
                                    >
                                      {duration}
                                    </button>
                                  </li>
                                )
                              )}
                            </ol>
                          )}
                        </div>
                        <div className="">
                          <TimeSelector
                            label="End Time"
                            hour={endTimeHour}
                            minute={endTimeMinute}
                            period={endTimePeriod}
                            onTimeChange={handleTimeChange}
                            hasValue={!!endDate}
                            isInvalid={isEndTimePeriodInvalid}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-5 pb-10">
                    <div className="w-full">
                        <div className="flex items-center justify-between pb-2.5">
                          <p className="text-gray-1200 font-inter text-sm font-medium">
                            Bid Increment
                          </p>
                        </div>
                        <div className="relative">
                          <input
                            id="amount"
                            type="number"
                            value={bidIncrement}
                            onChange={(e) => {
                              setBidIncrement(e.target.value);
                            }}
                            className={`text-white bg-black-1300 placeholder:text-gray-1200 text-base w-full font-inter px-5 h-12 border border-solid ${isInvalidBidIncrement ? "border-red-500" : "border-gray-1100"} rounded-lg font-medium`}
                            autoComplete="off"
                            placeholder=""
                          />
                          <div className="absolute z-20 top-1/2 right-5 -translate-y-1/2 bg-black-1300 border-l border-solid border-gray-1100">
                            <div className="flex items-center gap-1.5 px-3 cursor-pointer font-inter text-base font-medium text-white py-1">
                              <p>{"%"}</p>
                            </div>
                          </div>
                        </div>
                        {isInvalidBidIncrement && (
                          <p className="md:text-sm text-xs font-medium font-inter text-red-500 pt-2.5">
                            Please enter a valid bid increment (must be greater than 0)
                          </p>
                        )}
                        <ol className="flex items-center gap-4 pt-2.5 pb-10">
                          {(["5", "10", "20"] as const).map((duration) => (
                            <li key={duration} className="w-full">
                              <button
                                type="button"
                                onClick={() => setBidIncrement(duration)}
                                className={`rounded-[7px] cursor-pointer px-2.5 h-10 flex items-center justify-center text-sm font-semibold font-inter text-white w-full transition-colors ${
                                  bidIncrement === duration
                                    ? "bg-primary-color text-black!"
                                    : "bg-[#1B1B21FA] hover:bg-primary-color/30 text-white"
                                }`}
                              >
                                {duration}%
                              </button>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="w-full">
                        <div className="flex items-center justify-between pb-2.5">
                          <p className="text-gray-1200 font-inter text-sm font-medium">
                            Time extension period
                          </p>
                          <p className="text-gray-1200 font-inter text-sm font-medium">
                            {timeExtensionPeriod}
                          </p>
                        </div>
                        <div className="relative">
                          <input
                            id="amount"
                            type="number"
                            value={timeExtension}
                            onChange={(e) => {
                              setTimeExtension(e.target.value);
                            }}
                            className={`text-white bg-black-1300 placeholder:text-gray-1200 text-base w-full font-inter px-5 h-12 border border-solid ${isInvalidTimeExtension ? "border-red-500" : "border-gray-1100"} rounded-lg font-medium`}
                            autoComplete="off"
                            placeholder=""
                          />
                          <div className="absolute z-20 top-1/2 right-5 -translate-y-1/2 bg-black-1300 border-l border-solid border-gray-1100">
                            <div className="flex items-center gap-1.5 px-3 cursor-pointer font-inter text-base font-medium text-white py-1">
                              <p>{"mins"}</p>
                            </div>
                          </div>
                        </div>
                        {isInvalidTimeExtension && (
                          <p className="md:text-sm text-xs font-medium font-inter text-red-500 pt-2.5">
                            Please enter a valid time extension (must be between {timeExtensionPeriod})
                          </p>
                        )}
                        <ol className="flex items-center gap-4 pt-2.5 pb-10">
                          {(["5", "10", "15"] as const).map((duration) => (
                            <li key={duration} className="w-full">
                              <button
                                type="button"
                                onClick={() => setTimeExtension(duration)}
                                className={`rounded-[7px] cursor-pointer px-2.5 h-10 flex items-center justify-center text-sm font-semibold font-inter text-white w-full transition-colors ${
                                  timeExtension === duration
                                    ? "bg-primary-color text-black!"
                                    : "bg-[#1B1B21FA] hover:bg-primary-color/30 text-white"
                                }`}
                              >
                                {duration}
                              </button>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="w-full">
                        <div className="flex items-center justify-between pb-2.5">
                          <p className="text-gray-1200 font-inter text-sm font-medium">
                            Reserve Price
                          </p>
                        </div>
                        <div>
                          <div className="relative">
                            <input
                              id="amount"
                              type="number"
                              value={basePrice}
                              onChange={(e) => {
                                setBasePrice(e.target.value);
                              }}
                              className={`text-white bg-black-1300 placeholder:text-gray-1200 text-base w-full font-inter px-5 h-12 border border-solid ${isInvalidReservePrice ? "border-red-500" : "border-gray-1100"} rounded-lg font-medium`}
                              autoComplete="off"
                              placeholder="Enter Amount"
                            />
                            <div
                              ref={dropdownRef}
                              className="absolute z-20 top-1/2 right-5 -translate-y-1/2 bg-black-1300 border-l border-solid border-gray-1100"
                            >
                              <button
                                type="button"
                                className="flex items-center gap-1.5 px-3 cursor-pointer font-inter text-base font-medium text-white py-1"
                                onClick={toggleDropdown}
                              >
                                <p>{symbol}</p>
                                <span>
                                  <img
                                    src="/icons/down-arw.svg"
                                    alt="toggle"
                                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                  />
                                </span>
                              </button>

                              {isOpen && (
                                <ol className="absolute top-full right-0 w-full bg-black-1300 border border-gray-1100 rounded-md mt-3 z-10">
                                  {VerifiedTokens.map((token) => (
                                    <li key={token.symbol}>
                                      <button
                                        type="button"
                                        className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                        onClick={() =>
                                          handleSelect(
                                            token.address,
                                            token.symbol
                                          )
                                        }
                                      >
                                        {token.symbol}
                                      </button>
                                    </li>
                                  ))}
                                </ol>
                              )}
                            </div>
                          </div>
                          {isInvalidReservePrice && (
                            <p className="md:text-sm text-xs font-medium font-inter text-red-500 pt-2.5">
                              Please enter a valid reserve price (must be greater than 0)
                            </p>
                          )}
                        </div>
                        <p className="text-sm font-medium text-white py-2.5 font-inter">
                          Rent: {rentFee / 1e9} SOL
                        </p>
                      </div>
                    </div>


                   


                    <div>
                      <div className="mb-10 grid xl:grid-cols-2 gap-5 md:gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between gap-2.5">
                      <p className="text-sm font-medium text-white pb-2.5 font-inter">
                        Creation Fee: {creationFee / 1e9} SOL
                      </p>
                      <p className="text-sm font-medium text-white pb-2.5 font-inter">
                        Total Fee: {(creationFee + rentFee) / 1e9} SOL
                      </p></div>
                        <AgreeCheckbox
                          checked={agreedToTerms}
                          onChange={setAgreedToTerms}
                          />
                        </div>
                        <button
                          onClick={handleAuctionCreate}
                          disabled={!agreedToTerms || isCreatingAuction}
                          className={`mt-9 text-black cursor-pointer font-semibold hover:from-primary-color hover:to-primary-color hover:via-primary-color text-sm md:text-base leading-normal font-inter h-11 md:h-14 rounded-full inline-flex items-center justify-center w-full transition duration-500 hover:opacity-90 bg-primary-color ${
                            !agreedToTerms || isCreatingAuction
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {isCreatingAuction ? (
                            <Loader className="w-6 h-6 animate-spin" />
                          ) : (
                            "Create Auction"
                          )}
                        </button>
                      </div>
                      <div className="bg-black-1300 rounded-[20px] md:p-6 px-4 py-5">
                      <h4 className="text-primary-color font-bold text-base md:text-xl leading-normal mb-6">
                          Terms & Conditions
                        </h4>
                        <ul>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              1.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            An Auction is conducted through an open bidding process, where the highest bidder at the end of the auction becomes the winner.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              2.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            All bids are executed via blockchain transactions and cannot be canceled.
                            Only when a higher bid is placed will the previous bid amount be returned.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              3.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                              Refunds resulting from higher bids are processed automatically through on-chain logic.
The platform is not responsible for refund delays, fee deductions, or network-related issues.

                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                              <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              4.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            The on-chain state at the auction’s end constitutes the final and legally binding result.
                            UI display discrepancies have no legal effect.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              5.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            Network fees are not controlled by the platform and are non-refundable.

                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              6.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            The creator is fully responsible for the ownership, authenticity, and non-infringement of all assets listed in the auction.

                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              7.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            Upon finalization, escrowed assets are automatically transferred to the winning bidder.
                            The creator may not refuse or block the transfer.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              8.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            Primary responsibility for auction-related disputes lies with the creator.
                            The platform acts solely as a technical intermediary.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              9.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            A {creationFee / 1e9} SOL creation fee applies to auction creation and is non-refundable.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              10.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                            A {((auctionConfig?.commissionBps && (auctionConfig?.commissionBps / 10000) * 100) || 0)}% fee is deducted from participant payments and retained by the platform operator.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                              <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              11.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                              Once one Auction has sold, the machine cannot be
                              closed until the specified end date.
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
         {/* Verified Collections Modal */}
         <Transition appear show={isVerifiedCollectionsModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeVerifiedCollectionsModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="max-w-[962px] relative w-full transform overflow-hidden pt-5 pb-6 md:pb-[89px] rounded-[20px] bg-[#1B1B21FA] text-left align-middle shadow-xl transition-all">
                  <div className="flex md:gap-0 gap-5 md:items-center md:flex-row flex-col justify-between px-5 pb-5 md:pb-7 mb-7 border-b border-solid border-gray-1100">
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-white pb-3.5"
                      >
                        Verified Collections
                      </Dialog.Title>
                      <p className="text-sm font-medium font-inter text-white">
                        <Link to="." className=" text-primary-color">
                          Contact us
                        </Link>{" "}
                        to get your NFT verified
                      </p>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="relative md:w-auto w-full">
                      <FormInput
                          className="h-10 pl-[46px] rounded-[80px]"
                          placeholder="Search"
                          value={collectionSearchQuery}
                          onChange={(e) =>
                            setCollectionSearchQuery(e.target.value)
                          }
                        />
                        <span className="absolute top-1/2  z-10 left-3 -translate-y-1/2">
                          <img src="/icons/search-icon.svg" className='w-5 h-5' alt="" />
                        </span>
                      </div>
                      <button
                        type="button"
                        className="inline-flex cursor-pointer justify-center md:static absolute top-5 right-4 border border-transparent focus:outline-none focus-visible:ring-0"
                        onClick={closeVerifiedCollectionsModal}
                      >
                        <img src="/icons/cross-icon-2.svg" className='w-6' alt="" />
                      </button>
                    </div>
                  </div>
                  <div className="px-5">
                    <div className="w-full h-full flex items-center justify-center">
                    <ol className="w-full grid grid-cols-1 md:grid-cols-2  gap-5 place-items-center justify-center">
                        {filteredVerifiedCollections.length === 0 ? (
                          <li className="py-10 text-gray-500 font-medium">
                            No collections found
                          </li>
                        ) : (
                          filteredVerifiedCollections.map((collection) => (
                            <li key={collection.address} className="w-full bg-black rounded-lg border border-white hover:bg-white/5 flex items-center justify-start">
                              <Link
                                to={collection.url}
                                target="_blank"
                                className="rounded-lg text-center w-full gap-5 justify-start h-13 md:h-15 px-3.5 md:px-5 flex items-center text-sm md:text-base font-medium font-inter text-white border border-solid border-black/20"
                              >
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-50 border border-solid border-gray-300">
                                <img src={collection.image} alt={collection.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-sm md:text-base text-left font-medium font-inter text-white flex-2/3">
                                  {collection.name}
                                </span>
                              </Link>
                            </li>
                          ))
                        )}
                      </ol>
                    </div>
                   
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/*Prize Modal*/}
      <Dialog
              open={isPrizeModalOpen}
              as="div"
              className="relative z-50 focus:outline-none"
              onClose={handleClose}
            >
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/70">
                <div className="flex min-h-full items-center justify-center p-4">
                  <DialogPanel
                    transition
                    className="w-full max-w-[800px] rounded-2xl bg-black-1300 shadow-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                  >
                    {/* Header Close Button */}
                    <div className="flex items-center justify-end px-6 pt-6 pb-2">
                      <button
                        onClick={handleClose}
                        className="flex items-center justify-center w-10 h-10 rounded-full  border border-solid border-gray-400/30 cursor-pointer hover:bg-primary-color/40 transition duration-300"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M2 2L14 14M2 14L14 2"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
      
                    {/* Search Input */}
                    <div className="px-6 pb-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1 relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              stroke="#FFFFFF"
                            >
                              <path
                                d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                                stroke="#FFFFFF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search NFT name"
                            className="w-full h-14 pl-12 pr-4 rounded-xl border border-solid border-gray-400/30 bg-transparent text-white placeholder:text-white/50 font-medium focus:outline-none focus:border-primary-color transition"
                          />
                        </div>
                      </div>
                    </div>
      
                    {/* Table Header */}
                    <div className="px-11 pb-3">
                      <div className="grid grid-cols-[50px_1fr_150px] gap-4 text-left">
                        <span className="text-sm font-semibold text-gray-400">
                          NFT
                        </span>
                        <span className="text-sm font-semibold text-gray-400">
                          Title
                        </span>
                        <span className="text-sm font-semibold text-gray-400">
                          Floor Price
                        </span>
                      </div>
                    </div>
      
                    {/* List Body */}
                    <div className="px-6 pb-6 min-h-[40vh] max-h-[50vh] overflow-y-auto">
                      {isLoadingNfts ? (
                        <div className="flex items-center justify-center h-40">
                          <p className="text-gray-400 animate-pulse">
                            Loading items...
                          </p>
                        </div>
                      ) : filteredNfts.length === 0 ? (
                        <div className="flex items-center justify-center h-40">
                          <p className="text-xl font-semibold text-gray-400">
                            No NFTs found
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {filteredNfts.map((nft: any) => {
                            const isSelected = selectedNftId === nft.id;
                            return (
                              <div
                                key={nft.id}
                                onClick={() => handleSelectNft(nft.id)}
                                className={clsx(
                                  "relative grid grid-cols-[50px_1fr_150px] gap-4 items-center p-4 rounded-xl cursor-pointer transition duration-200",
                                  isSelected
                                    ? "bg-primary-color/60 border-2 border-primary-color"
                                    : "bg-gray-1300/10 border border-gray-800 hover:bg-primary-color/60"
                                )}
                              >
                                <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-800 flex-shrink-0">
                                  <img
                                    src={nft.image}
                                    alt={nft.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        "/images/placeholder-nft.png";
                                    }}
                                  />
                                </div>
      
                                <div className="font-medium text-white truncate">
                                  {nft.name}
                                </div>
      
                                <div className="font-semibold text-white">
                                  {nft.floorPrice && nft.floorPrice > 0 ? (nft.floorPrice/10**9).toFixed(5) : "0.00"} SOL
                                </div>
      
                                {isSelected && (
                                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                      <svg
                                        width="14"
                                        height="10"
                                        viewBox="0 0 14 10"
                                        fill="none"
                                      >
                                        <path
                                          d="M1 5L5 9L13 1"
                                          stroke="white"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
      
                    {/* Footer Action */}
                    <div className="px-6 py-5 border-t flex items-center justify-between flex-col border-gray-400/30">
                      <button
                        onClick={handleAddPrizes}
                        disabled={!selectedNftId}
                        className={clsx(
                          "w-[50%] h-14 rounded-full font-semibold text-lg transition duration-300",
                          selectedNftId
                            ? "bg-primary-color text-black hover:shadow-lg cursor-pointer"
                            : "bg-primary-color/40 text-black-1000 cursor-not-allowed"
                        )}
                      >
                        Confirm NFT
                      </button>
                    </div>
                  </DialogPanel>
                </div>
              </div>
            </Dialog>
  </div>
}
