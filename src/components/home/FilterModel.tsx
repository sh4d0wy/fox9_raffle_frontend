import { Button, Dialog, DialogPanel } from "@headlessui/react";
import { useMemo } from "react";
import { PrimaryButton } from "../ui/PrimaryButton";
import { SecondaryButton } from "../ui/SecondaryButton";
import { RadioGroup } from "../ui/RadioGroup";
import SelectOption from "../ui/SelectOption";
import FormInput from "../ui/FormInput";
import DateSelector from "../ui/DateSelector";
import TimeSelector from "../ui/TimeSelector";
import { useFiltersStore } from "../../../store/filters-store";
import { VerifiedTokens } from "../../utils/verifiedTokens";
import { VerifiedNftCollections } from "../../utils/verifiedNftCollections";

const tokenOptions = VerifiedTokens.map((token, index) => ({
  id: index + 1,
  name: token.symbol,
  image: token.image,
}));

const collectionOptions = VerifiedNftCollections.map((collection, index) => ({
  id: index + 1,
  name: collection.name,
  image: collection.image,
}));

const parseTimeString = (timeStr: string) => {
  if (!timeStr) return { hour: "12", minute: "00", period: "PM" as const };
  const parts = timeStr.split(":");
  if (parts.length < 2) return { hour: "12", minute: "00", period: "PM" as const };
  
  let hour = parseInt(parts[0]) || 12;
  const minute = parts[1]?.substring(0, 2) || "00";
  const period: "AM" | "PM" = hour >= 12 ? "PM" : "AM";
  
  if (hour > 12) hour = hour - 12;
  if (hour === 0) hour = 12;
  
  return {
    hour: String(hour).padStart(2, "0"),
    minute: minute.padStart(2, "0"),
    period,
  };
};

const formatTimeToString = (hour: string, minute: string, period: "AM" | "PM") => {
  let hour24 = parseInt(hour) || 12;
  if (period === "PM" && hour24 !== 12) hour24 += 12;
  if (period === "AM" && hour24 === 12) hour24 = 0;
  return `${String(hour24).padStart(2, "0")}:${minute}`;
};

const parseDateString = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

