import PopupModal from "../../PopupModal";
import { CheckIcon, Loader, Loader2 } from "lucide-react";
import { PrimaryButton } from "../../PrimaryButton";
import type { Prize } from "@/components/gumballs/PrizeModal";
import { VerifiedTokens } from "@/utils/verifiedTokens";

interface RevealPrizePopupProps {
  isOpen: boolean;
  shouldEnableAutoClose?: boolean;
  onClose:()=>void;
  prize:Prize | null;
}

export default function RevealPrizePopup({ isOpen, shouldEnableAutoClose = true,onClose,prize }: RevealPrizePopupProps) {
    const formatPrice = (price: string, mint: string) => {
        const numPrice = parseFloat(price)/ 10**(VerifiedTokens.find((token: typeof VerifiedTokens[0]) => token.address === mint)?.decimals || 0);
        return `${numPrice}`;
      }
    return (
    <PopupModal isOpen={isOpen} showCloseButton={true} shouldEnableAutoClose={shouldEnableAutoClose}>
      <div className="flex h-full flex-col  items-center justify-start gap-2">
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <h1 className="md:text-2xl text-xl text-center font-bold text-primary-color mb-2">Congratulations! 🎉 </h1>
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
        </div>
        {prize && 
        <div className="flex flex-col w-full gap-2 items-center justify-center">
            <img src={prize?.prizeImage??"/images/gumballs/gift_image_new.png"} alt="prize image" className="w-[150px] h-[150px]  transition duration-300 object-contain" />
            {prize?.isNft?
                <h1 className="md:text-2xl text-xl -mt:4 text-center font-bold text-primary-color mb-2">1x NFT</h1>
                :
            <h1 className="md:text-2xl text-xl -mt-4 text-center font-bold text-primary-color mb-2">{formatPrice(prize?.prizeAmount, prize?.prizeMint)} {VerifiedTokens.find((token: typeof VerifiedTokens[0]) => token.address === prize?.prizeMint)?.symbol}</h1>
            }
            <p className="text-sm text-white font-medium font-inter">Added to Your Wallet</p>

        </div>
        }

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
              </div>
      </div>
    </PopupModal>
  );
}