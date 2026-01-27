import React from "react";

export interface RadioOption<T = string> {
  label: string;
  value: T;
}

interface RadioGroupProps<T = string> {
  name: string;
  value: T;
  options: RadioOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export function RadioGroupFluid<T = string>({
  name,
  value,
  options,
  onChange,
  className = "",
}: RadioGroupProps<T>) {
  return (
    <div className={`flex items-center gap-5 ${className}`}>
      {options.map((opt) => (
        <label
          key={String(opt.value)}
          htmlFor={`${name}-${opt.value}`}
          className="flex-1 flex justify-center text-base font-semibold font-inter items-center gap-3 cursor-pointer"
        >
          <input
            type="radio"
            id={`${name}-${opt.value}`}
            name={name}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="w-full h-10  
                       checked:bg-primary-color bg-gray-1000  checked:outline-primary-color 
                        rounded-full appearance-none cursor-pointer"
          />
          <span className="absolute">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
