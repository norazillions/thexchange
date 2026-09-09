import { NavLink } from 'react-router-dom';
import { Home, History, Users, Shield, User } from 'lucide-react';

const MobileBottomNav = () => {
  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/transaction-history', icon: History, label: 'History' },
    { path: '/beneficiary', icon: Users, label: 'Beneficiary' },
    { path: '/account-limits', icon: Shield, label: 'Limits' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E5] px-2 pb-2 pt-1 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-[#E91908]' : 'text-[#8A8A8A]'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;