import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';

const LimitIncreasedSuccess = () => {
  const navigate = useNavigate();

  const handleDone = () => {
    navigate('/account-limits');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white flex items-center justify-center px-5"
    >
      <div className="w-full max-w-[280px] text-center">
        {/* Green Success Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-[#42B94A]" strokeWidth={1.8} />
        </div>

        {/* Heading */}
        <h1 className="text-xs font-semibold text-[#111111] text-center">
          Limit increased successfully
        </h1>

        {/* Description */}
        <p className="text-[8px] text-[#666666] text-center leading-5 mt-2">
          Your limits have been increased.
        </p>

        {/* Done Button */}
        <button
          onClick={handleDone}
          className="mt-6 w-[90px] h-[30px] bg-[#E91908] text-white text-[10px] font-medium rounded hover:bg-[#cc1707] transition-colors"
        >
          Done
        </button>
      </div>
    </motion.div>
  );
};

export default LimitIncreasedSuccess;