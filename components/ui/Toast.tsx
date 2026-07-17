import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { ToastMessage } from '../hooks/useToast';

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';
        
        return (
          <div
            key={toast.id}
            className={`flex items-center justify-between p-4 min-w-[300px] rounded-lg shadow-lg animate-fade-in-up border ${
              isError
                ? 'bg-red-50 border-red-200 text-red-800'
                : isSuccess
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {isError ? (
                <AlertCircle className="w-5 h-5 text-red-600" />
              ) : isSuccess ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Info className="w-5 h-5 text-blue-600" />
              )}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
