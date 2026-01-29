import { useState, useRef, useEffect, useMemo } from "react";
import { useCreateRaffleStore } from "../../../store/createRaffleStore";
import { VerifiedTokens, WRAPPED_SOL_MINT, NATIVE_SOL_MINT } from "@/utils/verifiedTokens";
import { useGetTokenPrice } from "hooks/useGetTokenPrice";
import { ChevronDownIcon } from "lucide-react";

export default function AmountInput() {
  const { ticketPrice, supply,ticketCurrency,ticketPricePerSol, getComputedTTV,setTicketPrice, setTicketCurrency, setTicketPricePerSol } = useCreateRaffleStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const ticketTokenMintForPrice = ticketCurrency.address === NATIVE_SOL_MINT ? WRAPPED_SOL_MINT : ticketCurrency.address;
  const { data: ticketTokenPrice } = useGetTokenPrice(ticketTokenMintForPrice);
  const { data: solPrice } = useGetTokenPrice(WRAPPED_SOL_MINT);
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (value: string) => {
    setTicketCurrency(VerifiedTokens.find((token) => token.symbol === value) || { symbol: "", address: "" });
    setIsOpen(false);
  };

  useEffect(() => {
    if (ticketPrice && ticketTokenPrice?.price && solPrice?.price) {
      setTicketPricePerSol((parseFloat(ticketPrice) * (ticketTokenPrice.price / solPrice.price)).toFixed(9));
      getComputedTTV();
    }
  }, [ticketCurrency.address, ticketTokenPrice?.price, solPrice?.price]);

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

  const isInvalidTicketPrice = useMemo(() => {
    if (!ticketPrice) return false;
    return parseFloat(ticketPrice) <= 0;
  }, [ticketPrice]);

  return (
    <div>
      <div className="relative">
        <input
          id="amount"
          type="number"
          value={ticketPrice}
          onChange={(e) => {
            setTicketPrice(e.target.value);
            setTicketPricePerSol((parseFloat(e.target.value) * (ticketTokenPrice?.price!/solPrice?.price!)).toFixed(9));
            getComputedTTV();
          }}
          className={`text-white focus:outline-0  placeholder:text-gray-1200 text-base w-full font-inter px-5 h-12 border border-solid border-gray-1100 rounded-lg font-medium ${isInvalidTicketPrice ? "border border-red-500" : ""}`}
          autoComplete="off"
          placeholder="Enter Amount"
        />
        <div
          ref={dropdownRef}
          className="absolute z-20 top-1/2 right-5 -translate-y-1/2 bg-transparent border-l border-solid border-gray-1100"
        >
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 cursor-pointer font-inter text-base font-medium text-white py-1"
            onClick={toggleDropdown}
          >
            <p>{ticketCurrency.symbol}</p>
            <ChevronDownIcon className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen && (
            <ol className="absolute top-full right-0 w-full bg-[#1B1B21FA] border border-white rounded-md mt-3 z-10">
              {VerifiedTokens.map((token) => (
                <li key={token.symbol}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-white hover:bg-gray-100/10 cursor-pointer"
                    onClick={() => handleSelect(token.symbol)}
                  >
                    {token.symbol}
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
      {isInvalidTicketPrice && (
        <p className="md:text-sm text-xs font-medium font-inter text-red-500 pt-2.5">
          Please enter a valid ticket price (must be greater than 0)
        </p>
      )}
    </div>
  );
}
