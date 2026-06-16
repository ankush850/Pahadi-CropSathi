import { useState } from 'react'
import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Chat } from './pages/Chat'
import { Diagnostics } from './pages/Diagnostics'
import { MandiPrices } from './pages/MandiPrices'
import { Profile } from './pages/Profile'
import { Auth } from './pages/Auth'

function InnerApp() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          <span className="text-2xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Loading CropSathi Profile...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'chat':
        return <Chat />;
      case 'diagnostics':
        return <Diagnostics />;
      case 'mandi':
        return <MandiPrices />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderActiveTab()}
    </Layout>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </SettingsProvider>
  );
}
