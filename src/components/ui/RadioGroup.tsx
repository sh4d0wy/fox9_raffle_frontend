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

export function RadioGroup<T = string>({
  name,
  value,
  options,
  onChange,
  className = "",
}: RadioGroupProps<T>) {
  return (
    <div className={`flex items-center gap-10 ${className}`}>
      {options.map((opt) => (
        <label
          key={String(opt.value)}
          htmlFor={`${name}-${opt.value}`}
          className="flex text-base text-white font-semibold font-inter items-center gap-3 cursor-pointer"
        >
          <input
            type="radio"
            id={`${name}-${opt.value}`}
            name={name}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="min-w-4 h-4 border-2 outline-2 outline-gray-1100 
                       checked:bg-primary-color checked:outline-primary-color 
                       border-primary rounded-full appearance-none cursor-pointer"
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
