import { Link } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react";
import { toast } from "sonner";

const EndedRaffleToast = ({id, totalEntries, toastId}: {id: number, totalEntries: number, toastId: string}) => {
  return (
    <div className="max-w-sm w-full bg-linear-to-br from-orange-50 via-white to-orange-50 shadow-2xl rounded-2xl pointer-events-auto border border-orange-200 overflow-hidden animate-in slide-in-from-right fade-in duration-500">
      <div className="relative p-5">
        <div className="absolute top-0 right-0 w-20 h-15 bg-linear-to-br from-orange-400/20 to-orange-400/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-linear-to-tr from-orange-300/20 to-orange-300/20 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex items-start gap-4">
          <div className="relative top-5 w-12 h-12 bg-linear-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🎟️</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                Raffle Ended
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Raffle Ended
            </h3>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-orange-600">
                Your Raffle #{id}
              </span>
              {" "}ended with {totalEntries} entries
            </p>
            <Link to="/raffles/$id" params={{ id: id.toString() }} className="text-xs text-orange-600 mt-2 font-medium flex items-center gap-2">
              See Raffle <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="h-1 bg-linear-to-r from-orange-400 via-orange-500 to-orange-400" />
    </div>
  )
}

export default EndedRaffleToast;

