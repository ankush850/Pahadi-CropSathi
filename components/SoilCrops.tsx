import React from 'react';
import { PlantAnalysis, Language } from '../types';
import { Layers } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface SoilCropsProps {
  analysis: PlantAnalysis | null;
  lang: Language;
}

export const SoilCrops: React.FC<SoilCropsProps> = ({ analysis, lang }) => {
  if (!analysis) return null;
  const t = (key: string) => getTranslation(lang, key);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-cement-200 overflow-hidden">
      <div className="p-4 border-b border-cement-100 bg-cement-50/50">
        <h3 className="font-semibold text-cement-800 flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-700" />
          {t('soilCrops')}
        </h3>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Soil Section */}
        <div className="md:col-span-1 border-r-0 md:border-r border-cement-100 pr-0 md:pr-8 pb-6 md:pb-0 border-b md:border-b-0">
          <span className="text-xs font-bold text-cement-400 uppercase tracking-wider">{t('detectedSoil')}</span>
          <h4 className="text-xl font-bold text-cement-900 mt-2 mb-3 text-amber-800">{analysis.soilTypeRecommendation}</h4>
          <p className="text-sm text-cement-600 leading-relaxed">
            {analysis.soilExplanation}
          </p>
        </div>

        {/* Crops Section */}
        <div className="md:col-span-2">
           <span className="text-xs font-bold text-cement-400 uppercase tracking-wider mb-4 block">{t('recommendedRotation')}</span>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
             {analysis.recommendedCrops.map((crop, idx) => (
               <div key={idx} className="group relative bg-white border border-cement-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-green-400">
                 {/* Crop Image */}
                 <div className="h-32 w-full bg-cement-100 overflow-hidden relative">
                    <img 
                      src={`https://image.pollinations.ai/prompt/agricultural photo of organic ${encodeURIComponent(crop.name)} crop growing in farm field high quality?width=400&height=300&nologo=true`}
                      alt={crop.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 </div>
                 
                 {/* Content */}
                 <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                       <h5 className="font-bold text-cement-900 group-hover:text-green-700 transition-colors">{crop.name}</h5>
                       <div className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                         ${crop.suitability === 'Highly Suitable' ? 'bg-green-100 text-green-700' : 
                           crop.suitability === 'Suitable' ? 'bg-blue-100 text-blue-700' : 'bg-cement-100 text-cement-600'}
                       `}>
                         {crop.suitability === 'Highly Suitable' ? t('bestMatch') : crop.suitability}
                       </div>
                    </div>
                    <div className="w-full h-1 bg-cement-100 rounded-full overflow-hidden">
                       <div 
                        className={`h-full rounded-full ${crop.suitability === 'Highly Suitable' ? 'bg-green-500 w-full' : crop.suitability === 'Suitable' ? 'bg-blue-500 w-3/4' : 'bg-cement-400 w-1/2'}`}
                       ></div>
                    </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};