import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { toast } from 'react-toastify';
import TheLoad from '../components/common/TheLoad';

const AccountLimits = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [dailyLimit, setDailyLimit] = useState('');
  const [yearlyLimit, setYearlyLimit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          setDailyLimit(data.dailyLimit?.toString() || '4000');
          setYearlyLimit(data.yearlyLimit?.toString() || '529500');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setReason('');
    if (userData) {
      setDailyLimit(userData.dailyLimit?.toString() || '4000');
      setYearlyLimit(userData.yearlyLimit?.toString() || '529500');
    }
  };

  const handleDailyLimitChange = (e) => {
    const value = e.target.value;
    setDailyLimit(value);
  };

  const handleYearlyLimitChange = (e) => {
    const value = e.target.value;
    setYearlyLimit(value);
  };

  const isFormValid = () => {
    const daily = parseFloat(dailyLimit);
    const yearly = parseFloat(yearlyLimit);
    const originalDaily = userData?.dailyLimit || 4000;
    const originalYearly = userData?.yearlyLimit || 529500;
    
    if (daily === originalDaily && yearly === originalYearly) {
      return false;
    }
    
    if (!reason) return false;
    if (isNaN(daily) || isNaN(yearly)) return false;
    if (daily <= 0 || yearly <= 0) return false;
    
    return true;
  };

  const handleProceed = () => {
  const daily = parseFloat(dailyLimit);
  const yearly = parseFloat(yearlyLimit);
  
  if (yearly <= daily) {
    toast.error('Yearly limit must be greater than daily limit');
    return;
  }
  const limitdata = {
    dailyLimit: daily,
    yearlyLimit: yearly
  };
  sessionStorage.setItem('requestedLimits', JSON.stringify(limitdata));
  
  setShowModal(false);
  navigate('/upload-proof-of-residence-limit');
};

  if (loading) {
    return (
      <TheLoad/>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-6xl mx-auto px-4 sm:px-6"
      >
        <h1 className="text-sm font-semibold text-[#111111] mb-4">Account Limits</h1>
        <h2 className="text-[11px] font-medium text-[#111111] mb-3">Current Limits</h2>
        <div 
          className="w-full max-w-4xl bg-white rounded-md border border-[#E5E5E5] p-5 cursor-pointer hover:border-[#E91908]/30 transition-colors"
        >
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[11px] text-[#666666]">Daily limit</p>
                  <p className="text-[14px] font-semibold text-[#111111]">
                    €{formatCurrency(userData?.dailyLimit || 4000)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[#666666]">Yearly limit</p>
                  <p className="text-[14px] font-semibold text-[#111111]">
                    €{formatCurrency(userData?.yearlyLimit || 529500)}
                  </p>
                </div>
              </div>
            </div>

            <button onClick={handleCardClick} className="hidden sm:flex items-center gap-1 bg-[#E91908] text-white text-xs font-medium px-4 py-2 rounded-md hover:bg-[#cc1707] transition-colors">
              <span>Increase Limits</span>
            </button>
          </div>
        </div>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-lg max-w-md w-full p-6"
          >
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-[#666666] hover:text-[#111111] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-semibold text-[#111111] text-center mb-4">
              Request Limit Increase
            </h2>

            <div className="mb-4">
              <label className="block text-[10px] font-medium text-[#666666] mb-1">
                Reason for request
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-white border border-[#E5E5E5] rounded focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908] appearance-none"
              >
                <option value="">Select reason</option>
                <option value="Business growth">Business growth</option>
                <option value="Increased transactions">Increased transactions</option>
                <option value="Salary increase">Salary increase</option>
                <option value="Investment">Investment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-[10px] font-medium text-[#666666] mb-1">
                Daily limit
              </label>
              <input
                type="number"
                value={dailyLimit}
                onChange={handleDailyLimitChange}
                className="w-full h-10 px-3 text-xs bg-white border border-[#E5E5E5] rounded focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-[10px] font-medium text-[#666666] mb-1">
                Yearly limit
              </label>
              <input
                type="number"
                value={yearlyLimit}
                onChange={handleYearlyLimitChange}
                className="w-full h-10 px-3 text-xs bg-white border border-[#E5E5E5] rounded focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908]"
              />
            </div>

            <button
              onClick={handleProceed}
              disabled={!isFormValid() || isSubmitting}
              className={`w-full py-2.5 rounded text-xs font-medium transition-colors ${
                isFormValid() && !isSubmitting
                  ? 'bg-[#E91908] text-white hover:bg-[#cc1707] cursor-pointer'
                  : 'bg-[#E5E5E5] text-white cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Proceed'}
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AccountLimits;