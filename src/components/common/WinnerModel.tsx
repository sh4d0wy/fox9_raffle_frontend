import { Dialog, DialogPanel } from "@headlessui/react";
import { Link } from "@tanstack/react-router";

interface WinnerModelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WinnerModel({ isOpen, onClose }: WinnerModelProps) {
 


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
            className="w-full max-w-[536px] rounded-xl pb-10 bg-black-1300 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <div className="flex items-center justify-between px-[22px] pt-6 pb-2">
              <h4 className="text-lg text-white font-semibold font-inter"></h4>
              <button
                onClick={onClose}
                className="flex items-center justify-center cursor-pointer hover:scale-110 transition duration-300"
              >
                <img src="/icons/cross-icon-2.svg" className="w-6" alt="cross" />
              </button>
            </div>

            <div className="w-full px-5 flex flex-col items-center justify-center gap-4 ">
              <img src="/images/winner-img-1.png" className="w-[111px]" alt="" />
              <p className="text-[22px] text-center text-primary-color py-1 px-5 rounded-full bg-primary-color/20 w-fit">WINNER!</p>
              <h3 className="text-center text-white text-[42px] font-semibold">Congratulation! 🎉</h3>
              <h5 className="text-white text-xl text-center ">You won <span className="text-primary-color">reffle #88</span></h5>
              <Link to="." className="bg-primary-color transition duration-300 hover:bg-primary-color/90 group flex items-center justify-center gap-2 rounded-full text-black-1000 px-6 py-3 font-semibold " >
                <img src="/icons/gift-line-icon.svg" alt="" />
              Claim your prize now
                <img src="/icons/arrow-style-1.svg" className="group-hover:translate-x-1 transition duration-300" alt="" />
              
              </Link>
            </div>



          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
