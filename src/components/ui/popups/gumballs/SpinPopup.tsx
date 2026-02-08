import PopupModal from "../../PopupModal";
import { CheckIcon, Loader, Loader2 } from "lucide-react";
import { PrimaryButton } from "../../PrimaryButton";

interface SpinGumballPopupProps {
  isOpen: boolean;
  shouldEnableAutoClose?: boolean;
  onClaimPrize: () => void;
  isClaiming:boolean;
}

export default function SpinGumballPopup({ isOpen, shouldEnableAutoClose = true,onClaimPrize,isClaiming }: SpinGumballPopupProps) {
  return (
    <PopupModal isOpen={isOpen} showCloseButton={false} shouldEnableAutoClose={shouldEnableAutoClose}>
      <div className="flex h-full flex-col  items-center justify-start gap-4">
        <div className="w-full flex flex-col items-center justify-center ">
           <img src="/images/gumballs/gift_image_new.png" alt="spin popup" className="w-[150px] h-[150px]  transition duration-300 object-contain" />
          <h1 className="md:text-2xl text-xl text-center font-bold text-primary-color mb-2">You Won A Prize!</h1>
            <p className="text-xs text-white font-medium font-inter">Click claim to reveal your prize</p>
        </div>
        <div className="w-full flex flex-col items-center justify-center gap-4 py-1 ">
                  <svg width="347" height="2" viewBox="0 0 347 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="347" height="2" fill="url(#paint0_linear_665_538)" />
                      <rect width="347" height="2" fill="url(#paint1_linear_665_538)" />
                      <defs>
                          <linearGradient id="paint0_linear_665_538" x1="0" y1="1" x2="347" y2="1" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#212121" />
                              <stop offset="0.524038" stop-color="#FFD400" />
                              <stop offset="0.9375" stop-color="#212121" />
                          </linearGradient>
                          <linearGradient id="paint1_linear_665_538" x1="0" y1="1" x2="347" y2="1" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#212121" />
                              <stop offset="0.524038" stop-color="#FDED9C" stop-opacity="0.77" />
                              <stop offset="0.9375" stop-color="#212121" />
                          </linearGradient>
                      </defs>
                  </svg>

                  <PrimaryButton 
                    text={isClaiming ? <Loader className="w-5 h-5 text-black-1000 animate-spin" /> : "Claim Prize"} 
                    className="w-[80%] disabled:opacity-50 disabled:cursor-not-allowed" 
                    onclick={onClaimPrize} 
                    disabled={isClaiming}
                    />
              </div>
      </div>
    </PopupModal>
  );
}