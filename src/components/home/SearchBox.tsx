import { useState, useEffect, useCallback } from "react";

interface SearchBoxProps {
  placeholder?: string;
  onSearch: (value: string) => void;
}

export default function SearchBox({
  placeholder = "Search raffles, Gumballs, etc...",
  onSearch,
}: SearchBoxProps) {
  const [query, setQuery] = useState("");

  const debouncedSearch = useCallback((value: string) => {
    onSearch(value);
  }, [onSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, debouncedSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="flex-1">
      <form onSubmit={handleSubmit} className="w-full ml-auto max-w-[398px]">
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
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 w-full placeholder:text-gray-1200 text-gray-1200 text-sm md:text-base outline-none bg-transparent"
            placeholder={placeholder}
          />
        </label>
      </form>
    </div>
  );
}
