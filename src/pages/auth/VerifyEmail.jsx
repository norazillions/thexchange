import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CheckCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase/firebase';
import StepProgress from '../../components/auth/StepProgress';
import { db } from '../../firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
const emailVerificationImage = '/images/email-verification-placeholder.png';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { user, reloadUser } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false); 

  const steps = [
    { id: 1, label: 'Sign Up' },
    { id: 2, label: 'Verify Email' },
    { id: 3, label: 'Upload Credentials' },
  ];

  const checkVerificationStatus = async (showToast = true) => {
    setIsChecking(true);
    try {
      const refreshedUser = await reloadUser();
      
      if (refreshedUser && refreshedUser.emailVerified) {
        setIsVerified(true);
        if (showToast) {
          toast.success('Email verified successfully!');
        }
      } else {
        setIsVerified(false);
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    } finally {
      setIsChecking(false);
      setCheckCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    checkVerificationStatus(false);
    
    const interval = setInterval(() => {
      if (!isVerified) {
        checkVerificationStatus(false);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleResendVerification = async () => {
    if (!auth.currentUser) {
      toast.error('No user found. Please sign up again.');
      return;
    }

    setIsResending(true);
    try {
      const actionCodeSettings = {
        url: 'http://localhost:5173/verify-email',
        handleCodeInApp: true,
      };
      
      await auth.currentUser.sendEmailVerification(actionCodeSettings);
      toast.success('Verification email resent! Please check your inbox.');
    } catch (error) {
      console.error('Error resending verification:', error);
      toast.error('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleContinue = async () => {
  if (isVerified) {
    try {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          onboardingStep: 'valid-id'
        });
      }
      window.location.href = '/onboarding/valid-id'
    } catch (error) {
      console.error('Error updating onboarding step:', error);
      window.location.href = '/onboarding/valid-id'
    }
  } else {
    toast.warning('Please verify your email first.');
  }
};

  const userEmail = user?.email || 'your email address';

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <StepProgress steps={steps} currentStep={2} />
        <div className="text-center mt-6 mb-2">
          <h1 className="text-lg font-semibold text-[#111111]">Verify Email</h1>
          <p className="text-[#777777] text-[11px] mt-1.5 leading-relaxed">
            We've sent a verification link to your email address
          </p>
        </div>
        <div className="flex justify-center mt-6 mb-4">
          {isVerified ? (
            <CheckCircle className="w-24 h-24 text-[#E91908]" />
          ) : (
            <img
              src="/src/assets/images/email.png"
              alt="Email verification"
              className="w-24 h-24 object-contain"
            />
          )}
        </div>
        <div className="text-center">
          {isVerified ? (
            <>
              <h2 className="text-base font-bold text-[#111111] mb-2">
                Email Verified! ✅
              </h2>
              <p className="text-[#777777] text-[11px] leading-relaxed">
                Your email has been successfully verified. You can now continue.
              </p>
            </>
          ) : (
            <>
              <p className="text-[#777777] text-[11px] mb-1">
                We've sent a verification link 
                <span className="text-[#111111] font-medium text-[11px] mb-3">
                {userEmail}
                </span> Please check your inbox and click the verification link to continue.
              </p>
              <div className="mb-4">
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="w-full flex items-center justify-between bg-[#F8F8F8] border border-[#E5E5E5] rounded px-3 py-2 transition-colors hover:bg-[#F0F0F0]"
                >
                  <span className="text-[#111111] text-[10px] font-medium">
                    What to do
                  </span>
                  {showInstructions ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  )}
                </button>
                
                {showInstructions && (
                  <div className="mt-1.5 bg-[#F8F8F8] border border-[#E5E5E5] border-t-0 rounded-b px-3 py-2.5 text-left">
                    <ol className="text-[#777777] text-[10px] space-y-1.5 list-decimal list-inside">
                      <li className="leading-relaxed">
                        Open your email inbox
                      </li>
                      <li className="leading-relaxed">
                        Find the verification email from TheXchange
                      </li>
                      <li className="leading-relaxed">
                        Click the verification link
                      </li>
                      <li className="leading-relaxed text-[#E91908] font-medium">
                        Return here - we'll detect it automatically!
                      </li>
                    </ol>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-2 text-[9px] text-[#8A8A8A]">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${isChecking ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                <span>
                  {isChecking ? 'Checking...' : `Auto-checking (${checkCount})`}
                </span>
              </div>
            </>
          )}
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!isVerified}
            className={`w-28 h-9 rounded font-medium text-[11px] transition-colors ${
              isVerified
                ? 'bg-[#E91908] text-white hover:bg-[#cc1707] cursor-pointer'
                : 'bg-[#E5E5E5] text-[#AAAAAA] cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
        <p className="text-center text-[10px] text-[#8A8A8A] mt-4">
          Changed your mind?{' '}
          <Link to="/login" className="text-[#E91908] font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;