import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import MakeTransfer from './MakeTransfer';

const SendMoney = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto px-4 sm:px-6 pb-20 lg:pb-6 pt-4"
    >
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/home')}
          className="p-2 rounded-lg hover:bg-[#F5F5F5] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#111111]" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-[#111111]">Send Money</h1>
          <p className="text-xs text-[#666666]">Transfer money to your beneficiaries</p>
        </div>
      </div>

      {/* Transfer Form */}
      <MakeTransfer compact={true} />
    </motion.div>
  );
};

export default SendMoney;