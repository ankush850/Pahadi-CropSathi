import React from 'react';
import { 
  Leaf, 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  Code2, 
  Database, 
  BrainCircuit, 
  Sprout, 
  Terminal, 
  BookOpen, 
  ExternalLink,
  Layers,
  Layers3
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface LandingPageProps {
  lang: Language;
  onNavigate: (page: 'dashboard' | 'history' | 'market' | 'community') => void;
  onLangChange: (lang: Language) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ lang, onNavigate, onLangChange }) => {

  const screenshots = [
    { 
      title: "Dashboard Overview", 
      path: "/assest/shot_dashboard.png", 
      fallback: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80",
      desc: "Unified Agricultural Intelligence Dashboard with Soil, Planning, and Health Suites" 
    },
    { 
      title: "AgriVision Feature Modules", 
      path: "/assest/shot_modules.png", 
      fallback: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
      desc: "Suite of specialized tools for hill & plain agriculture" 
    },
    { 
      title: "AI Plant Health Scanner", 
      path: "/assest/shot_scanner.png", 
      fallback: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80",
      desc: "Multimodal Gemini vision scanner for instant disease and treatment diagnostic" 
    },
    { 
      title: "ML Crop Recommender", 
      path: "/assest/shot_recommender.png", 
      fallback: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80",
      desc: "Native Gaussian Naive Bayes model predicting optimal crops (99.50% accuracy)" 
    },
    { 
      title: "Arecanut Palm Diagnostic", 
      path: "/assest/shot_arecanut.png", 
      fallback: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=800&q=80",
      desc: "TensorFlow offline neural model diagnosing Fruit Rot, Stem Bleeding, and Koleroga" 
    },
    { 
      title: "Weed Density Scanner", 
      path: "/assest/shot_weed.png", 
      fallback: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80",
      desc: "ONNX semantic segmentation calculating canopy cover % and weed density index" 
    },
  ];

  const mlModels = [
    {
      name: "ML Crop Recommender",
      architecture: "Gaussian Naive Bayes Classifier",
      accuracy: "99.50% Accuracy",
      performance: "2,189 / 2,200 dataset samples matched",
      mode: "100% Client/Server In-Memory TypeScript",
      icon: Sprout,
      color: "from-emerald-500 to-green-600",
      bgLight: "bg-emerald-50 border-emerald-200 text-emerald-800",
      inputs: ["Nitrogen (N)", "Phosphorus (P)", "Potassium (K)", "Temperature", "Humidity", "pH", "Rainfall"],
      desc: "Instant soil nutrient analysis predicting 22+ crop varieties tailored specifically for mountain and field soil profiles."
    },
    {
      name: "Arecanut Palm Disease Diagnostic",
      architecture: "TensorFlow Convolutional Neural Network",
      accuracy: "Multi-Class Disease Classifier",
      performance: "Fruit Rot / Koleroga, Stem Bleeding, Bud Borer & Healthy",
      mode: "100% Offline Python Microservice (FastAPI Port 8080)",
      icon: Cpu,
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50 border-amber-200 text-amber-800",
      inputs: ["Palm Tree Leaf / Trunk Image", "Visual Symptom Tensor"],
      desc: "Deep learning model trained specifically for Arecanut (Supari) growers in hill & coastal terrain with exact chemical dosage prescriptions."
    },
    {
      name: "Field Crop & Weed Density Detector",
      architecture: "ONNX Semantic Segmentation Model (352x480)",
      accuracy: "ExG Canopy Index",
      performance: "Crop % vs Weed % vs Soil % Ratio Calculation",
      mode: "100% Offline ONNX Runtime Microservice",
      icon: Layers3,
      color: "from-teal-500 to-cyan-600",
      bgLight: "bg-teal-50 border-teal-200 text-teal-800",
      inputs: ["Overhead / Field Image (352x480)", "Pixel Grid RGB Matrix"],
      desc: "Computes Excess Green (ExG) vegetation index to quantify weed encroachment and crop canopy density automatically."
    },
    {
      name: "Multimodal Visual Diagnostic Scanner",
      architecture: "Google Gemini 1.5 Flash Vision AI",
      accuracy: "Sub-second Diagnostics",
      performance: "Confidence Score, Severity Index (0-100), Organic & Chemical Remedies",
      mode: "Server API Route (/api/ai/analyse)",
      icon: Sparkles,
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50 border-blue-200 text-blue-800",
      inputs: ["Leaf / Stem Photo", "Target Language Preference"],
      desc: "Full multimodal AI diagnostics delivering custom multi-step treatment plans, pest identifications, and automatic SQLite database logging."
    }
  ];

  return (
    <div className="bg-cement-50 text-cement-900 min-h-screen selection:bg-green-100 selection:text-green-800">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-900 via-cement-900 to-cement-950 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#16a34a25,transparent_50%),radial-gradient(circle_at_70%_60%,#0d948820,transparent_50%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Top Badge & Language switch */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-green-300 tracking-wide">
              <Leaf className="w-4 h-4 text-green-400 animate-pulse" />
              <span>PAHADI CROPSATHI • AGRI AI PLATFORM</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-white/80 font-normal">v1.0 Production</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-xs">
                <Globe className="w-3.5 h-3.5 text-green-300" />
                <select 
                  value={lang} 
                  onChange={(e) => onLangChange(e.target.value as Language)}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                >
                  <option value="en" className="text-slate-900">English</option>
                  <option value="hi" className="text-slate-900">हिंदी (Hindi)</option>
                  <option value="pah" className="text-slate-900">गढ़वाली / कुमाऊँनी (Pahadi)</option>
                  <option value="pa" className="text-slate-900">ਪੰਜਾਬੀ (Punjabi)</option>
                  <option value="ta" className="text-slate-900">தமிழ் (Tamil)</option>
                  <option value="te" className="text-slate-900">తెలుగు (Telugu)</option>
                  <option value="mr" className="text-slate-900">मराठी (Marathi)</option>
                </select>
              </div>

              <button
                onClick={() => onNavigate('dashboard')}
                className="px-3.5 py-1.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
              >
                Sign In / App
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                Intelligent <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">Agri-Intelligence</span> for Mountain & Field Farmers
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-300 font-normal max-w-2xl leading-relaxed">
                Combining offline neural network microservices, <strong>99.50% accurate Gaussian Naive Bayes ML</strong>, ONNX canopy segmentation, and Google Gemini multimodal vision to solve agricultural challenges in real time.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-green-900/40 hover:shadow-green-900/60 transition-all transform hover:-translate-y-0.5 flex items-center gap-2.5 text-base"
                >
                  <span>Launch App Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <a
                  href="#ml-models"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 text-base"
                >
                  <BrainCircuit className="w-5 h-5 text-emerald-400" />
                  <span>View Machine Learning Models</span>
                </a>
              </div>

              {/* Real Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
                <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-green-400">99.50%</div>
                  <div className="text-xs text-slate-300 font-medium">Naive Bayes Test Acc.</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-teal-300">4 Microservices</div>
                  <div className="text-xs text-slate-300 font-medium">ML Neural Engines</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-emerald-300">7 Languages</div>
                  <div className="text-xs text-slate-300 font-medium">Native Dialects</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-amber-300">100% Offline</div>
                  <div className="text-xs text-slate-300 font-medium">FastAPI & ONNX Edge</div>
                </div>
              </div>

            </div>

            {/* Right Screenshot Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-slate-900/90 group">
                <img 
                  src="/assest/hero_dashboard.png" 
                  alt="Pahadi CropSathi Dashboard Preview" 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-green-500/30 text-green-300 border border-green-400/40">
                        Live System Dashboard
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">Pahadi-CropSathi AgriVision AI</h3>
                    </div>
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* HIGHLIGHTS */}
      <section className="py-12 bg-white border-b border-cement-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-cement-50 transition-colors">
              <div className="p-3 bg-green-100 text-green-700 rounded-xl">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-cement-900 text-base">Multi-Engine ML Architecture</h4>
                <p className="text-sm text-cement-600 mt-1">
                  Gaussian Naive Bayes classifier, TensorFlow SavedModels, ONNX segmentation runtime, and Gemini Multimodal AI.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-cement-50 transition-colors">
              <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-cement-900 text-base">Privacy & Offline First</h4>
                <p className="text-sm text-cement-600 mt-1">
                  100% local microservice inference via Python FastAPI (Port 8080) for field environments with low connectivity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-cement-50 transition-colors">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-cement-900 text-base">7 Regional Languages</h4>
                <p className="text-sm text-cement-600 mt-1">
                  Full multi-lingual support in English, Hindi, Garhwali/Kumaoni Pahadi, Punjabi, Tamil, Telugu, and Marathi.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ML MODELS SECTION */}
      <section id="ml-models" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>INTEGRATED ML MICROSERVICES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-cement-900 tracking-tight">
            Built-in AI & Machine Learning Suite
          </h2>
          <p className="text-base sm:text-lg text-cement-600">
            Real machine learning models integrated directly into Pahadi CropSathi, evaluated on authentic agricultural datasets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mlModels.map((model, idx) => {
            const Icon = model.icon;
            return (
              <div 
                key={idx} 
                className="bg-white rounded-2xl p-6 sm:p-8 border border-cement-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${model.color} text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${model.bgLight}`}>
                      {model.accuracy}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-cement-900 mb-2">{model.name}</h3>
                  <p className="text-sm text-cement-600 mb-4 leading-relaxed">{model.desc}</p>

                  <div className="space-y-2.5 text-xs text-cement-700 bg-cement-50 p-4 rounded-xl border border-cement-200/80 mb-6">
                    <div className="flex justify-between">
                      <span className="font-semibold text-cement-500">Architecture:</span>
                      <span className="font-medium text-cement-900">{model.architecture}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-cement-500">Execution Mode:</span>
                      <span className="font-medium text-emerald-700">{model.mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-cement-500">Benchmark/Dataset:</span>
                      <span className="font-medium text-cement-900">{model.performance}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-xs font-semibold text-cement-500 uppercase tracking-wider block mb-2">Model Inputs:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {model.inputs.map((inp, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-cement-100 text-cement-700 border border-cement-200">
                          {inp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full py-2.5 px-4 rounded-xl border border-green-600 text-green-700 hover:bg-green-50 font-semibold text-sm transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  <span>Open Tool in Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>


      {/* SYSTEM ARCHITECTURE */}
      <section className="py-16 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
              <Layers className="w-3.5 h-3.5" />
              <span>FULL-STACK ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Pahadi-CropSathi System Flow
            </h2>
            <p className="text-slate-400 text-base">
              End-to-end data pipeline from React/Next.js frontend components to local Python FastAPI inference microservices and SQLite database persistence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 relative">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-sm mb-4 border border-green-500/30">
                1
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Frontend UI Layer</h4>
              <p className="text-xs text-slate-400 mb-4">React 18 & Next.js App Router with Leaflet Satellite mapping and multi-lingual UI state.</p>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">🌱 CropRecommender.tsx</li>
                <li className="flex items-center gap-2">🌴 ArecanutDiagnostic.tsx</li>
                <li className="flex items-center gap-2">🌾 CropDetectionScanner.tsx</li>
                <li className="flex items-center gap-2">🗺️ LocationPanel (Leaflet)</li>
              </ul>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 relative">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm mb-4 border border-teal-500/30">
                2
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Next.js API Gateway</h4>
              <p className="text-xs text-slate-400 mb-4">Secure App Router endpoints handling JWT authentication, rate limiting, and AI proxies.</p>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">⚡ /api/recommendation</li>
                <li className="flex items-center gap-2">⚡ /api/ai/arecanut</li>
                <li className="flex items-center gap-2">⚡ /api/ai/crop-detection</li>
                <li className="flex items-center gap-2">⚡ /api/ai/region</li>
              </ul>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 relative">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm mb-4 border border-amber-500/30">
                3
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Local ML Microservice</h4>
              <p className="text-xs text-slate-400 mb-4">FastAPI Python microservice running offline inference engines on localhost:8080.</p>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">⚙️ Naive Bayes Engine (99.5%)</li>
                <li className="flex items-center gap-2">⚙️ TensorFlow Arecanut Model</li>
                <li className="flex items-center gap-2">⚙️ ONNX Weed Segmentation</li>
                <li className="flex items-center gap-2">⚙️ FastAPI uvicorn server</li>
              </ul>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 relative">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm mb-4 border border-indigo-500/30">
                4
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Database & Cloud AI</h4>
              <p className="text-xs text-slate-400 mb-4">Prisma ORM integration with SQLite database and Google Gemini multimodal API.</p>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">🗄️ SQLite Database (dev.db)</li>
                <li className="flex items-center gap-2">🗄️ Prisma PlantAnalysis Model</li>
                <li className="flex items-center gap-2">✨ Google Gemini Vision API</li>
                <li className="flex items-center gap-2">📊 Community & Market Data</li>
              </ul>
            </div>

          </div>

        </div>
      </section>


      {/* APPLICATION SCREENSHOTS GALLERY */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>APPLICATION INTERFACE PREVIEWS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-cement-900 tracking-tight">
            Real Application Screenshots
          </h2>
          <p className="text-cement-600 text-base">
            Explore authentic screenshots of Pahadi-CropSathi modules operating in action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {screenshots.map((shot, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl overflow-hidden border border-cement-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative aspect-video overflow-hidden bg-cement-900">
                <img 
                  src={shot.path} 
                  alt={shot.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = shot.fallback;
                  }}
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-cement-900 text-base mb-1">{shot.title}</h3>
                <p className="text-xs text-cement-600 leading-relaxed">{shot.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* DEVELOPER SETUP & QUICKSTART */}
      <section className="py-16 bg-cement-900 text-white border-t border-cement-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold border border-green-500/30">
                <Terminal className="w-3.5 h-3.5" />
                <span>QUICKSTART GUIDE</span>
              </div>
              
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Run Pahadi-CropSathi Locally
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                Clone the repository, install dependencies, spin up the local Python FastAPI microservice for local model predictions, and start the Next.js web platform.
              </p>

              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 space-y-2 overflow-x-auto">
                  <div className="text-slate-500"># 1. Start Python Offline ML Server (Terminal 1)</div>
                  <div>python scripts/local_inference_server.py</div>
                  <div className="text-slate-500 pt-2"># 2. Launch Next.js Application (Terminal 2)</div>
                  <div>npm run dev</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
                <div><strong>Author:</strong> Ankush Singh Rawat</div>
                <div><strong>Repository:</strong> ankush850/Pahadi-CropSathi</div>
                <div><strong>License:</strong> Open Source</div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-slate-800/90 rounded-2xl p-6 sm:p-8 border border-slate-700 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                  <span>Technical Prerequisites</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                    <div className="font-bold text-slate-200">Node.js Environment</div>
                    <div className="text-slate-400 mt-1">v18.0 or higher with npm</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                    <div className="font-bold text-slate-200">Python ML Suite</div>
                    <div className="text-slate-400 mt-1">Python 3.10+, TensorFlow, ONNX Runtime</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                    <div className="font-bold text-slate-200">Local Database</div>
                    <div className="text-slate-400 mt-1">SQLite via Prisma ORM (`dev.db`)</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                    <div className="font-bold text-slate-200">API Key</div>
                    <div className="text-slate-400 mt-1">Google Gemini API Key (.env)</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm transition-colors shadow-lg shadow-green-950 flex items-center justify-center gap-2"
                  >
                    <span>Launch Interactive Dashboard Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-cement-950 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-green-500" />
            <span className="font-bold text-white text-sm">Pahadi-CropSathi (Agri AI)</span>
            <span>— Developed by Ankush Singh Rawat</span>
          </div>
          <div>
            © {new Date().getFullYear()} Pahadi CropSathi. Multi-Lingual Agricultural Intelligence Platform.
          </div>
        </div>
      </footer>

    </div>
  );
};
