import { createFileRoute, Link } from '@tanstack/react-router'
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from 'react';
import { AgreeCheckbox } from '@/components/common/AgreeCheckbox';
import AdvancedSettingsAccordion from '@/components/home/AdvancedSettings';
import AmountInput from '@/components/home/AmountInput';
import TimeSelector from '@/components/ui/TimeSelector';
import FormInput from '@/components/ui/FormInput';
import DateSelector from '@/components/ui/DateSelector';
import CreateTokenModel from '@/components/gumballs/CreateTokenModel';

export const Route = createFileRoute('/raffles/create_raffles')({
  component: CreateRaffles,
})

function CreateRaffles() {
     const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
    const [showModel, setShowModel] = useState(false)



  return <div className='bg-black-1400'>
      <section className="md:pt-48 pt-36 pb-[122px]">
        <div className="max-w-[1440px] mx-auto w-full px-4 lg:px-10">
          <div>
            <Link to={"/"}
              className="bg-gray-1000 mb-10 rounded-[80px] inline-flex h-10 md:h-[49px] justify-center items-center pl-5 pr-3.5 md:px-6 gap-2 md:gap-2.5  md:text-base text-sm font-semibold text-white font-inter"
>
              <span>
                <img src="/icons/back-arw.svg" className='invert' alt="" />
              </span>
              Back
            </Link>
            <div className="flex items-start md:flex-row flex-col gap-[42px] md:gap-5 lg:gap-10">
              <div className="lg:w-2/6 md:w-2/5 w-full">
                <div className="flex items-start gap-10 pb-5">
                  <div className="w-full">
                    <div className="relative border-2 border-dashed border-gray-1000 h-[361px] lg:h-[450px] bg-black-1400 rounded-[20px] flex items-center justify-center flex-col">
                      <h4 className="font-inter mb-5 lg:mb-6 font-semibold lg:text-2xl text-lg text-white">
                        Add an NFT prize
                      </h4>
                      <Link
                        to={"."}
                        className="text-black-1000 hover:from-primary-color hover:via-primary-color hover:to-primary-color font-semibold text-sm lg:text-base leading-normal font-inter h-10 lg:h-11 rounded-full inline-flex items-center justify-center px-5 lg:px-[26px] transition duration-500 hover:opacity-90 bg-primary-color gap-2"
                      >
                        <span className="w-6 h-6 flex items-center justify-center">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.75 6.75H12.75M6.75 0.75V12.75"
                              stroke="#212121"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </span>
                        Add
                      </Link>
                    </div>
                  </div>
                </div>
                <div>
                  <Link
                    to={"."}
                    onClick={openModal}
                    className="flex items-center justify-between border border-solid border-gray-1100 rounded-[20px] h-[60px] px-5"
                  >
                    <p className="text-white xl:text-lg text-base font-medium font-inter">
                      View all verified collections
                    </p>
                    <span>
                      <img src="/icons/right-arw.svg" className='invert' alt="" />
                    </span>
                  </Link>
                  <p className="md:text-2xl text-xl font-bold font-inter text-white/30 pt-[22px] pb-[31px] md:pt-7 md:pb-5 text-center">
                    or
                  </p>
                  <div className="bg-primary-color/10 border border-primary-color px-4 md:px-5 py-6 rounded-[20px] mb-5">
                    <p className="md:text-xl text-base font-inter font-bold text-primary-color pb-6">
                      Add a token prize
                    </p>
                    <label
                      htmlFor=""
                      className="text-gray-1200 font-medium text-sm font-inter block pb-2.5"
                    >
                      Raffle tokens
                    </label>
                    <FormInput
                      placeholder="Enter Amount"
                    />
                    <small className="md:text-sm text-xs font-medium text-orange-1100 font-inter block pt-4">
                      No Available Tokens
                    </small>
                  </div>
                  <Link
                    to={"."}
                    className="flex items-center justify-between border border-solid border-gray-1100 rounded-[20px] h-[54px] md:h-[60px] px-5"
                  >
                    <p className="text-white xl:text-lg text-base font-medium font-inter">
                      View all prize tokens
                    </p>
                    <span>
                      <img src="/icons/right-arw.svg" className='invert' alt="" />
                    </span>
                  </Link>
                </div>
              </div>
              <div className="lg:w-4/6 md:w-3/5 w-full">
                <div>
                  <div>
                    <p className="text-primary-color text-base font-medium font-inter">
                      Please link your twitter and discord in your profile or
                      your raffles won't be shown.
                    </p>
                    <div className="w-full my-5 md:my-10">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="">
                          <DateSelector label="Raffle end date" />
                          <ol className="flex items-center gap-4 pt-2.5">
                            <li className="w-full">
                              <Link
                                to="."
                                className=" rounded-[7px]  bg-black-1300 px-2.5 h-10 flex items-center justify-center text-sm font-semibold font-inter text-white w-full"
                              >
                                24hr
                              </Link>
                            </li>
                            <li className="w-full">
                              <Link
                                to="."
                                className=" rounded-[7px]  bg-black-1300 px-2.5 h-10 flex items-center justify-center text-sm font-semibold font-inter text-white w-full"
                              >
                                36hr
                              </Link>
                            </li>
                            <li className="w-full">
                              <Link
                                to="."
                                className=" rounded-[7px]  bg-black-1300 px-2.5 h-10 flex items-center justify-center text-sm font-semibold font-inter text-white w-full"
                              >
                                48hr
                              </Link>
                            </li>
                          </ol>
                        </div>
                        <div className="">
                          <TimeSelector label="End Time" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-5 lg:flex-row flex-col">
                      <div className="w-full">
                        <div className="flex items-center justify-between pb-2.5">
                          <p className="text-gray-1200 font-inter text-sm font-medium">
                            Supply
                          </p>
                          <p className="text-gray-1200 font-inter text-sm font-medium">
                            Min: 3 / Max: 10,000
                          </p>
                        </div>
                        <FormInput 
                          type='number'
                          placeholder='Enter Count'
                          id='count'
                        />
                  
                        <p className="text-sm font-medium text-white pt-2.5 font-inter">
                          Rent: 0
                        </p>
                      </div>
                      <div className="w-full">
                        <div className="flex items-center justify-between pb-2.5">
                          <p className="text-gray-1200 font-inter text-sm font-medium">
                            Ticket Price
                          </p>
                        </div>
                        <AmountInput/>
                   
                        <p className="text-sm font-medium text-white pt-2.5 font-inter">
                          TTV: 5,382 SOL
                        </p>
                      </div>
                    </div>
                    <AdvancedSettingsAccordion/>
                
                    <div>
                      <div className="mb-10 grid xl:grid-cols-2 gap-5 md:gap-4">
                       <AgreeCheckbox/>
                        <button
                          onClick={()=> setShowModel(true)}
                          className="text-black-1000 cursor-pointer font-semibold hover:from-primary-color hover:to-primary-color hover:via-primary-color text-sm md:text-base leading-normal font-inter h-11 md:h-14 rounded-full inline-flex items-center justify-center w-full transition duration-500 hover:opacity-90 bg-primary-color"
                        >
                          Create Raffle
                        </button>
                      </div>
                      <div className="bg-black-1300 rounded-[20px] md:p-6 px-4 py-5">
                        <h4 className="text-primary-color font-bold text-base md:text-xl leading-normal mb-6">
                          Terms & Conditions
                        </h4>
                        <ul className='space-y-2'>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              1.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                              When you add prizes to a Gumball, the prizes will
                              be transferred from your wallet into an escrow
                              wallet.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              2.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                              You will be charged an up-front rent fee, in SOL,
                              which will be taken in proportion to the number of
                              prizes you choose to add to the Gumball, with a
                              maximum rent fee of 0.72 SOL. The rent fee will be
                              automatically refunded after the Gumball has been
                              closed.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              3.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                              FFF and TFF holders will get a 50% fee waiver for
                              staking or sending foxes on missions prior to
                              creating the Gumball and will be hosted on the
                              "Featured" section of the home page.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              4.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                              The prizes that do not get sold will be returned
                              to you upon closing the Gumball.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              5.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                              You can specify the amount of time a Gumball runs
                              at the creation of the Gumball. Gumballs require a
                              minimum 24 hour run time.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              6.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                              You can end the Gumball machine early if the
                              expected value is at least -90% based on remaining
                              prizes or if it has been at least 10 hours since
                              the last spin on that Gumball.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              7.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                              FFF will take a total of 5% commission fee from
                              the Gumball sales.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              8.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                              To enable Holder-only, you will be charged 1 SOL
                              per Gumball creation, withdrawn at the time of
                              creation. More information about holder-only
                              Gumballs is available on the create Gumball site.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              9.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                              Scheduled Gumballs will start at the scheduled
                              date and time even if not all prizes have been
                              added.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              10.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                              Gumballs CANNOT be edited once it has been
                              launched. Gumballs cannot restart once it has been
                              stopped.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              11.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                              Once one Gumball has sold, the machine cannot be
                              closed until the specified end date.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%]  w-6">
                              12.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                              Gumball, its agents, directors, or officers shall
                              not assume any liability or responsibility for
                              your use of Gumball, promoting or marketing the
                              Gumballs.
                            </p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-white font-medium font-inter text-sm md:text-base leading-[160%] w-6">
                              13.
                            </span>
                            <p className="flex-1 w-full text-white font-medium font-inter text-sm md:text-base leading-[160%] break-all">
                              Gumball currently does not support cNFTs, the
                              program ID is:
                              <strong className="font-medium block">
                                MGUMqztv7MHgoHBYWbvMyL3E3NJ4UHfTwgLJUQAbKGa
                              </strong>
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="max-w-[962px] relative w-full transform overflow-hidden pt-5 pb-6 md:pb-[89px] rounded-[20px] bg-black-1300 text-left align-middle shadow-xl transition-all">
                  <div className="flex md:gap-0 gap-5 md:items-center md:flex-row flex-col justify-between px-5 pb-5 md:pb-7 mb-7 border-b border-solid border-gray-1100">
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-white pb-3.5"
                      >
                        Verified Collections
                      </Dialog.Title>
                      <p className="text-sm font-medium font-inter text-white">
                        <Link to="." className=" text-primary-color">
                          Contact us
                        </Link>{" "}
                        to get your NFT verified
                      </p>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="relative md:w-auto w-full">
                        <FormInput
                          className="h-10! pl-[46px] rounded-[80px]!"
                          placeholder="Search"
                        />
                        <span className="absolute top-1/2  z-10 left-3 -translate-y-1/2">
                          <img src="/icons/search-icon.svg" className='w-5 h-5' alt="" />
                        </span>
                      </div>
                      <button
                        type="button"
                        className="inline-flex cursor-pointer justify-center md:static absolute top-5 right-4 border border-transparent focus:outline-none focus-visible:ring-0"
                        onClick={closeModal}
                      >
                        <img src="/icons/cross-icon-2.svg" className='w-6' alt="" />
                      </button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 px-5 gap-2.5 md:gap-10">
                    <div>
                      <ol>
                        <li className="md:pb-5 pb-2.5">
                          <Link
                            to="."
                            className="rounded-lg hover:bg-black-1300 h-10 md:h-12 px-3.5 md:px-5 flex items-center text-sm md:text-base font-medium font-inter text-white border border-solid border-gray-1100"
                          >
                            Famous Fox Federation
                          </Link>
                        </li>
                        <li className="md:pb-5 pb-2.5">
                          <Link
                            to="."
                            className="rounded-lg hover:bg-black-1300 h-10 md:h-12 px-3.5 md:px-5 flex items-center text-sm md:text-base font-medium font-inter text-white border border-solid border-gray-1100"
                          >
                            Famous Fox Dens
                          </Link>
                        </li>
                        <li className="md:pb-5 pb-2.5">
                          <Link
                            to="."
                            className="rounded-lg hover:bg-black-1300 h-10 md:h-12 px-3.5 md:px-5 flex items-center text-sm md:text-base font-medium font-inter text-white border border-solid border-gray-1100"
                          >
                            0rphans
                          </Link>
                        </li>
                        <li className="md:pb-5 pb-2.5">
                          <Link
                            to="."
                            className="rounded-lg hover:bg-black-1300 h-10 md:h-12 px-3.5 md:px-5 flex items-center text-sm md:text-base font-medium font-inter text-white border border-solid border-gray-1100"
                          >
                            AGE of SAM
                          </Link>
                        </li>
                        <li className="md:pb-5 pb-2.5">
                          <Link
                            to="."
                            className="rounded-lg hover:bg-black-1300 h-10 md:h-12 px-3.5 md:px-5 flex items-center text-sm md:text-base font-medium font-inter text-white border border-solid border-gray-1100"
                          >
                            Aiternate - Entities
                          </Link>
                        </li>
                        <li className="md:block hidden">
                          <Link
                            to="."
                            className="rounded-lg hover:bg-black-1300 h-10 md:h-12 px-3.5 md:px-5 flex items-center text-sm md:text-base font-medium font-inter text-white border border-solid border-gray-1100"
                          >
                            Alpha Pharaohs
                          </Link>
                        </li>
                      </ol>
                    </div>
                    <div className="md:block hidden">
                      <ol>
                        <li className="md:pb-5 pb-2.5">
                          <Link
                            to="."
                            className="rounded-lg hover:bg-black-1300 h-10 md:h-12 px-3.5 md:px-5 flex items-center text-sm md:text-base font-medium font-inter text-white border border-solid border-gray-1100"
                          >
                            Transdimensional Fox Federation
                          </Link>
                        </li>
                        <li className="md:pb-5 pb-2.5">
                          <Link
                            to="."
                            className="rounded-lg hover:bg-black-1300 h-10 md:h-12 px-3.5 md:px-5 flex items-center text-sm md:text-base font-medium font-inter text-white border border-solid border-gray-1100"
                          >
                            Famous Fox Friends & Foes
                          </Link>
                        </li>
                        <li className="md:pb-5 pb-2.5">
                          <Link
                            to="."
                            className="rounded-lg hover:bg-black-1300 h-10 md:h-12 px-3.5 md:px-5 flex items-center text-sm md:text-base font-medium font-inter text-white border border-solid border-gray-1100"
                          >
                            ABC
                          </Link>
                        </li>
                        <li className="md:pb-5 pb-2.5">
                          <Link
                            to="."
                            className="rounded-lg hover:bg-black-1300 h-10 md:h-12 px-3.5 md:px-5 flex items-center text-sm md:text-base font-medium font-inter text-white border border-solid border-gray-1100"
                          >
                            AGE of SAM PFP
                          </Link>
                        </li>
                        <li className="md:pb-5 pb-2.5">
                          <Link
                            to="."
                            className="rounded-lg hover:bg-black-1300 h-10 md:h-12 px-3.5 md:px-5 flex items-center text-sm md:text-base font-medium font-inter text-white border border-solid border-gray-1100"
                          >
                            Aiternate - Holotabs
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="."
                            className="rounded-lg hover:bg-black-1300 h-10 md:h-12 px-3.5 md:px-5 flex items-center text-sm md:text-base font-medium font-inter text-white border border-solid border-gray-1100"
                          >
                            Alpha Wolves
                          </Link>
                        </li>
                      </ol>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

       <CreateTokenModel  isOpen={showModel} onClose={()=>setShowModel(false)} />
  </div>
}
