import { Link } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react";
import { toast } from "sonner";

const EndedRaffleToast = ({id, totalEntries, toastId}: {id: number, totalEntries: number, toastId: string}) => {
  return (
    <div className="max-w-sm w-full bg-black-1300 shadow-2xl rounded-2xl pointer-events-auto border border-primary-color overflow-hidden animate-in slide-in-from-right fade-in duration-500">
      <div className="relative p-5">
        <div className="relative flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-color bg-primary-color/20 px-2 py-0.5 rounded-full">
                Raffle Ended
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Raffle Ended
            </h3>
            <p className="text-sm text-white">
              <span className="font-semibold text-primary-color">
                Your Raffle #{id}
              </span>
              {" "}ended with {totalEntries} entries
            </p>
            <Link to="/raffles/$id" params={{ id: id.toString() }} className="text-xs text-primary-color mt-2 font-medium flex items-center gap-2">
              See Raffle <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-1000 transition-colors text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="h-1 bg-primary-color" />
    </div>
  )
}

export default EndedRaffleToast;

