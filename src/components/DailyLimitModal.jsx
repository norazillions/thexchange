import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle } from 'lucide-react';

const DailyLimitModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-[#666666] hover:text-[#111111] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#E91908]/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-[#E91908]" />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-[#111111] text-center mb-2">
            Daily limit reached
          </h2>
          
          <p className="text-sm text-[#666666] text-center mb-6">
            You've reached your daily transfer limit. Please try again tomorrow.
          </p>

          <div className="bg-[#F5F5F5] rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#666666]">Daily limit</span>
              <span className="font-medium text-[#111111]">₦4,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#666666]">Today's transfers</span>
              <span className="font-medium text-[#E91908]">₦4,000</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-[#E91908] text-white font-medium py-2.5 rounded-lg hover:bg-[#cc1707] transition-colors"
          >
            OK
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DailyLimitModal;