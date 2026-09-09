import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore';

const OnboardingRoute = ({ children, requiredStep }) => {
  const { user, loading, reloadUser } = useAuth();
  const [checking, setChecking] = useState(true);
  const [currentStep, setCurrentStep] = useState(null);
  const stepOrder = {
    'valid-id': 0,
    'photo': 1,
    'proof-of-residence': 2,
    'set-pin': 3,
    'confirm-pin': 4,
    'completed': 5,
  };

  const revisitableSteps = ['set-pin'];
  const steps = ['valid-id', 'photo', 'proof-of-residence', 'set-pin', 'confirm-pin'];

  useEffect(() => {
    const checkStep = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        await reloadUser();
        
        if (!user.emailVerified) {
          setChecking(false);
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.onboardingCompleted === true) {
            setCurrentStep('completed');
          } else {
            setCurrentStep(userData.onboardingStep || 'valid-id');
          }
        } else {
          setCurrentStep('valid-id');
        }
      } catch (error) {
        console.error('Error checking onboarding step:', error);
        setCurrentStep('valid-id');
      } finally {
        setChecking(false);
      }
    };

    if (!loading) {
      checkStep();
    }
  }, [user, loading, reloadUser]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E91908] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[#505050] text-sm mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  if (currentStep === 'completed') {
    return <Navigate to="/" replace />;
  }

  const currentStepNum = stepOrder[currentStep] ?? 0;
  const requiredStepNum = stepOrder[requiredStep] ?? 0;

  if (currentStepNum === requiredStepNum) {
    return children;
  }

  if (currentStepNum < requiredStepNum) {
    if (revisitableSteps.includes(requiredStep)) {
      return children;
    }
    
    const firstIncompleteStep = steps[currentStepNum] || 'valid-id';
    return <Navigate to={`/onboarding/${firstIncompleteStep}`} replace />;
  }
  if (currentStepNum > requiredStepNum && !revisitableSteps.includes(requiredStep)) {
    const currentStepPath = steps[currentStepNum] || 'valid-id';
    return <Navigate to={`/onboarding/${currentStepPath}`} replace />;
  }
  return children;
};

export default OnboardingRoute;