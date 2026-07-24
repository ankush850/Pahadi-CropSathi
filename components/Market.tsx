import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';
import { TrendingUp, DollarSign, BarChart3, Calendar, MapPin, Search, Filter, Star, AlertCircle, Bell, Check } from 'lucide-react';
import { Modal } from './Modal';
import { useToast } from './hooks/useToast';

interface MarketProps {
  lang: Language;
}

interface MarketItem {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  previousPrice: number;
  location: string;
  supplier: string;
  rating: number;
  updatedAt?: string;
}

export const Market: React.FC<MarketProps> = ({ lang }) => {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Selected Item Modal State
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [alertTargetPrice, setAlertTargetPrice] = useState<string>('');
  const [alertSaved, setAlertSaved] = useState(false);

  const t = (key: string) => getTranslation(lang, key);
  const { addToast } = useToast();

  const categories = ['All', 'Grains', 'Vegetables', 'Fruits', 'Cash Crops', 'Dairy & Natural'];

  const fetchMarketData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/market?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(selectedCategory)}`);
      if (!res.ok) throw new Error('Failed to fetch market intelligence');
      const data = await res.json();
      setItems(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load market data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, [searchTerm, selectedCategory]);

  const getPriceChange = (current: number, previous: number) => {
    const change = current - previous;
    const percentage = ((change / previous) * 100).toFixed(1);
    return { change, percentage, isPositive: change >= 0 };
  };

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTargetPrice || isNaN(Number(alertTargetPrice))) {
      addToast('Please enter a valid price threshold', 'error');
      return;
    }

    setAlertSaved(true);
    addToast(`Price alert set for ${selectedItem?.name} at ₹${alertTargetPrice}/quintal`, 'success');
    setTimeout(() => setAlertSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cement-900 mb-2 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-green-600" />
          {t('market')} Intelligence
        </h1>
        <p className="text-cement-600">Real-time agricultural commodity prices and market trends across APMC mandis</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cement-400" />
            <input
              type="text"
              placeholder="Search commodities or mandi locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-cement-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cement-500 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-cement-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="bg-white rounded-xl p-6 border border-cement-200 animate-pulse space-y-4">
              <div className="h-5 bg-cement-200 rounded w-1/2"></div>
              <div className="h-8 bg-cement-300 rounded w-3/4"></div>
              <div className="h-12 bg-cement-100 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-600 max-w-lg mx-auto mb-8">
          <AlertCircle className="w-10 h-10 mx-auto mb-2 text-red-500" />
          <p className="font-semibold">{error}</p>
          <button 
            onClick={fetchMarketData}
            className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && items.length === 0 && (
        <div className="bg-white rounded-xl border border-cement-200 p-12 text-center max-w-md mx-auto mb-8 shadow-sm">
          <BarChart3 className="w-12 h-12 text-cement-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-cement-900 mb-1">No commodity prices found</h3>
          <p className="text-cement-500 text-sm">Try broadening your search term or selecting 'All' categories.</p>
        </div>
      )}

      {/* Market Data Grid */}
      {!isLoading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {items.map(item => {
            const priceChange = getPriceChange(item.currentPrice, item.previousPrice);
            return (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-cement-200 p-6 hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
                <div>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-cement-900">{item.name}</h3>
                      <span className="inline-block px-2 py-0.5 bg-cement-100 text-cement-600 rounded text-xs font-medium mt-0.5">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-1 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4 bg-cement-50 p-3.5 rounded-xl border border-cement-100">
                    <div className="text-2xl font-bold text-cement-900 mb-1">
                      ₹{item.currentPrice.toLocaleString()}
                      <span className="text-xs font-normal text-cement-500 ml-1">/ quintal</span>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${
                      priceChange.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`w-3.5 h-3.5 ${
                        priceChange.isPositive ? 'text-green-600' : 'text-red-600 rotate-180'
                      }`} />
                      {priceChange.isPositive ? '+' : ''}₹{Math.abs(priceChange.change)} ({priceChange.percentage}%) vs last week
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-cement-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-cement-400" />
                      <span className="font-medium text-cement-700">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-cement-400" />
                      <span>Updated: Today</span>
                    </div>
                    <div className="text-cement-500 truncate">
                      Supplier: <span className="text-cement-700 font-medium">{item.supplier}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-cement-100">
                  <button 
                    onClick={() => {
                      setSelectedItem(item);
                      setAlertTargetPrice(item.currentPrice.toString());
                    }}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-semibold shadow-sm"
                  >
                    View Details & Set Alert
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Market Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-6">
        <h2 className="text-xl font-bold text-cement-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Market Insights Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="text-2xl font-bold text-green-700 mb-1">+4.2%</div>
            <div className="text-xs text-green-600 font-medium">Average Price Increase (Fruits)</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="text-2xl font-bold text-blue-700 mb-1">18 Mandis</div>
            <div className="text-xs text-blue-600 font-medium">Hill Region Mandis Tracked</div>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="text-2xl font-bold text-amber-700 mb-1">99.4%</div>
            <div className="text-xs text-amber-600 font-medium">Data Freshness Index</div>
          </div>
        </div>
      </div>

      {/* Item Detail & Price Alert Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem ? `${selectedItem.name} — Market Intelligence` : ''}
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="bg-cement-50 p-4 rounded-xl border border-cement-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-cement-500">{selectedItem.category}</span>
                <span className="text-xs text-cement-500 font-medium">Location: {selectedItem.location}</span>
              </div>
              <div className="text-3xl font-extrabold text-cement-900">
                ₹{selectedItem.currentPrice.toLocaleString()} <span className="text-sm font-normal text-cement-500">/ quintal</span>
              </div>
              <p className="text-xs text-cement-600">
                Supplier: <span className="font-semibold text-cement-800">{selectedItem.supplier}</span> (Rating: {selectedItem.rating}/5.0)
              </p>
            </div>

            {/* Simulated mini chart */}
            <div>
              <h4 className="text-xs font-bold text-cement-700 uppercase mb-2">7-Day Mandi Price Trend</h4>
              <div className="flex items-end justify-between gap-2 h-24 bg-white p-3 border border-cement-200 rounded-xl">
                {[0.92, 0.94, 0.93, 0.97, 0.96, 0.98, 1.0].map((factor, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                      style={{ height: `${factor * 100}%` }}
                    ></div>
                    <span className="text-[10px] text-cement-400">D-{7 - idx}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Set Price Alert Form */}
            <form onSubmit={handleSetAlert} className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-green-800 uppercase flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-green-600" />
                Set Price Alert Notification
              </h4>
              <p className="text-xs text-green-700">
                Get notified when the market price for {selectedItem.name} drops below or reaches your target price.
              </p>
              
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Target Price (₹/quintal)"
                  value={alertTargetPrice}
                  onChange={(e) => setAlertTargetPrice(e.target.value)}
                  className="flex-1 px-3 py-2 border border-green-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors flex items-center gap-1"
                >
                  {alertSaved ? <Check className="w-4 h-4" /> : 'Set Alert'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};