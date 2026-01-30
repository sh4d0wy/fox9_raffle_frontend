import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

interface WinnerToastProps {
  id: number;
  toastId: string;
}

export default function WinnerToast({ id, toastId }: WinnerToastProps) {
  return (
    <div className="max-w-sm w-full bg-black-1300 shadow-2xl rounded-2xl pointer-events-auto border border-primary-color border-b-4 overflow-hidden animate-in slide-in-from-right fade-in duration-500">
      <div className="w-full bg-primary-color/10">
        <div className="flex items-center justify-between px-4 pt-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-color bg-primary-color/20 px-2 py-0.5 rounded-full">
            WINNER!
          </span>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-1000 transition-colors text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="w-full px-4 pb-4 flex flex-row items-center gap-4">
          <img src="/images/winner-img-1.png" className="w-14 h-14 object-contain" alt="winner" />
          <div className="flex-1">
            <h3 className="text-white text-lg font-semibold">
              Congratulations! 🎉
            </h3>
            <p className="text-white text-sm">
              You won <span className="text-primary-color font-semibold">raffle #{id}</span>
            </p>
            <Link
              onClick={() => toast.dismiss(toastId)}
              to="/raffles/$id"
              params={{ id: id?.toString() ?? "" }}
              className="transition duration-300 group flex items-center gap-1 text-primary-color text-xs mt-1 font-medium"
            >
              Claim your prize now
              <img
                src="/icons/arrow-style-11.svg"
                className="w-4 h-4 group-hover:translate-x-1 transition duration-300"
                alt=""
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="h-1 bg-primary-color" />
    </div>
  );
}