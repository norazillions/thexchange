import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const ConfirmTransferModal = ({ isOpen, onClose, onConfirm, transferData }) => {
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
              <svg className="w-8 h-8 text-[#E91908]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-[#111111] text-center mb-2">
            Are you sure you want to proceed in sending this?
          </h2>
          {transferData && (
            <div className="bg-[#F5F5F5] rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#666666]">Beneficiary</span>
                <span className="font-medium text-[#111111]">{transferData.beneficiaryName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#666666]">You send</span>
                <span className="font-medium text-[#111111]">${transferData.sendAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#666666]">Recipient gets</span>
                <span className="font-medium text-[#111111]">NGN {transferData.recipientAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#666666]">Payment method</span>
                <span className="font-medium text-[#111111]">{transferData.paymentMethod}</span>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-[#E5E5E5] text-[#666666] font-medium py-2.5 rounded-lg hover:bg-[#F5F5F5] transition-colors"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-[#E91908] text-white font-medium py-2.5 rounded-lg hover:bg-[#cc1707] transition-colors"
            >
              Yes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmTransferModal;