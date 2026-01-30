import { useState, useEffect, useCallback } from "react";

interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onSearch: (value: string) => void;
}

export default function SearchBox({
  placeholder = "Search raffles, Gumballs, etc...",
  value,
  onSearch,
}: SearchBoxProps) {
  const [internalQuery, setInternalQuery] = useState("");
  
  const isControlled = value !== undefined;
  const query = isControlled ? value : internalQuery;

  useEffect(() => {
    if (isControlled) {
      setInternalQuery(value);
    }
  }, [value, isControlled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalQuery(newValue);
    }
    onSearch(newValue);
  };
  return (
    <div className="flex-1">
      <form className="w-full ml-auto max-w-[398px]">
        <label
          htmlFor="search"
          className="inline-flex border border-gray-1200 rounded-full h-12 px-3 pr-3 md:pr-5 md:px-5 p-2 md:py-3
             overflow-hidden w-full items-center gap-2.5
             focus-within:border-primary-color"
        >
          <img src="/icons/search-icon.svg" alt="Search Icon" />

          <input
            type="text"
            id="search"
            name="search"
            value={query}
            onChange={handleChange}
            className="flex-1 w-full placeholder:text-gray-1200 text-gray-1200 text-sm md:text-base outline-none bg-transparent"
            placeholder={placeholder}
          />
        </label>
      </form>
    </div>
  );
}
