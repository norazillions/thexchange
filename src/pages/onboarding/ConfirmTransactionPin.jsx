import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import StepProgress from '../../components/auth/StepProgress';

const ConfirmTransactionPin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pin, setPin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const steps = [
    { id: 1, label: 'Sign Up' },
    { id: 2, label: 'Verify Email' },
    { id: 3, label: 'Upload Credentials' },
  ];

  useEffect(() => {
    const tempPin = sessionStorage.getItem('tempPin');
    if (!tempPin) {
      toast.warning('No PIN found to confirm. Please set your PIN first.');
      navigate('/onboarding/set-pin');
    }
  }, [navigate]);

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

    const originalPin = sessionStorage.getItem('tempPin');
    
    if (!originalPin) {
      toast.error('No PIN found to confirm. Please set your PIN first.');
      navigate('/onboarding/set-pin');
      return;
    }

    if (pinString !== originalPin) {
      toast.error('PINs do not match. Please try again.');
      setPin(['', '', '', '']);
      inputRefs[0].current.focus();
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
        transactionPin: originalPin,
        transactionPinSet: true,
        onboardingStep: 'completed',
        onboardingCompleted: true,
        completedAt: new Date().toISOString()
      });
      
      sessionStorage.removeItem('tempPin');
      
      setIsComplete(true);
      toast.success('🎉 Onboarding complete! Welcome to TheXchange!');
      
      setTimeout(() => {
        navigate('/home');
      }, 2000);
      
    } catch (error) {
      console.error('Error confirming PIN:', error);
      toast.error('Failed to confirm PIN. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        {isComplete ? (
          <div className="text-center mt-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-[#111111] mb-2">
              🎉 Onboarding Complete!
            </h2>
            <p className="text-[#777777] text-[11px]">
              Your account is now fully set up. Welcome to TheXchange!
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mt-6 mb-2">
              <h1 className="text-lg font-semibold text-[#111111]">
                Confirm Pin
              </h1>
              <p className="text-[#777777] text-[11px] mt-1.5 leading-relaxed">
                Re-enter your 4-digit PIN to confirm
              </p>
            </div>
            <div className="text-center mt-6">
              
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
                {isLoading ? 'Confirming...' : 'Confirm'}
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem('tempPin');
                  navigate('/onboarding/set-pin');
                }}
                className="block mx-auto mt-3 text-[#CCCCCC] text-[9px] hover:text-[#8A8A8A] transition-colors"
              >
                Go back to set a new PIN
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmTransactionPin;