import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  UserCircle, 
  LogOut, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from '../store/preferences.store';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuthStore();
  const t = useTranslation();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { icon: LayoutDashboard, label: t.dashboard, path: '/' },
    { icon: Users, label: t.users, path: '/users', roles: ['ADMIN'] },
    { icon: FileText, label: t.logs, path: '/logs', roles: ['ADMIN'] },
    { icon: Settings, label: t.settings, path: '/settings' },
    { icon: UserCircle, label: t.profile, path: '/profile' },
  ];

  const canViewItem = (item: any) => {
    if (!item.roles || item.roles.length === 0) return true;
    if (!user || !user.role) return false;
    return item.roles.includes(user.role);
  };

  return (
    <div 
      className={cn(
        'bg-card border-r border-border h-screen fixed left-0 top-0 z-40 transition-transform duration-300 ease-in-out',
        isOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0'
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className={cn(
            'flex items-center gap-2',
            !isOpen && 'lg:hidden'
          )}>
            <ShieldCheck className="h-6 w-6 text-[#3b82f6]" />
            {isOpen && <span className="font-inter font-bold text-lg text-foreground">ServiceHub</span>}
          </div>
          <button 
            className="lg:hidden p-1 rounded-md hover:bg-[rgba(255,255,255,0.05)]"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              if (!canViewItem(item)) return null;
              return (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative',
                        isActive
                          ? 'text-foreground bg-primary/10'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        !isOpen && 'lg:justify-center',
                        isActive && 'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-[#3b82f6] before.rounded-r'
                      )
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className={cn('h-5 w-5', !isOpen && 'lg:h-5 lg:w-5')} />
                    {isOpen && <span>{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-2 border-t border-border">
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-muted-foreground hover:bg-muted hover:text-foreground',
              !isOpen && 'lg:justify-center'
            )}
          >
            <LogOut className="h-5 w-5" />
            {isOpen && <span>{t.logout}</span>}
          </button>
        </div>
      </div>
    </div>
  );
};
