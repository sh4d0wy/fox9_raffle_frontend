import { useState } from "react";
import { SoldGumballTable } from "./SoldGumballTable";
import { AvailableGumballTable } from "./AvailableGumballTable";
import { Link } from "@tanstack/react-router";

interface GumballStudioProps {
  gumballId: string;
}

export const GumballStudio = ({ gumballId }: GumballStudioProps) => {

   const [tabNames, setTabNames] = useState([
  { name: "Sold", active: true },
  { name: "Available", active: false },
]);

const handleTabClick = (clickedName: string) => {
  setTabNames((prev) =>
    prev.map((tab) =>
      tab.name === clickedName
        ? { ...tab, active: true }
        : { ...tab, active: false }
    )
  );
};



  return (
    <div className="w-full">
        <div className="w-full flex items-center lg:justify-end md:gap-[20px] gap-4 md:mb-7 mb-5">
            <button className="inline-flex cursor-pointer items-center gap-2.5 md:text-base text-sm font-medium border border-orange-1100 px-4 py-2.5 rounded-[10px] text-orange-1100 font-inter">
                <img src="/icons/delete-icon-3.svg" className="w-6 h-6" alt="no-img" />
                <span>Cancel Gumball</span>
            </button>
            <Link to="/gumballs/preview_gumball"
            params={{ id: gumballId }} 
            className="inline-flex cursor-pointer items-center px-4 py-2.5 border border-white rounded-[10px] gap-2.5 md:text-base text-sm font-medium text-white font-inter">
                <img src="/icons/gumball-icon-1.svg" className="w-6 h-6 invert" alt="no-img" />
                <span>View Gumball</span>
            </Link>
        </div>

        <div className="w-full pb-16">
        <div className="w-full grid md:grid-cols-2 grid-cols-1 bg-black-1300 border-2 border-gray-1000 md:p-6 p-4 md:gap-10 gap-5 rounded-[10px]">
            <div className="flex gap-5">
            <div className="px-2 flex-1 max-w-[190px] py-2 border border-gray-1000 rounded-[10px]">
                <h3 className='md:text-base text-center text-sm text-white font-medium font-inter mb-4'>Sale Start</h3>
                <h4 className='text-2xl font-bold font-inter text-center text-white'>0/10</h4>
            </div>

               <div className="px-6 py-2 border border-gray-1000 rounded-[10px]">
                <h3 className='md:text-base text-sm text-center text-white font-medium font-inter mb-4'>Profit from buy backs</h3>
                <div className="flex items-center justify-center text-center gap-4">
                <h4 className='text-2xl font-bold font-inter text-white'>0 SOL</h4>
                <h4 className="text-base font-medium font-inter text-primary-color">0 Unique Buyers</h4>
                </div>
            </div>
            </div>

            <div className="flex items-center justify-center w-fit ml-auto">
                <button className="h-12 px-10 cursor-pointer hover:opacity-90 max-w-[260px] flex-1 w-full rounded-full font-medium text-black-1000 text-center bg-primary-color">
                    Launch Gumball Now
                </button>
            </div>
          </div>

        <ul className="inline-flex p-1 rounded-full items-center bg-black-1300 gap-3 md:w-auto w-full mt-16">
           {tabNames.map((tab) => (
            <li key={tab.name} className="flex-1 sm:flex-none">
            <button
                onClick={() => handleTabClick(tab.name)}
                className={`md:text-base text-sm md:w-auto w-full cursor-pointer font-inter font-medium transition duration-300 
                hover:bg-primary-color text-white hover:text-black-1000 rounded-full py-2.5 md:py-3 md:px-5 px-3
                ${tab.active ? "bg-primary-color text-black-1000!" : ""}
                `}>
                {tab.name}
            </button>
            </li>
            ))}
        </ul> 

        <div className="w-full">
            {tabNames[0].active &&
            <SoldGumballTable/>
            }

            {tabNames[1].active &&
            <AvailableGumballTable/>
            }
        </div>

          



        </div>




        
    </div>
  )
}
