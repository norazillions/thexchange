import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firestore';
import { 
  doc, getDoc, updateDoc, setDoc, increment, serverTimestamp, 
  collection, query, where, getDocs 
} from 'firebase/firestore';
import { toast } from 'react-toastify';


const PinModal = ({ isOpen, onClose, transferData, onSuccess }) => {  
  const { user } = useAuth();
  const [pin, setPin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      setIsSuccess(false);
      setIsLoading(false);
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePinChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(0, 1);
    setPin(newPin);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numbers = pastedData.replace(/\D/g, '').slice(0, 4);
    
    if (numbers.length === 4) {
      const newPin = numbers.split('');
      setPin(newPin);
      inputRefs[3].current?.focus();
    }
  };

  const processTransfer = async (userData) => {
    if (!transferData || !user) {
      console.log('❌ No transferData or user found');
      return;
    }

    try {
      const senderId = user.uid;
      const senderAccountNumber = userData.accountNumber;
      const amountSent = parseFloat(transferData.sendAmount);
      const recipientAmount = transferData.recipientAmount;
      let receiverId = null;
      let receiverData = null;
      let isInternalTransfer = false;

      if (transferData.beneficiaryAccountNumber && transferData.beneficiaryAccountNumber !== 'N/A') {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('accountNumber', '==', transferData.beneficiaryAccountNumber));
        const querySnapshot = await getDocs(q);        
        if (!querySnapshot.empty) {
          const receiverDoc = querySnapshot.docs[0];
          receiverData = receiverDoc.data();
          receiverId = receiverDoc.id;
          isInternalTransfer = true;
        } else {
          console.log('❌ No user found with this account number - External transfer');
        }
      } else {
        console.log('❌ No beneficiary account number provided - External transfer');
      }
      const senderTransactionId = `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const senderDocRef = doc(db, 'users', senderId, 'transactions', senderTransactionId);
      
      const senderTransactionData = {
        beneficiaryId: transferData.beneficiaryId || 'unknown',
        beneficiaryName: transferData.beneficiaryName || 'Unknown',
        beneficiaryAccountNumber: transferData.beneficiaryAccountNumber || 'N/A',
        amountSent: amountSent,
        recipientAmount: recipientAmount,
        paymentMethod: transferData.paymentMethod || 'N/A',
        reason: transferData.reason || 'Not specified',
        source: transferData.source || 'Not specified',
        rate: userData.rateChange || 1700,
        status: 'completed',
        type: isInternalTransfer ? 'internal_sent' : 'external_sent',
        senderId: senderId,
        receiverId: receiverId,
        beneficiaryBank: transferData.beneficiaryBank || 'N/A',
        createdAt: serverTimestamp()
      };

      await setDoc(senderDocRef, senderTransactionData);
      if (isInternalTransfer && receiverId && receiverData) {
        
        const receiverTransactionId = `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const receiverDocRef = doc(db, 'users', receiverId, 'transactions', receiverTransactionId);
        
        const receiverBeneficiaryName = `${userData.firstName || 'Unknown'} ${userData.lastName || 'User'}`;
        
        const receiverTransactionData = {
          beneficiaryId: senderId,
          beneficiaryName: receiverBeneficiaryName,
          beneficiaryAccountNumber: senderAccountNumber || 'N/A',
          amountSent: amountSent,
          recipientAmount: recipientAmount,
          paymentMethod: transferData.paymentMethod || 'N/A',
          reason: transferData.reason || 'Not specified',
          source: transferData.source || 'Not specified',
          rate: userData.rateChange || 1700,
          status: 'completed',
          type: 'internal_received',
          senderId: senderId,
          receiverId: receiverId,
          beneficiaryBank: transferData.beneficiaryBank || 'N/A',
          createdAt: serverTimestamp()
        };

        await setDoc(receiverDocRef, receiverTransactionData);
        const receiverNotificationId = `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const receiverNotificationRef = doc(db, 'users', receiverId, 'notifications', receiverNotificationId);
        
        const receiverNotificationData = {
          senderId: senderId,
          senderName: `${userData.firstName || 'Unknown'} ${userData.lastName || 'User'}`,
          amountSent: amountSent,
          content: `You received $${amountSent} from ${userData.firstName || 'Unknown'} ${userData.lastName || 'User'}`,
          type: 'payment_received',
          isRead: false,
          createdAt: serverTimestamp()
        };
        
        await setDoc(receiverNotificationRef, receiverNotificationData);
        const receiverRef = doc(db, 'users', receiverId);
        const receiverCurrentBalance = receiverData.totalBalance || 0;
        
        await updateDoc(receiverRef, {
          totalBalance: receiverCurrentBalance + amountSent,
          transactionCount: increment(1),
          notificationCount: increment(1)
        });
      }

      const senderRef = doc(db, 'users', senderId);
      const senderCurrentBalance = userData.totalBalance || 0;
      
      await updateDoc(senderRef, {
        transactionCount: increment(1),
        totalBalance: senderCurrentBalance - amountSent
      });
      setIsSuccess(true);
      toast.success('Transfer completed successfully!');
      sessionStorage.removeItem('transferData');

      setTimeout(() => {
        onClose();
        if (onSuccess) {
          onSuccess(transferData);
        }
      }, 2000);

    } catch (error) {
      console.error('❌ Error processing transfer:', error);
      toast.error('Failed to complete transfer. Please try again.');
    }
  };

  const handleSubmit = async () => {
    
    const pinString = pin.join('');
    
    if (pinString.length !== 4) {
      toast.warning('Please enter your 4-digit PIN.');
      return;
    }

    if (!user) {
      toast.error('Please sign in again.');
      return;
    }

    setIsLoading(true);

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        toast.error('User not found.');
        setIsLoading(false);
        return;
      }

      const userData = userSnap.data();
      const savedPin = userData.transactionPin;
      if (pinString !== savedPin) {
        toast.error('Invalid PIN. Please try again.');
        setPin(['', '', '', '']);
        inputRefs[0].current?.focus();
        setIsLoading(false);
        return;
      }
      await processTransfer(userData);

    } catch (error) {
      console.error('Error verifying PIN:', error);
      toast.error('Failed to verify PIN. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg max-w-[480px] w-full p-6 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-[#666666] hover:text-[#111111] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-[#111111] mb-2">Processing...</h2>
              <p className="text-sm text-[#666666]">Please wait while we complete your transfer.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-[#E91908]/10 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-[#E91908]" />
                </div>
              </div>

              <h2 className="text-lg font-semibold text-[#111111] text-center mb-1">
                Verify your transaction
              </h2>
              <p className="text-xs text-[#666666] text-center mb-6">
                Enter your 4-digit transaction PIN to confirm
              </p>

              {transferData && (
                <div className="bg-[#F5F5F5] rounded-lg p-4 mb-6 text-center">
                  <p className="text-xs text-[#666666]">Amount</p>
                  <p className="text-xl font-bold text-[#111111]">${transferData.sendAmount}</p>
                  <p className="text-xs text-[#666666]">to {transferData.beneficiaryName}</p>
                </div>
              )}

              <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="password"
                    maxLength="1"
                    value={pin[index]}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold border border-[#E5E5E5] rounded-lg focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908] transition-all bg-white"
                    autoFocus={index === 0}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    disabled={isLoading}
                  />
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-[#E91908] text-white font-medium py-3 rounded-lg hover:bg-[#cc1707] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Confirm Payment'}
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PinModal;