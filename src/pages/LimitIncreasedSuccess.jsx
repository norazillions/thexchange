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
      <div className="w-full max-w-[320px] text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[#42B94A]" strokeWidth={1.8} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-sm font-semibold text-[#111111] text-center">
          Limit increased successfully
        </h1>

        {/* Description */}
        <p className="text-xs text-[#666666] text-center leading-relaxed mt-2">
          Your account limit has been increased!
        </p>

        {/* Done Button */}
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

export default LimitIncreasedSuccess;