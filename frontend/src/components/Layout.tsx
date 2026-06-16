import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Leaf, 
  TrendingUp, 
  User, 
  Sun, 
  Moon, 
  Globe, 
  Menu, 
  X, 
  LogOut, 
  Mountain,
  Sprout
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { theme, toggleTheme, language, setLanguage, t, farmProfile } = useSettings();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'chat', label: t('advisor'), icon: MessageSquare },
    { id: 'diagnostics', label: t('diagnostics'), icon: Leaf },
    { id: 'mandi', label: t('mandi'), icon: TrendingUp },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 font-sans">
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-lg text-white">
            <Mountain className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
            {t('appName')}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar navigation */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/50 dark:border-slate-800/50 
        transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:flex md:flex-col z-50 transition-transform duration-300 ease-in-out h-full
      `}>
        {/* Brand / Logo */}
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 hidden md:block">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-emerald-600 to-emerald-400 dark:from-emerald-500 dark:to-emerald-300 rounded-xl text-white shadow-md shadow-emerald-500/10">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent block">
                CropSathi
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wide uppercase">
                {t('tagline')}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                  ${isSelected 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 shadow-sm border-l-4 border-emerald-600 dark:border-emerald-400' 
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/50'
                  }
                `}
              >
                <IconComponent className={`w-5 h-5 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User profile & controls footer */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
          {user && (
            <div className="flex items-center space-x-3 mb-4 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/40">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                {user.displayName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {user.role === 'farmer' ? t('farmer') : t('supervisor')}
                </p>
                <p className="text-sm font-bold truncate text-slate-800 dark:text-slate-200">
                  {user.displayName}
                </p>
              </div>
            </div>
          )}

          {/* Language selection toggle */}
          <div className="flex items-center justify-between px-2 mb-3">
            <span className="text-xs font-medium text-slate-400 flex items-center">
              <Globe className="w-3.5 h-3.5 mr-1" /> Lang
            </span>
            <div className="flex bg-slate-200/80 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
              {(['en', 'hi', 'pah'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-0.5 rounded-md text-2xs font-extrabold transition-all uppercase ${
                    language === lang 
                      ? 'bg-white text-emerald-700 dark:bg-slate-700 dark:text-emerald-400 shadow-xs' 
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                  style={{ fontSize: '0.65rem' }}
                >
                  {lang === 'pah' ? 'पहाड़ी' : lang}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Desktop Theme toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors hidden md:block"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Logout button */}
            <button 
              onClick={() => logout()}
              className="flex items-center space-x-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 px-3 py-2 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar header for status/elevation details */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 m-0 leading-none">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center font-medium">
              <Sprout className="w-3.5 h-3.5 mr-1 text-emerald-500" />
              {t('welcomeBack')}, {user?.displayName}
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">{t('elevation')}</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center justify-end">
                <Mountain className="w-4 h-4 mr-1 text-slate-500" />
                {farmProfile.elevation} m
              </span>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">{t('soilType')}</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {t(farmProfile.soilType)}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">{t('location')}</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {farmProfile.location}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic page container */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full fade-in">
          {children}
        </div>
      </main>

    </div>
  );
};
