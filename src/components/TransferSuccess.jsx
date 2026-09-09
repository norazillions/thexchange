import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';

const TransferSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const transferData = location.state?.transferData;

  const handleDone = () => {
    navigate('/home');
  };

  const handleViewTransaction = () => {
    if (transferData) {
      navigate('/transaction-detail', { state: { transaction: transferData } });
    } else {
      navigate('/home');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[calc(100vh-120px)] flex items-center justify-center px-5"
    >
      <div className="w-full max-w-[360px] text-center">
        <div className="flex justify-center mb-5">
          <CheckCircle className="w-16 h-16 text-[#22C55E]" strokeWidth={1.8} />
        </div>
        <h1 className="text-base font-semibold text-[#111111] text-center">
          Transfer successful
        </h1>
        <p className="mt-2 text-xs text-[#666666] text-center max-w-[280px] mx-auto">
          Your transfer has been successfully sent.{' '}
          <button
            onClick={handleViewTransaction}
            className="text-[#E91908] font-medium hover:underline"
          >
            click here to view transaction details
          </button>
        </p>
        <button
          onClick={handleDone}
          className="mt-6 w-[120px] h-10 bg-[#E91908] text-white text-xs font-medium rounded-md hover:bg-[#cc1707] transition-colors"
        >
          Done
        </button>
      </div>
    </motion.div>
  );
};

export default TransferSuccess;