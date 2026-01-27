import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

export const AdvancedSettings = () => {
  return (
    <div className="mb-10 border border-solid border-gray-1100 bg-black-1300 rounded-[10px] md:pt-[27px] pt-6 md:px-6 px-4 pb-6">
      <Disclosure defaultOpen>
        <div>
          <DisclosureButton className="group flex items-center cursor-pointer justify-between w-full">
            <p className="text-white md:text-base text-sm font-medium font-inter">
              Advanced settings
            </p>

            <span className="transition-transform duration-200 group-data-open:rotate-180">
              <img src="/icons/arrow-icon-2.svg" className="w-5 h-5" alt="" />
            </span>
          </DisclosureButton>

          <DisclosurePanel className="pt-6">
            <div className="pb-[18px]">
              <div className="flex items-center gap-8 justify-between pb-2.5">
                <p className="text-gray-1200 font-inter sm:text-sm text-xs font-medium">
                  Holder only mode (+1 SOL charge)
                </p>
                <p className="text-gray-1200 font-inter sm:text-sm text-xs font-medium">
                  Min: 3 / Max: 10,000
                </p>
              </div>

              <input
                id="adv"
                type="text"
                className="text-black-1000  outline outline-gray-1100 rounded-lg focus:outline-primary-color placeholder:text-gray-1200 md:text-base text-sm w-full font-inter md:px-5 px-[14px] h-12 font-medium"
                placeholder="Enter Collection key or first creator address"
              />
            </div>

            <button
              type="button"
              className="text-white group transition hover:bg-black-1000 hover:text-white cursor-pointer font-medium text-sm font-inter inline-flex items-center justify-center h-8 border border-solid border-gray-1100 rounded-full px-3.5 gap-2.5"
            >
              <span className="flex items-center justify-center w-6 h-6">
                <img src="/icons/plus.svg" className="invert" alt="" />
              </span>
              Add another collection
            </button>
          </DisclosurePanel>
        </div>
      </Disclosure>
    </div>
  );
};
