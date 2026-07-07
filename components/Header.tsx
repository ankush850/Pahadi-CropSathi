import React from 'react';
import { Leaf, Menu, Bell, User, Globe } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface HeaderProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  currentPage: 'dashboard' | 'market' | 'community';
  onPageChange: (page: 'dashboard' | 'market' | 'community') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentLang, onLangChange, currentPage, onPageChange }) => {
  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'mr', label: 'मराठी' },
  ];

  const t = (key: string) => getTranslation(currentLang, key);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-cement-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm border border-cement-200">
              <img 
                src="./1000098217.png" 
                alt="AgriVision AI Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-full h-full bg-green-600 rounded-lg flex items-center justify-center hidden">
                <Leaf className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold text-cement-900 tracking-tight">{t('appTitle')}<span className="text-green-600">.AI</span></span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => onPageChange('dashboard')}
              className={`font-medium transition-colors ${
                currentPage === 'dashboard' ? 'text-cement-900' : 'text-cement-500 hover:text-green-600'
              }`}
            >
              {t('dashboard')}
            </button>
            <a href="#" className="text-cement-500 font-medium hover:text-green-600 transition-colors">{t('myCrops')}</a>
            <button 
              onClick={() => onPageChange('market')}
              className={`font-medium transition-colors ${
                currentPage === 'market' ? 'text-cement-900' : 'text-cement-500 hover:text-green-600'
              }`}
            >
              {t('market')}
            </button>
            <button 
              onClick={() => onPageChange('community')}
              className={`font-medium transition-colors ${
                currentPage === 'community' ? 'text-cement-900' : 'text-cement-500 hover:text-green-600'
              }`}
            >
              {t('community')}
            </button>
          </nav>

          <div className="flex items-center gap-4">
             {/* Language Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 p-2 text-cement-600 hover:text-green-600 transition-colors">
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium uppercase">{currentLang}</span>
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white border border-cement-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => onLangChange(lang.code)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-green-50 hover:text-green-700 ${currentLang === lang.code ? 'font-bold text-green-700 bg-green-50' : 'text-cement-600'}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <button className="p-2 text-cement-400 hover:text-cement-600 transition-colors relative hidden sm:block">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-cement-200 flex items-center justify-center border border-cement-300 hidden sm:flex">
              <User className="w-5 h-5 text-cement-500" />
            </div>
            <button className="md:hidden p-2 text-cement-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};