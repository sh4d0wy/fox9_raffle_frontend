import { useState } from "react";

export default function DaysSelector() {
  const [days, setDays] = useState("1");

  const presets = [
    { label: "1d", value: "1" },
    { label: "3d", value: "3" },
    { label: "7d", value: "7" },
  ];

  return (
    <div className="pb-10 max-w-[588px] w-full">
      <p className="md:text-base text-sm font-medium font-inter text-gray-1200 pb-2.5">
        How many days would you like the Gumball to be live for?
      </p>

      <input
        id="days"
        type="number"
        value={days}
        onChange={(e) => setDays(e.target.value)}
        className="text-white outline outline-gray-1100 focus:outline-primary-color placeholder:text-gray-1100 text-base w-full font-inter px-5 h-12 rounded-lg font-medium [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        placeholder="1"
      />

      <ol className="flex items-center gap-4 pt-2.5">
        {presets.map((p) => (
          <li key={p.value} className="w-full">
            <button
              type="button"
              onClick={() => setDays(p.value)}
              className={`rounded-[7px] px-2.5 h-10 flex items-center justify-center text-sm font-semibold font-inter w-full 
                ${
                  days === p.value
                    ? "bg-primary-color text-black-1000"
                    : "bg-black-1300 text-white"
                }
              `}
            >
              {p.label}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
