import { useState, useRef, useEffect } from "react";

export default function GumballPriceInput() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("SOL");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currencies = ["SOL", "BTC", "DODGE", "BNB"];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-2.5">
        <p className="text-gray-1200 font-inter text-sm font-medium">Gumball price</p>
      </div>

      <div className="relative">
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="text-black-1000 outline outline-gray-1100 rounded-lg focus:outline-primary-color placeholder:text-gray-1200 text-base w-full font-inter px-5 h-12 font-medium"
          placeholder="Enter Amount"
        />

        <div ref={dropdownRef} className="absolute z-30 top-1/2 right-5 -translate-y-1/2">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 cursor-pointer font-inter text-base font-medium text-white  px-2.5 border-l border-solid border-gray-1100 rounded-r-md h-12"
          >
            <p>{currency}</p>
            <img src="/icons/down-arw.svg" className="invert" alt="arrow" />
          </button>

          {open && (
            <ol className="absolute right-0 mt-1 bg-black-1300 shadow-lg rounded-md overflow-hidden z-10 w-20">
              {currencies.map((cur) => (
                <li key={cur}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-primary-color/20 font-inter text-sm text-white"
                    onClick={() => {
                      setCurrency(cur);
                      setOpen(false);
                    }}
                  >
                    {cur}
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
