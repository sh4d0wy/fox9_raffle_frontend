import { useState } from "react";

export default function QuantityBox() {
  const MIN = 1;
  const MAX = 10;
  const [qty, setQty] = useState(6);

  const percentage = ((qty - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm text-gray-300 font-medium">Quantity</h4>
        <h4 className="text-sm text-white font-medium">Max : {MAX}</h4>
      </div>

      <div className="relative">
        <div className="relative h-3 rounded-full bg-gray-1000">
          <div
            className="absolute left-0 top-0 h-3 rounded-full bg-yellow-400"
            style={{ width: `${percentage}%` }}
          />

          <div className="absolute inset-0 flex justify-between items-center px-1">
            {Array.from({ length: MAX }, (_, i) => {
              const value = i + 1;
              const active = value <= qty;

              return (
                <span
                  key={value}
                  className={`w-1 h-1 rounded-full ${
                    active ? "bg-black" : "bg-gray-1200"
                  }`}
                />
              );
            })}
          </div>
        </div>

        <input
          type="range"
          min={MIN}
          max={MAX}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="absolute top-1/2 left-0 w-full -translate-y-1/2 appearance-none bg-transparent pointer-events-auto
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#0f1115]
            [&::-webkit-slider-thumb]:border-4
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:h-6
            [&::-moz-range-thumb]:w-6
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[#0f1115]
            [&::-moz-range-thumb]:border-4
            [&::-moz-range-thumb]:border-white"
        />
      </div>

      <div className="flex justify-between mt-4 px-2 text-sm">
        {Array.from({ length: MAX }, (_, i) => {
          const value = i + 1;
          return (
            <span
              key={value}
              className={value === qty ? "text-yellow-400" : "text-gray-400"}
            >
              {value}
            </span>
          );
        })}
      </div>
    </div>
  );
}
