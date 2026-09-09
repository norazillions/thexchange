import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DesktopSidebar from './DesktopSidebar';
import DesktopTopNav from './DesktopTopNavbar';
import MobileBottomNav from './MobileBottomNav';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [pageTitle, setPageTitle] = useState('Home');
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) return;
      
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setOnboardingComplete(userData.onboardingCompleted === true);
        }
      } catch (error) {
        console.error('Error checking onboarding:', error);
      }
    };

    if (user) {
      checkOnboarding();
    }
  }, [user]);
  useEffect(() => {
    const path = window.location.pathname;
    const titles = {
      '/home': 'Home',
      '/transaction-history': 'Transaction History',
      '/beneficiary': 'Beneficiary',
      '/add-beneficiary': 'Add Beneficiary',
      '/account-limits': 'Account Limits',
      '/profile': 'Profile',
    };
    setPageTitle(titles[path] || 'Dashboard');
  }, [window.location.pathname]);



  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      <div className="hidden md:block">
        <DesktopSidebar />
      </div>
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="hidden md:block">
          <DesktopTopNav title={pageTitle} />
        </div>
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default Dashboard;