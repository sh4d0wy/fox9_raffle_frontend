import { Link } from '@tanstack/react-router'

export const LoadPrizesTab = () => {
  return (
    <div className='w-full'>
         <div className="flex items-center gap-5 border border-solid border-primary-color rounded-[10px] bg-primary-color/5 py-4 px-5">
            <div>
              <p className="md:text-lg text-base text-primary-color font-medium font-inter pb-2.5 leading-7">
                Load your prizes into the Gumball machine
              </p>
              <p className="md:text-lg text-sm font-medium text-white font-inter leading-7">
                You can load a mix ofNFTs or  Tokens from our verified list. If you enable buy back, you’ll be able to top this up when the machine is live
              </p>
            </div>
          </div>

          <div className="w-full grid md:grid-cols-4 grid-cols-2 gap-5">
            <div className="bg-black-1300 flex-1 border border-gray-1000 my-10  px-6 py-4 rounded-[10px] flex flex-col items-center justify-center">
                <h3 className='text-base text-white font-medium font-inter mb-5'>Price Loaded</h3>
                <h4 className='text-2xl font-bold font-inter text-white'>0/10</h4>
            </div>

               <div className="bg-black-1300 flex-1 border border-gray-1000 my-10  px-6 py-4 rounded-[10px] flex flex-col items-center justify-center">
                <h3 className='text-base text-white font-medium font-inter mb-[22px]'>Total Prize Value</h3>
                <h4 className='text-2xl font-bold font-inter text-white'>0 SOL</h4>
            </div>

               <div className="bg-black-1300 flex-1 border border-gray-1000 my-10  px-6 py-4 rounded-[10px] flex flex-col items-center justify-center">
                <h3 className='text-base text-white font-medium font-inter mb-[22px]'>Max Proceeds</h3>
                <h4 className='text-2xl font-bold font-inter text-white'>0 SOL</h4>
            </div>

               <div className="bg-black-1300 flex-1 border border-gray-1000 my-10  px-6 py-4 rounded-[10px] flex flex-col items-center justify-center">
                <h3 className='text-base text-white font-medium font-inter mb-[22px]'>Max ROI</h3>
                <h4 className='text-2xl font-bold font-inter text-white'>-</h4>
            </div>

          </div>

          <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-[28px]">

               <div className="relative border-2 border-solid border-gray-1000 bg-black-1300 rounded-[20px]">
                   <div className="w-full p-5">
                    <h2 className='lg:text-xl text-lg text-primary-color font-bold font-inter'>NFTs</h2>
                    <div className="w-full flex items-center justify-center flex-col md:my-24 my-10">
                    <h4 className="font-inter mb-5 lg:mb-6 font-medium lg:text-xl text-lg text-white/30">
                    Add NFT prize
                    </h4>
                    <Link
                    to={"."}
                    className="text-black-1000 font-semibold hover:from-primary-color hover:via-primary-color hover:to-primary-color text-sm lg:text-base leading-normal font-inter h-10 lg:h-11 rounded-full inline-flex items-center justify-center px-5 lg:px-[26px] transition duration-500 hover:opacity-90 bg-primary-color gap-2"
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
                            stroke="#000"
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

                   <div className="w-full p-5 border-t border-gray-1000">
                    <p className='text-base text-gray-1200 font-semibold font-inter'>0 Prizes Added</p>

                   </div>

                </div>

                <div className="relative border-2 border-solid border-gray-1000 bg-black-1300 rounded-[20px]">
                   <div className="w-full p-5">
                    <h2 className='lg:text-xl text-lg text-primary-color font-bold font-inter'>Tokens</h2>
                    <div className="w-full flex items-center justify-center flex-col md:my-24 my-10">
                    <h4 className="font-inter mb-5 lg:mb-6 font-medium lg:text-xl text-lg text-white/30">
                    Add Tokens prize
                    </h4>
                       <Link
                    to={"."}
                    className="text-black-1000 font-semibold hover:from-primary-color hover:via-primary-color hover:to-primary-color text-sm lg:text-base leading-normal font-inter h-10 lg:h-11 rounded-full inline-flex items-center justify-center px-5 lg:px-[26px] transition duration-500 hover:opacity-90 bg-primary-color gap-2"
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
                            stroke="#000"
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

                   <div className="w-full p-5 border-t border-gray-1000">
                    <p className='text-base text-gray-1200 font-semibold font-inter'>0 Prizes Added</p>

                   </div>

                </div>

            
          </div>


    </div>
  )
}
