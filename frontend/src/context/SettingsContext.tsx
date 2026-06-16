import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'hi' | 'pah';
export type SoilType = 'sandy_loam' | 'clay_loam' | 'red_acidic' | 'rocky_gravel';

export interface FarmProfile {
  elevation: number; // in meters
  soilType: SoilType;
  primaryCrops: string[];
  location: string;
}

interface SettingsContextType {
  theme: Theme;
  language: Language;
  farmProfile: FarmProfile;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  updateFarmProfile: (profile: Partial<FarmProfile>) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: "Pahadi CropSathi",
    tagline: "AI Mountain Farming Advisory",
    dashboard: "Dashboard",
    advisor: "AI Chatbot",
    diagnostics: "Crop Clinic",
    mandi: "Mandi Rates",
    profile: "My Farm Profile",
    elevation: "Altitude / Elevation",
    soilType: "Soil Type",
    location: "Location",
    primaryCrops: "Primary Crops",
    sandy_loam: "Sandy Loam (Sandy Soil)",
    clay_loam: "Clay Loam (Retains Water)",
    red_acidic: "Red Acidic Soil (Hill Slope)",
    rocky_gravel: "Rocky Gravel (Terrace Edge)",
    weatherAlerts: "Hill Weather Warnings",
    soilHealth: "Soil & Slope Status",
    diagnoseTitle: "AI Plant Diagnostics",
    diagnoseDesc: "Upload leaf image to identify diseases",
    cropCalendar: "Mountain Crop Calendar",
    activeAlerts: "Active Warnings",
    riskFrost: "Frost Risk",
    riskLandslide: "Soil Washout/Landslide Risk",
    mandiTitle: "Himalayan Mandi Market",
    searchCrop: "Search crops...",
    suggestedQuestions: "Suggested Queries",
    askPlaceholder: "Ask CropSathi about your mountain crops...",
    send: "Send",
    backToDash: "Back to Dashboard",
    logIn: "Sign In",
    signUp: "Register",
    logout: "Log Out",
    welcomeBack: "Welcome back, Sathi",
    farmer: "Farmer",
    supervisor: "Field Supervisor",
  },
  hi: {
    appName: "पहाड़ी क्रॉपसाथी",
    tagline: "पर्वतीय कृषि एआई सलाहकार",
    dashboard: "डैशबोर्ड",
    advisor: "एआई चैटबॉट",
    diagnostics: "फसल क्लिनिक",
    mandi: "मंडी भाव",
    profile: "मेरा खेत प्रोफाइल",
    elevation: "ऊंचाई (समुद्र तल से)",
    soilType: "मिट्टी का प्रकार",
    location: "स्थान",
    primaryCrops: "मुख्य फसलें",
    sandy_loam: "रेतीली दोमट मिट्टी",
    clay_loam: "चिकनी दोमट मिट्टी",
    red_acidic: "लाल अम्लीय मिट्टी (पहाड़ी ढलान)",
    rocky_gravel: "पथरीली बजरी (सीढ़ीदार किनारा)",
    weatherAlerts: "पहाड़ी मौसम चेतावनी",
    soilHealth: "मिट्टी और ढलान की स्थिति",
    diagnoseTitle: "एआई फसल रोग पहचान",
    diagnoseDesc: "बीमारी की पहचान के लिए पत्ती की फोटो अपलोड करें",
    cropCalendar: "पर्वतीय फसल कैलेंडर",
    activeAlerts: "सक्रिय चेतावनियाँ",
    riskFrost: "पाला (Frost) का खतरा",
    riskLandslide: "भूस्खलन / मिट्टी कटाव का खतरा",
    mandiTitle: "हिमालयन मंडी बाजार",
    searchCrop: "फसल खोजें...",
    suggestedQuestions: "सुझाए गए प्रश्न",
    askPlaceholder: "क्रॉपसाथी से अपनी पहाड़ी फसलों के बारे में पूछें...",
    send: "पूछें",
    backToDash: "डैशबोर्ड पर जाएँ",
    logIn: "लॉग इन करें",
    signUp: "पंजीकरण करें",
    logout: "लॉग आउट",
    welcomeBack: "स्वागत है, साथी",
    farmer: "किसान",
    supervisor: "क्षेत्र पर्यवेक्षक",
  },
  pah: {
    appName: "पहाड़ी क्रॉपसाथि",
    tagline: "पहाड़ कृषिखैं एआई सलाहाकार",
    dashboard: "खेत-मल्लि",
    advisor: "क्रॉपसाथि एआई",
    diagnostics: "फसल डाक्टरी",
    mandi: "मंडी मोल-भाव",
    profile: "मेरु खेत विवरण",
    elevation: "डाँडो की ऊँचाई",
    soilType: "माटुक प्रकार",
    location: "गाँउ / थान",
    primaryCrops: "खास फसल",
    sandy_loam: "बलुई माटु",
    clay_loam: "चिकनी माटु",
    red_acidic: "पहाड़ी लाल माटु",
    rocky_gravel: "गरग्यार माटु (पथरीली)",
    weatherAlerts: "खराब मौसम डाँठ",
    soilHealth: "मिट्टी अर भिरू की हालत",
    diagnoseTitle: "पात देखी बिमारी जाँचना",
    diagnoseDesc: "बिमारी जान्न कै लीजै पातुक फोटो हालो",
    cropCalendar: "पहाड़ी ऋतु चक्र",
    activeAlerts: "आजुक खतर",
    riskFrost: "तुषार / सीत खतरो",
    riskLandslide: "पहाड़ खिसकण (भूस्खलन) खतरो",
    mandiTitle: "पहाड़ी मंडी भाव",
    searchCrop: "फसल खोजो...",
    suggestedQuestions: "खास सवाल",
    askPlaceholder: "क्रॉपसाथि दगड़ि बात करो...",
    send: "भेजो",
    backToDash: "वापस जाओ",
    logIn: "भितर आओ",
    signUp: "नाव लिखो",
    logout: "बाहर जाओ",
    welcomeBack: "भल मान्याँ, साथी",
    farmer: "खेतीबाड़ि करण वोल",
    supervisor: "सुपरवाइजर",
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('pcs_theme');
    return (saved as Theme) || 'light';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('pcs_lang');
    return (saved as Language) || 'en';
  });

  const [farmProfile, setFarmProfile] = useState<FarmProfile>(() => {
    const saved = localStorage.getItem('pcs_profile');
    if (saved) return JSON.parse(saved);
    return {
      elevation: 1650, // default altitude in meters (e.g. Almora / Shimla height)
      soilType: 'red_acidic',
      primaryCrops: ['Apple', 'Potato', 'Ginger', 'Off-season Peas'],
      location: 'Ranikhet, Uttarakhand'
    };
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('pcs_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('pcs_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('pcs_profile', JSON.stringify(farmProfile));
  }, [farmProfile]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const updateFarmProfile = (profile: Partial<FarmProfile>) => {
    setFarmProfile(prev => ({ ...prev, ...profile }));
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <SettingsContext.Provider value={{
      theme,
      language,
      farmProfile,
      toggleTheme,
      setLanguage,
      updateFarmProfile,
      t
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
