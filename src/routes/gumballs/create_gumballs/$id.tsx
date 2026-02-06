import { GumballSetup } from '@/components/gumballs/GumballSetup';
import { GumballStudio } from '@/components/gumballs/GumballStudio';
import { LoadPrizesTab } from '@/components/gumballs/LoadPrizesTab';
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react';
import { useGumballStore, type GumballTab } from 'store/useGumballStore';
import { useCreateGumball } from 'hooks/gumball/useCreateGumball';
import { useGumballById } from 'hooks/gumball/useGumballsQuery';
export const Route = createFileRoute('/gumballs/create_gumballs/$id')({
  component: CreateGumballs,
})
const tabs: { name: string; key: GumballTab }[] = [
    { name: "Gumball set-up", key: "setup" },
    { name: "Load Prizes", key: "loadPrizes" },
    // { name: "Buy back Settings", key: "buySettings" },
    { name: "Gumball Studio", key: "studio" },
  ];
  
function CreateGumballs() {
  const { id } = Route.useParams();
  const {data:gumball,isLoading} = useGumballById(id);
  const isActive = gumball?.status === "ACTIVE" || gumball?.status ==="INITIALIZED";
  const [activeTab, setActiveTab] = useState<GumballTab>("studio");

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
      useEffect(() => {
        if (gumball && isActive) {
          setActiveTab("loadPrizes");
        }
      }, [gumball, isActive]);
      
      const tabs: { name: string; key: GumballTab }[] = useMemo(()=>{
        if(isActive){
          return [
            { name: "Load Prizes", key: "loadPrizes" },
            { name: "Gumball Studio", key: "studio" },
          ]
        }
        return [
          { name: "Gumball Studio", key: "studio" },
        ]
      },[gumball])
    
      const handleTabClick = (tabKey: GumballTab) => {
          setActiveTab(tabKey);
      };
      if(isLoading){
        return <div className="flex bg-black-1400 items-center min-h-[60vh] justify-center">
          <img src="/loading-vector.svg" alt="" />
        </div>
      }
      if(!gumball){
        return <div className="w-full h-full flex bg-black-1400 items-center justify-center">
          <p className="text-xl text-red-500 font-inter font-semibold">Gumball not found</p>
        </div>
      }
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
            <li key="setup">
                        <button
                          type="button"
                          disabled={true}
                          className={`cursor-pointer w-full flex items-center justify-center rounded-full lg:px-10 px-4 sm:h-12 h-8 md:text-base sm:text-sm text-xs font-medium text-black-1000 font-inter transition-all ${
                            activeTab === "setup" 
                              ? "bg-primary-color text-black-1000" 
                              : "bg-black-1300 text-white"
                          } ${
                            true 
                              ? "opacity-50 cursor-not-allowed" 
                              : "cursor-pointer hover:opacity-80"
                          }`}>
                          Gumball set-up
                        </button>
                      </li>
                      {tabs.map((tab) => {
                    return (
                      <li key={tab.key}>
                        <button
                          type="button"
                          onClick={() => handleTabClick(tab.key)}
                          className={`w-full flex items-center justify-center rounded-full lg:px-10 px-4 sm:h-12 h-8 md:text-base sm:text-sm text-xs font-medium text-black-1000 font-inter transition-all ${
                            activeTab === tab.key 
                              ? "bg-primary-color text-black-1000" 
                              : "bg-black-1300 text-white"
                          } `}>
                          {tab.name}
                        </button>
                      </li>
                    );
                  })}
            </ul>
            </div>

            {activeTab === "setup" || activeTab === "loadPrizes" && <LoadPrizesTab gumballId={id.toString()} />}
            {activeTab === "studio" && <GumballStudio gumballId={id.toString()} />}

       
        </div>
      </div>
    </section>
    </main>
  );
}
