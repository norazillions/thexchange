import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import TheLoad from './common/TheLoad';

const ProtectedRoute = ({ children }) => {
  const { user, loading, reloadUser } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState('valid-id');

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setCheckingOnboarding(false);
        return;
      }

      try {
        await reloadUser();
        if (!user.emailVerified) {
          setCheckingOnboarding(false);
          return;
        }
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setOnboardingComplete(userData.onboardingCompleted === true);
          setOnboardingStep(userData.onboardingStep || 'valid-id');
        } else {
          setOnboardingComplete(false);
          setOnboardingStep('valid-id');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setOnboardingComplete(false);
        setOnboardingStep('valid-id');
      } finally {
        setCheckingOnboarding(false);
      }
    };

    if (!loading) {
      checkOnboardingStatus();
    }
  }, [user, loading, reloadUser]);

  if (loading || checkingOnboarding) {
    return (
      <TheLoad/>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (!onboardingComplete) {
    return <Navigate to={`/onboarding/${onboardingStep}`} replace />;
  }

  return children;
};

export default ProtectedRoute;