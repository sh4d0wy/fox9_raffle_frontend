import { CheckIcon } from "lucide-react";
import PopupModal from "../../PopupModal";

interface BuyTicketPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BuyTicketPopup({ isOpen, onClose }: BuyTicketPopupProps) {
  return (
    <PopupModal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div className="flex h-full flex-col py-10  items-center justify-center gap-4">
        <CheckIcon className="md:w-15 md:h-15 w-10 h-10 text-black bg-primary-color rounded-full p-2" />
        <h1 className="md:text-4xl text-3xl text-center font-bold text-primary-color">Raffle Participation Complete</h1>
      </div>
    </PopupModal>
  )
}