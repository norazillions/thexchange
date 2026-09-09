import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send } from 'lucide-react';

const ReasonTransferModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [source, setSource] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim() || !source.trim()) {
      return;
    }
    onConfirm({ reason: reason.trim(), source: source.trim() });
  };

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-[#111111] text-center mb-2">
            Reason for transfer
          </h2>
          <p className="text-xs text-[#666666] text-center mb-6">
            Please provide a reason for this transfer
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">
                Reason for transfer
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-white border border-[#E5E5E5] rounded-lg focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908] text-[#111111]"
              >
                <option value="">Select reason</option>
                <option value="Family support">Family support</option>
                <option value="Business payment">Business payment</option>
                <option value="Gift">Gift</option>
                <option value="Bill payment">Bill payment</option>
                <option value="Investment">Investment</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">
                Source of funds
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-white border border-[#E5E5E5] rounded-lg focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908] text-[#111111]"
              >
                <option value="">Select source</option>
                <option value="Salary">Salary</option>
                <option value="Savings">Savings</option>
                <option value="Business income">Business income</option>
                <option value="Investment returns">Investment returns</option>
                <option value="Gift">Gift</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim() || !source.trim()}
            className="w-full mt-6 bg-[#E91908] text-white font-medium py-2.5 rounded-lg hover:bg-[#cc1707] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send now
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReasonTransferModal;