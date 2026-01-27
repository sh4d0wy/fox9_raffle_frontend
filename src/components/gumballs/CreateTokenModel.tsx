import { Dialog, DialogPanel } from "@headlessui/react";
import { ChooseToken } from "./ChooseToken";
import { PrimaryLink2 } from "../ui/PrimaryLink2";

interface CreateTokenModelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTokenModel({ isOpen, onClose }: CreateTokenModelProps) {
 


  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-50 focus:outline-none bg-black/80"
      onClose={onClose}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/80">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-[536px] rounded-xl pb-4 bg-black-1300 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <div className="flex items-center justify-between border-b border-gray-1400 px-[22px] pt-6 pb-4 mb-6">
              <h4 className="text-lg text-white font-semibold font-inter">Add Token</h4>
              <button
                onClick={onClose}
                className="flex items-center justify-center cursor-pointer hover:scale-110 transition duration-300"
              >
                <img src="/icons/cross-icon-2.svg" alt="cross" />
              </button>
            </div>

            <div className="w-full px-5">
             <ChooseToken/>

            </div>
             <div className="border-t my-6 w-full border-gray-1100"></div>


            <div className="w-full px-5">
             <ChooseToken/>

            </div>
             <div className="border-t mt-[66px] w-full border-gray-1100"></div>


            <div className="w-full grid md:grid-cols-2 grid-cols-1 md:gap-5 gap-3 px-5 pt-4">
                <button className="inline-flex group transition duration-300 cursor-pointer hover:bg-primary-color hover:text-black-1000 text-sm text-gray-1200 font-semibold items-center justify-center border border-gray-1200 hover:border-primary-color rounded-full py-2 px-6">
                    <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >

                    <path
                        d="M6 12H18M12 6V18"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    </svg>

                    <span>Add Tokens</span>
                </button>

                <PrimaryLink2 className="text-sm" link="#" text="Save" />


            </div>

          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
