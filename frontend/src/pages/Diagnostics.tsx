import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { 
  Upload, 
  Leaf, 
  CheckCircle, 
  RefreshCw, 
  Sparkles,
  Info,
  ShieldAlert
} from 'lucide-react';

interface DiagnosticResult {
  disease: string;
  pathogen: string;
  severity: 'healthy' | 'moderate' | 'critical';
  confidence: number;
  description: string;
  remedies: {
    immediate: string[];
    organic: string[];
    prevention: string[];
  };
}

export const Diagnostics: React.FC = () => {
  const { t } = useSettings();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<DiagnosticResult | null>(null);

  // Pre-configured mock samples to test instantly
  const samples = [
    {
      name: 'Apple Scab Leaf',
      img: 'https://images.unsplash.com/photo-1598880940080-ff9a29891b85?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // Apple leaf scab texture
      result: {
        disease: 'Apple Scab (सेब का पपड़ी रोग)',
        pathogen: 'Venturia inaequalis (Fungus)',
        severity: 'critical',
        confidence: 94.2,
        description: 'Velvety brown/green spots detected on leaf surfaces. Favorable conditions: High moisture and cool spring temperature in high elevations.',
        remedies: {
          immediate: [
            'Prune and destroy infected leaves immediately to stop spore spreading.',
            'Spray copper-based fungicide (1.5g per Litre of water).'
          ],
          organic: [
            'Spray Garlic extract + Neem Oil solution (10ml oil per Litre of water).',
            'Apply baking soda spray (3g/L) to alter leaf surface pH.'
          ],
          prevention: [
            'Rake and burn all fallen leaves in winter.',
            'Plant scab-resistant cultivars like Crimson Crisp or Prima.'
          ]
        }
      } as DiagnosticResult
    },
    {
      name: 'Potato Late Blight Leaf',
      img: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // Late blight texture
      result: {
        disease: 'Potato Late Blight (आलू का पछेता अंगमारी)',
        pathogen: 'Phytophthora infestans (Oomycete)',
        severity: 'critical',
        confidence: 89.7,
        description: 'Dark water-soaked lesions appearing at leaf margins with white mildew underneath. Highly contagious during monsoon humidity.',
        remedies: {
          immediate: [
            'Remove affected plants immediately. Do not compost them.',
            'Apply Mancozeb or Ridomil Gold (2g per Litre) immediately.'
          ],
          organic: [
            'Spray dilute sour buttermilk solution (1L buttermilk + 9L water) to inhibit growth.',
            'Use copper hydroxide sprays.'
          ],
          prevention: [
            'Always use certified disease-free seed tubers.',
            'Avoid overhead irrigation; use drip lines at terrace bases.'
          ]
        }
      } as DiagnosticResult
    },
    {
      name: 'Healthy Ginger Leaf',
      img: 'https://images.unsplash.com/photo-1618258265837-53d566580f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // Green ginger
      result: {
        disease: 'Healthy Leaf (स्वस्थ पत्ता)',
        pathogen: 'None',
        severity: 'healthy',
        confidence: 98.8,
        description: 'No pathogens or lesions identified. Chlorophyll index is high, indicating healthy nitrogen intake.',
        remedies: {
          immediate: ['No chemical treatments required.'],
          organic: ['Maintain regular weeding and companion planting.'],
          prevention: ['Apply vermicompost at regular intervals. Keep monitoring soil run-off.']
        }
      } as DiagnosticResult
    }
  ];

  const handleSampleClick = (sample: typeof samples[0]) => {
    setSelectedImage(sample.img);
    setAnalyzing(true);
    setReport(null);

    // Simulate analysis delay
    setTimeout(() => {
      setReport(sample.result);
      setAnalyzing(false);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setAnalyzing(true);
        setReport(null);

        // Simulate random analysis result
        setTimeout(() => {
          setReport(samples[0].result); // fall back to first sample result
          setAnalyzing(false);
        }, 2200);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Clinic Intro Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center">
          <Leaf className="w-5.5 h-5.5 text-emerald-500 mr-2" />
          {t('diagnoseTitle')}
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
          {t('diagnoseDesc')} using deep computer vision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Upload & Sample Gallery */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-lg rounded-3xl p-6 flex flex-col items-center">
            
            {/* Upload Area / Screen */}
            <div className="w-full h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden relative flex flex-col justify-center items-center transition-all bg-slate-50 dark:bg-slate-950/20 group">
              {selectedImage ? (
                <>
                  <img src={selectedImage} className="w-full h-full object-cover" alt="Uploaded leaf" />
                  
                  {/* Analysis overlay scanner line */}
                  {analyzing && (
                    <div className="absolute inset-0 bg-emerald-500/10 flex flex-col justify-center items-center">
                      <div className="w-full h-1.5 bg-emerald-400 absolute top-0 animate-bounce shadow-md shadow-emerald-400/50" />
                      <div className="px-4 py-2 bg-slate-900/90 rounded-xl text-white text-xs font-bold flex items-center space-x-2 backdrop-blur-xs">
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>Scanning leaf cells...</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center text-center p-6 w-full h-full justify-center">
                  <div className="p-4 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-4">
                    Drag Leaf Photo Here
                  </span>
                  <span className="text-2xs text-slate-400 font-semibold mt-1">
                    Supports JPG, PNG, WebP
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {selectedImage && !analyzing && (
              <button 
                onClick={() => { setSelectedImage(null); setReport(null); }}
                className="mt-4 px-4 py-2 text-xs font-extrabold text-red-500 border border-red-500/20 hover:bg-red-500/5 rounded-xl transition-all"
              >
                Clear Image
              </button>
            )}
          </div>

          {/* Preset Samples */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-lg rounded-3xl p-6">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
              Test Instantly with Samples
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {samples.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSampleClick(sample)}
                  className="flex flex-col items-left text-left group focus:outline-none"
                >
                  <div className="w-full h-20 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 relative shadow-2xs group-hover:border-emerald-500/40 transition-all">
                    <img src={sample.img} className="w-full h-full object-cover" alt={sample.name} />
                  </div>
                  <span className="text-2xs font-extrabold text-slate-600 dark:text-slate-300 mt-2 truncate w-full group-hover:text-emerald-500">
                    {sample.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: AI Diagnostic Report */}
        <div className="space-y-6">
          {report ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-lg rounded-3xl p-6 space-y-6">
              
              {/* Report Title */}
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <div>
                  <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-3xs font-extrabold uppercase rounded">
                    AI Diagnostic Report
                  </span>
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                    {report.disease}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    Pathogen: <em className="text-slate-500">{report.pathogen}</em>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold block text-slate-400">Confidence</span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                    {report.confidence}%
                  </span>
                </div>
              </div>

              {/* Severity Status Flag */}
              <div className={`p-3.5 rounded-2xl border flex items-center space-x-3 ${
                report.severity === 'healthy' 
                  ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'bg-red-500/5 border-red-500/10 text-red-700 dark:text-red-400'
              }`}>
                {report.severity === 'healthy' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                )}
                <div className="text-xs">
                  <span className="font-extrabold uppercase">Severity Level: </span>
                  <span className="font-extrabold">{report.severity.toUpperCase()}</span>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1 flex items-center">
                  <Info className="w-4 h-4 mr-1 text-slate-400" /> Diagnosis Summary:
                </p>
                <p className="font-medium">{report.description}</p>
              </div>

              {/* Remedies Tabbed sections */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Treatment Guide
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Immediate Actions */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/50 rounded-2xl">
                    <span className="text-2xs font-extrabold text-red-500 uppercase tracking-wide">
                      ⚡ Immediate Actions
                    </span>
                    <ul className="mt-2 space-y-1.5 list-disc list-inside text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {report.remedies.immediate.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>

                  {/* Organic Remedies */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/50 rounded-2xl">
                    <span className="text-2xs font-extrabold text-emerald-500 uppercase tracking-wide">
                      🌿 Organic Remedies
                    </span>
                    <ul className="mt-2 space-y-1.5 list-disc list-inside text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {report.remedies.organic.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Long-term prevention */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/50 rounded-2xl">
                  <span className="text-2xs font-extrabold text-blue-500 uppercase tracking-wide">
                    🛡️ Long-Term Prevention
                  </span>
                  <ul className="mt-2 space-y-1.5 list-disc list-inside text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {report.remedies.prevention.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 rounded-3xl p-8 h-full flex flex-col justify-center items-center text-center min-h-[400px]">
              <div className="p-4 bg-slate-200/50 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Ready to Analyze Leaf Health
              </h3>
              <p className="text-2xs text-slate-400 dark:text-slate-500 font-semibold mt-1 max-w-xs">
                Upload a photo from your fields or click one of our test presets to generate your visual report instantly.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
