import { useState } from "react";

export default function QuantityBox() {
  const MIN = 1;
  const MAX = 10;
  const [quantityValue, setQuantityValue] = useState(6);

  const percentage =
    ((quantityValue - MIN) / (MAX - MIN)) * 100;


  const handleQuickSelect = (val: number) =>
    setQuantityValue(Math.min(MAX, Math.max(MIN, val)));

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-between pt-7 pb-3">
        <p className="text-sm font-medium font-inter text-gray-1200">
          Quantity
        </p>
        <p className="text-white text-sm font-inter font-medium">
          Max : <span>{MAX}</span>
        </p>
      </div>

      <div className="relative w-full mb-4">
        <div className="h-3 rounded-full bg-gray-1000 relative">
          <div
            className="absolute left-0 top-0 h-3 rounded-full bg-primary-color"
            style={{ width: `${percentage}%` }}
          />

          <div className="absolute inset-0 flex justify-between items-center px-1">
            {Array.from({ length: MAX }, (_, i) => {
              const value = i + 1;
              return (
                <span
                  key={value}
                  className={`w-1 h-1 rounded-full ${
                    value <= quantityValue
                      ? "bg-black"
                      : "bg-gray-400"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Input */}
        <input
          type="range"
          min={MIN}
          max={MAX}
          value={quantityValue}
          onChange={(e) =>
            setQuantityValue(Number(e.target.value))
          }
          className="absolute top-1/2 left-0 w-full -translate-y-1/2 bg-transparent appearance-none
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-black
            [&::-webkit-slider-thumb]:border-4
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:h-6
            [&::-moz-range-thumb]:w-6
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-black
            [&::-moz-range-thumb]:border-4
            [&::-moz-range-thumb]:border-white"
        />
      </div>

  <div className="flex justify-between px-2 text-sm">
  {Array.from({ length: MAX }, (_, i) => {
    const value = i + 1;
    return (
      <span
        key={value}
        className={
          value === quantityValue
            ? "text-primary-color"
            : "text-gray-400"
        }
      >
        {value}
      </span>
    );
  })}
</div>



      {/* Quick Select */}
      <div className="w-full pt-5 pb-10">
        <ul className="grid grid-cols-4 gap-4">
          {[1, 3, 5, 10].map((num) => (
            <li key={num}>
              <button
                onClick={() => handleQuickSelect(num)}
                className={`text-sm py-3 w-full rounded-lg font-inter font-semibold
                  ${
                    quantityValue === num
                      ? "bg-primary-color text-black"
                      : "bg-gray-1000 text-black-1000"
                  }`}
              >
                x{num}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
