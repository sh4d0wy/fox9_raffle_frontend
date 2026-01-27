import React, { useState } from 'react'

export const AgreeCheckbox = () => {
       const [checked, setChecked] = useState(false);


  return (
    <label className="cursor-pointer w-full">
            <div onClick={() => setChecked(!checked)}
                className={`flex items-center justify-center transition duration-300 hover:border-primary-color gap-2.5 w-full h-14 border border-solid rounded-full font-inter font-semibold text-base
                ${checked ? "border-gray-1100 !bg-transparent" : "border-gray-1100"}
                `}
            >
                <span
                className="flex items-center justify-center w-6 h-6"
                >
                {checked ? (
                    <img src="/icons/checkbox-icon-2.svg" alt="checked" />
                ) : (
                    <div className="w-5 h-5 border border-gray-1100 rounded-sm" />
                )}
                </span>

                <span className="text-white">
                I agree to the Terms & Conditions
                </span>
            </div>
    </label>
)
}
