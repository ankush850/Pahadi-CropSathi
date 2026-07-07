import React, { useState } from 'react';
import { PlantAnalysis, Language } from '../types';
import { 
  AlertTriangle, CheckCircle, Bug, Droplets, Sprout, ChevronDown, ChevronUp, 
  AlertOctagon, ScanEye, ClipboardList, Scissors, Sun, Wind, Thermometer, 
  Trash2, ShieldCheck, Beaker, Layers, ExternalLink 
} from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface AnalysisResultsProps {
  analysis: PlantAnalysis | null;
  isLoading: boolean;
  image: string | null;
  lang: Language;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis, isLoading, image, lang }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const t = (key: string) => getTranslation(lang, key);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getTreatmentIcon = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('water') || lowerText.includes('irriga') || lowerText.includes('moist') || lowerText.includes('pani')) 
      return <Droplets className="w-5 h-5 text-blue-600" />;
    if (lowerText.includes('prune') || lowerText.includes('cut') || lowerText.includes('trim') || lowerText.includes('remove') || lowerText.includes('kat')) 
      return <Scissors className="w-5 h-5 text-orange-600" />;
    if (lowerText.includes('sun') || lowerText.includes('light') || lowerText.includes('dhup')) 
      return <Sun className="w-5 h-5 text-amber-500" />;
    if (lowerText.includes('soil') || lowerText.includes('fertiliz') || lowerText.includes('khad')) 
      return <Sprout className="w-5 h-5 text-emerald-600" />;
    if (lowerText.includes('spray') || lowerText.includes('fungicide') || lowerText.includes('neem') || lowerText.includes('insecticide')) 
      return <Beaker className="w-5 h-5 text-purple-600" />;
    
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-6 h-full flex flex-col gap-4 animate-pulse">
        <div className="flex gap-4">
           <div className="w-20 h-20 bg-cement-200 rounded-lg shrink-0"></div>
           <div className="flex-1 space-y-2">
             <div className="h-4 bg-cement-200 rounded w-1/4"></div>
             <div className="h-6 bg-cement-200 rounded w-1/2"></div>
           </div>
        </div>
        <div className="h-32 bg-cement-100 rounded-lg mt-4"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-8 h-full flex flex-col items-center justify-center text-center">
        <div className="bg-cement-50 p-4 rounded-full mb-4">
          <Sprout className="w-8 h-8 text-cement-400" />
        </div>
        <h3 className="text-lg font-medium text-cement-800">Awaiting Analysis</h3>
        <p className="text-cement-500 text-sm max-w-xs mt-2">Upload a plant image to identify the species, detect diseases, and get treatment advice.</p>
      </div>
    );
  }

  const getSeverityColor = (sev: number) => {
    if (sev < 30) return 'bg-green-500';
    if (sev < 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-cement-200 overflow-hidden h-full">
      <div className="p-5 border-b border-cement-100 flex justify-between items-start gap-4">
        <div className="flex gap-4 flex-1">
          {image && (
            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-cement-200 shadow-sm hidden sm:block">
              <img src={image} alt="Analyzed Plant" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5 text-cement-500 mb-1">
              <ScanEye className="w-3.5 h-3.5" />
              <span className="text-xs font-bold uppercase tracking-wider">{t('identifiedPlant')}</span>
            </div>
            <h3 className="text-lg font-medium text-cement-600 mb-0.5">{analysis.plantName}</h3>
            <h2 className="text-2xl font-bold text-cement-900 leading-tight">{analysis.diseaseName}</h2>
            
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${analysis.isHealthy ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {analysis.isHealthy ? t('healthy') : t('issueDetected')}
              </span>
              <span className="text-xs text-cement-400">|</span>
              <span className="text-xs text-cement-500 font-medium">{t('confidence')}: {(analysis.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {!analysis.isHealthy && (
           <div className="flex flex-col items-end pl-2">
             <span className="text-[10px] font-bold text-cement-400 uppercase tracking-wide mb-1">{t('severity')}</span>
             <div className="flex flex-col items-end gap-1">
               <span className="text-xl font-bold text-cement-800">{analysis.severity}%</span>
               <div className="w-20 h-1.5 bg-cement-100 rounded-full overflow-hidden">
                 <div className={`h-full ${getSeverityColor(analysis.severity)}`} style={{ width: `${analysis.severity}%` }}></div>
               </div>
             </div>
           </div>
        )}
      </div>

      <div className="p-5 overflow-y-auto max-h-[600px]">
        {/* Treatments */}
        {!analysis.isHealthy && (
          <div className="mb-6">
             <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-green-100 rounded-md">
                <ClipboardList className="w-4 h-4 text-green-700" />
              </div>
              <h4 className="text-sm font-bold text-cement-800 uppercase tracking-wide">
                {t('treatments')}
              </h4>
            </div>
            
            <div className="space-y-3">
              {analysis.treatments.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-cement-50/50 rounded-xl border border-cement-200 shadow-sm hover:border-green-300 hover:shadow-md transition-all duration-200 group">
                  <div className="flex-shrink-0 p-2 bg-white rounded-lg border border-cement-200 shadow-sm group-hover:border-green-200 transition-colors mt-0.5">
                     {getTreatmentIcon(step)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <span className="text-[10px] font-bold text-cement-400 uppercase tracking-wider bg-cement-200 px-1.5 py-0.5 rounded">{t('step')} {idx + 1}</span>
                    </div>
                    <p className="text-sm font-medium text-cement-700 leading-relaxed group-hover:text-cement-900 transition-colors">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Soil Type Section */}
        <div className="mb-6 bg-amber-50/60 rounded-xl p-4 border border-amber-100/80">
           <div className="flex items-center gap-2 mb-2">
             <div className="p-1 bg-amber-100 rounded-md">
               <Layers className="w-3.5 h-3.5 text-amber-700" />
             </div>
             <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide">{t('soilProfile')}</h4>
           </div>
           <h5 className="font-bold text-cement-800 mb-1">{analysis.soilTypeRecommendation}</h5>
           <p className="text-sm text-cement-600 leading-relaxed">{analysis.soilExplanation}</p>
        </div>

        {/* Additional Features Toggle */}
        <div className="space-y-3">
          {/* Pests */}
          <div className="border border-cement-200 rounded-lg overflow-hidden">
            <button 
              onClick={() => toggleSection('pests')}
              className="w-full flex justify-between items-center p-3 bg-cement-50 hover:bg-cement-100 transition-colors group"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-cement-700 group-hover:text-cement-900">
                <Bug className={`w-4 h-4 ${analysis.pestsDetected ? 'text-red-500' : 'text-cement-400'}`} />
                {t('pestDetection')}
              </div>
              {expandedSection === 'pests' ? <ChevronUp className="w-4 h-4 text-cement-400"/> : <ChevronDown className="w-4 h-4 text-cement-400"/>}
            </button>
            {expandedSection === 'pests' && (
              <div className="p-3 bg-white text-sm text-cement-600 border-t border-cement-200">
                {analysis.pestsDetected ? (
                  <div className="space-y-4">
                    <span className="text-red-600 font-medium flex items-start gap-2 leading-tight">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5"/> 
                        {analysis.pestDetails || "Signs of pest activity found."}
                    </span>
                    
                    {/* Visual Pest Grid */}
                    {analysis.detectedPests && analysis.detectedPests.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            {analysis.detectedPests.map((pest, idx) => (
                                <div key={idx} className="bg-cement-50 rounded-lg p-2.5 border border-cement-200 shadow-sm flex flex-col">
                                     <div className="h-24 w-full rounded-md overflow-hidden bg-white mb-2 relative border border-cement-100">
                                        <img 
                                            src={`https://image.pollinations.ai/prompt/macro photo of ${encodeURIComponent(pest.name)} insect pest on plant high quality?width=300&height=300&nologo=true`} 
                                            alt={pest.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                     </div>
                                     <h5 className="font-semibold text-cement-800 text-xs mb-0.5">{pest.name}</h5>
                                     <a 
                                        href={`https://www.google.com/search?q=${encodeURIComponent(pest.name + ' pest control ' + analysis.plantName)}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 mt-auto pt-1"
                                     >
                                        {t('learnMore')} <ExternalLink className="w-2.5 h-2.5" />
                                     </a>
                                </div>
                            ))}
                        </div>
                    )}
                  </div>
                ) : (
                  <span className="text-green-600 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> No significant pests detected.</span>
                )}
              </div>
            )}
          </div>

          {/* Nutrients */}
          <div className="border border-cement-200 rounded-lg overflow-hidden">
             <button 
              onClick={() => toggleSection('nutrients')}
              className="w-full flex justify-between items-center p-3 bg-cement-50 hover:bg-cement-100 transition-colors group"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-cement-700 group-hover:text-cement-900">
                <Droplets className={`w-4 h-4 ${analysis.nutrientDeficiency ? 'text-amber-500' : 'text-cement-400'}`} />
                {t('nutrientAnalysis')}
              </div>
              {expandedSection === 'nutrients' ? <ChevronUp className="w-4 h-4 text-cement-400"/> : <ChevronDown className="w-4 h-4 text-cement-400"/>}
            </button>
            {expandedSection === 'nutrients' && (
              <div className="p-3 bg-white text-sm text-cement-600 border-t border-cement-200">
                {analysis.nutrientDeficiency
                  ? <span className="text-amber-600 font-medium flex items-start gap-2"><AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5"/> {analysis.deficiencyDetails || "Nutrient imbalance detected."}</span> 
                  : <span className="text-green-600 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Nutrient levels appear adequate.</span>}
              </div>
            )}
          </div>

           {/* Weed */}
           <div className="border border-cement-200 rounded-lg overflow-hidden">
             <button 
              onClick={() => toggleSection('weeds')}
              className="w-full flex justify-between items-center p-3 bg-cement-50 hover:bg-cement-100 transition-colors group"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-cement-700 group-hover:text-cement-900">
                <AlertOctagon className={`w-4 h-4 ${analysis.weedDetected ? 'text-amber-500' : 'text-cement-400'}`} />
                {t('weedDetection')}
              </div>
              {expandedSection === 'weeds' ? <ChevronUp className="w-4 h-4 text-cement-400"/> : <ChevronDown className="w-4 h-4 text-cement-400"/>}
            </button>
            {expandedSection === 'weeds' && (
              <div className="p-3 bg-white text-sm text-cement-600 border-t border-cement-200">
                 {analysis.weedDetected
                  ? <span className="text-amber-600 font-medium flex items-start gap-2"><AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5"/> Invasive plants/weeds detected in the frame.</span> 
                  : <span className="text-green-600 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> No weeds detected nearby.</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};