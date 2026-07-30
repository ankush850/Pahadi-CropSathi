import React, { useState, useEffect, useCallback } from 'react';
import { PlantAnalysis, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { History, Trash2, Eye, Calendar, AlertCircle, CheckCircle, Sprout, Search } from 'lucide-react';
import { Modal } from './Modal';
import { AnalysisResults } from './AnalysisResults';
import { ConfirmDialog } from './ConfirmDialog';
import { useToast } from './hooks/useToast';

interface HistoryPanelProps {
  lang: Language;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ lang }) => {
  const [history, setHistory] = useState<PlantAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<PlantAnalysis | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const t = (key: string) => getTranslation(lang, key);
  const { addToast } = useToast();

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/analysis', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        throw new Error('Failed to load analysis history');
      }
      const data = await res.json();
      setHistory(data);
    } catch (err: any) {
      console.error("Failed to fetch analysis history:", err);
      setError(err.message || 'Error loading history');
      addToast(err.message || 'Error loading history', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/analysis/${deleteTargetId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        throw new Error('Failed to delete analysis record');
      }
      setHistory(prev => prev.filter(item => (item as any).id !== deleteTargetId));
      addToast('Analysis record deleted successfully', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to delete item', 'error');
    } finally {
      setDeleteTargetId(null);
    }
  };

  const filteredHistory = history.filter(item => 
    item.plantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.diseaseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cement-900 mb-2 flex items-center gap-3">
            <History className="w-8 h-8 text-green-600" />
            Scan History
          </h1>
          <p className="text-cement-600">Review all your previous crop health analyses and diagnostic records</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cement-400" />
          <input
            type="text"
            placeholder="Search plant or disease..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-cement-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white"
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="bg-white rounded-xl p-6 border border-cement-200 animate-pulse space-y-4">
              <div className="h-5 bg-cement-200 rounded w-2/3"></div>
              <div className="h-4 bg-cement-100 rounded w-1/2"></div>
              <div className="h-16 bg-cement-100 rounded-lg"></div>
              <div className="h-8 bg-cement-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-600 max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-red-500" />
          <h3 className="font-semibold text-lg">{error}</h3>
          <button 
            onClick={fetchHistory}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredHistory.length === 0 && (
        <div className="bg-white rounded-xl border border-cement-200 p-12 text-center max-w-md mx-auto my-8 shadow-sm">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sprout className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-cement-900 mb-2">No past scans yet</h3>
          <p className="text-cement-600 text-sm mb-6">
            Upload a photo of your plant or crop from the Dashboard to analyze disease symptoms and track health history.
          </p>
        </div>
      )}

      {/* History Grid */}
      {!isLoading && !error && filteredHistory.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => {
            const itemId = (item as any).id;
            const createdAt = (item as any).createdAt ? new Date((item as any).createdAt).toLocaleDateString() : 'Recent';
            
            return (
              <div 
                key={itemId} 
                className="bg-white rounded-xl shadow-sm border border-cement-200 p-6 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-cement-900">{item.plantName}</h3>
                      <p className="text-sm font-medium text-cement-600">{item.diseaseName}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 flex items-center gap-1 ${
                      item.isHealthy ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.isHealthy ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" /> Healthy
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5" /> {item.severity}% Severity
                        </>
                      )}
                    </span>
                  </div>

                  <div className="bg-cement-50 rounded-lg p-3 text-xs text-cement-600 space-y-1 mb-4">
                    <p><span className="font-semibold text-cement-700">Soil Rec:</span> {item.soilTypeRecommendation || 'Standard'}</p>
                    <p><span className="font-semibold text-cement-700">Treatments:</span> {item.treatments?.length || 0} recommended</p>
                    {item.pestsDetected && (
                      <p className="text-red-600 font-semibold">⚠️ Pests detected</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-xs text-cement-400 mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-cement-100">
                    <button
                      onClick={() => setSelectedAnalysis(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(itemId)}
                      className="p-2 text-cement-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
        title={selectedAnalysis ? `${selectedAnalysis.plantName} Analysis` : ''}
      >
        <div className="max-h-[75vh] overflow-y-auto pr-1">
          <AnalysisResults 
            analysis={selectedAnalysis}
            isLoading={false}
            image={null}
            lang={lang}
          />
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Scan Record"
        message="Are you sure you want to delete this analysis record? This action cannot be undone."
        confirmLabel="Delete"
        isDangerous={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
