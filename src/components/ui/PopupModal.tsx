import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PopupModalProps {
  isOpen: boolean;
  onClose?: () => void | undefined;
  children: ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  shouldEnableAutoClose?: boolean;
}

export default function PopupModal({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  closeOnOverlayClick = true,
  shouldEnableAutoClose = true,
}: PopupModalProps) {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };
  useEffect(() => {
    if(isOpen && shouldEnableAutoClose){
      const timer = setTimeout(() => {
        onClose?.();
      }, 5000);
      return () => clearTimeout(timer);
    } 
  }, [isOpen, shouldEnableAutoClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm "
          onClick={handleOverlayClick}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="relative w-full max-w-[450px] h-full max-h-[350px] mx-4 bg-black-1300 border-2 border-primary-color shadow-[0_0_40px_rgba(212,175,55,0.4),0_0_80px_rgba(212,175,55,0.2)]  rounded-4xl p-6">
            {showCloseButton && (
              <button
                onClick={() => onClose?.()}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-1000 hover:bg-gray-1100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

