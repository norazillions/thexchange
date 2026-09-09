import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import StepProgress from '../../components/auth/StepProgress';

const SetTransactionPin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pin, setPin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const steps = [
    { id: 1, label: 'Sign Up' },
    { id: 2, label: 'Verify Email' },
    { id: 3, label: 'Upload Credentials' },
  ];
  const handlePinChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(0, 1);
    setPin(newPin);
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };


  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numbers = pastedData.replace(/\D/g, '').slice(0, 4);
    
    if (numbers.length === 4) {
      const newPin = numbers.split('');
      setPin(newPin);
      inputRefs[3].current.focus();
    }
  };


  const handleSubmit = async () => {
    const pinString = pin.join('');
    
    if (pinString.length !== 4) {
      toast.warning('Please enter a 4-digit PIN.');
      return;
    }

    if (!user) {
      toast.error('No user found. Please sign in again.');
      return;
    }

    setIsLoading(true);
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        transactionPin: pinString, 
        transactionPinSet: false,
        onboardingStep: 'confirm-pin'
      });
      
      sessionStorage.setItem('tempPin', pinString);
      
      toast.success('PIN set! Please confirm your PIN.');
      window.location.href = '/onboarding/confirm-pin';
      
    } catch (error) {
      console.error('Error setting PIN:', error);
      toast.error('Failed to set PIN. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mt-6 mb-2">
          <h1 className="text-lg font-semibold text-[#111111]">
            Set Transaction Pin
          </h1>
          <p className="text-[#777777] text-[11px] mt-1.5 leading-relaxed">
            Create a 4-digit PIN for secure transactions
          </p>
        </div>
        <div className="text-center mt-6">
          <p className="text-[#777777] text-[10px] mb-4">
            Enter your 4-digit PIN
          </p>
          
          <div className="flex justify-center gap-3 mb-5" onPaste={handlePaste}>
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="password"
                maxLength="1"
                value={pin[index]}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold border border-[#E5E5E5] rounded focus:outline-none focus:border-[#E91908] focus:ring-1 focus:ring-[#E91908] transition-all bg-white"
                autoFocus={index === 0}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-28 h-9 rounded font-medium text-[11px] bg-[#E91908] text-white hover:bg-[#cc1707] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Setting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetTransactionPin;