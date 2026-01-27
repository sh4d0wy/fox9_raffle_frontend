import { Dialog, DialogPanel } from "@headlessui/react";
import TicketsTable from "../gumballs/TicketsTable";
import { PrimaryLink2 } from "../ui/PrimaryLink2";

interface TicketCartModelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TicketCartModel({ isOpen, onClose }: TicketCartModelProps) {


  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none bg-black/80"
      onClose={onClose}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/80">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-[854px] rounded-xl pb-4 bg-black-1300 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0">
            <div className="flex items-center justify-between border-b border-gray-1400 px-[22px] pt-6 pb-4 mb-6">
              <h4 className="text-lg text-white font-semibold font-inter">Ticket Cart</h4>
              <button
                onClick={onClose}
                className="flex items-center justify-center cursor-pointer hover:scale-110 transition duration-300"
              >
                <img src="/icons/cross-icon-2.svg" alt="cross" />
              </button>
            </div>

            <div className="w-full px-5">
                <TicketsTable/>
            </div>

            
              <div className="w-full mt-32 p-5 border-t border-gray-1100">
                <div className="w-full flex items-center gap-2 mb-6">
                  <h4 className="text-base text-primary-color font-semibold font-inter">Wallet:</h4>
                  <div className="flex items-center gap-1">
                    <img src="/images/fox-icon-1.png" className="w-[30px] h-[30px]" alt="no-img" />
                    <h5 className="text-base font-inter text-white">He1v..J5zi</h5>
                  </div>
                </div>

                <div className="w-full flex md:flex-nowrap flex-wrap gap-5">
                  <div className="md:w-2/3 w-full flex items-center justify-between rounded-[10px] bg-primary-color/15 py-3 px-5">
                  <div className="">
                    <h3 className="text-sm text-gray-1200 mb-3">Total Tickets</h3>
                    <h2 className="text-xl font-semibold text-white font-inter">01</h2>
                  </div>
                  <div className="border-r borer-gray-1100 h-[55px]"></div>

                     <div className="">
                    <h3 className="text-sm text-end text-gray-1200 mb-3">Total Cost</h3>
                    <h2 className="text-xl text-end font-semibold text-white font-inter">0.118 SOL</h2>
                  </div>

                  </div>

                  <div className="md:w-1/3 w-full">
                    <div className="w-full flex items-center gap-2">
                      <h3 className="text-base font-semibold font-inter text-primary-color">Balance:</h3>
                      <h4 className="text-base font-inter font-semibold text-white">0.17 SOL</h4>
                    </div>

                    <div className="mt-5 w-full">
                      <PrimaryLink2 text="Check Out" className="w-full" link="#" />
                    </div>


                  </div>

                </div>

              </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
