import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface SortOption {
  label: string;
  value: string;
}

interface SortDropdownProps {
  options: SortOption[];
  selected: string;
  onChange: (value: string) => void;
}

export default function SortDropdown({ options, selected, onChange }: SortDropdownProps) {
  return (
    <Menu as="div" className="relative inline-block group text-left">
      {({ open }) => (
        <>
          <Menu.Button
            className={`text-base md:px-5 px-0 py-3 md:w-auto w-10 h-10 md:h-12 cursor-pointer outline-0 font-medium font-inter transition duration-200 rounded-full border inline-flex items-center justify-center gap-2
              ${open ? 'border-primary-color lg:bg-transparent bg-orange-1000 text-primary-color' : 'border-gray-1200 text-gray-1200'}
              hover:border-primary-color group-hover:text-primary-color`}>
            <span className="flex items-center transition duration-200 text-gray-1200 group-hover:text-primary-color gap-2">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`${open ? 'text-primary-color' : ''}`}
              >
                <path
                  d="M16 18L16 6M16 6L20 10.125M16 6L12 10.125"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 6L8 18M8 18L12 13.875M8 18L4 13.875"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="md:block hidden">{'Sort'}</span>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute z-30 overflow-hidden md:right-0 -right-16 mt-2 w-[290px] origin-top-right bg-black-1000 dark:bg-black-1500 dark:border-black-900 rounded-xl shadow-lg focus:outline-none">
              {options.map(option => (
                <Menu.Item key={option.value}>
                  {({ active }) => (
                    <button
                      onClick={() => onChange(option.value)}
                      className={`${active ? "bg-primary-color text-black-1000" : "text-white"
                        } w-full text-left px-4 py-3 text-sm transition flex items-center justify-between ${selected === option.value ? "bg-primary-color text-black-1000!" : "text-white!"}`} >
                      <span className="flex items-center justify-between w-full">
                        {option.label}
                        {selected !== option.value ? (
                          <span className="flex items-center justify-center">
                            <svg
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2 8C2 4.68629 4.68629 2 8 2H16C19.3137 2 22 4.68629 22 8V16C22 19.3137 19.3137 22 16 22H8C4.68629 22 2 19.3137 2 16V8Z"
                                stroke="#E9E9E9"
                                strokeWidth="1.5"
                              />
                            </svg>


                          </span>
                        ) :
                          <span className="flex items-center justify-center">

                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="white"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_298_6257)">
                            <path
                              d="M0 7.2C0 3.22355 3.22355 0 7.2 0H16.8C20.7764 0 24 3.22355 24 7.2V16.8C24 20.7764 20.7764 24 16.8 24H7.2C3.22355 24 0 20.7764 0 16.8V7.2Z"
                              fill="#FFD400"
                            />
                            <path
                              d="M8.0625 12.5625L10.6875 15.1875L15.9375 9.5625"
                              stroke="black"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_298_6257">
                              <rect width={24} height={24} fill="white" />
                            </clipPath>
                          </defs>
                        </svg>





                          </span>
                        }
                      </span>
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