const formatDateToString = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function FilterModal() {
  const {
    isFilterOpen,
    setFilterOpen,
    pageType,
    raffleType,
    setRaffleType,
    selectedToken,
    setSelectedToken,
    selectedCollection,
    setSelectedCollection,
    floorMin,
    floorMax,
    setFloorMin,
    setFloorMax,
    endTimeAfter,
    endTimeBefore,
    setEndTimeAfter,
    setEndTimeBefore,
    applyFilters,
    resetFilters,
  } = useFiltersStore();
  const showRaffleType = pageType === "raffles";


  
  const open = () => setFilterOpen(true);
  const close = () => setFilterOpen(false);

  const handleApply = () => {
    applyFilters();
  };

  const handleCancel = () => {
    close();
  };

  const handleReset = () => {
    resetFilters();
    close();
  };

  const endTimeAfterDate = useMemo(() => parseDateString(endTimeAfter.date), [endTimeAfter.date]);
  const endTimeBeforeDate = useMemo(() => parseDateString(endTimeBefore.date), [endTimeBefore.date]);

  const endTimeAfterParsed = useMemo(() => parseTimeString(endTimeAfter.time), [endTimeAfter.time]);
  const endTimeBeforeParsed = useMemo(() => parseTimeString(endTimeBefore.time), [endTimeBefore.time]);

  const handleAfterDateChange = (date: Date | null) => {
    setEndTimeAfter(formatDateToString(date), endTimeAfter.time);
  };

  const handleAfterTimeChange = (hour: string, minute: string, period: "AM" | "PM") => {
    setEndTimeAfter(endTimeAfter.date, formatTimeToString(hour, minute, period));
  };

  const handleBeforeDateChange = (date: Date | null) => {
    setEndTimeBefore(formatDateToString(date), endTimeBefore.time);
  };

  const handleBeforeTimeChange = (hour: string, minute: string, period: "AM" | "PM") => {
    setEndTimeBefore(endTimeBefore.date, formatTimeToString(hour, minute, period));
  };

  return (
    <>
      <Button
        onClick={open}
        className="md:px-5 py-3 md:w-auto text-gray-1200 hover:text-primary-color hover:border-primary-color transition duration-200 justify-center h-10 md:h-12 w-10 group text-base cursor-pointer font-inter font-medium rounded-full border inline-flex items-center gap-2 border-gray-1100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          className="group-hover:text-primary-color text-gray-1200"
        >
          <path
            d="M3 6.375H21M6.37493 12H17.6249M10.8749 17.625H13.1249"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="md:block hidden">Filter</span>
      </Button>

      <Dialog
        open={isFilterOpen}
        as="div"
        className="relative z-10 bg-black/80"
        onClose={close}>
        <div className="fixed inset-0 w-screen overflow-y-auto bg-black/80">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="w-full max-w-[896px] rounded-xl bg-black-1300">
              <div className="flex items-center justify-between border-b px-[22px] pt-6 pb-4">
                <h4 className="text-lg text-white font-semibold">Filter</h4>
                <button onClick={close} className="cursor-pointer">
                  <img src="/icons/cross-icon-gray.svg" alt="close" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 px-4 md:px-5 border-b border-gray-1100">
                <div className="py-[30px] md:border-r border-gray-1100">
                  {showRaffleType && (
                    <RadioGroup
                      name="raffles"
                      value={raffleType}
                      onChange={setRaffleType}
                      options={[
                        { label: "Token Raffles", value: "token" },
                        { label: "NFT Raffles", value: "nft" },
                      ]}
                    />
                  )}

                  <div className={`md:space-y-5 space-y-3 ${showRaffleType ? "pt-10 md:pt-[42px]" : ""} md:pr-7`}>
                    <SelectOption
                      label="Token"
                      placeholder="Select token"
                      options={tokenOptions}
                      value={selectedToken}
                      onChange={setSelectedToken}
                    />

                    <SelectOption
                      label="Collection"
                      placeholder="Select collection"
                      options={collectionOptions}
                      value={selectedCollection}
                      onChange={setSelectedCollection}
                    />

                    <div className="grid grid-cols-2 gap-2.5">
                      <FormInput
                        label="Floor"
                        placeholder="Min"
                        value={floorMin}
                        onChange={(e) => setFloorMin(e.target.value)}
                      />
                      <FormInput
                        placeholder="Max"
                        value={floorMax}
                        onChange={(e) => setFloorMax(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="md:pt-[30px] md:pl-7">
                  <h4 className="text-base font-inter font-semibold text-white">End time</h4>

                  <div className="md:space-y-5 space-y-3 md:pt-[42px] pt-5 md:pb-0 pb-[30px]">
                    <div className="grid grid-cols-2 md:flex lg:flex-row flex-row md:flex-col items-end md:gap-x-5 gap-y-5 gap-x-2.5">
                      <DateSelector
                        label="After"
                        value={endTimeAfterDate}
                        onChange={handleAfterDateChange}
                      />
                      <TimeSelector
                        hour={endTimeAfterParsed.hour}
                        minute={endTimeAfterParsed.minute}
                        period={endTimeAfterParsed.period}
                        onTimeChange={handleAfterTimeChange}
                        hasValue={!!endTimeAfter.time}
                      />
                    </div>

                    <div className="grid grid-cols-2 md:flex lg:flex-row flex-row md:flex-col items-end md:gap-x-5 gap-y-5 gap-x-2.5">
                      <DateSelector
                        label="Before"
                        value={endTimeBeforeDate}
                        onChange={handleBeforeDateChange}
                      />
                      <TimeSelector
                        hour={endTimeBeforeParsed.hour}
                        minute={endTimeBeforeParsed.minute}
                        period={endTimeBeforeParsed.period}
                        onTimeChange={handleBeforeTimeChange}
                        hasValue={!!endTimeBefore.time}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3.5 pb-[18px] px-5 flex items-center justify-between md:justify-end gap-5">
                <SecondaryButton className="md:w-auto w-full justify-center" onclick={handleReset} text="Reset" />
                <SecondaryButton className="md:w-auto w-full justify-center" onclick={handleCancel} text="Cancel" />
                <PrimaryButton
                  onclick={handleApply}
                  text="Apply"
                  className="md:w-auto text-sm px-[30px] w-full"
                />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
