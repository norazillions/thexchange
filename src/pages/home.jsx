import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firestore';
import { motion } from 'motion/react';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore'; 
import { 
  ArrowUpRight,  
  Users, 
  Wallet,
  Send,
  Eye,
  ChevronDown,
  ReceiptText,
  ArrowDownRight,
  User,
  Calendar,
  EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MakeTransfer from './MakeTransfer';
import TheLoad from '../components/common/TheLoad';

// Simple Stat Card Component (kept inside Home.jsx for simplicity)
const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-lg p-4">
      <div className="flex items-center gap-2">
        {Icon && <img src={Icon} className="w-5 h-5 text-[#666666]" />}
        <span className="text-xs font-medium text-[#666666]">{title}</span>
        
      </div>
      <p className="text-xl font-semibold text-[#111111] mt-1 ">
        {value}
      </p>
    </div>
  );
};
// Transfer Item Component
// Transfer Item Component - Figma Design
const TransferItem = ({ transfer }) => {
  const navigate = useNavigate();
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  const handleViewDetails = () => {
    navigate('/transaction-detail', { state: { transaction: transfer } });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  const isReceived = transfer.type === 'internal_received';
  const displayAmount = !isReceived ? transfer.amountSent*1700 : transfer.amountSent;
  return (
    <div className="flex items-center justify-between px-3 py-2.5 bg-[#EAF8EA] rounded-lg mb-2 last:mb-0">
      {/* 1. Icon + Beneficiary Name - Grouped on left */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 bg-[#E91908]/10 rounded-full flex items-center justify-center flex-shrink-0">
          {isReceived ? <ArrowDownRight className="w-4 h-4 text-[#009A49]" /> : <ArrowUpRight className="w-4 h-4 text-[#E91908]" />}
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-[#111111] truncate">
            {transfer.beneficiaryName}
          </p>
          <p className="text-[10px] text-[#666666] hidden sm:block">
            {formatDate(transfer.createdAt)}
          </p>
        </div>
      </div>

      {/* 3. Amount - Centered */}
      <div className="flex-1 text-center">
        <span className={`text-sm font-semibold ${isReceived ? 'text-green-600' : 'text-[#111111]'} whitespace-nowrap`}>
          {isReceived ? '+' : '-'}{isReceived ? '€' : '₦'}{formatCurrency(displayAmount)}
        </span>
      </div>

      {/* 4. Status - Centered */}
      <div className="flex-1 text-center">
        <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full whitespace-nowrap">
          Successful
        </span>
      </div>

      {/* 5. View - Right aligned */}
      <div className="flex-1 text-center">
        <button 
          onClick={handleViewDetails}
          className="text-xs text-[#E91908] font-medium hover:underline"
        >
          View
        </button>
      </div>
    </div>
  );
};
const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [loadingTransfers, setLoadingTransfers] = useState(true);
  const [showBalance, setShowBalance] = useState(false);
 
  
  // Fetch user data from Firestore
  useEffect(() => {
  if (!user) return;

  // 1. Listen to user data changes
  const userRef = doc(db, 'users', user.uid);
  const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      setUserData(docSnap.data());
    }
    setLoading(false);
  });

  // 2. Listen to recent transfers changes
  const transactionsRef = collection(db, 'users', user.uid, 'transactions');
  const q = query(transactionsRef, orderBy('createdAt', 'desc'), limit(3));
  const unsubscribeTransfers = onSnapshot(q, (querySnapshot) => {
    const transfers = [];
    querySnapshot.forEach((doc) => {
      transfers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    setRecentTransfers(transfers);
    setLoadingTransfers(false);
  });

  // Cleanup subscriptions on unmount
  return () => {
    unsubscribeUser();
    unsubscribeTransfers();
  };
}, [user]);


  // Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };
  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  if (loading) {
    return (
      <TheLoad/>
    );
  }

  const hasTransfers = (userData?.transactionCount || 0) > 0;
  const hasBeneficiaries = (userData?.beneficiaryCount || 0) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-2 sm:px-4"
    >
      {/* Welcome Section */}
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-[#111111]">
          Welcome back, {userData?.firstName || 'User'} {userData?.lastName || 'User'}! 👋
        </h1>
        <p className="text-xs text-[#666666]">Here's your financial overview</p>
      </div>

      {/* Balance Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-[#E5E5E5] rounded-lg p-4 mb-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#666666]" />
              <span className="text-xs font-medium text-[#666666]">Available balance</span>
              <button
                onClick={toggleBalance}
                className="text-[#666666] hover:text-[#111111] transition-colors ml-1"
              >
                {showBalance ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-2xl font-semibold text-[#111111] mt-1">
              {showBalance ? '€'+ formatCurrency(userData?.totalBalance || 0) : '****'}
            </p>
          </div>
          <button className="hidden sm:flex items-center gap-2 bg-[#E91908] text-white text-xs font-medium px-4 py-2 rounded-md hover:bg-[#cc1707] transition-colors">
            {/* <Send className="w-3.5 h-3.5" /> */}
            Top up
            <img src="/src/assets/images/topup.png" className='w-3.5 h-3.5' />
          </button>
        </div>
      </motion.div>

      

      {/* Desktop Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Recent Transfers - Takes 2/3 on desktop */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          {/* Statistics Cards Row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard 
            title="Transfers made" 
            value={formatNumber(userData?.transactionCount || 0)}
            icon="/src/assets/images/transaction.png"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard 
            title="Beneficiaries" 
            value={formatNumber(userData?.beneficiaryCount || 0)}
            icon="/src/assets/images/transaction.png"
          />
        </motion.div>
      </div>
      <div className=' bg-white border border-[#E5E5E5] rounded-lg p-4'>
          <div className="flex items-center justify-between mb-4 ">
            <h3 className="text-sm font-semibold text-[#111111]">Recent transfers</h3>
            <button 
              onClick={() => navigate('/transaction-history')}
              className="text-xs text-[#666666] hover:text-[#E91908] transition-colors"
            >
              View all
            </button>
          </div>

          {!hasTransfers ? (
            // Empty State
            <div className="text-center py-6 sm:py-8">
              <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-3">
                <ReceiptText className="w-6 h-6 text-[#999999]" />
              </div>
              <p className="text-sm font-medium text-[#111111] mb-1">You are yet to make transfers</p>
              <p className="text-xs text-[#666666]">Start sending money to your loved ones</p>
            </div>
          ): loadingTransfers ? (
              // Loading state
              <div className="flex items-center justify-center py-6">
                <div className="w-8 h-8 border-4 border-[#E91908] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )
           : recentTransfers.length === 0 ? (
              // No recent transfers (but count > 0 - edge case)
              <div className="text-center py-6">
                <p className="text-sm text-[#666666]">No recent transfers to show</p>
              </div>
            ) : (
              // Transfer List
              <div className="space-y-1">
                {recentTransfers.map((transfer) => (
                  <TransferItem key={transfer.id} transfer={transfer} />
                ))}
              </div>
            )}
        </div>
        {/* Current Limit Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg border border-[#E5E5E5] p-5 mt-4"
        >
          {/* Card heading */}
          <div className="flex items-center gap-2 mb-5">
            {/* <Gauge className="w-4 h-4 text-[#111111]" /> */}

            <h3 className="text-sm font-semibold text-[#111111]">
              Current limit
            </h3>
          </div>

          {/* Limit information */}
          <div className="grid grid-cols-2 gap-8">

            {/* Daily Limit */}
            <div>
              <p className="text-xs text-[#666666] mb-2">
                Daily limit
              </p>

              <p className="text-base font-semibold text-[#111111]">
                €{formatCurrency(userData?.dailyLimit || 0)}
              </p>
            </div>

            {/* Remaining */}
            <div>
              <p className="text-xs text-[#666666] mb-2">
                Yearly limit
              </p>

              <p className="text-base font-semibold text-[#111111]">
                €{formatCurrency(userData?.yearlyLimit || 0)}
              </p>
            </div>
          </div>
          <p className='mt-3'>If you want higher limits. temporarily or permanently, click here</p>
        </motion.div>
        </motion.div>

        {/* Make a Transfer - Takes 1/3 on desktop, hidden on mobile */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="hidden lg:block bg-white border border-[#E5E5E5] rounded-lg p-4"
        >
          <MakeTransfer/>
        </motion.div>
      </div>

      {/* Mobile Send Money Button - Only on mobile */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="lg:hidden mt-5"
      >
        <button
          onClick={() => navigate('/send-money')}
          className="w-full bg-[#E91908] text-white text-sm font-medium py-3 rounded-lg hover:bg-[#cc1707] transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          Send money
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Home;