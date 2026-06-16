import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { WeatherWidget } from '../components/WeatherWidget';
import { 
  Sprout, 
  Leaf, 
  Compass, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Mountain
} from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { t, farmProfile } = useSettings();
  const { user } = useAuth();

  // Recommended crop lists based on altitude
  const getElevationCrops = (elevation: number) => {
    if (elevation < 1000) {
      return [
        { name: 'Ginger (अदरक)', cycle: 'April - Dec', demand: 'High', price: '₹90/kg' },
        { name: 'Turmeric (हल्दी)', cycle: 'May - Jan', demand: 'Medium', price: '₹120/kg' },
        { name: 'Basmati Rice (धान)', cycle: 'June - Nov', demand: 'Very High', price: '₹65/kg' }
      ];
    } else if (elevation >= 1000 && elevation <= 2000) {
      return [
        { name: 'Off-Season Peas (मटर)', cycle: 'Aug - Nov', demand: 'High', price: '₹75/kg' },
        { name: 'Potato (आलू)', cycle: 'March - Aug', demand: 'Stable', price: '₹35/kg' },
        { name: 'Plums (पुलम)', cycle: 'Jan - July', demand: 'High', price: '₹110/kg' },
        { name: 'Garlic (लहसुन)', cycle: 'Oct - May', demand: 'Very High', price: '₹180/kg' }
      ];
    } else {
      return [
        { name: 'Royal Apple (स्याउ)', cycle: 'Jan - Sept', demand: 'Export Grade', price: '₹140/kg' },
        { name: 'Saffron (केसर)', cycle: 'July - Nov', demand: 'Exquisite', price: '₹3.2L/kg' },
        { name: 'Cabbage & Broccoli', cycle: 'April - Aug', demand: 'High', price: '₹55/kg' }
      ];
    }
  };

  const recommendedCrops = getElevationCrops(farmProfile.elevation);

  const mockDiagnostics = [
    { id: 1, crop: 'Apple Leaves', status: 'Apple Scab detected', severity: 'High', date: 'Yesterday' },
    { id: 2, crop: 'Potato stem', status: 'Healthy', severity: 'None', date: '3 days ago' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 text-white p-6 md:p-8 shadow-xl">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center pr-6 pointer-events-none">
          <Mountain className="w-56 h-56" />
        </div>
        
        <div className="max-w-xl relative z-10">
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-extrabold uppercase tracking-wide">
            {t('welcomeBack')}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-3 text-white">
            Namaskar, {user?.displayName}!
          </h2>
          <p className="mt-2 text-sm text-emerald-100 font-medium leading-relaxed">
            Your farm sits at <strong className="text-white">{farmProfile.elevation} meters</strong> in the beautiful {farmProfile.location} valley. The climate is currently perfect for monitoring crop diagnostics.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button 
              onClick={() => setActiveTab('chat')}
              className="px-5 py-2.5 bg-white text-emerald-700 rounded-xl text-xs font-extrabold hover:bg-slate-100 transition-colors shadow-sm flex items-center space-x-1.5"
            >
              <span>Ask CropSathi AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveTab('diagnostics')}
              className="px-5 py-2.5 bg-emerald-800/40 text-white border border-emerald-500/30 rounded-xl text-xs font-extrabold hover:bg-emerald-800/60 transition-colors flex items-center space-x-1.5"
            >
              <Leaf className="w-4 h-4 text-emerald-300" />
              <span>Scan Sick Leaf</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Mountain Weather and Alerts Section */}
      <WeatherWidget />

      {/* Dashboard Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recommended Crops based on elevation */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-lg rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center">
                <Compass className="w-5 h-5 text-emerald-500 mr-2" />
                Altitude Crop Recommendation ({farmProfile.elevation}m)
              </h3>
              <button 
                onClick={() => setActiveTab('profile')}
                className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Change Altitude
              </button>
            </div>
            
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-4 leading-relaxed">
              These crops show optimal yields when planted at your current mountain altitude. Standard market rates are tracked below.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-medium">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5">Crop Name</th>
                    <th className="py-2.5">Best Cycle</th>
                    <th className="py-2.5">Local Demand</th>
                    <th className="py-2.5 text-right">Avg Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {recommendedCrops.map((crop, idx) => (
                    <tr key={idx} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 font-bold flex items-center">
                        <Sprout className="w-4 h-4 mr-2 text-emerald-500" />
                        {crop.name}
                      </td>
                      <td className="py-3 font-semibold text-slate-500 dark:text-slate-400">{crop.cycle}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-md text-3xs font-extrabold uppercase ${
                          crop.demand.includes('High') || crop.demand.includes('Exquisite')
                            ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/5' 
                            : 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/5'
                        }`}>
                          {crop.demand}
                        </span>
                      </td>
                      <td className="py-3 text-right font-extrabold text-slate-900 dark:text-white">{crop.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-400 flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-bold">Terrace Sloping Tip:</p>
              <p className="mt-0.5 leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                Plant deep-rooting grasses like Vetiver along terrace boundaries to reduce soil washouts caused by heavy rain.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Diagnostics logs */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-lg rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center mb-1">
              <Leaf className="w-5 h-5 text-teal-500 mr-2" />
              Recent Plant Diagnostics
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-4">
              Your camera scans of crop leaves.
            </p>

            <div className="space-y-3">
              {mockDiagnostics.map((diag) => (
                <div key={diag.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/30 dark:border-slate-700/30 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{diag.crop}</h4>
                    <p className={`text-xs font-semibold mt-1 ${
                      diag.severity === 'High' ? 'text-red-500' : 'text-emerald-500'
                    }`}>
                      {diag.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xs text-slate-400 block font-semibold">{diag.date}</span>
                    <button 
                      onClick={() => setActiveTab('diagnostics')}
                      className="text-2xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline mt-1 block"
                    >
                      View Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className="w-full mt-6 py-2.5 bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-200 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center space-x-1"
          >
            <span>Launch Diagnostics</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Advisory Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-lg rounded-3xl p-6">
        <h3 className="text-base font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center mb-4">
          <HelpCircle className="w-5 h-5 text-amber-500 mr-2" />
          Mountain Farming Knowledge Hub
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center">
              🏔️ Terracing Guidelines
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-2 leading-relaxed">
              Design crop rows along contour lines. This holds rain runoff, builds organic layer, and reduces soil run-off by up to 80%.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center">
              🍂 Cold-climate Composting
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-2 leading-relaxed">
              In higher altitudes (1800m+), decomposition is slower. Add compost starters and insulate pits using dry pine needles.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center">
              💧 Gravity Drip Irrigation
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-2 leading-relaxed">
              Harness mountain slopes. Place water storage tanks on the top terrace, allowing water to trickle down via gravity.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
