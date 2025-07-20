import React, { useState } from 'react';
import { Shield, Search, Filter, CheckCircle, Clock, AlertTriangle, Users, Award } from 'lucide-react';
import { credentialTypes } from '../../data/credentialData';

export const CredentialsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Types' },
    { id: 'academic', name: 'Academic' },
    { id: 'professional', name: 'Professional' },
    { id: 'governmental', name: 'Governmental' },
    { id: 'event', name: 'Events' },
    { id: 'membership', name: 'Memberships' },
    { id: 'award', name: 'Awards' },
    { id: 'iot', name: 'IoT/Device' }
  ];

  const filteredCredentials = credentialTypes.filter(credential => {
    const matchesCategory = selectedCategory === 'all' || credential.category === selectedCategory;
    const matchesSearch = credential.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credential.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic': return '🎓';
      case 'professional': return '💼';
      case 'governmental': return '🏛️';
      case 'event': return '🎫';
      case 'membership': return '🎖️';
      case 'award': return '🏆';
      case 'iot': return '🔧';
      default: return '📜';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'from-blue-500/20 to-indigo-500/20 border-blue-500/30';
      case 'professional': return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'governmental': return 'from-red-500/20 to-pink-500/20 border-red-500/30';
      case 'event': return 'from-purple-500/20 to-violet-500/20 border-purple-500/30';
      case 'membership': return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 'award': return 'from-amber-500/20 to-yellow-500/20 border-amber-500/30';
      case 'iot': return 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl text-sharp text-white">CREDENTIAL TYPES</h1>
          </div>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Explore the various types of verifiable credentials supported by IOTA Passport
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search credential types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-neutral-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20 transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-neutral-400" />
              <div className="flex items-center space-x-2 overflow-x-auto">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap ${
                      selectedCategory === category.id
                        ? 'bg-cyan-900/50 text-white border border-cyan-700'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Credential Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCredentials.map((credential, index) => (
            <div
              key={credential.id}
              className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-300 animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${getCategoryColor(credential.category)} p-6 border-b border-neutral-800`}>
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{credential.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{credential.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold tracking-wide text-white/80">
                        {getCategoryIcon(credential.category)} {credential.category.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-neutral-400 leading-relaxed mb-6">
                  {credential.description}
                </p>

                {/* Fields Preview */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-white font-semibold text-sm">Required Fields:</h4>
                  <div className="space-y-2">
                    {credential.fields.slice(0, 3).map((field, fieldIndex) => (
                      <div key={field.id} className="flex items-center space-x-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${field.required ? 'bg-red-400' : 'bg-gray-400'}`}></div>
                        <span className="text-neutral-300">{field.name}</span>
                        <span className="text-neutral-500">({field.type})</span>
                      </div>
                    ))}
                    {credential.fields.length > 3 && (
                      <div className="text-xs text-neutral-500">
                        +{credential.fields.length - 3} more fields
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
                  <div className="text-center">
                    <div className="text-lg font-bold text-cyan-400">2.5K+</div>
                    <div className="text-neutral-400 text-xs font-semibold">Issued</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">98%</div>
                    <div className="text-neutral-400 text-xs font-semibold">Verified</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCredentials.length === 0 && (
          <div className="text-center py-16 animate-slide-up">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No credential types found</h3>
            <p className="text-neutral-400">
              Try adjusting your search terms or category filter
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-neutral-950 to-neutral-900 border border-cyan-900/30 rounded-2xl p-8 text-center animate-slide-up">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-2xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl text-sharp text-white">Ready to Get Started?</h2>
            </div>
            
            <p className="text-xl text-neutral-300 leading-relaxed font-medium">
              Start managing your digital credentials with IOTA Passport. 
              Secure, verifiable, and completely under your control.
            </p>

            <button
              onClick={() => window.location.href = '#wallet'}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide"
            >
              <Shield className="w-5 h-5" />
              <span>OPEN YOUR WALLET</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};