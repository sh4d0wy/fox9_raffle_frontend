import {AnimatePresence, motion } from "motion/react";

export default function ToolTip({ label, children ,className, isOpen}: { label: string, children: React.ReactNode, className?: string, isOpen: boolean }) {
  return (
    <AnimatePresence>
    {isOpen && (
    <motion.div 
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 100 }}
    transition={{ duration: 0.3 }} 
    className={`bg-black-1300 absolute z-1000 shadow-lg rounded-md p-2 ${className}`}>
      <p className="text-sm font-inter text-white font-medium">{label}</p>
      {children}
    </motion.div>
    )}
    </AnimatePresence>
  )
}