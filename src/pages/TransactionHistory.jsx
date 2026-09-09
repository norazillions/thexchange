import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firestore';
import { collection, query, orderBy, getDocs , onSnapshot } from 'firebase/firestore';
import { motion } from 'motion/react';
import { ArrowUpRight, Search, ChevronDown, ReceiptText, Eye } from 'lucide-react';
import TheLoad from '../components/common/TheLoad';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
  if (!user) return;

  const transactionsRef = collection(db, 'users', user.uid, 'transactions');
  const q = query(transactionsRef, orderBy('createdAt', 'desc'));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const transfers = [];
    querySnapshot.forEach((doc) => {
      transfers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    transfers.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB - dateA;
    });
    setTransactions(transfers);
    setLoading(false);
  });

  return () => unsubscribe();
}, [user]);


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const handleViewTransaction = (transaction) => {
    navigate('/transaction-detail', { state: { transaction } });
  };

  if (loading) {
    return (
      <TheLoad/>
    );
  }

  const hasTransactions = transactions.length > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-6xl mx-auto px-4 sm:px-6"
    >
      <h1 className="text-sm font-semibold text-[#111111] mb-4">Transactions</h1>

      {/* Transaction Container */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg overflow-hidden">
        {/* Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#F0F0F0]">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[#999999]" />
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-3 h-7 text-[10px] bg-white border border-[#E5E5E5] rounded focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908]"
              />
            </div>
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="h-7 px-3 pr-7 text-[10px] bg-white border border-[#E5E5E5] rounded focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908] appearance-none"
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-[#999999] pointer-events-none" />
            </div>
          </div>
          <span className="text-[10px] text-[#666666]">
            {transactions.length} transactions
          </span>
        </div>

        {/* Transaction List */}
        {!hasTransactions ? (
          // Empty State
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-3">
              <ReceiptText className="w-6 h-6 text-[#999999]" />
            </div>
            <p className="text-sm font-medium text-[#111111] mb-1">No transactions yet</p>
            <p className="text-xs text-[#666666]">Your completed transfers will appear here.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View - Hidden on mobile */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F9FA] border-b border-[#E5E5E5]">
                  <tr>
                    <th className="text-left text-[10px] font-medium text-[#666666] uppercase tracking-wider px-4 py-3">Reference</th>
                    <th className="text-left text-[10px] font-medium text-[#666666] uppercase tracking-wider px-4 py-3">Amount Sent</th>
                    <th className="text-left text-[10px] font-medium text-[#666666] uppercase tracking-wider px-4 py-3">Rate</th>
                    <th className="text-left text-[10px] font-medium text-[#666666] uppercase tracking-wider px-4 py-3">Channel</th>
                    <th className="text-left text-[10px] font-medium text-[#666666] uppercase tracking-wider px-4 py-3">Recipient</th>
                    <th className="text-left text-[10px] font-medium text-[#666666] uppercase tracking-wider px-4 py-3">Status</th>
                    <th className="text-right text-[10px] font-medium text-[#666666] uppercase tracking-wider px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0F0]">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-[#F8F9FA] transition-colors">
                      <td className="px-4 py-3 text-[11px] text-[#111111] font-mono">
                        #TX{transaction.id?.slice(-8) || Date.now().toString().slice(-8)}
                      </td>
                      <td className="px-4 py-3 text-[11px] font-medium text-[#111111]">
                        <span className={transaction.type === 'internal_received' ? 'text-[#111111]' : 'text-green-600'}>
                          {transaction.type === 'internal_received' ? '-' : '+'}
                          {transaction.type === 'internal_received' 
                            ? `₦${transaction.recipientAmount}` 
                            : `€${transaction.amountSent}`}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-[#111111]">
                        ₦{transaction.rate || 1700}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-[#111111]">
                        {transaction.paymentMethod || 'Bank Transfer'}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-[#111111]">
                        {transaction.beneficiaryName || 'Unknown'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                          Successful
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleViewTransaction(transaction)}
                          className="text-[#111111] hover:underline text-xs font-medium flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List View - Hidden on desktop */}
            <div className="md:hidden divide-y divide-[#F0F0F0]">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  onClick={() => handleViewTransaction(transaction)}
                  className="flex items-center px-4 py-3 hover:bg-[#F8F9FA] transition-colors cursor-pointer"
                >
                  {/* Div 1: Icon */}
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-9 h-9 bg-[#E91908]/10 rounded-full flex items-center justify-center">
                      {/* <ArrowUpRight className="w-4 h-4 text-[#E91908]" /> */}
                      <img 
                      src="/src/assets/images/arrow.png"
                      alt="Money transfer illustration"
                      className="w-4 h-4 object-cover"
                    />
                    </div>
                  </div>

                  {/* Div 2: Beneficiary + Date */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-[#111111] truncate">
                      {transaction.beneficiaryName || 'Unknown'}
                    </p>
                    <p className="text-[9px] text-[#666666]">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>

                  {/* Div 3: Amount + Status */}
                  <div className="flex-shrink-0 text-right">
                    <p className={`text-[10px] font-semibold ${transaction.type === 'internal_received' ? 'text-[#111111]' : 'text-green-600'}`}>
                      {transaction.type === 'internal_received' ? '1' : '+'}€{transaction.amountSent}
                    </p>
                    <span className="text-[8px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Successful
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionHistory;