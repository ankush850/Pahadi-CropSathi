import React, { useState } from 'react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';
import { Users, MessageCircle, ThumbsUp, Calendar, Tag, Search, Plus, TrendingUp, Award, MapPin } from 'lucide-react';

interface CommunityProps {
  lang: Language;
}

interface Post {
  id: string;
  author: string;
  location: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  date: string;
  isExpert: boolean;
  image?: string;
}

const communityPosts: Post[] = [
  {
    id: '1',
    author: 'Rajesh Kumar',
    location: 'Punjab',
    title: 'Best practices for wheat harvesting this season',
    content: 'After 15 years of farming, I wanted to share some key insights about wheat harvesting timing and techniques that have significantly improved my yield...',
    category: 'Crop Management',
    tags: ['wheat', 'harvesting', 'yield'],
    likes: 24,
    comments: 8,
    date: '2025-12-05',
    isExpert: false,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
  },
  {
    id: '2',
    author: 'Dr. Priya Sharma',
    location: 'Maharashtra',
    title: 'Organic pest control methods for cotton crops',
    content: 'As an agricultural scientist, I have researched and tested various organic pest control methods. Here are the most effective ones for cotton farming...',
    category: 'Pest Control',
    tags: ['cotton', 'organic', 'pest-control'],
    likes: 42,
    comments: 15,
    date: '2025-12-04',
    isExpert: true
  },
  {
    id: '3',
    author: 'Amit Patel',
    location: 'Gujarat',
    title: 'Water conservation techniques that increased my profit by 30%',
    content: 'Implementing these water conservation methods not only helped the environment but also significantly reduced my irrigation costs...',
    category: 'Water Management',
    tags: ['water-conservation', 'irrigation', 'profit'],
    likes: 36,
    comments: 12,
    date: '2025-12-03',
    isExpert: false
  },
  {
    id: '4',
    author: 'Sunita Devi',
    location: 'Haryana',
    title: 'Women in agriculture: My journey from traditional to modern farming',
    content: 'Sharing my transformation story and how technology helped me become a successful farmer despite initial challenges...',
    category: 'Success Stories',
    tags: ['women-farming', 'technology', 'success'],
    likes: 58,
    comments: 22,
    date: '2025-12-02',
    isExpert: false,
    image: 'https://images.unsplash.com/photo-1566133948275-919c0340b7c1?w=400'
  },
  {
    id: '5',
    author: 'Prof. Ravi Krishnan',
    location: 'Tamil Nadu',
    title: 'Climate-smart agriculture practices for rice cultivation',
    content: 'Latest research findings on adapting rice cultivation to changing climate patterns and sustainable farming practices...',
    category: 'Research & Innovation',
    tags: ['rice', 'climate-smart', 'research'],
    likes: 31,
    comments: 18,
    date: '2025-12-01',
    isExpert: true
  }
];

const categories = ['All', 'Crop Management', 'Pest Control', 'Water Management', 'Success Stories', 'Research & Innovation', 'Market Tips'];

export const Community: React.FC<CommunityProps> = ({ lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const t = (key: string) => getTranslation(lang, key);

  const filteredPosts = communityPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cement-900 mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-green-600" />
          Farming {t('community')}
        </h1>
        <p className="text-cement-600">Connect, learn, and share knowledge with fellow farmers and experts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">12,543</div>
          <div className="text-sm text-cement-600">Active Farmers</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">2,847</div>
          <div className="text-sm text-cement-600">Discussions</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-6 text-center">
          <div className="text-2xl font-bold text-amber-600 mb-1">156</div>
          <div className="text-sm text-cement-600">Experts</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">98%</div>
          <div className="text-sm text-cement-600">Satisfaction</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Create Post */}
          <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-6">
            <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
              <Plus className="w-4 h-4" />
              New Post
            </button>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-6">
            <h3 className="font-semibold text-cement-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-green-100 text-green-700 font-medium'
                      : 'text-cement-600 hover:bg-cement-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-6">
            <h3 className="font-semibold text-cement-900 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Top Contributors
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">RS</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-cement-900">Rajesh Singh</div>
                  <div className="text-xs text-cement-500">247 helpful posts</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">AP</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-cement-900">Anjali Patel</div>
                  <div className="text-xs text-cement-500">198 helpful posts</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cement-400" />
              <input
                type="text"
                placeholder="Search discussions, topics, or farmers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-cement-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-cement-200 p-6 hover:shadow-lg transition-shadow">
                {/* Post Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-cement-900">{post.author}</h3>
                      {post.isExpert && (
                        <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Expert
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-cement-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {post.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-cement-900 mb-2">{post.title}</h2>
                  <p className="text-cement-700 leading-relaxed">{post.content}</p>
                  {post.image && (
                    <div className="mt-3 rounded-lg overflow-hidden">
                      <img src={post.image} alt="Post" className="w-full h-48 object-cover" />
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-cement-100 text-cement-600 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-cement-100">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-cement-600 hover:text-green-600 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-cement-600 hover:text-blue-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </button>
                  </div>
                  <div className="bg-cement-100 text-cement-600 text-xs font-medium px-3 py-1 rounded-full">
                    {post.category}
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