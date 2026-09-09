import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { XCircle } from 'lucide-react';

const LimitIncreaseFailed = () => {
  const navigate = useNavigate();

  const handleOkay = () => {
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
        {/* Failed Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-[#E91908]" strokeWidth={1.8} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-sm font-semibold text-[#111111] text-center">
          Limit increase failed
        </h1>

        {/* Description */}
        <p className="text-xs text-[#666666] text-center leading-relaxed mt-2">
          The document you uploaded does not match the proof of residence you provided during onboarding.
        </p>
        <p className="text-[10px] text-[#E91908] text-center mt-2">
          Please upload the same document you used during sign up.
        </p>

        {/* OK Button */}
        <button
          onClick={handleOkay}
          className="mt-6 w-[120px] h-10 bg-[#E91908] text-white text-xs font-medium rounded-md hover:bg-[#cc1707] transition-colors"
        >
          OK
        </button>
      </div>
    </motion.div>
  );
};

export default LimitIncreaseFailed;