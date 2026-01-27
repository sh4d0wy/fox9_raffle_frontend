import { createFileRoute, useRouter } from '@tanstack/react-router'
import { RafflesData } from "../../../data/raffles-data";
import { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ParticipantsTable } from '@/components/auctions/ParticipantsTable';
import { TransactionsTable } from '@/components/auctions/TransactionsTable';
import { TermsConditions } from '@/components/auctions/TermsConditions';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import QuantityBox from '@/components/home/QuantityBox';


export const Route = createFileRoute('/raffles/$id')({
  component: RouteComponent,
})


 const UserDetails = [
    {
      title: 'Traits',
      items: [
        { label: 'Background', value: 'Vanilla Ice' },
        { label: 'Fur', value: 'Hazel' },
        { label: 'Face', value: 'Smirk' },
        { label: 'Clothes', value: 'Baseball Hoodie' },
        { label: 'Head', value: 'Beanie (blackout)' },
        { label: 'Eyewear', value: 'Melrose Bricks' },
        { label: '1/1', value: 'None' },
      ],
    },
    {
      title: 'Details',
      items: [
        { label: 'Background', value: 'Vanilla Ice' },
        { label: 'Fur', value: 'Hazel' },
        { label: 'Face', value: 'Smirk' },
        { label: 'Clothes', value: 'Baseball Hoodie' },
        { label: 'Head', value: 'Beanie (blackout)' },
        { label: 'Eyewear', value: 'Melrose Bricks' },
        { label: '1/1', value: 'None' },
      ],
    },
  ]

