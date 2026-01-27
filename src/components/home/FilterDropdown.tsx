import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  options: FilterOption[];
  selected: string;
  onChange: (value: string) => void;
}

export default function FilterDropdown({
  options,
  selected,
  onChange,
}: FilterDropdownProps) {
  return (
    <Menu as="div" className="relative inline-block group text-left">
        {({ open }) => (
        <>
        
       <Menu.Button
          className={`px-5 py-3 h-12 text-base cursor-pointer font-inter font-medium outline-0 transition duration-200 rounded-full border inline-flex items-center gap-2
              ${open ? 'border-primary-color text-black-1000' : 'border-gray-1100 text-gray-1200'}
              hover:border-primary-color group-hover:text-black-1000`}>
            <span className="flex items-center transition duration-200 text-black-1000 group-hover:text-primary-color gap-2">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                  className={`${open ? 'text-primary-color' : ''}`}
              >
                <path
                  d="M3 6.375H21M6.37493 12H17.6249M10.8749 17.625H13.1249"
                   stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

            </span>
              <span>{'Filter'}</span>
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
        <Menu.Items className="absolute z-30 overflow-hidden right-0 mt-2 w-[290px] origin-top-right bg-white dark:bg-black-1500 dark:border-black-900 rounded-b-xl shadow-lg focus:outline-none">
          {options.map(option => (
            <Menu.Item key={option.value}>
              {({ active }) => (
                <button
                  onClick={() => onChange(option.value)}
                     className={`${
                    active ? "bg-gray-1500 dark:bg-black-1000" : ""
                  } w-full text-left px-4 py-2 text-sm transition flex items-center justify-between ${selected === option.value ? "bg-orange-1000" : ""}`} >
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
                          width={22}
                          height={22}
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.75 0C3.02208 0 0 3.02208 0 6.75V14.75C0 18.4779 3.02208 21.5 6.75 21.5H14.75C18.4779 21.5 21.5 18.4779 21.5 14.75V6.75C21.5 3.02208 18.4779 0 14.75 0H6.75ZM15.2803 8.7803C15.5732 8.48742 15.5732 8.01255 15.2803 7.71966C14.9874 7.42676 14.5126 7.42676 14.2197 7.71966L9.5934 12.3459C9.4958 12.4435 9.3375 12.4435 9.2399 12.3459L7.28033 10.3863C6.98744 10.0934 6.51256 10.0934 6.21967 10.3863C5.92678 10.6792 5.92678 11.1541 6.21967 11.447L8.17923 13.4065C8.8626 14.09 9.9707 14.09 10.6541 13.4065L15.2803 8.7803Z"
                            fill="#F08409"
                          />
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
