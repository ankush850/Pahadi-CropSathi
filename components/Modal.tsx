import React from 'react';
import { X, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-cement-100">
          <h2 className="text-xl font-bold text-cement-800">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-cement-100 rounded-full transition-colors text-cement-500 hover:text-cement-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
              <p className="text-cement-500 font-medium">Generating AI Report...</p>
            </div>
          ) : (
            <div className="prose prose-green prose-sm max-w-none text-cement-700">
              {children}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-cement-100 bg-cement-50 rounded-b-2xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-cement-300 rounded-lg text-sm font-medium text-cement-700 hover:bg-cement-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};