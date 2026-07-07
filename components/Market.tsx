import React, { useState } from 'react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';
import { TrendingUp, DollarSign, BarChart3, Calendar, MapPin, Search, Filter, Star } from 'lucide-react';

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
  date: string;
  rating: number;
  supplier: string;
}

const marketData: MarketItem[] = [
  {
    id: '1',
    name: 'Wheat',
    category: 'Grains',
    currentPrice: 2850,
    previousPrice: 2750,
    location: 'Delhi Mandi',
    date: '2025-12-06',
    rating: 4.5,
    supplier: 'Grain Hub Ltd'
  },
  {
    id: '2',
    name: 'Rice (Basmati)',
    category: 'Grains',
    currentPrice: 4200,
    previousPrice: 4100,
    location: 'Punjab Market',
    date: '2025-12-06',
    rating: 4.8,
    supplier: 'Punjab Rice Co'
  },
  {
    id: '3',
    name: 'Tomato',
    category: 'Vegetables',
    currentPrice: 45,
    previousPrice: 52,
    location: 'Mumbai APMC',
    date: '2025-12-06',
    rating: 4.2,
    supplier: 'Fresh Produce Inc'
  },
  {
    id: '4',
    name: 'Onion',
    category: 'Vegetables',
    currentPrice: 35,
    previousPrice: 42,
    location: 'Nashik Market',
    date: '2025-12-06',
    rating: 4.0,
    supplier: 'Nashik Traders'
  },
  {
    id: '5',
    name: 'Cotton',
    category: 'Cash Crops',
    currentPrice: 6800,
    previousPrice: 6650,
    location: 'Gujarat Cotton Exchange',
    date: '2025-12-06',
    rating: 4.6,
    supplier: 'Cotton Connect'
  },
  {
    id: '6',
    name: 'Sugarcane',
    category: 'Cash Crops',
    currentPrice: 320,
    previousPrice: 315,
    location: 'UP Sugar Mills',
    date: '2025-12-06',
    rating: 4.3,
    supplier: 'Sugar Valley Corp'
  }
];

export const Market: React.FC<MarketProps> = ({ lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const t = (key: string) => getTranslation(lang, key);

  const categories = ['All', 'Grains', 'Vegetables', 'Fruits', 'Cash Crops', 'Dairy', 'Poultry'];

  const filteredData = marketData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPriceChange = (current: number, previous: number) => {
    const change = current - previous;
    const percentage = ((change / previous) * 100).toFixed(1);
    return { change, percentage, isPositive: change > 0 };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cement-900 mb-2 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-green-600" />
          {t('market')} Intelligence
        </h1>
        <p className="text-cement-600">Real-time agricultural commodity prices and market trends</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cement-400" />
            <input
              type="text"
              placeholder="Search commodities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-cement-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cement-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-cement-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Market Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredData.map(item => {
          const priceChange = getPriceChange(item.currentPrice, item.previousPrice);
          return (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-cement-200 p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-cement-900">{item.name}</h3>
                  <p className="text-sm text-cement-500">{item.category}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-2xl font-bold text-cement-900 mb-1">
                  ₹{item.currentPrice.toLocaleString()}
                  <span className="text-sm font-normal text-cement-500 ml-1">/quintal</span>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  priceChange.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${
                    priceChange.isPositive ? 'text-green-600' : 'text-red-600 rotate-180'
                  }`} />
                  {priceChange.isPositive ? '+' : ''}₹{Math.abs(priceChange.change)} ({priceChange.percentage}%)
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-cement-600">
                  <MapPin className="w-4 h-4" />
                  {item.location}
                </div>
                <div className="flex items-center gap-2 text-cement-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(item.date).toLocaleDateString()}
                </div>
                <div className="text-cement-500">
                  Supplier: {item.supplier}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-cement-100">
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Market Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-6">
        <h2 className="text-xl font-semibold text-cement-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Market Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700 mb-1">12%</div>
            <div className="text-sm text-green-600">Average Price Increase</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700 mb-1">24</div>
            <div className="text-sm text-blue-600">Active Markets</div>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-700 mb-1">156</div>
            <div className="text-sm text-amber-600">Commodities Tracked</div>
          </div>
        </div>
      </div>
    </div>
  );
};