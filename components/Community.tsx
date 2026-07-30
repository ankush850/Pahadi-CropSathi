import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';
import { Users, MessageCircle, ThumbsUp, Calendar, Tag, Search, Plus, Award, MapPin, Trash2, AlertCircle, X, Loader2 } from 'lucide-react';
import { Modal } from './Modal';
import { ConfirmDialog } from './ConfirmDialog';
import { useToast } from './hooks/useToast';

interface CommunityProps {
  lang: Language;
}

interface Post {
  id: string;
  userId?: string;
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

const categories = ['All', 'Crop Management', 'Pest Control', 'Water Management', 'Success Stories', 'Research & Innovation', 'Market Tips'];

export const Community: React.FC<CommunityProps> = ({ lang }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // New Post Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Crop Management');
  const [location, setLocation] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['agriculture']);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const t = (key: string) => getTranslation(lang, key);
  const { addToast } = useToast();

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/community');
      if (!res.ok) throw new Error('Failed to load community discussions');
      const data = await res.json();
      setPosts(data);
    } catch (err: any) {
      console.error("Failed to fetch community posts:", err);
      setError(err.message || 'Error loading posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Get current user id from /api/auth/me
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('/api/auth/me', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUserId(data.user?.id || null);
        }
      } catch (e) {
        console.error("Failed to fetch user session in community:", e);
      }
    };
    fetchUser();
  }, []);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Post title is required');
      return;
    }
    if (content.trim().length < 20) {
      setFormError('Content must be at least 20 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title,
          content,
          category,
          location: location || 'Local Region',
          tags
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create post');
      }

      const newPost = await res.json();
      setPosts([newPost, ...posts]);
      addToast('Post created successfully!', 'success');
      setIsModalOpen(false);
      // Reset form
      setTitle('');
      setContent('');
      setLocation('');
      setTags(['agriculture']);
    } catch (err: any) {
      setFormError(err.message || 'Failed to create post');
      addToast(err.message || 'Failed to create post', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`/api/community/${postId}`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: data.likes } : p));
      }
    } catch (e) {
      console.error("Failed to like post", e);
    }
  };

  const handleDeletePost = async () => {
    if (!deleteTargetId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/community/${deleteTargetId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error('Failed to delete post');
      
      setPosts(prev => prev.filter(p => p.id !== deleteTargetId));
      addToast('Post deleted successfully', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to delete post', 'error');
    } finally {
      setDeleteTargetId(null);
    }
  };

  const filteredPosts = posts.filter(post => {
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-5 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">12,543</div>
          <div className="text-xs sm:text-sm text-cement-600">Active Farmers</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-5 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">{posts.length}</div>
          <div className="text-xs sm:text-sm text-cement-600">Discussions</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-5 text-center">
          <div className="text-2xl font-bold text-amber-600 mb-1">156</div>
          <div className="text-xs sm:text-sm text-cement-600">Experts</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-5 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">98%</div>
          <div className="text-xs sm:text-sm text-cement-600">Satisfaction</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Create Post */}
          <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
            >
              <Plus className="w-5 h-5" />
              New Post
            </button>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-cement-200 p-6">
            <h3 className="font-semibold text-cement-900 mb-4">Categories</h3>
            <div className="flex lg:flex-col overflow-x-auto gap-2 pb-2 lg:pb-0 custom-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left px-3 py-2 rounded-lg transition-colors whitespace-nowrap text-sm ${
                    selectedCategory === cat
                      ? 'bg-green-100 text-green-700 font-medium'
                      : 'text-cement-600 hover:bg-cement-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
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
                placeholder="Search discussions, topics, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-cement-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm"
              />
            </div>
          </div>

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="bg-white rounded-xl p-6 border border-cement-200 animate-pulse space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cement-200 rounded-full"></div>
                    <div className="h-4 bg-cement-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-5 bg-cement-200 rounded w-3/4"></div>
                  <div className="h-12 bg-cement-100 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="font-medium">{error}</p>
              <button 
                onClick={fetchPosts}
                className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold"
              >
                Reload
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredPosts.length === 0 && (
            <div className="bg-white rounded-xl border border-cement-200 p-12 text-center">
              <MessageCircle className="w-12 h-12 text-cement-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-cement-900 mb-1">No discussions found</h3>
              <p className="text-cement-500 text-sm mb-4">Be the first to share your knowledge or ask a question!</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Start a Discussion
              </button>
            </div>
          )}

          {/* Posts List */}
          {!isLoading && !error && (
            <div className="space-y-6">
              {filteredPosts.map(post => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-cement-200 p-6 hover:shadow-md transition-shadow">
                  {/* Post Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                        {post.author ? post.author.substring(0, 2).toUpperCase() : 'FA'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-cement-900 text-sm">{post.author}</h4>
                          {post.isExpert && (
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Award className="w-3 h-3" /> Expert
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-cement-500 mt-0.5">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {post.location}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delete button if user owns the post */}
                    {currentUserId && post.userId === currentUserId && (
                      <button
                        onClick={() => setDeleteTargetId(post.id)}
                        className="text-cement-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-cement-900 mb-2">{post.title}</h3>
                    <p className="text-cement-700 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
                    {post.image && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-cement-200">
                        <img src={post.image} alt="Post asset" className="w-full h-48 object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.map(tag => (
                      <span key={tag} className="bg-cement-100 text-cement-600 text-xs px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        <Tag className="w-3 h-3 text-cement-400" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer / Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-cement-100 text-xs">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1.5 text-cement-600 hover:text-green-600 transition-colors font-medium"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <span className="flex items-center gap-1.5 text-cement-500">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments} comments</span>
                      </span>
                    </div>
                    <span className="bg-green-50 text-green-700 font-medium px-2.5 py-1 rounded-full text-xs">
                      {post.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Post Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Discussion Post"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium">
              {formError}
            </div>
          )}

          <div>
            <label htmlFor="community-title" className="block text-xs font-semibold text-cement-700 uppercase mb-1">Title *</label>
            <input
              id="community-title"
              type="text"
              placeholder="e.g. Tips for pest control on mustard crop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-cement-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="community-category" className="block text-xs font-semibold text-cement-700 uppercase mb-1">Category</label>
              <select
                id="community-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-cement-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white"
              >
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="community-location" className="block text-xs font-semibold text-cement-700 uppercase mb-1">Location</label>
              <input
                id="community-location"
                type="text"
                placeholder="e.g. Kangra, Himachal"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-cement-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="community-content" className="block text-xs font-semibold text-cement-700 uppercase mb-1">Content * (min 20 chars)</label>
            <textarea
              id="community-content"
              rows={4}
              placeholder="Share your question, experience, or advice with the community..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-cement-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label htmlFor="community-tags" className="block text-xs font-semibold text-cement-700 uppercase mb-1">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                id="community-tags"
                type="text"
                placeholder="Add tag and press Add"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                className="flex-1 px-3 py-1.5 border border-cement-200 rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-cement-100 text-cement-700 rounded-lg text-xs font-semibold hover:bg-cement-200"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map(t => (
                <span key={t} className="bg-green-50 text-green-700 border border-green-200 text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
                  #{t}
                  <button type="button" onClick={() => handleRemoveTag(t)}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cement-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm text-cement-600 bg-cement-100 rounded-lg hover:bg-cement-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Publish Post
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Post"
        message="Are you sure you want to delete this discussion post? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeletePost}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};