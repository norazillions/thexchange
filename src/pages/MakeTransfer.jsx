import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import ConfirmTransferModal from '../components/ConfirmTransferModal';
import ReasonTransferModal from '../components/ReasonTransferModal';
import DailyLimitModal from '../components/DailyLimitModal';
import TheLoad from '../components/common/TheLoad';

const MakeTransfer = ({ compact = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAmount, setRecipientAmount] = useState('');
  const [userData, setUserData] = useState(null);
  const [beneficiaryCount, setBeneficiaryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showDailyLimitModal, setShowDailyLimitModal] = useState(false);
  const [transferData, setTransferData] = useState(null);

  // Fetch user data and beneficiaries
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        let count = 0;
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          const userData = userSnap.data();
          count = userData.beneficiaryCount || 0;
          setBeneficiaryCount(count);
        }
        
        if (count > 0) {
          const q = query(collection(db, 'users', user.uid, 'beneficiaries'));
          const querySnapshot = await getDocs(q);
          const beneficiaryData = [];
          querySnapshot.forEach((doc) => {
            beneficiaryData.push({
              id: doc.id,
              ...doc.data()
            });
          });
          setBeneficiaries(beneficiaryData);
        } else {
          setBeneficiaries([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Calculate recipient amount based on rate
  useEffect(() => {
    if (sendAmount && userData?.rateChange) {
      const amount = parseFloat(sendAmount);
      if (!isNaN(amount) && amount > 0) {
        const calculated = amount * userData.rateChange;
        setRecipientAmount(calculated.toLocaleString());
      } else {
        setRecipientAmount('');
      }
    } else {
      setRecipientAmount('');
    }
  }, [sendAmount, userData]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  // ✅ Check daily limit - FIXED to use correct subcollection path
  const checkDailyLimit = async (amount) => {
    if (!user || !userData) return true;

    try {
      const dailyLimit = userData.dailyLimit || 4000;
      
      // Query today's transactions from the user's subcollection
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // ✅ CORRECT: Use subcollection path: users/{userId}/transactions
      const transactionsRef = collection(db, 'users', user.uid, 'transactions');
      const q = query(
        transactionsRef,
        where('createdAt', '>=', today)
      );
      
      const querySnapshot = await getDocs(q);
      let totalToday = 0;
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalToday += data.amountSent || 0;
      });

      // Check if adding this amount would exceed the daily limit
      const newTotal = totalToday + parseFloat(amount);
      
      if (newTotal > dailyLimit) {
        setShowDailyLimitModal(true);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking daily limit:', error);
      return true;
    }
  };

  // Transfer Handlers - FIXED: Made async
  const handleSendNow = async () => {
    if (!selectedBeneficiary) {
      toast.warning('Please select a beneficiary.');
      return;
    }
    if (!sendAmount || parseFloat(sendAmount) <= 0) {
      toast.warning('Please enter a valid amount.');
      return;
    }
    if (!paymentMethod) {
      toast.warning('Please select a payment method.');
      return;
    }
    
    // ✅ Check daily limit before proceeding - AWAIT the result
    const isWithinLimit = await checkDailyLimit(sendAmount);
    if (!isWithinLimit) {
      return; // Daily limit modal will show
    }

    const beneficiary = beneficiaries.find(b => b.id === selectedBeneficiary);
    
    setTransferData({
      beneficiaryId: selectedBeneficiary,
      beneficiaryName: beneficiary?.name || 'Unknown',
      beneficiaryAccountNumber: beneficiary?.accountNumber || 'N/A',
      sendAmount: sendAmount,
      beneficiaryBank: beneficiary?.bank || 'N/A',
      recipientAmount: recipientAmount,
      paymentMethod: paymentMethod,
    });
    
    setShowConfirmModal(true);
  };

  const handleConfirmTransfer = () => {
    setShowConfirmModal(false);
    setShowReasonModal(true);
  };

  const handleReasonSubmit = (data) => {
    const updatedTransferData = { ...transferData, ...data };
    setTransferData(updatedTransferData);
    setShowReasonModal(false);
    
    // ✅ Store transfer data in sessionStorage for the Review page
    sessionStorage.setItem('transferData', JSON.stringify(updatedTransferData));
    
    // ✅ Navigate to Review page
    navigate('/review');
  };

  if (loading) {
    return <TheLoad />;
  }

  const hasBeneficiaries = (userData?.beneficiaryCount || 0) > 0;

  return (
    <>
      <div className={`bg-white rounded-lg p-4 ${compact ? 'w-full' : ''}`}>
        <h3 className="text-sm font-semibold text-[#111111] mb-4">Make a Transfer</h3>

        {/* Beneficiary Dropdown */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-[#666666] mb-1">
            Select beneficiary
          </label>
          <div className="relative">
            <select
              value={selectedBeneficiary}
              onChange={(e) => setSelectedBeneficiary(e.target.value)}
              className="w-full h-10 px-3 pr-8 text-xs bg-white border border-[#E5E5E5] rounded-md focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908] appearance-none text-[#111111]"
            >
              <option value="">Select beneficiary</option>
              {hasBeneficiaries ? (
                beneficiaries.map((beneficiary) => (
                  <option key={beneficiary.id} value={beneficiary.id}>
                    {beneficiary.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No beneficiaries found</option>
              )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#666666] pointer-events-none" />
          </div>
          {!hasBeneficiaries && (
            <p className="text-xs text-[#666666] mt-1">
              No beneficiaries yet.{' '}
              <button 
                onClick={() => navigate('/add-beneficiary')}
                className="text-[#E91908] hover:underline font-medium"
              >
                Add one
              </button>
            </p>
          )}
        </div>

        {/* Payment Method */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-[#666666] mb-1">
            Payment method
          </label>
          <div className="relative">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full h-10 px-3 pr-8 text-xs bg-white border border-[#E5E5E5] rounded-md focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908] appearance-none text-[#111111]"
            >
              <option value="">Select payment method</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card">Card</option>
              <option value="Wallet">Wallet</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#666666] pointer-events-none" />
          </div>
        </div>

        {/* You Send */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-[#666666] mb-1">
            You send
          </label>
          <input
            type="number"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            placeholder="0.00"
            className="w-full h-10 px-3 text-xs bg-white border border-[#E5E5E5] rounded-md focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908] text-[#111111]"
          />
        </div>

        {/* Recipient Gets - Read-only */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-[#666666] mb-1">
            Recipient gets
          </label>
          <div className="w-full h-10 px-3 text-xs bg-[#F5F5F5] border border-[#E5E5E5] rounded-md flex items-center text-[#111111]">
            {recipientAmount ? `NGN ${recipientAmount}` : '0.00'}
          </div>
        </div>

        {/* Rate & Charges */}
        <div className="mb-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-[#666666]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E91908]"></span>
              Rate
            </span>
            <span className="font-medium text-[#111111]">
              1 USD = ₦{formatNumber(userData?.rateChange || 1700)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-[#666666]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E91908]"></span>
              Transfer fee
            </span>
            <span className="font-medium text-[#111111]">₦0</span>
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendNow}
          className="w-full bg-[#E91908] text-white text-xs font-medium py-2.5 rounded-md hover:bg-[#cc1707] transition-colors"
        >
          Send now
        </button>
      </div>

      {/* Transfer Modals */}
      <ConfirmTransferModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmTransfer}
        transferData={transferData}
      />

      <ReasonTransferModal
        isOpen={showReasonModal}
        onClose={() => setShowReasonModal(false)}
        onConfirm={handleReasonSubmit}
      />

      <DailyLimitModal
        isOpen={showDailyLimitModal}
        onClose={() => setShowDailyLimitModal(false)}
      />
    </>
  );
};

export default MakeTransfer;