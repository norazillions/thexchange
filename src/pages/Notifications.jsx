import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firestore';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  getDoc 
} from 'firebase/firestore';
import { motion } from 'motion/react';
import { ArrowLeft, Bell, User, Euro, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import TheLoad from '../components/common/TheLoad';

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch notifications
    const notificationsRef = collection(db, 'users', user.uid, 'notifications');
    const q = query(notificationsRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifs = [];
      querySnapshot.forEach((doc) => {
        notifs.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setNotifications(notifs);
      setLoading(false);
    });

    // Mark notifications as read and reset count
    const markAsRead = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          notificationCount: 0
        });
        console.log('✅ Notifications marked as read');
      } catch (error) {
        console.error('Error marking notifications as read:', error);
      }
    };

    // Wait a moment then mark as read
    const timer = setTimeout(() => {
      markAsRead();
    }, 1000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [user]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const handleBack = () => {
    navigate(-1);
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
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 rounded-lg hover:bg-[#F5F5F5] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#111111]" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-[#111111]">Notifications</h1>
          <p className="text-xs text-[#666666]">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white border border-[#E5E5E5] rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-[#999999]" />
          </div>
          <h3 className="text-base font-medium text-[#111111] mb-2">No notifications</h3>
          <p className="text-sm text-[#666666]">You're all caught up!</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E5E5] rounded-lg overflow-hidden divide-y divide-[#F0F0F0]">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-4 p-4 hover:bg-[#F8F9FA] transition-colors"
            >
              {/* Icon */}
              <div className="w-10 h-10 bg-[#E91908]/10 rounded-full flex items-center justify-center flex-shrink-0">
                {notification.type === 'payment_received' ? (
                  <Euro className="w-5 h-5 text-[#E91908]" />
                ) : (
                  <Bell className="w-5 h-5 text-[#E91908]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#111111] leading-relaxed">
                  {notification.content}
                </p>
                <p className="text-xs text-[#666666] mt-1 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {formatDate(notification.createdAt)}
                </p>
              </div>

              {/* Unread indicator */}
              {!notification.isRead && (
                <div className="w-2 h-2 bg-[#E91908] rounded-full flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Notifications;