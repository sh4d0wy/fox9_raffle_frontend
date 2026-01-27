import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

const currencies = ["SOL", "BTC", "DOGE", "BNB"];

export default function AmountWithDropdown() {
  const [selected, setSelected] = useState(currencies[0]);

  return (
    <div className="relative">
      <input
        id="amount"
        type="text"
        className="text-black-1000 focus:border-primary-color bg-black-1300 focus:outline-0 placeholder:text-gray-1200 text-base w-full font-inter px-5 h-12 border border-solid border-gray-1100 rounded-lg font-medium"
        placeholder="Enter Amount"
      />

      <div className="absolute z-20 top-1/2 bg-black-1300 right-5 border-l border-solid border-gray-1100 pl-2.5 -translate-y-1/2">
        <Listbox value={selected} onChange={setSelected}>
          <div className="relative">
            <Listbox.Button className="flex items-center gap-1.5 cursor-pointer font-inter text-base font-medium text-white">
              <p>{selected}</p>
              <img src="/icons/arrow-icon-3.svg" alt="" />
            </Listbox.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-150"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute right-0 mt-2 w-28 bg-black-1400 shadow-lg rounded-lg py-1 z-20">
                {currencies.map((cur) => (
                  <Listbox.Option
                    key={cur}
                    value={cur}
                    className="cursor-pointer px-4 py-2 text-sm font-medium text-white hover:bg-primary-color/20"
                  >
                    {cur}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </div>
  );
}
