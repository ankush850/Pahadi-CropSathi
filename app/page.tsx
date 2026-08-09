"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { Header } from '../components/Header';
import { LandingPage } from '../components/LandingPage';
import { ImageUpload } from '../components/ImageUpload';
import { AnalysisResults } from '../components/AnalysisResults';
import dynamic from 'next/dynamic';
const LocationPanel = dynamic(() => import('../components/LocationPanel').then(mod => mod.LocationPanel), { ssr: false });
import { UnifiedSoilSuite } from '../components/UnifiedSoilSuite';
import { UnifiedPlanningSuite } from '../components/UnifiedPlanningSuite';
import { UnifiedHealthSuite } from '../components/UnifiedHealthSuite';
import { ChatBot } from '../components/ChatBot';
import { Modal } from '../components/Modal';
import { Market } from '../components/Market';
import { Community } from '../components/Community';
import { HistoryPanel } from '../components/HistoryPanel';
import { useToast } from '../components/hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';
import { useRouter } from 'next/navigation';
import { PlantAnalysis, FeaturePlaceholder, Language } from '../types';
import ReactMarkdown from 'react-markdown';
import { FileJson, FileText, RefreshCw } from 'lucide-react';
import { getTranslation } from '../utils/translations';

export default function App() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard' | 'history' | 'market' | 'community'>('landing');
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const { toasts, addToast, removeToast } = useToast();

  const handlePageChange = useCallback((page: 'landing' | 'dashboard' | 'history' | 'market' | 'community') => {
    if (page === 'landing') {
      setCurrentPage('landing');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      addToast('Please sign in to access application features', 'info');
      router.push('/login');
      return;
    }

    setCurrentPage(page);
  }, [router, addToast]);

  React.useEffect(() => {
    const saved = localStorage.getItem('preferred_language') as Language;
    if (saved) {
      setLang(saved);
    }

    // Check query params if coming back after login
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as 'dashboard' | 'history' | 'market' | 'community' | null;
    const token = localStorage.getItem('token');
    
    if (token && tabParam && ['dashboard', 'history', 'market', 'community'].includes(tabParam)) {
      setCurrentPage(tabParam);
    }
  }, []);

  const handleLangChange = useCallback((newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('preferred_language', newLang);
  }, []);
  
  // Feature Modal State
  const [selectedFeature, setSelectedFeature] = useState<FeaturePlaceholder | null>(null);
  const [featureReport, setFeatureReport] = useState<string>('');
  const [isFeatureLoading, setIsFeatureLoading] = useState(false);

  const t = useCallback((key: string) => getTranslation(lang, key), [lang]);

  const handleImageSelected = useCallback(async (base64: string) => {
    setCurrentImage(base64);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ai/analyse', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ image: base64, lang })
      });
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to analyze image');
      }
      
      const result = await response.json();
      setAnalysis(result);

      // Automatically persist analysis to DB
      fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(result)
      }).then(res => {
        if (res.ok) {
          addToast('Scan saved to history!', 'success');
        }
      }).catch(err => console.error("Failed to save analysis to history", err));

    } catch (err: any) {
      setError(err.message || "Failed to analyze image. Please try again.");
      console.error("Analysis execution error:", err);
      addToast(err.message || "Failed to analyze image", "error");
    } finally {
      setIsLoading(false);
    }
  }, [lang, addToast]);

  const handleClear = useCallback(() => {
    setCurrentImage(null);
    setAnalysis(null);
    setError(null);
  }, []);

  const handleFeatureClick = useCallback(async (feature: FeaturePlaceholder) => {
    setSelectedFeature(feature);
    setIsFeatureLoading(true);
    setFeatureReport('');

    try {
      const context = {
        plant: analysis?.plantName,
        soil: analysis?.soilTypeRecommendation,
        location: 'Current Location'
      };
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ai/summarise', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ featureId: feature.id, context, lang })
      });
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to generate report');
      }
      
      const report = await response.json();
      setFeatureReport(report.content);
    } catch (err: any) {
      setFeatureReport("Unable to generate report at this time. Please try again.");
      addToast(err.message || "Unable to generate report", "error");
    } finally {
      setIsFeatureLoading(false);
    }
  }, [analysis, lang, addToast]);

  const handleExportJSON = useCallback(() => {
    if (!selectedFeature || !featureReport) return;
    
    const data = {
      title: t(selectedFeature.name),
      date: new Date().toISOString(),
      content: featureReport,
      brand: "Pahadi-CropSathi | AgriVision AI"
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AgriVision_${selectedFeature.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [selectedFeature, featureReport, t]);

  const handleExportPDF = useCallback(() => {
    window.print();
  }, []);

  const renderedContent = useMemo(() => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage lang={lang} onNavigate={handlePageChange} onLangChange={handleLangChange} />;
      case 'history':
        return <HistoryPanel lang={lang} />;
      case 'market':
        return <Market lang={lang} />;
      case 'community':
        return <Community lang={lang} />;
      case 'dashboard':
      default:
        return (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Reorganized Categorized Suites with Tab/Carousel Controls */}
            <div className="space-y-8 animate-fade-in-up">
               <UnifiedSoilSuite lang={lang} analysis={analysis} />
               <UnifiedPlanningSuite lang={lang} />
               <UnifiedHealthSuite lang={lang} />
            </div>
          </main>
        );
    }
  }, [currentPage, lang, analysis, handleLangChange, handlePageChange]);

  return (
    <div className="min-h-screen bg-cement-50 pb-20 font-sans text-cement-900">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-section, #print-section * {
            visibility: visible;
          }
          #print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2rem;
          }
        }
      `}</style>
      {currentPage !== 'landing' && (
        <Header 
          currentLang={lang} 
          onLangChange={handleLangChange} 
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}

      {renderedContent}

      {/* Persistent ChatBot */}
      <ChatBot analysisContext={analysis} lang={lang} />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Feature Details Modal */}
      <Modal 
        isOpen={!!selectedFeature} 
        onClose={() => setSelectedFeature(null)}
        title={selectedFeature ? t(selectedFeature.name) : ''}
        isLoading={isFeatureLoading}
      >
        <div className="flex flex-col gap-6">
          {/* Action Bar */}
          {!isFeatureLoading && (
            <div className="flex justify-end gap-2 border-b border-cement-100 pb-4">
              <button 
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cement-600 bg-white border border-cement-200 rounded-lg hover:bg-cement-50 hover:text-green-600 transition-colors"
              >
                <FileJson className="w-4 h-4" />
                {t('exportJSON')}
              </button>
              <button 
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <FileText className="w-4 h-4" />
                {t('exportPDF')}
              </button>
            </div>
          )}

          <div id="print-section" className="prose prose-sm prose-green max-w-none">
            <ReactMarkdown>{featureReport}</ReactMarkdown>
          </div>
        </div>
      </Modal>
    </div>
  );
}