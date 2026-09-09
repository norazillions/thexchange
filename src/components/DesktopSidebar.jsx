import { NavLink, useNavigate } from 'react-router-dom';
import { Home, History, Users, Shield, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const DesktopSidebar = () => {
  const navigate = useNavigate();
  const { handleSignOut } = useAuth();

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/transaction-history', icon: History, label: 'Transaction History' },
    { path: '/beneficiary', icon: Users, label: 'Beneficiary' },
    { path: '/account-limits', icon: Shield, label: 'Account Limits' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const handleLogout = async () => {
    try {
      await handleSignOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <aside className="w-56 h-full bg-white border-r border-[#E5E5E5] flex flex-col flex-shrink-0">
      <div className="px-5 py-6 border-b border-[#E5E5E5] flex-shrink-0">
        <h1 className="text-xl font-bold text-[#251412]">THEXCHANGE</h1>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#E91908] text-[#FFFF]'
                  : 'text-[#505050] hover:bg-[#F0F0F0]'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-[#E5E5E5] flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#505050] hover:bg-[#F0F0F0] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default DesktopSidebar;