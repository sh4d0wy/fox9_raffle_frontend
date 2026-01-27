import { Button, Dialog, DialogPanel } from "@headlessui/react";
import { PrimaryButton } from "../ui/PrimaryButton";
import { SecondaryButton } from "../ui/SecondaryButton";
import { RadioGroup } from "../ui/RadioGroup";
import SelectOption from "../ui/SelectOption";
import FormInput from "../ui/FormInput";
import DateSelector from "../ui/DateSelector";
import TimeSelector from "../ui/TimeSelector";
import { useFiltersStore } from "../../../store/filters-store";


interface PersonOption {
  id: number;
  name: string;
}

const tokenOptions: PersonOption[] = [
  { id: 1, name: "ETH" },
  { id: 2, name: "BTC" },
  { id: 3, name: "USDT" },
  { id: 4, name: "SOL" },
  { id: 5, name: "BNB" },
];

const collectionOptions: PersonOption[] = [
  { id: 1, name: "CryptoPunks" },
  { id: 2, name: "BAYC" },
  { id: 3, name: "Azuki" },
  { id: 4, name: "Moonbirds" },
  { id: 5, name: "Doodles" },
];



export default function FilterModal() {
  const {
    isFilterOpen,
    setFilterOpen,

    raffleType,
    setRaffleType,

    setSelectedToken,

    setSelectedCollection,

    floorMin,
    floorMax,
    setFloorMin,
    setFloorMax,

    tierMin,
    tierMax,
    setTierMin,
    setTierMax,

    endTimeAfter,
    endTimeBefore,
    setEndTimeAfter,
    setEndTimeBefore,

  } = useFiltersStore();



  const open = () => setFilterOpen(true);
  const close = () => setFilterOpen(false);

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

                  <RadioGroup
                    name="raffles"
                    value={raffleType}
                    onChange={setRaffleType}
                    options={[
                      { label: "Token Raffles", value: "token" },
                      { label: "NFT Raffles", value: "nft" },
                    ]}
                  />

                  <div className="md:space-y-5 space-y-3 pt-10 md:pt-[42px] md:pr-7">
                    <SelectOption
                      label="Token"
                      placeholder="Select token"
                      options={tokenOptions}
                      onChange={setSelectedToken}
                    />

                    <SelectOption
                      label="Collection"
                      placeholder="Select collection"
                      options={collectionOptions}
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

                    <div className="grid grid-cols-2 gap-2.5">
                      <FormInput
                        label="Tier"
                        placeholder="Min"
                        value={tierMin}
                        onChange={(e) => setTierMin(e.target.value)}
                      />
                      <FormInput
                        placeholder="Max"
                        value={tierMax}
                        onChange={(e) => setTierMax(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="md:pt-[30px] md:pl-7">
                  <h4 className="text-base font-inter font-semibold text-black-1000">End time</h4>

                  <div className="md:space-y-5 space-y-3 md:pt-[42px] pt-5 md:pb-0 pb-[30px]">
                    <div className="grid grid-cols-2 md:flex lg:flex-row flex-row md:flex-col items-end md:gap-x-5 gap-y-5 gap-x-2.5">
                      <DateSelector
                        label="After"
                        value={endTimeAfter.date}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEndTimeAfter(e.target.value, endTimeAfter.time)
                        } />

                      <TimeSelector
                        value={endTimeAfter.time}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEndTimeAfter(endTimeAfter.date, e.target.value)
                        } />
                    </div>

                    <div className="grid grid-cols-2 md:flex lg:flex-row flex-row md:flex-col items-end md:gap-x-5 gap-y-5 gap-x-2.5">
                      <DateSelector
                        label="Before"
                        value={endTimeBefore.date}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEndTimeBefore(e.target.value, endTimeBefore.time)
                        } />
                      <TimeSelector
                        value={endTimeBefore.time}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEndTimeBefore(endTimeBefore.date, e.target.value)
                        } />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3.5 pb-[18px] px-5 flex items-center justify-between md:justify-end gap-5">
                <SecondaryButton className="md:w-auto w-full justify-center" onclick={close} text="Cancel" />
                <PrimaryButton
                  onclick={close}
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
