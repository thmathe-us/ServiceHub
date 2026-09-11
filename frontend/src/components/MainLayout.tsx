import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Button } from './ui/button';
import { Menu, UserCircle } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { cn } from '../lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-background-main">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className={cn(
        'transition-margin duration-300 ease-in-out min-h-screen',
        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
      )}>
        <header className="bg-card border-b border-border sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)]"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden lg:flex text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)]"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1" />
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <UserCircle className="h-6 w-6 text-text-secondary" />
                <span className="text-sm font-medium text-text-primary">{user?.name} {user?.lastName}</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};