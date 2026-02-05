import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";

export interface OptionType {
  label: number | string;
  value: string;
}

interface DropdownProps {
  options: OptionType[];
  value?: OptionType | null;     
  placeholder?: string;
  onChange?: (value: OptionType) => void;
  className?: string;
}

export default function Dropdown({
  options,
  value = null,
  placeholder = "Select option...",
  onChange,
  className,
}: DropdownProps) {
  const [selected, setSelected] = useState<OptionType | null>(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleChange = (val: OptionType) => {
    setSelected(val);
    onChange?.(val);
  };

  return (
    <div className={clsx("relative md:w-auto w-full", className)}>
      <Listbox value={selected as OptionType} onChange={handleChange}>
        {({ open }) => (
          <>
            <ListboxButton
              className={clsx(
                "relative block w-full transition duration-300 cursor-pointer rounded-full md:py-3 py-2 md:pr-12 pr-8 pl-5 h-12 outline outline-gray-1100",
                "text-left font-inter font-medium md:text-base text-sm",
                open && ""
              )}
            >
              {selected ? (
                <span className="text-white">{selected.label}</span>
              ) : (
                <span className="text-white">{placeholder}</span>
              )}

              <span
                className="pointer-events-none absolute top-4 right-5 size-5"
                aria-hidden="true"
              >
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.6693 6L8.0026 10.6667L3.33594 6"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </ListboxButton>

            <ListboxOptions
              anchor="bottom"
              transition
              className={clsx(
                "w-fit  z-30 shadow-lg max-h-[400px]! rounded-b-[10px] overflow-hidden bg-black-1400",
                "[--anchor-gap:--spacing(1)] focus:outline-none",
                "transition duration-100 ease-in data-leave:data-closed:opacity-0"
              )}
            >
              {options.map((option) => (
                <ListboxOption
                  key={option.label}
                  value={option}
                  className={clsx(
                    "group flex cursor-default transition font-inter font-medium duration-300",
                    "data-[selected]:bg-primary-color data-[selected]:text-black-1300",
                    "data-[focus]:bg-primary-color/50",
                    "items-center gap-2 text-white px-6 py-3 select-none"
                  )}
                >
                  {option.label}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </>
        )}
      </Listbox>
    </div>
  );
}
