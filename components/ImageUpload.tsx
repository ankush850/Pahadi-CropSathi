import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
  currentImage: string | null;
  onClear: () => void;
  lang: Language;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, isLoading, currentImage, onClear, lang }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = (key: string) => getTranslation(lang, key);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-cement-200 overflow-hidden">
      <div className="p-4 border-b border-cement-100 flex justify-between items-center">
        <h3 className="font-semibold text-cement-800">{t('imageAnalysis')}</h3>
        {currentImage && (
          <button onClick={onClear} className="text-xs font-medium text-red-500 hover:text-red-700">
            {t('clearImage')}
          </button>
        )}
      </div>
      
      <div className="p-6">
        {currentImage ? (
          <div className="relative rounded-lg overflow-hidden bg-cement-50 border border-cement-200 aspect-video md:aspect-[4/3] group">
            <img 
              src={currentImage} 
              alt="Uploaded plant" 
              className="w-full h-full object-cover"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-3" />
                <p className="text-sm font-medium text-cement-700 animate-pulse">{t('analyzing')}</p>
              </div>
            )}
            {!isLoading && (
              <button 
                onClick={onClear}
                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-opacity opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-8 md:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200
              ${isDragging ? 'border-green-500 bg-green-50' : 'border-cement-300 hover:border-green-400 hover:bg-cement-50'}
            `}
          >
            <div className="bg-cement-100 p-4 rounded-full mb-4">
              <Upload className={`w-8 h-8 ${isDragging ? 'text-green-600' : 'text-cement-500'}`} />
            </div>
            <h4 className="text-lg font-medium text-cement-900 mb-1">{t('uploadTitle')}</h4>
            <p className="text-sm text-cement-500 mb-4">{t('dragDrop')}</p>
            <p className="text-xs text-cement-400">Supports JPG, PNG (Max 10MB)</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};