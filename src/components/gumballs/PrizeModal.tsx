import { VerifiedTokens } from "@/utils/verifiedTokens";
import { Dialog, DialogPanel } from "@headlessui/react";

export interface Prize{
    gumballId: number,
    prizeIndex: number,
    prizeMint: string,
    ticketPrice: string,
    ticketMint: string,
    isTicketSol: boolean,
    prizeImage: string,
    prizeAmount: string,
    isNft: boolean
}
interface PrizeModalProps {
isOpen: boolean;
onClose: () => void;
prize: Prize | null;
onClaimPrize: () => void;
isClaimPending: boolean;
isClaimed: boolean;
canClose: boolean;
}

export const PrizeModal = ({ isOpen, onClose, prize, onClaimPrize, isClaimPending, isClaimed, canClose }: PrizeModalProps) => {
const formatPrice = (price: string, mint: string) => {
  const numPrice = parseFloat(price)/ 10**(VerifiedTokens.find((token: typeof VerifiedTokens[0]) => token.address === mint)?.decimals || 0);
  return `${numPrice}`;
}
return (
  <Dialog open={isOpen} as="div" className="relative z-50" onClose={canClose ? onClose : () => {}}>
    <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative z-10 w-full max-w-md duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
        >
          <div className="bg-white rounded-[24px] p-6 shadow-2xl">
            <p className='text-primary-color text-center mb-4 font-bold text-2xl font-inter'>You won!</p>
            {canClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L13 13M1 13L13 1" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            <div className="flex flex-col items-center pt-4">
              <div className="relative w-[300px] h-[300px] flex items-center justify-center flex-col gap-4">
                {isClaimed && prize ? (
                  <>
                    <img src={prize.prizeImage??""} alt={prize.prizeImage} className="w-[200px] h-[200px] object-cover" />
                    {prize.isNft ? (
                      <p className="text-black-1000 font-bold text-lg font-inter">1x NFT</p>
                    ) : (
                      <p className="text-black-1000 font-bold text-lg font-inter">{formatPrice(prize.prizeAmount, prize.prizeMint)} {VerifiedTokens.find((token: typeof VerifiedTokens[0]) => token.address === prize.prizeMint)?.symbol}</p>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <img src="/images/gumballs/gift_image.png" alt="Gift box" className="w-[200px] h-[200px] object-cover" />
                    <p className="text-black-1000 font-bold text-lg font-inter">Open to reveal your prize!</p>
                  </div>
                )}
              </div>
              {!isClaimed && (
                <button
                  onClick={onClaimPrize}
                  disabled={isClaimPending}
                  className="mt-6 w-full cursor-pointer px-12 py-3.5 rounded-full font-bold text-lg font-inter transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'var(--color-primary-color)',
                    color: 'var(--color-white-1000)',
                    boxShadow: '0 6px 24px rgba(255, 20, 147, 0.35)',
                  }}
                >
                  {isClaimPending ? 'Claiming...' : 'Claim prize'}
                </button>
              )}
            </div>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
);
};