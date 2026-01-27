import React from 'react'
import ListboxToken from './ListboxToken'

const tokenOption = [
  { label: "Bonk", img: "/images/token-img-1.png", value: "Bonk" },
  { label: "Tickets Sold", img: "/images/token-img-1.png", value: "Tickets Sold" },
  { label: "Volume", img: "/images/token-img-1.png", value: "Volume" },
];

export const ChooseToken = () => {
  return (
    <div className='relative flex-1'>
        <p className='text-sm text-black-1000 font-medium font-inter mb-2.5'>Choose Token</p>
        <div className="w-full flex items-start gap-6">
            <ListboxToken 
            options={tokenOption}
            onChange={(value) => {
            console.log("Selected option:", value);
            }}
            />


        <button className='cursor-pointer my-3'>
            <img src="/icons/delete-icon-2.svg" className='w-6 h-6' alt="" />
        </button>

        </div>

    </div>
  )
}
