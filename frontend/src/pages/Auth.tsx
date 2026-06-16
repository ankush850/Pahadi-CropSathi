import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mountain, Sprout, Mail, Lock, User, MapPin, Phone, ShieldCheck } from 'lucide-react';

export const Auth: React.FC = () => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'farmer' | 'supervisor'>('farmer');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      if (isLogin) {
        if (!email || !password) {
          throw new Error('Please fill in all fields.');
        }
        await login(email, role);
      } else {
        if (!name || !email || !location || !phone || !password) {
          throw new Error('All fields are required.');
        }
        await signup(name, email, role, location, phone);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans relative overflow-hidden">
      
      {/* Majestic Mountain background circles and gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[120px] dark:bg-emerald-500/5" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[120px] dark:bg-amber-500/5" />

      <div className="w-full max-w-lg glass-panel-elevated rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-slate-200/60 dark:border-slate-800/80">
        
        {/* Banner Section */}
        <div className="p-8 bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 dark:from-emerald-950 dark:to-teal-900 text-white relative">
          <div className="absolute top-4 right-4 opacity-10">
            <Mountain className="w-24 h-24" />
          </div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight">Pahadi CropSathi</span>
          </div>
          <h2 className="text-sm font-semibold tracking-wide text-emerald-100 uppercase">
            AI-Powered Agricultural Companion for Hills
          </h2>
        </div>

        {/* Form Section */}
        <div className="p-8 bg-white dark:bg-slate-900">
          
          {/* Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-6 border border-slate-200/50 dark:border-slate-700/50">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-extrabold transition-all ${
                isLogin 
                  ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-white' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-extrabold transition-all ${
                !isLogin 
                  ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-white' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl">
                {error}
              </div>
            )}

            {/* Role Toggle Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`py-2 px-3 border rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 transition-all ${
                    role === 'farmer' 
                      ? 'border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sprout className="w-4 h-4" />
                  <span>Mountain Farmer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('supervisor')}
                  className={`py-2 px-3 border rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 transition-all ${
                    role === 'supervisor' 
                      ? 'border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Field Supervisor</span>
                </button>
              </div>
            </div>

            {/* Display Name for Signup */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@cropsathi.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Signup Only Fields */}
            {!isLogin && (
              <>
                {/* Phone Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Location Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    Mandi Region / Valley Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Almora, Uttarakhand"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Action button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-sm font-extrabold transition-all duration-300 shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Please wait...' : isLogin ? 'Sign In as Sathi' : 'Register Farm Profile'}
            </button>
          </form>

          {/* Quick Mock Helper */}
          <div className="mt-6 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-3xs text-center text-slate-400 font-medium">
            💡 Pro-Tip: You can use any email and password to log in instantly!
          </div>

        </div>

      </div>

    </div>
  );
};
