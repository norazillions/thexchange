import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import PinModal from './PinModal';
import TheLoad from './common/TheLoad';

const Review = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transferData, setTransferData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('transferData');
    if (data) {
      setTransferData(JSON.parse(data));
    } else {
      navigate('/home');
    }

    const fetchUserData = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(-1);
  };

  const handleMakePayment = () => {
    setShowPinModal(true);
  };

  const handlePinSuccess = (data) => {
    navigate('/transfer-success', { state: { transferData: data } });
  };

  if (loading || !transferData) {
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
        className="w-full max-w-[760px] mx-auto px-4 sm:px-6 py-4 sm:py-6"
      >
        <div className="relative flex items-center justify-center h-12 mb-8">
          <button
            onClick={handleBack}
            className="absolute left-0 flex items-center justify-center text-[#111111] hover:text-[#E91908] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base md:text-lg font-semibold text-[#111111]">Review</h1>
        </div>
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[#111111] mb-4">Transfer information</h2>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between py-1.5 border-b border-[#F0F0F0]">
              <span className="text-xs text-[#666666]">Beneficiary</span>
              <span className="text-xs font-medium text-[#111111] text-right">
                {transferData.beneficiaryName}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#F0F0F0]">
              <span className="text-xs text-[#666666]">You send</span>
              <span className="text-xs font-medium text-[#111111] text-right">
                ${transferData.sendAmount}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#F0F0F0]">
              <span className="text-xs text-[#666666]">Recipient gets</span>
              <span className="text-xs font-medium text-[#111111] text-right">
                NGN {transferData.recipientAmount}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#F0F0F0]">
              <span className="text-xs text-[#666666]">Payment method</span>
              <span className="text-xs font-medium text-[#111111] text-right">
                {transferData.paymentMethod}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs text-[#666666]">Rate</span>
              <span className="text-xs font-medium text-[#111111] text-right">
                1 USD = ₦{formatNumber(userData?.rateChange || 1700)}
              </span>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[#111111] mb-4">Transaction details</h2>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between py-1.5 border-b border-[#F0F0F0]">
              <span className="text-xs text-[#666666]">Reason</span>
              <span className="text-xs font-medium text-[#111111] text-right">
                {transferData.reason || 'Not specified'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#F0F0F0]">
              <span className="text-xs text-[#666666]">Source of funds</span>
              <span className="text-xs font-medium text-[#111111] text-right">
                {transferData.source || 'Not specified'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs text-[#666666]">Transaction fee</span>
              <span className="text-xs font-medium text-[#111111] text-right">₦0</span>
            </div>
          </div>
        </div>
        <div className="mt-8 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E91908] shrink-0" />
            <p className="text-[10px] leading-4 text-[#E91908]">
              Please confirm that all details are correct before proceeding.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E91908] shrink-0" />
            <p className="text-[10px] leading-4 text-[#E91908]">
              This transaction cannot be reversed once completed.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E91908] shrink-0" />
            <p className="text-[10px] leading-4 text-[#E91908]">
              Ensure you have sufficient funds in your account.
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleEdit}
            className="flex-1 h-10 rounded-md bg-[#D9D9D9] text-[#111111] text-xs font-medium hover:bg-[#CCCCCC] transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleMakePayment}
            className="flex-1 h-10 rounded-md bg-[#E91908] text-white text-xs font-medium hover:bg-[#CC1707] transition-colors"
          >
            Make payment
          </button>
        </div>
      </motion.div>
      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        transferData={transferData}
        onSuccess={handlePinSuccess}
      />
    </>
  );
};

export default Review;