import { useCreatorProfileStore } from "store/creatorProfile-store";
import InputSwitch from "../ui/Switch";

export const BuySettings = () => {

     const {
        enabled,
        setEnabled,
      } = useCreatorProfileStore();


  return (
    <div className="w-full">
        <h2 className="text-xl font-bold text-black-1000 font-inter">Buy back Settings</h2>
        <p className="md:text-base font-inter text-black-1000 mt-7 mb-10">(Optional) You can now offer the immediate buy back of the prize from the winner at a percentage of the floor price!
        You will need to deposit funds into escrow that will be used to buy back the prizes.</p>

        <div className="w-full mt-5 mb-10 flex items-center justify-between bg-primary-color/5 border border-primary-color rounded-[10px] px-5 py-3">
        <p className='md:text-base text-sm font-inter font-semibold text-black-1000'>Set as profile default page</p>
            <InputSwitch
            checked={enabled}
            onChange={setEnabled}
            />
        </div>


            <div className="bg-black-1300 rounded-[20px] md:p-6 p-4">
                        <h4 className="text-primary-color font-bold text-xl leading-normal mb-6">Notes</h4>
                        <ul>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-black-1000 font-medium font-inter text-base leading-[160%]  w-6">1.</span>
                            <p className="flex-1 w-full text-black-1000 font-medium font-inter md:text-base text-sm leading-[160%]">Buy backs can not be turned off once the gumball is live.</p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-black-1000 font-medium font-inter md:text-base text-sm leading-[160%]  w-6">2.</span>
                            <p className="flex-1 w-full text-black-1000 font-medium font-inter md:text-base text-sm leading-[160%]">Any buy backs will be returned to your wallet.</p>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-black-1000 font-medium font-inter md:text-base text-sm leading-[160%]  w-6">3.</span>
                            <p className="flex-1 w-full text-black-1000 font-medium font-inter md:text-base text-sm leading-[160%]">You can add prizes back into the gumball via the 'Load prizes' tab.</p>
                          </li>
                           <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-black-1000 font-medium font-inter md:text-base text-sm leading-[160%]  w-6">4.</span>
                            <p className="flex-1 w-full text-black-1000 font-medium font-inter md:text-base text-sm leading-[160%]">The winner can sell the prize back to you for up to 1 hour.</p>
                          </li>
                            <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-black-1000 font-medium font-inter md:text-base text-sm leading-[160%]  w-6">5.</span>
                            <p className="flex-1 w-full text-black-1000 font-medium font-inter md:text-base text-sm leading-[160%]">The price of the prize will be based on the floor price at the time of gumball creation.</p>
                          </li>
                            <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-black-1000 font-medium font-inter md:text-base text-sm leading-[160%]  w-6">6.</span>
                            <p className="flex-1 w-full text-black-1000 font-medium font-inter md:text-base text-sm leading-[160%]">There is a 2% marketplace fee on buy backs</p>
                          </li>
                              <li className="flex items-start gap-1.5">
                            <span className="flex items-start justify-end text-black-1000 font-medium font-inter md:text-base text-sm leading-[160%]  w-6">7.</span>
                            <p className="flex-1 w-full text-black-1000 font-medium font-inter md:text-base text-sm leading-[160%]">Any remaining escrow balance will be returned when closing the Gumball </p>
                          </li>
                        
                        </ul>
            </div>

            <h4 className="md:text-xl text-base text-black-1000 font-bold font-inter md:my-10 my-8">Moneyback or big hit</h4>

                  <div className="w-full grid md:grid-cols-4 grid-cols-2 bg-black-1300 border border-gray-1100 p-6 gap-10 rounded-[10px]">
            <div className="">
                <h3 className='md:text-base text-sm text-black-1000 font-medium font-inter mb-[22px]'>Buy Backs</h3>
                <h4 className='text-2xl font-bold font-inter text-black-1000'>0/10</h4>
            </div>

               <div className="">
                <h3 className='md:text-base text-sm text-black-1000 font-medium font-inter mb-[22px]'>Profit from buy backs</h3>
                <h4 className='text-2xl font-bold font-inter text-black-1000'>0 SOL</h4>
            </div>


          </div>


    </div>
  )
}
