import React, { useRef, useMemo } from "react";
import { useCreateRaffleStore } from "../../../store/createRaffleStore";
import { Clock } from "lucide-react";

interface TimeSelectorProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label?: string;
  hour?: string;
  minute?: string;
  period?: "AM" | "PM";
  onTimeChange?: (hour: string, minute: string, period: "AM" | "PM") => void;
  hasValue?: boolean;
  isInvalid?: boolean;
}

export default function TimeSelector({ 
  label, 
  hour = "12",
  minute = "00",
  period = "PM",
  onTimeChange,
  hasValue = false,
  isInvalid = false,
  ...props 
}: TimeSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    inputRef.current?.showPicker?.();
  };
  const {getEndTimestamp} = useCreateRaffleStore();

  // Convert 12-hour format to 24-hour format for input[type="time"]
  const inputValue = useMemo(() => {
    let hour24 = parseInt(hour) || 12;
    
    if (period === "PM" && hour24 !== 12) {
      hour24 += 12;
    } else if (period === "AM" && hour24 === 12) {
      hour24 = 0;
    }
    
    return `${String(hour24).padStart(2, "0")}:${minute.padStart(2, "0")}`;
  }, [hour, minute, period]);

  // Handle change and convert 24-hour back to 12-hour format
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onTimeChange) {
      const [h24, m] = e.target.value.split(":");
      let hour24 = parseInt(h24) || 0;
      const newMinute = m || "00";
      
      let newPeriod: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
      let newHour = hour24 % 12 || 12;
      
      onTimeChange(
        String(newHour).padStart(2, "0"),
        newMinute,
        newPeriod
      );
    }
  };
const isInvalidTime = useMemo(() => {
  try {
    const endTimestampSeconds = getEndTimestamp() || 0;
    console.log("endTimestampSeconds", endTimestampSeconds);
    const nowSeconds = Math.floor(Date.now() / 1000);
    console.log("nowSeconds", nowSeconds);
    const diffSeconds = endTimestampSeconds ? endTimestampSeconds - nowSeconds : 0;
    console.log("diffSeconds", diffSeconds);
    const diffMinutes = diffSeconds / 60;
    const diffDays = diffSeconds / (60 * 60 * 24);

    if (diffSeconds < 0) {
      return { 
        isValid: false, 
        error: "Selected time cannot be in the past" 
      };
    }

    if (diffMinutes < 5) {
      return { 
        isValid: false, 
        error: "Selected time must be at least 5 minutes from now" 
      };
    }

    if (diffDays > 7) {
      return { 
        isValid: false, 
        error: "Selected time cannot be more than 7 days from now" 
      };
    }

    return { isValid: true, error: null };
  } catch (error) {
    return { 
      isValid: false, 
      error: "Invalid date or time selected" 
    };
  }
}, [ hour, minute, period]);
  return (
    <div className="w-full flex flex-col justify-end relative">
      {label && (
        <label
          htmlFor={props.id}
          className="text-sm mb-2.5 block text-gray-1200 font-medium font-inter"
        >
          {label}
        </label>
      )}
      <div className="w-full relative">
        <input
          type="time"
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          {...props}
          className={`w-full text-base font-medium bg-black-1300 ${hasValue ? 'text-white' : 'text-gray-500 focus:outline-0'} placeholder:text-gray-1200 outline ${isInvalid ? "outline-red-500" : "outline-gray-1100"} h-12 md:px-5 px-3 md:pr-5 py-3 rounded-lg border-transparent [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden`}
        />
        <Clock
          onClick={handleIconClick}
          className="absolute right-3 md:right-5 top-[50%] -translate-y-1/2 cursor-pointer text-white"
        />
      </div>
    </div>
  );
}
