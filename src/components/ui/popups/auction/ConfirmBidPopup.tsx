import PopupModal from "../../PopupModal";
import { CheckIcon, Loader, Loader2 } from "lucide-react";
import { PrimaryButton } from "../../PrimaryButton";

interface ConfirmBidPopupProps {
  isOpen: boolean;
  shouldEnableAutoClose?: boolean;
  bidAmount: number;
  currencyDecimals: number;
  prizeName: string;
  prizeImage: string;
  currency: string;
  highestBidAmount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isBiddingAuction: boolean;
}

export default function ConfirmBidPopup(props: ConfirmBidPopupProps) {
  const { 
    isOpen, 
    shouldEnableAutoClose = true, 
    bidAmount, 
    currencyDecimals = 9, 
    currency = "SOL",
    prizeName,
    prizeImage,
    highestBidAmount,
    isBiddingAuction,
    onConfirm,
    onCancel
  } = props;
  return (
    <PopupModal isOpen={isOpen} showCloseButton={false} shouldEnableAutoClose={shouldEnableAutoClose} className="px-2 max-h-[550px] md:max-h-[350px]">
      <div className="flex h-full flex-col  items-center justify-start ">
        <div className="w-full flex flex-col items-center justify-center gap-4 pb-2">
          <h1 className="md:text-2xl text-xl text-center font-bold text-white">Confirm Your Bid</h1>
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
           <div className="w-full px-3 grid md:grid-cols-2 grid-cols-1 gap-3">
            <div className="w-full  flex flex-1 flex-col items-center max-h-[150px]  justify-center gap-2">
              <img src={prizeImage} alt="solana" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="w-full flex flex-1 flex-col items-center justify-center gap-2">
                <div className="mb-3">
                    <h2 className="text-xl font-medium text-white">{prizeName?.slice(0, 15)}...</h2>
                </div>
                <div className="w-full flex items-center justify-between gap-2 px-2 py-2 rounded-lg bg-primary-color/10">
                    <h2 className="text-sm font-medium text-primary-color">Current Bid</h2>
                    <p className="text-sm font-medium text-white">{highestBidAmount/(10**currencyDecimals)} {currency}</p>
                </div>
                <div className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-primary-color/10">
                    <h2 className="text-sm font-medium text-primary-color">Your Bid</h2>
                    <p className="text-sm font-medium text-white">{(bidAmount)} {currency}</p>
                </div>
            </div>

           </div>
           <div className="w-full flex flex-col md:flex-row items-center justify-center gap-2 px-5 -mt-2">
            <PrimaryButton text="Cancel" className="w-full bg-transparent border text-center border-gray-1200 text-gray-1200" onclick={onCancel} />
            <PrimaryButton disabled={isBiddingAuction} text={isBiddingAuction ? <Loader className="w-6 h-6 animate-spin text-white text-center mx-auto" /> : "Confirm Bid"} className="w-full" onclick={onConfirm} />
           </div>
        </div>
      </div>
    </PopupModal>
  );
}