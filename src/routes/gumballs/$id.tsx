import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { TransactionsTable } from '../../components/auctions/TransactionsTable';
import { GumballPrizesTable } from '../../components/gumballs/GumballPrizesTable';
import { MoneybackTable } from '../../components/gumballs/MoneybackTable';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import QuantityBox from '@/components/gumballs/QuantityBox';

export const Route = createFileRoute('/gumballs/$id')({
  component: GumballsDetails,
})



function GumballsDetails() {
//   const { id } = Route.useParams();

    const router = useRouter();

    const [tabs, setTabs] = useState([
        { name: "Gumball Prizes", active: true },
        { name: "Your Prizes", active: false },
        ]);

    const [saleEnded] = useState(true);






  return (
  <main className='bg-black-1400'>
    <div className="w-full pb-2 md:pb-16 md:pt-44 pt-36 max-w-[1440px] px-5 mx-auto">
        <button onClick={() => router.history.go(-1)} className='px-6 cursor-pointer transition duration-300 hover:opacity-80 inline-flex items-center gap-2 py-2.5 bg-gray-1000 rounded-full text-base font-semibold text-white'>
        <img src="/icons/back-arw.svg" className='invert' alt="" />
         Back
         </button>
    </div>

    <section className='w-full pb-20'>
        <div className="w-full max-w-[1440px] px-5 mx-auto">
            <div className="w-full flex gap-[60px] md:gap-8 md:flex-row flex-col">
                <div className="flex-1">
                    <div className="md:p-[18px] p-3 bg-black-1300 rounded-[20px]">
                        {saleEnded ? 
                        <div className="flex-1 bg-black rounded-xl border border-primary-color">
                            <img src="/images/gumballs/sol-img-frame.png" className="w-full lg:h-[604px] md:h-[506px] rounded-[20px]" alt="no img" />
                        </div>
                    :
                    <div className="relative flex items-center justify-center rounded-lg overflow-hidden">
                        <img src="/images/gumballs/sol-img-frame.png" className="w-full object-cover lg:h-[604px] md:h-[406px]" alt="no img" />
                        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
                        <p className='md:text-[28px] text-lg text-white font-bold font-inter absolute z-10'>Sale Ended</p>
                    </div>
                    
                    }
                    </div>
                
                </div>

                <div className="flex-1 max-w-[467px] bg-black-1300 p-6 rounded-[20px]">
                    <div className="w-full">
                        <h1 className='md:text-[28px] text-xl font-inter font-bold text-white'>Moneyback or big hit</h1>
                        <div className="w-full">
                            <div className="w-full flex items-center justify-between md:pt-5 py-6 md:pb-6">
                                <div className="inline-flex gap-4">
                                    <img src="/images/placeholder-user.png" className="w-10 h-10 rounded-full object-cover" alt="no" />
                                    <div className="">
                                        <p className='text-xs font-inter font-normal text-gray-1200 md:pb-0 pb-1'>Raffler</p>
                                        <h4 className='md:text-base text-sm text-white font-inter font-semibold'>OzzyyySOL</h4>
                                    </div>
                                </div>  
                            </div>

                            <div className="w-full flex items-center justify-between py-4 px-5 rounded-[20px] bg-primary-color/10">
                                <div className="inline-flex flex-col gap-2.5">
                                    <p className='font-inter text-sm text-gray-1200'>Prize </p>
                                    <h3 className='lg:text-[28px] text-xl font-semibold font-inter text-primary-color'>0.022 SOL</h3>
                                </div>
                            </div>

                            <div className="w-full">
                                {saleEnded ? 
                                <div className="w-full">

                                    <QuantityBox/>

                                <div className="w-full flex">
                                <PrimaryButton text='Press To Spin' className='w-full h-12' />
                                </div>

                                <p className='md:text-base text-sm text-white font-medium font-inter pt-[18px] pb-10'>Your balance: 0 SOL</p>
                                </div>
                                :
                                <div className="w-full bg-black-1300 rounded-full flex items-center justify-center h-12 my-10">
                                    <p className='text-base text-white text-center font-semibold font-inter'>Sale Ended</p>
                                    
                                </div>
                                }
                                <div className="w-full flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="w-full bg-gray-1000 rounded-full h-4 relative">
                                            <div className="bg-primary-color rounded-full absolute left-0 top-0 h-4 w-1/4"></div>
                                        </div>
                                    </div>

                                    <div className="">
                                        <p className='md:text-base text-sm text-white font-medium font-inter'>225 / 1000 sold</p>
                                    </div>

                                </div>

                            </div>


                        </div>

                    </div>
                </div>

            </div>
                <div className="w-full">
                    <ul className="inline-flex items-center bg-white/15 gap-3 2xl:gap-4 mb-6 mt-14 p-1 rounded-full sm:w-auto">
                                {tabs.map((tab, index) => (
                                <li key={index}>
                                    <button onClick={() => {
                                    const updatedTabs = tabs.map((t, i) => ({
                                        ...t,
                                        active: i === index,
                                    }));
                                    setTabs(updatedTabs);
                                    }
                                    } className={`md:text-base whitespace-nowrap text-sm cursor-pointer font-inter font-medium transition duration-300 hover:bg-primary-color hover:text-black-1000 text-white rounded-full py-2.5 md:py-3 px-4 ${tab.active ? 'bg-primary-color !text-black-1000' : 'text-black-1000'}`}>{tab.name}</button>
                                </li>
                                ))}
                            </ul>

                            {tabs[0].active &&
                            <div className="md:grid md:grid-cols-2 items-start gap-5">
                             <GumballPrizesTable/>
                             <div className="flex-1 md:-mt-[60px] mt-10">
                                <h2 className='text-xl pb-8 text-white font-bold font-inter'>Moneyback or big hit</h2>
                             <MoneybackTable/>
                             </div>
                             </div>
                            }

                            {tabs[1].active &&
                             <TransactionsTable/>
                            }
                            


                </div>
        </div>
    </section>
    
</main>
  )}
