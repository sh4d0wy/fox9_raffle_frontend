import { Transition } from "@headlessui/react";
import { Link } from "@tanstack/react-router";
import { Fragment } from "react";
import { toast } from "sonner";

interface WinnerToastProps {
  isOpen: boolean;
  onClose: () => void;
  id: number;
  toastId: string;
}

export default function WinnerToast({ isOpen, onClose,id,toastId }: WinnerToastProps) {
  return (
    <Transition
      show={isOpen}
      as={Fragment}
    >
      <div className="fixed top-4 right-4 z-50 w-full max-w-[356px]">
        <div className="border border-primary-color border-b-4 overflow-hidden rounded-xl bg-black-1300 backdrop-blur-2xl shadow-lg">
          <div className="w-full bg-primary-color/10">
            <div className="flex items-center justify-between px-4 pt-3 -mb-4">
              <h4 className="text-lg text-white font-semibold font-inter"></h4>
              <button
                onClick={() => toast.dismiss(toastId)}
                className="flex items-center justify-center cursor-pointer hover:scale-110 transition duration-300"
              >
                <img src="/icons/cross-icon-2.svg" className="w-6" alt="cross" />
              </button>
            </div>

            <div className="w-full px-5 flex flex-row items-center justify-center gap-5 pb-2">
              <img src="/images/winner-img-1.png" className="max-w-[60px]" alt="" />
              <div className="flex-1">
                <p className="text-[13px] text-primary-color py-1 px-4 rounded-full bg-primary-color/20 w-fit">
                  WINNER!
                </p>
                <h3 className="text-white text-xl my-2 font-semibold">
                  Congratulation! 🎉
                </h3>
                <h5 className="text-white text-base">
                  You won <span className="text-primary-color">reffle #{id}</span>
                </h5>
                <Link
                onClick={() => toast.dismiss(toastId)}
                  to="/raffles/$id"
                  params={{ id: id?.toString() ?? "" }}
                  className="transition duration-300 group flex items-center gap-2 rounded-full text-primary-color py-3 font-semibold"
                >
                  Claim your prize now
                  <img
                    src="/icons/arrow-style-11.svg"
                    className="group-hover:translate-x-1 transition duration-300"
                    alt=""
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}