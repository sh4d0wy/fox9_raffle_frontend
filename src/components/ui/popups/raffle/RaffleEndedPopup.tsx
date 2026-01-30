import PopupModal from "../../PopupModal";
import { CheckIcon, Loader2 } from "lucide-react";

interface RaffleEndedPopupProps {
  isOpen: boolean;
  shouldEnableAutoClose?: boolean;
}

export default function RaffleEndedPopup({ isOpen, shouldEnableAutoClose = true }: RaffleEndedPopupProps) {
  return (
    <PopupModal isOpen={isOpen} showCloseButton={false} shouldEnableAutoClose={shouldEnableAutoClose}>
      <div className="flex h-full flex-col  items-center justify-start gap-4">
        <div className="w-full flex flex-col items-center justify-center gap-4 pb-2">
          <h1 className="md:text-2xl text-xl text-center font-bold text-white">Raffle Ended</h1>
                  <svg width="446" height="2" viewBox="0 0 446 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="446" height="2" fill="url(#paint0_linear_451_1310)" />
                      <rect width="446" height="2" fill="url(#paint1_linear_451_1310)" />
                      <defs>
                          <linearGradient id="paint0_linear_451_1310" x1="0" y1="1" x2="446" y2="1" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#212121" />
                              <stop offset="0.524038" stop-color="#FFD400" />
                              <stop offset="0.9375" stop-color="#212121" />
                          </linearGradient>
                          <linearGradient id="paint1_linear_451_1310" x1="0" y1="1" x2="446" y2="1" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#212121" />
                              <stop offset="0.524038" stop-color="#FDED9C" stop-opacity="0.77" />
                              <stop offset="0.9375" stop-color="#212121" />
                          </linearGradient>
                      </defs>
                  </svg>

        </div>
        <div className="w-full flex flex-col items-center justify-center gap-8 py-3">
        <h1 className="md:text-4xl text-3xl text-center font-bold text-primary-color">Waiting for Winners</h1>
        <Loader2 className="md:w-20 md:h-20 w-15 h-15 text-primary-color animate-spin" />
        <p className="text-sm text-white font-medium font-inter">The raffle has ended winners will be announced soon...</p>
        </div>
      </div>
    </PopupModal>
  );
}