import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, ArrowLeft, Share2 } from 'lucide-react';

const TransactionDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const transaction = location.state?.transaction;

  if (!transaction) {
    navigate('/transaction-history');
    return null;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      let date;
      if (timestamp.toDate) {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else if (typeof timestamp === 'number') {
        date = new Date(timestamp);
      } else {
        return 'N/A';
      }
      
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      
      const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownloadPDF = () => {
    console.log('Download PDF clicked');
  };

  const handleSharePDF = () => {
    console.log('Share PDF clicked');
  };

  // Determine if this was a received transaction
  const isReceived = transaction.type === 'internal_received';
  const displayAmount = isReceived ? transaction.recipientAmount || transaction.amountSent * 1700 : transaction.amountSent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[680px] mx-auto px-5 lg:px-8 pt-6 pb-10"
    >
      <button
        onClick={handleBack}
        className="flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#E91908] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      <h1 className="text-xl font-semibold text-[#111111] text-center">
        {isReceived ? '+' : '-'}${displayAmount} {isReceived ? 'Received' : 'Sent'}
      </h1>
      <p className="mt-1 text-xs text-[#666666] text-center">
        Your transfer was {isReceived ? 'received' : 'sent'} successfully
      </p>
      <div className="flex justify-center mt-6 mb-6">
        <CheckCircle className="w-16 h-16 text-[#22C55E]" strokeWidth={1.8} />
      </div>
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-[#111111] mb-3">Transaction details</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-6 py-1.5 border-b border-[#F5F5F5]">
            <span className="text-xs text-[#666666]">Transaction amount</span>
            <span className="text-xs font-medium text-[#111111] text-right">
              ${transaction.amountSent}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 py-1.5 border-b border-[#F5F5F5]">
            <span className="text-xs text-[#666666]">Exchange rate</span>
            <span className="text-xs font-medium text-[#111111] text-right">
              ₦{transaction.rate || 1700}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 py-1.5 border-b border-[#F5F5F5]">
            <span className="text-xs text-[#666666]">You {isReceived ? 'received' : 'sent'}</span>
            <span className="text-xs font-medium text-[#111111] text-right">
              {isReceived ? '+' : '-'}${displayAmount}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 py-1.5 border-b border-[#F5F5F5]">
            <span className="text-xs text-[#666666]">Payment method</span>
            <span className="text-xs font-medium text-[#111111] text-right">
              {transaction.paymentMethod || 'Bank Transfer'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 py-1.5 border-b border-[#F5F5F5]">
            <span className="text-xs text-[#666666]">Transaction date</span>
            <span className="text-xs font-medium text-[#111111] text-right">
              {formatDate(transaction.createdAt)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 py-1.5">
            <span className="text-xs text-[#666666]">Transaction reference</span>
            <span className="text-xs font-medium text-[#111111] text-right">
              #TX{transaction.id?.slice(-8) || Date.now().toString().slice(-8)}
            </span>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-[#111111] mb-3">
          {isReceived ? 'Sender details' : 'Beneficiary details'}
        </h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-6 py-1.5 border-b border-[#F5F5F5]">
            <span className="text-xs text-[#666666]">Name</span>
            <span className="text-xs font-medium text-[#111111] text-right">
              {transaction.beneficiaryName || 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 py-1.5 border-b border-[#F5F5F5]">
            <span className="text-xs text-[#666666]">Account number</span>
            <span className="text-xs font-medium text-[#111111] text-right">
              {transaction.beneficiaryAccountNumber || 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 py-1.5 border-b border-[#F5F5F5]">
            <span className="text-xs text-[#666666]">Bank</span>
            <span className="text-xs font-medium text-[#111111] text-right">
              {transaction.beneficiaryBank || 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 py-1.5">
            <span className="text-xs text-[#666666]">Country</span>
            <span className="text-xs font-medium text-[#111111] text-right">
              {transaction.country || 'Nigeria'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
        <button
          onClick={handleDownloadPDF}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#E5E5E5] text-[#111111] text-xs font-medium rounded hover:bg-[#D9D9D9] transition-colors"
        >
          Download PDF
        </button>
        <button
          onClick={handleSharePDF}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#E91908] text-white text-xs font-medium rounded hover:bg-[#cc1707] transition-colors flex items-center justify-center gap-2"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share PDF
        </button>
      </div>
    </motion.div>
  );
};

export default TransactionDetail;