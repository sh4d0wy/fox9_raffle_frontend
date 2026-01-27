import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";

interface SelectOptionProps<T extends { id: number | string; name: string }> {
  label?: string;
  options: T[];
  value?: T | null;
  placeholder?: string;
  onChange?: (value: T | null) => void;
  className?: string;
}

export default function SelectOption<T extends { id: number | string; name: string }>({
  label = "Select",
  options,
  value = null,
  placeholder = "Select option...",
  onChange,
  className,
}: SelectOptionProps<T>) {
  const [selected, setSelected] = useState<T | null>(value);

  const handleChange = (val: T) => {
    setSelected(val);
    onChange?.(val);
  };

  return (
    <div className={clsx("relative w-full", className)}>
      {label && (
        <label className="text-sm text-gray-1200 font-medium font-inter mb-2.5 block">
          {label}
        </label>
      )}

      <Listbox value={selected ?? undefined} onChange={handleChange}>
        {({ open }) => (
          <>
            <ListboxButton
              className={clsx(
                "relative block w-full bg-black-1300 rounded-lg py-3 pr-8 pl-5 h-12 outline outline-gray-1100",
                "text-left font-inter font-medium text-base",
                open && "outline-primary-color"
              )}
            >
              {selected ? (
                <span className="text-white">{selected.name}</span>
              ) : (
                <span className="text-gray-1200">{placeholder}</span>
              )}

              <span
                className="pointer-events-none absolute top-4 right-5 size-4"
                aria-hidden="true"
              >
                <svg
                  width={16}
                  height={16}
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
              className={clsx(
                "z-30 shadow-lg absolute w-full mt-1 rounded-b-[10px] overflow-hidden bg-black-1100",
                "focus:outline-none transition duration-100 ease-in"
              )}
            >
              {options.map((option) => (
                <ListboxOption
                  key={option.id}
                  value={option}
                  className={clsx(
                    "group flex cursor-default transition font-inter font-medium duration-300",
                    "data-[selected]:bg-primary-color text-white data-[selected]:text-black-1000",
                    "data-[focus]:bg-primary-color/10",
                    "items-center gap-2 px-5 py-2 select-none"
                  )}
                >
                  {option.name}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </>
        )}
      </Listbox>
    </div>
  );
}
