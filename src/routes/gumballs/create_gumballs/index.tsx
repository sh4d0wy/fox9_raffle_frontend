import { GumballSetup } from '@/components/gumballs/GumballSetup';
import { GumballStudio } from '@/components/gumballs/GumballStudio';
import { LoadPrizesTab } from '@/components/gumballs/LoadPrizesTab';
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react';
import { useGumballStore, type GumballTab } from 'store/useGumballStore';
import { useCreateGumball } from 'hooks/gumball/useCreateGumball';
export const Route = createFileRoute('/gumballs/create_gumballs/')({
  component: CreateGumballs,
})
const tabs: { name: string; key: GumballTab }[] = [
    { name: "Gumball set-up", key: "setup" },
    { name: "Load Prizes", key: "loadPrizes" },
    // { name: "Buy back Settings", key: "buySettings" },
    { name: "Gumball Studio", key: "studio" },
  ];
  
function CreateGumballs() {
    const { activeTab, setActiveTab, createdGumballId } = useGumballStore();
    const { createGumball } = useCreateGumball();
    const isTabDisabled = (tabKey: GumballTab): boolean => {
    
        // If gumball is NOT created, disable "loadPrizes" tab
        if ( tabKey === "loadPrizes") {
          return true;
        }
        if (tabKey === "studio") {
          return true;
        }
        
        // If gumball IS created, disable "setup" tab
        if (tabKey === "setup") {
          return false;
        }
        
        return false;
      };
      const handleTabClick = (tabKey: GumballTab) => {
        if (!isTabDisabled(tabKey)) {
          setActiveTab(tabKey);
        }
      };
  return (
    <main className='flex-1 bg-black-1400'>
    <section className="md:pt-48 pt-36 md:pb-[122px] pb-5 ">
      <div className="max-w-[1440px] mx-auto w-full md:px-10 px-4">
        <div className="max-w-[1008px] w-full mx-auto">
          <div className="flex flex-col items-start">
          <Link
            to={"/gumballs"}
            className="bg-gray-1000 mb-10 rounded-[80px] w-fit inline-flex h-10 md:h-[49px] justify-center items-center pl-5 pr-3.5 md:px-6 gap-2 md:gap-2.5  md:text-base text-sm font-semibold text-white font-inter">
            <span>
              <img src="/icons/back-arw.svg" className='invert' alt="" />
            </span>
            Back
          </Link>

                <div className="mb-6">
                    <h1 className='text-[28px] font-semibold text-white font-inter mb-1'>Create Gumball</h1>
                    <p className='text-base text-cream-1000 font-inter'>Set up your prize pool and watch the excitement unfold</p>
                  </div>

            <ul className="mb-12 p-1 w-fit inline-flex rounded-full lg:flex-nowrap bg-black-1300 flex-wrap items-center sm:justify-center md:justify-start justify-start md:gap-3 gap-1">
                {tabs.map((tab, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => handleTabClick(tab.key)}
                        disabled={isTabDisabled(tab.key)}
                        className={`cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-solid w-full flex items-center justify-center rounded-full lg:px-5 px-4 sm:h-12 h-8 md:text-base sm:text-sm text-xs font-medium text-white hover:bg-primary-color hover:text-black-1000 transition duration-300 font-inter ${activeTab === tab.key ? "bg-primary-color text-black-1000!" : ""}`}>
                        {tab.name}
                      </button>
                    </li>
                  ))}
            </ul>
            </div>

            {activeTab === "setup" && 
            <GumballSetup/>
            }

       
        </div>
      </div>
    </section>
    </main>
  );
}
