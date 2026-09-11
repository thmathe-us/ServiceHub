import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Logs from './pages/Logs';
import { MainLayout } from './components/MainLayout';
import { configsApi } from './services/configsApi';
import { usePreferencesStore } from './store/preferences.store';

function App() {
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const setPreferences = usePreferencesStore((state) => state.setPreferences);

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated) return;
    configsApi.getAll().then((configs) => {
      const values = Object.fromEntries(configs.map((config) => {
        const value = typeof config.value === 'string' ? config.value : config.value?.value;
        return [config.key, value];
      }));
      setPreferences({
        ...(values.check_interval && { checkInterval: values.check_interval }),
        ...(values.theme && { theme: values.theme as 'light' | 'dark' }),
        ...(values.language && { language: values.language as 'pt-BR' | 'en-US' | 'es-ES' }),
        ...(values.notifications_enabled && { notificationsEnabled: values.notifications_enabled === 'true' }),
      });
    }).catch(() => undefined);
  }, [hasHydrated, isAuthenticated, setPreferences]);

  const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
    if (!hasHydrated) {
      return null;
    }
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <MainLayout>{children}</MainLayout>;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/users" element={<ProtectedLayout><Users /></ProtectedLayout>} />
      <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
      <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
      <Route path="/logs" element={<ProtectedLayout><Logs /></ProtectedLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;