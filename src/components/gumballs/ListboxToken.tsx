import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import FormInput from "../ui/FormInput";

export interface OptionType {
  label: number | string;
  value: string;
  img?: string;
}

interface ListboxTokenProps {
  options: OptionType[];
  value?: OptionType | null;
  placeholder?: string;
  onChange?: (value: OptionType) => void;
  className?: string;
}

export default function ListboxToken({
  options,
  value = null,
  placeholder = "Select token",
  onChange,
  className,
}: ListboxTokenProps) {
  const [selected, setSelected] = useState<OptionType | null>(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleChange = (val: OptionType) => {
    setSelected(val);
    onChange?.(val);
  };

  return (
    <div>
    <div className={clsx("relative md:flex-1 w-full", className)}>
      <Listbox value={selected as OptionType} onChange={handleChange}>
        {({ open }) => (
          <>
            <ListboxButton
              className={clsx(
                "relative block w-full transition duration-300 hover:outline-primary-color cursor-pointer rounded-xl md:pr-12 pr-8 pl-3 h-12 outline outline-gray-1100",
                "text-left font-inter font-medium md:text-base text-sm",
                open && "outline-primary-color"
              )}
            >
              {selected ? (
                <span className="flex items-center gap-2 text-white">
                  {selected.img && (
                    <img
                      src={selected.img}
                      alt={selected.value}
                      className="w-[34px] h-[34px] rounded-xl object-cover"
                    />
                  )}
                  {selected.value}
                </span>
              ) : (
                <span className="text-gray-1200">{placeholder}</span>
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
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </ListboxButton>

            <ListboxOptions
              portal={false}
              anchor="bottom start"
              transition
              className={clsx(
                "w-[--button-width] min-w-[450px] max-w-[--button-width] z-30 shadow-lg max-h-[500px] rounded-b-[10px] overflow-hidden bg-black-1300",
                "[--anchor-gap:--spacing(1)] focus:outline-none",
                "transition duration-100 ease-in data-leave:data-closed:opacity-0"
              )}
            >
              {options.map((option) => (
                <ListboxOption
                  key={option.label}
                  value={option}
                  className={clsx(
                    "group flex cursor-default transition placeholder:text-white text-white font-inter font-medium duration-300 items-center gap-3 px-6 py-3 select-none",
                    "data-selected:bg-primary-color data-selected:text-black-1000",
                    "data-focus:bg-primary-color/20"
                  )}
                >
                  {option.img && (
                    <img
                      src={option.img}
                      alt={option.value}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  )}
                  {option.value}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </>
        )}
      </Listbox>
    </div>
              <div className="grid grid-cols-2 mt-5 gap-5">
              <div>
                <label
                  htmlFor="price"
                  className="text-gray-1200 text-sm font-medium font-inter pb-2.5 block"
                >
                  Prize Size
                </label>
                <FormInput
                  className="placeholder:text-gray-1200! text-black-1000"
                  placeholder="Min"
                ></FormInput>
              </div>
              <div>
                <label
                  htmlFor="prize-num"
                  className="text-gray-1200 text-sm font-medium font-inter pb-2.5 block"
                >
                  Number Of Prizes
                </label>
                <FormInput
                  className="placeholder:text-gray-1200! text-black-1000"
                  placeholder="Min"
                ></FormInput>
              </div>
            </div>
            </div>
  );
}
