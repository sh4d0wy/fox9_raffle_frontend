import { CheckIcon } from 'lucide-react';
import { useState } from 'react'

interface AgreeCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const AgreeCheckbox = ({ checked: controlledChecked, onChange }: AgreeCheckboxProps) => {
  const [internalChecked, setInternalChecked] = useState(false);

  // Support both controlled and uncontrolled modes
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleClick = () => {
    const newValue = !checked;
    if (onChange) {
      onChange(newValue);
    }
    if (!isControlled) {
      setInternalChecked(newValue);
    }
  };

  return (
    <label className="cursor-pointer w-full">
      <div
        onClick={handleClick}
        className={`text-white flex items-center justify-center transition duration-300 gap-2.5 w-full h-14 border rounded-full font-inter font-semibold text-base cursor-pointer border-white bg-transparent`}
      >
        <span className="flex items-center justify-center w-6 h-6">
          {checked ? (
            <CheckIcon className="text-black bg-primary-color rounded-md p-1" />
          ) : (
            <div className="w-5 h-5 border border-gray-1100 rounded-sm" />
          )}
        </span>

        <span className="">I agree to the Terms & Conditions</span>
      </div>
    </label>
  );
}
