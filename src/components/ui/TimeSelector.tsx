import React, { useRef } from "react";

interface TimeSelectorProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function TimeSelector({ label, ...props }: TimeSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    inputRef.current?.showPicker?.();
  };

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
          onClick={handleIconClick}
          type="time"
          ref={inputRef}
          {...props}
          className="w-full text-base bg-black-1300 font-medium text-gray-1200 placeholder:text-gray-1200 outline outline-gray-1100 focus:outline-primary-color h-12 md:px-5 px-3 md:pr-5 py-3 rounded-lg border-transparent appearance-none"
        />
        <span
          onClick={handleIconClick}
          className="absolute bg-black-1300 right-3 md:right-5 top-[50%] -translate-y-1/2 cursor-pointer"
        >
         <img src="/icons/clock-icon.svg" alt="" />
        </span>
      </div>
    </div>
  );
}