function RouteComponent() {
      const { id } = Route.useParams();
      const raffle = RafflesData.find((item) => item.id === Number(id));
    
            const [tabs, setTabs] = useState([
                { name: "Participants", active: true },
                { name: "Transactions", active: false },
                { name: "Terms & Conditions", active: false },
              ]);
    
        const router = useRouter();
        
        const [TimeExtension] = useState(true)
    
    
      if (!raffle) {
        return (
          <main className="py-20 text-center text-3xl font-bold text-red-500">
            Raffle not found!
          </main>
        );
      }
    


  return (
     <main className='bg-black-1400'>
        <div className="w-full md:pb-4 md:pt-44 pt-36 max-w-[1440px] px-5 mx-auto">
            <button onClick={() => router.history.go(-1)} className='px-6 cursor-pointer transition duration-300 hover:opacity-80 inline-flex items-center gap-2 py-2.5 bg-gray-1000 rounded-full text-base font-semibold text-white'>
            <img src="/icons/back-arw.svg" className='invert' alt="" />
             Back
             </button>
        </div>
    
        <section className='w-full pb-20'>
            <div className="w-full py-5 md:py-10 max-w-[1440px] px-5 mx-auto">
                <div className="w-full flex gap-6 md:gap-10 xl:flex-row flex-col">
                    <div className="flex-1 max-w-full xl:max-w-[450px]">
                         <div className="bg-black-1300 p-4 rounded-xl">
                          <img src={raffle?.MainImage}
                          className="w-full md:h-[450px] h-[361px] object-cover rounded-[12px]"
                          />
                        </div>
                        <div className="w-full pb-7 pt-6 md:py-10 hidden md:flex items-center justify-between">
                            <div className="flex items-center gap-3 2xl:gap-5">
                                <img  src={raffle?.userAvatar} className='w-12 h-12 rounded-full object-cover' alt='' />
                                <h3 className='md:text-[28px] text-lg font-bold text-white font-inter'>{raffle?.userName}</h3>
                            </div>
    
                              <ul className='flex items-center bg-primary-color/20 rounded-full p-2 gap-6'>
                            <li>
                                <a href='#'><img src="/icons/twitter-icon.svg" className='w-7 invert h-7 object-contain' alt="" /></a>
                            </li>

                                <li>
                                <a href='#'> <img src="/icons/mcp-server-icon.svg" className='w-7 invert h-7 object-contain' alt="" /></a>
                            </li>
                        </ul>
    
                        </div>
                     <div className="w-full space-y-5 hidden md:block">
                        {UserDetails.map((section, index) => (
                            <Disclosure as="div" key={section.title} defaultOpen={index === 0} className="w-full py-4 md:py-6 px-5 border border-gray-1100 rounded-[20px]">
                            {({ open }) => (
                                <>
                                <Disclosure.Button className={`flex items-center justify-between w-full text-base md:text-xl font-bold font-inter text-white ${
                                    open ? 'text-primary-color!' : ''}`}>
                                    <span>{section.title}</span>
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={16}
                                    height={9}
                                    viewBox="0 0 16 9"
                                    fill="none"
                                    className={`${open ? `rotate-180` : ``} transition-transform`}
                                    >
                                    <path
                                        d="M15 1L8 8L1 1"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    </svg>
                                </Disclosure.Button>
    
                                <Disclosure.Panel className="w-full">
                                    <ul className="space-y-6 pt-6">
                                    {section.items.map((item) => (
                                        <li key={item.label} className="flex items-center justify-between">
                                        <p className="md:text-base text-sm font-inter font-medium text-gray-1200">{item.label}</p>
                                        <p className="md:text-base text-sm font-inter font-medium text-white">{item.value}</p>
                                        </li>
                                    ))}
                                    </ul>
                                </Disclosure.Panel>
                                </>
                                 )}
                            </Disclosure>
                            ))}
                      </div>
    
                    </div>
                    <div className="flex-1">
                        <div className="w-full">
                            <h4 className='text-sm text-primary-color font-inter font-medium'>Raffle prize • 1 winner</h4>
                            <h1 className='md:text-[28px] text-xl font-inter md:mt-6 my-5 md:mb-5 font-bold text-white'>{raffle?.coins}</h1>
                            <div className="flex relative items-start md:items-center md:flex-row flex-col md:gap-0 gap-5 justify-between pb-6 md:pb-8 border-b border-gray-1000">
                                  <ul className="flex items-center gap-3 2xl:gap-5 flex-wrap">
                                    <li>
                                    <p className="md:text-sm text-xs inline-block px-2 sm:px-2.5 py-2 md:py-1.5 font-semibold text-center font-inter text-black-1000 bg-primary-color rounded-lg">
                                        Prize Value: 0.99 SOL
                                    </p>
                                    </li>
                                    <li>
                                    <p className="md:text-sm text-xs inline-block px-2 sm:px-2.5 py-2 md:py-1.5 font-semibold text-center font-inter bg-gray-1000 text-white  rounded-lg">
                                        TTV: 1.18 SOL
                                    </p>
                                    </li>
                                    <li>
                                    <p className="md:text-sm text-xs inline-block px-2 sm:px-2.5 py-2 md:py-1.5 font-semibold text-center font-inter bg-gray-1000 text-white  rounded-lg">
                                        +19.19%
                                    </p>
                                    </li>
                                </ul>

                                <ul className="flex md:absolute bottom-[33px] right-0 items-center md:flex-col mx-auto bg-primary-color/20 gap-4 p-2 rounded-full ">
                                <li>
                                <button className="border bg-gray-1200 cursor-pointer w-12 h-12 md:py-2.5 gap-2.5 rounded-full text-sm md:text-base font-semibold font-inter text-white inline-flex items-center justify-center">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    >
                                    <path
                                        d="M12 5.50066L11.4596 6.02076C11.601 6.16766 11.7961 6.25066 12 6.25066C12.2039 6.25066 12.399 6.16766 12.5404 6.02076L12 5.50066ZM9.42605 18.3219C7.91039 17.1271 6.25307 15.9603 4.93829 14.4798C3.64922 13.0282 2.75 11.3345 2.75 9.13713H1.25C1.25 11.8026 2.3605 13.8361 3.81672 15.4758C5.24723 17.0866 7.07077 18.3752 8.49742 19.4999L9.42605 18.3219ZM2.75 9.13713C2.75 6.98626 3.96537 5.18255 5.62436 4.42422C7.23607 3.68751 9.40166 3.88261 11.4596 6.02076L12.5404 4.98056C10.0985 2.44355 7.26409 2.02542 5.00076 3.05999C2.78471 4.07295 1.25 6.42506 1.25 9.13713H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55954 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.13713H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.13713C22.75 6.42506 21.2153 4.07295 18.9992 3.05999C16.7359 2.02542 13.9015 2.44355 11.4596 4.98056L12.5404 6.02076C14.5983 3.88261 16.7639 3.68751 18.3756 4.42422C20.0346 5.18255 21.25 6.98626 21.25 9.13713H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219Z"
                                        fill="#212121"
                                    />
                                    </svg>
                                </button>
                                </li>

                                <li>
                                <button className="border bg-gray-1200 cursor-pointer w-12 h-12 md:py-2.5 gap-2.5 rounded-full text-sm md:text-base font-semibold font-inter text-white inline-flex items-center justify-center">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M13.803 5.33333C13.803 3.49238 15.3022 2 17.1515 2C19.0008 2 20.5 3.49238 20.5 5.33333C20.5 7.17428 19.0008 8.66667 17.1515 8.66667C16.2177 8.66667 15.3738 8.28596 14.7671 7.67347L10.1317 10.8295C10.1745 11.0425 10.197 11.2625 10.197 11.4872C10.197 11.9322 10.109 12.3576 9.94959 12.7464L15.0323 16.0858C15.6092 15.6161 16.3473 15.3333 17.1515 15.3333C19.0008 15.3333 20.5 16.8257 20.5 18.6667C20.5 20.5076 19.0008 22 17.1515 22C15.3022 22 13.803 20.5076 13.803 18.6667C13.803 18.1845 13.9062 17.7255 14.0917 17.3111L9.05007 13.9987C8.46196 14.5098 7.6916 14.8205 6.84848 14.8205C4.99917 14.8205 3.5 13.3281 3.5 11.4872C3.5 9.64623 4.99917 8.15385 6.84848 8.15385C7.9119 8.15385 8.85853 8.64725 9.47145 9.41518L13.9639 6.35642C13.8594 6.03359 13.803 5.6896 13.803 5.33333Z"
                                        fill="#212121"
                                    />
                                    </svg>
                                </button>
                                </li>
                          </ul>
                            </div>
    
                            <div className="w-full">
                                <div className="w-full flex items-center justify-between md:pt-7 py-6 md:pb-10">
                                    <div className="inline-flex gap-4">
                                    <img
                                        src="/images/placeholder-user.png"
                                        className="w-10 h-10 rounded-full object-cover"
                                        alt="no"
                                    />

                                    <div className="">
                                        <p className="text-xs md:pb-0 pb-1 font-inter font-normal text-gray-1200">
                                        Raffler
                                        </p>
                                        <h4 className="text-base text-white font-inter font-semibold">
                                        OzzyyySOL
                                        </h4>
                                    </div>
                                    </div>

                                    <a href="#" className='flex items-center gap-6 justify-center'>
                                      <span className='w-[90px] h-11 font-medium rounded-full flex items-center justify-center border border-primary-color text-primary-color'>Follow</span>
                                    <img
                                        src="/icons/twitter-icon.svg"
                                        className="md:w-7 invert md:h-7 w-6 h-6 object-contain"
                                        alt=""
                                    />
                                    </a>
                                </div>
                                   <div className="w-full flex items-center flex-col-reverse md:flex-row justify-between py-4 px-[26px] rounded-[20px] bg-primary-color/10">
                            <div className="inline-flex w-full md:w-fit flex-col gap-2.5">
                              <div className="flex gap-3.5 items-center justify-center">
                                <div className="">
                                <h3 className='text-[11px] mb-2 text-center text-gray-1100 uppercase font-inter'>HOURS</h3>
                                  <div className="flex flex-row gap-1.5">
                                  <h4 className="text-xl rounded bg-black-1400 pr-2.5 text-center font-semibold text-white font-inter px-2.5 py-3">
                                    2
                                </h4>
                                   <h4 className="text-xl rounded bg-black-1400 pr-2.5 text-center font-semibold text-white font-inter px-2.5 py-3">
                                    2
                                </h4>
                                </div>

                                  </div>

                                <div className="">
                                <h3 className='text-[11px] mb-2 text-center text-gray-1100 uppercase font-inter'>Minutes</h3>
                                  <div className="flex flex-row gap-1.5">
                                  <h4 className="text-xl rounded bg-black-1400 pr-2.5 text-center font-semibold text-white font-inter px-2.5 py-3">
                                    2
                                </h4>
                                   <h4 className="text-xl rounded bg-black-1400 pr-2.5 text-center font-semibold text-white font-inter px-2.5 py-3">
                                    2
                                </h4>
                                </div>
                                  </div>

                                <div className="">
                                <h3 className='text-[11px] mb-2 text-center text-gray-1100 uppercase font-inter'>SECONDS</h3>
                                  <div className="flex flex-row gap-1.5">
                                  <h4 className="text-xl rounded bg-black-1400 pr-2.5 text-center font-semibold text-white font-inter px-2.5 py-3">
                                    2
                                </h4>
                                   <h4 className="text-xl rounded bg-black-1400 pr-2.5 text-center font-semibold text-white font-inter px-2.5 py-3">
                                    2
                                </h4>
                                </div>
                                  </div>
                            
                                </div>
                                <p className="text-sm font-inter text-gray-1200 font-normal">
                                Time Left
                                </p>
                            </div>
                            <div className="flex-1 md:flex-none md:w-1/2 flex justify-between w-full pb-6 md:pb-0">
                            <div className="inline-flex flex-col gap-2.5">
                                <h3 className="md:text-xl font-semibold font-inter text-white">
                                15 / 100
                                </h3>
                                <p className="font-inter text-gray-1200 text-sm font-normal">
                                Tickets Sold
                                </p>
                            </div>

                            <div className="inline-flex flex-col gap-2.5">
                                <h3 className="md:text-xl text-base font-semibold font-inter text-white">
                                0.118 SOL
                                </h3>
                                <p className="font-inter text-gray-1200 text-sm font-normal">
                                Ticket price
                                </p>
                            </div>
                            </div>
                            </div>

                              {!TimeExtension ? 
                             <div className="w-full mt-6 bg-black-1300 px-6 py-3 border border-primary-color rounded-[20px]">

                                  <div className="w-full items-center grid lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 md:gap-[80px] gap-6">
                                    <QuantityBox/>
                                      <div className="flex items-center gap-4 justify-center">
                                    <div className="w-full">
                                      <PrimaryButton className='w-full h-[54px]' text='Buy for 0.11 SOL' />
                                    </div>

                                    <div className="w-full">
                                      <button className='border transition duration-300 hover:bg-primary-color hover:border-primary-color hover:text-black-1000 cursor-pointer w-full text-base font-semibold border-gray-1200 text-white rounded-full h-[56px] flex items-center justify-center'>
                                        Add To Cart
                                      </button>
                                    </div>
                                    </div>

                                  </div>

                                </div>
                                :
                            <div className="w-full mt-6 flex flex-col gap-4 sm:py-[22px] pt-5 pb-4 px-4 sm:px-[26px] rounded-[20px] bg-primary-color/30 border border-primary-color border-t-4">
                              <div className="flex items-center gap-3">
                                <img src="/icons/crown_icon.svg" alt="" />
                                <h3 className='text-xl text-white font-semibold font-inter'>Raffle Winners</h3>
                              </div>

                              <div className="w-full grid grid-cols-3 gap-4">
                                <div className="bg-black-1300 px-3 py-3.5 rounded-xl flex items-center gap-5">
                                  <div className="flex items-center gap-3">
                                    <img src="/images/home/user-tool-img-1.png" className='w-10 h-10 rounded-full object-cover' alt="" />
                                    <div className="">
                                      <h3 className='text-sm text-white font-semibold'>GKo6...kEgV</h3>
                                      <p className='text-xs text-gray-1200'>Won with 2 Ticket(s)</p>
                                    </div>
                                  </div>

                                  <div className="flex relative items-center justify-center">
                                    <img src="/images/polygon-shape.png" alt="" />
                                    <p className="absolute text-black-1000 font-semibold">1</p>
                                  </div>

                                </div>

                                  <div className="bg-black-1300 px-3 py-3.5 rounded-xl flex items-center gap-5">
                                  <div className="flex items-center gap-3">
                                    <img src="/images/home/user-tool-img-1.png" className='w-10 h-10 rounded-full object-cover' alt="" />
                                    <div className="">
                                      <h3 className='text-sm text-white font-semibold'>GKo6...kEgV</h3>
                                      <p className='text-xs text-gray-1200'>Won with 2 Ticket(s)</p>
                                    </div>
                                  </div>

                                  <div className="flex relative items-center justify-center">
                                    <img src="/images/polygon-shape-2.png" alt="" />
                                    <p className="absolute text-black-1000 font-semibold">1</p>
                                  </div>

                                </div>

                                  <div className="bg-black-1300 px-3 py-3.5 rounded-xl flex items-center gap-5">
                                  <div className="flex items-center gap-3">
                                    <img src="/images/home/user-tool-img-1.png" className='w-10 h-10 rounded-full object-cover' alt="" />
                                    <div className="">
                                      <h3 className='text-sm text-white font-semibold'>GKo6...kEgV</h3>
                                      <p className='text-xs text-gray-1200'>Won with 2 Ticket(s)</p>
                                    </div>
                                  </div>

                                  <div className="flex relative items-center justify-center">
                                    <img src="/images/polygon-shape-3.png" alt="" />
                                    <p className="absolute text-black-1000 font-semibold">1</p>
                                  </div>

                                </div>

                              </div>
                     
                            </div>
                               }
    
                                <div className="w-full">
                                    <div className="w-full overflow-x-auto">
                                    <ul className="inline-flex items-center bg-white/15 gap-3 2xl:gap-4 mb-6 mt-10 p-1 rounded-full sm:w-auto">
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
                                </div>
                                {tabs[0].active &&
                                 <ParticipantsTable/>
                                }
    
                                {tabs[1].active &&
                                 <TransactionsTable/>
                                }
    
                                {tabs[2].active &&
                                 <TermsConditions/>
                                }
                                
                                </div>
    
    
                            </div>
                        </div>
                    </div>
                    <div className="md:hidden block border-t border-solid border-gray-1100">
                              <div className="w-full pb-7 pt-6 md:py-10 flex items-center justify-between">
                                <div className="flex items-center gap-5 md:gap-3 2xl:gap-5">
                                  <img
                                    src={raffle?.userAvatar}
                                    className="w-12 h-12 rounded-full object-cover"
                                    alt=""
                                  />
                                  <h3 className="md:text-[28px] text-lg font-bold text-white font-inter">
                                    {raffle?.userName}
                                  </h3>
                                </div>
                
                                <ul className="flex items-center gap-6">
                                  <li>
                                    <a href="#">
                                      <img
                                        src="/icons/twitter-icon.svg"
                                        className="md:w-7 md:h-7 w-6 h-6 object-contain"
                                        alt=""
                                      />
                                    </a>
                                  </li>
                
                                  <li>
                                    <a href="#">
                                      {" "}
                                      <img
                                        src="/icons/mcp-server-icon.svg"
                                        className="md:w-7 md:h-7 w-6 h-6 object-contain"
                                        alt=""
                                      />
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div className="w-full space-y-5">
                                {UserDetails.map((section, index) => (
                                  <Disclosure
                                    as="div"
                                    key={section.title}
                                    defaultOpen={index === 0}
                                    className="w-full py-4 md:py-6 px-5 border border-gray-1100 rounded-[20px]"
                                  >
                                    {({ open }) => (
                                      <>
                                        <Disclosure.Button
                                          className={`flex items-center justify-between w-full text-base md:text-xl font-bold font-inter text-white ${
                                            open ? "text-primary-color" : ""
                                          }`}
                                        >
                                          <span>{section.title}</span>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={16}
                                            height={9}
                                            viewBox="0 0 16 9"
                                            fill="none"
                                            className={`${open ? `rotate-180` : ``} transition-transform`}
                                          >
                                            <path
                                              d="M15 1L8 8L1 1"
                                              stroke="currentColor"
                                              strokeWidth={2}
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                        </Disclosure.Button>
                
                                        <Disclosure.Panel className="w-full">
                                          <ul className="space-y-6 pt-6">
                                            {section.items.map((item) => (
                                              <li
                                                key={item.label}
                                                className="flex items-center justify-between"
                                              >
                                                <p className="md:text-base text-sm font-inter font-medium text-gray-1200">
                                                  {item.label}
                                                </p>
                                                <p className="md:text-base text-sm font-inter font-medium text-white">
                                                  {item.value}
                                                </p>
                                              </li>
                                            ))}
                                          </ul>
                                        </Disclosure.Panel>
                                      </>
                                    )}
                                  </Disclosure>
                                ))}
                              </div>
                    </div>
                </div>
            </div>
        </section>
        
    </main>
  )
}
