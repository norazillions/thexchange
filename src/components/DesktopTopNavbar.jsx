import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, User } from 'lucide-react';
import { db } from '../firebase/firestore';
import { doc, onSnapshot } from 'firebase/firestore';

const DesktopTopNav = ({ title }) => {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setNotificationCount(data.notificationCount || 0);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleNotificationClick = () => {
    window.location.href = '/notifications';
  };

  return (
    <header className="h-16 bg-white border-b border-[#E5E5E5] flex items-center justify-between px-6 flex-shrink-0">
      <h2 className="text-lg font-semibold text-[#251412]">{title}</h2>
      <div className="flex items-center gap-4">
        


        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E91908]/10 flex items-center justify-center">
            <User className="w-4 h-4 text-[#E91908]" />
          </div>
          <span className="text-sm font-medium text-[#251412]">
            {user?.displayName || user?.email?.split('@')[0] || 'User'}
          </span>
        </div>
        <button
          onClick={handleNotificationClick}
          className="p-2 rounded-lg hover:bg-[#F0F0F0] transition-colors relative"
        >
          <Bell className="w-5 h-5 text-[#505050]" />
          {notificationCount > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          ) : (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#E91908] rounded-full"></span>
          )}
        </button>
      </div>
    </header>
  );
};

export default DesktopTopNav;