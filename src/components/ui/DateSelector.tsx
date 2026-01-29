import { Calendar } from "lucide-react";
import React, { useRef, useMemo } from "react";

interface DateSelectorProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label?: string;
  value?: Date | null;
  limit?:string|null;
  onChange?: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

// Helper to format Date to YYYY-MM-DD string for input[type="date"]
const formatDateToString = (date: Date | null | undefined): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function DateSelector({ 
  label, 
  value, 
  minDate,
  maxDate,
  limit,
  onChange,
  className,
  ...restProps 
}: DateSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    inputRef.current?.showPicker?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      const dateValue = e.target.value;
      if (dateValue) {
        // Parse YYYY-MM-DD format
        const [year, month, day] = dateValue.split("-").map(Number);
        const date = new Date(year, month - 1, day);

        onChange(date);
      } else {
        onChange(null);
      }
    }
  };

  // Format the value for the input
  const inputValue = useMemo(() => formatDateToString(value), [value]);
  
  // Format the min date
  const minValue = useMemo(() => formatDateToString(minDate), [minDate]);
  const maxValue = useMemo(() => formatDateToString(maxDate), [maxDate]);
  return (
    <div className="w-full flex flex-col justify-end relative">
      {label && (
        <div className="flex gap-3">
        <label
          htmlFor={restProps.id}
          className="text-sm mb-2.5 block text-gray-1200 font-medium font-inter"
        >
          {label}
        </label>
        {limit && 
        <p className="text-sm text-gray-1200">Time Period Limit ({limit})</p>
        }
        </div>
      )}
      <div className="w-full relative">
        <input
          type="date"
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          min={minValue}
          max={maxValue}
          {...restProps}
          className={`w-full text-sm md:text-base font-medium bg-black-1300 ${inputValue ? 'text-white' : 'text-gray-500'} placeholder:text-gray-1200 outline ${className ? 'outline-red-500' : 'outline-gray-1100'} focus:outline-primary-color h-12 md:px-5 px-3 md:pr-5 py-3 rounded-lg border-transparent [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden`}
        />
        <Calendar onClick={handleIconClick} className="absolute right-3 md:right-5 top-[50%] -translate-y-1/2 cursor-pointer text-white" />
      </div>
    </div>
  );
}
