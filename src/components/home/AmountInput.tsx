import { useState, useRef, useEffect } from "react";
import { useAmountStore } from "../../../store/globalStore";

export default function AmountInput() {
  const { amount, currency, setAmount, setCurrency } = useAmountStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (value: string) => {
    setCurrency(value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <input
        id="amount"
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="text-white bg-black-1300 focus:outline-0 focus:border-primary-color placeholder:text-gray-1200 text-base w-full font-inter px-5 h-12 border border-solid border-gray-1100 rounded-lg font-medium"
        placeholder="Enter Amount"
      />
      <div
        ref={dropdownRef}
        className="absolute z-20 top-1/2 right-2 -translate-y-1/2 bg-black-1300 border-l border-solid border-gray-1100"
      >
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 cursor-pointer font-inter text-base font-medium text-white py-1"
          onClick={toggleDropdown}
        >
          <p>{currency}</p>
          <span>
            <img
              src="/icons/arrow-icon-2.svg"
              alt="toggle"
              className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </span>
        </button>

        {isOpen && (
          <ol className="absolute top-full right-0 w-full overflow-hidden bg-black-1300 rounded-md mt-3 z-10">
            {["SOL", "BTC", "DODGE", "BNB"].map((coin) => (
              <li key={coin}>
                <button
                  type="button"
                  className="w-full text-left px-3 font-semibold text-sm text-white py-2 hover:bg-primary-color/20 hover:text-white"
                  onClick={() => handleSelect(coin)}
                >
                  {coin}
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
