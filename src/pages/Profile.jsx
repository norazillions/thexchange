import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firestore';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { motion } from 'motion/react';
import { User, Edit2, ArrowUpRight, LogOut, Bell } from 'lucide-react';
import { toast } from 'react-toastify';
import TheLoad from '../components/common/TheLoad';

const Profile = () => {
  const navigate = useNavigate();
  const { user, handleSignOut } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Fetch user data with real-time updates
    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setNotificationCount(data.notificationCount || 0);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
    };

  const handleUpgrade = () => {
    navigate('/account-limits');
  };

  const handleLogout = async () => {
    try {
      await handleSignOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const handleNotifications = () => {
    navigate('/notifications');
  };

  if (loading) {
    return (
      <TheLoad/>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6"
    >
      {/* Profile Card - Wider like Transaction History */}
      <div className="w-full bg-white rounded-lg border border-[#E5E5E5] p-6 sm:p-8 lg:p-10">
        
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-[60px] h-[60px] rounded-full bg-[#A6A6A6] flex items-center justify-center overflow-hidden flex-shrink-0">
              {userData?.profilePhoto ? (
                <img 
                  src="/src/assets/images/avatar.png" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            
            {/* User Name */}
            <h2 className="text-lg font-semibold text-[#111111]">
              {userData?.firstName} {userData?.lastName}
            </h2>
          </div>

          {/* Desktop: Edit Profile Button */}
          <button
            onClick={handleEditProfile}
            className="hidden lg:flex bg-[#E91908] text-white text-xs font-medium px-4 py-1.5 rounded hover:bg-[#cc1707] transition-colors"
          >
            Edit profile
          </button>

          {/* Mobile: Notification Bell */}
          <button
            onClick={handleNotifications}
            className="lg:hidden p-2 rounded-lg hover:bg-[#F5F5F5] transition-colors relative"
          >
            <Bell className="w-5 h-5 text-[#111111]" />
            {notificationCount > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            ) : (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#E91908] rounded-full"></span>
            )}
          </button>
        </div>

        {/* Personal Details Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#111111]">Personal details</h3>
            
            {/* Edit Button - Mobile */}
            <button
              onClick={handleEditProfile}
              className="lg:hidden bg-transparent border border-[#E91908] text-[#E91908] text-xs font-medium px-4 py-1.5 rounded-full hover:bg-[#E91908]/5 transition-colors"
            >
              Edit
            </button>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-x-16 gap-y-5">
            <div>
              <p className="text-xs text-[#A0A0A0] mb-1">First name</p>
              <p className="text-sm text-[#111111]">{userData?.firstName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-[#A0A0A0] mb-1">Last name</p>
              <p className="text-sm text-[#111111]">{userData?.lastName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-[#A0A0A0] mb-1">Country of residence</p>
              <p className="text-sm text-[#111111]">{userData?.country || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-[#A0A0A0] mb-1">Email address</p>
              <p className="text-sm text-[#111111]">{userData?.email || user?.email || 'N/A'}</p>
            </div>
          </div>

          {/* Mobile Stacked */}
          <div className="lg:hidden space-y-6">
            <div>
              <p className="text-xs text-[#A0A0A0] mb-1">First name</p>
              <p className="text-sm text-[#111111]">{userData?.firstName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-[#A0A0A0] mb-1">Last name</p>
              <p className="text-sm text-[#111111]">{userData?.lastName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-[#A0A0A0] mb-1">Email address</p>
              <p className="text-sm text-[#111111]">{userData?.email || user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-[#A0A0A0] mb-1">Country of residence</p>
              <p className="text-sm text-[#111111]">{userData?.country || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Transaction Limits Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#111111]">Transaction limits</h3>
            
            {/* Upgrade Button - Mobile */}
            <button
              onClick={handleUpgrade}
              className="lg:hidden bg-transparent border border-[#E91908] text-[#E91908] text-xs font-medium px-4 py-1.5 rounded-full hover:bg-[#E91908]/5 transition-colors"
            >
              Upgrade
            </button>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-x-16 gap-y-5">
            <div>
              <p className="text-xs text-[#A0A0A0] mb-1">Daily limit</p>
              <p className="text-sm text-[#111111]">€{formatCurrency(userData?.dailyLimit || 4000)}</p>
            </div>
            <div>
              <p className="text-xs text-[#A0A0A0] mb-1">Yearly limit</p>
              <p className="text-sm text-[#111111]">€{formatCurrency(userData?.yearlyLimit || 529500)}</p>
            </div>
          </div>

          {/* Mobile Stacked */}
          <div className="lg:hidden space-y-6">
            <div>
              <p className="text-xs text-[#A0A0A0] mb-1">Daily limit</p>
              <p className="text-sm text-[#111111]">€{formatCurrency(userData?.dailyLimit || 4000)}</p>
            </div>
            <div>
              <p className="text-xs text-[#A0A0A0] mb-1">Yearly limit</p>
              <p className="text-sm text-[#111111]">€{formatCurrency(userData?.yearlyLimit || 529500)}</p>
            </div>
          </div>
        </div>

        {/* Logout Button - Mobile Only */}
        <div className="lg:hidden pt-4 border-t border-[#E5E5E5]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-[#E91908] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#cc1707] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;