import React, { useState } from 'react';
import { Wallet, Shield, Trophy, Flame, Target, ChevronRight, Lock, CheckCircle, Star, Eye, Share2 } from 'lucide-react';
import { credentials, credentialTypes, achievements as allAchievements } from '../../data/credentialData';
import { Credential, Achievement } from '../../types';

interface WalletDashboardProps {
  onCredentialSelect: (credentialId: string) => void;
  verifiedCredentials: string[];
  achievements: Achievement[];
  totalPoints: number;
  currentStreak: number;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({ 
  onCredentialSelect, 
  verifiedCredentials, 
  achievements, 
  totalPoints, 
  currentStreak 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getCredentialProgress = (categoryId: string) => {
    const categoryCredentials = credentials.filter(credential => {
      const credType = credentialTypes.find(type => type.id === credential.type);
      return credType?.category === categoryId;
    });
    const verifiedCount = categoryCredentials.filter(credential => 
      verifiedCredentials.includes(credential.id)
    ).length;
    return {
      verified: verifiedCount,
      total: categoryCredentials.length,
      percentage: categoryCredentials.length > 0 ? Math.round((verifiedCount / categoryCredentials.length) * 100) : 0
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-950 border-green-800';
      case 'revoked': return 'text-red-400 bg-red-950 border-red-800';
      case 'expired': return 'text-yellow-400 bg-yellow-950 border-yellow-800';
      default: return 'text-gray-400 bg-gray-950 border-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'from-blue-500 to-indigo-500';
      case 'professional': return 'from-green-500 to-emerald-500';
      case 'governmental': return 'from-red-500 to-pink-500';
      case 'event': return 'from-purple-500 to-violet-500';
      case 'membership': return 'from-yellow-500 to-orange-500';
      case 'award': return 'from-amber-500 to-yellow-500';
      case 'iot': return 'from-cyan-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const categories = [
    { id: 'academic', name: 'Academic', icon: '🎓' },
    { id: 'professional', name: 'Professional', icon: '💼' },
    { id: 'governmental', name: 'Government', icon: '🏛️' },
    { id: 'event', name: 'Events', icon: '🎫' },
    { id: 'membership', name: 'Memberships', icon: '🎖️' },
    { id: 'award', name: 'Awards', icon: '🏆' },
    { id: 'iot', name: 'IoT/Device', icon: '🔧' }
  ];

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-2xl">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl text-sharp text-white">Digital Wallet</h1>
          </div>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Manage your verifiable credentials securely with full control and privacy
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: Shield,
              title: 'Total Credentials',
              value: credentials.length.toLocaleString(),
              subtitle: 'In your wallet',
              color: 'from-blue-900 to-indigo-900 border-blue-800',
              iconColor: 'text-blue-300'
            },
            {
              icon: CheckCircle,
              title: 'Verified',
              value: verifiedCredentials.length,
              subtitle: 'Successfully verified',
              color: 'from-green-900 to-emerald-900 border-green-800',
              iconColor: 'text-green-300'
            },
            {
              icon: Trophy,
              title: 'Achievements',
              value: achievements.length,
              subtitle: 'Unlocked badges',
              color: 'from-yellow-900 to-orange-900 border-yellow-800',
              iconColor: 'text-yellow-300'
            },
            {
              icon: Target,
              title: 'Trust Score',
              value: totalPoints,
              subtitle: 'Reputation points',
              color: 'from-cyan-900 to-teal-900 border-cyan-800',
              iconColor: 'text-cyan-300'
            }
          ].map((stat, index) => (
            <div
              key={stat.title}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                <div className={`text-3xl font-mono font-bold text-white transition-all duration-500`}>
                  {stat.value}
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">{stat.title}</h3>
                <p className={`${stat.iconColor} text-sm font-medium opacity-80`}>
                  {stat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Credential Categories */}
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-8 animate-slide-up">
            <h2 className="text-3xl text-sharp text-white">Credential Categories</h2>
            <div className="flex items-center space-x-2 text-sm text-neutral-400">
              <Star className="w-4 h-4" />
              <span>Click a category to view credentials</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {categories.map((category, index) => {
              const progress = getCredentialProgress(category.id);
              const isExpanded = selectedCategory === category.id;
              const categoryCredentials = credentials.filter(credential => {
                const credType = credentialTypes.find(type => type.id === credential.type);
                return credType?.category === category.id;
              });

              return (
                <div
                  key={category.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-neutral-900 hover:border-neutral-700 cursor-pointer">
                    {/* Category Header */}
                    <div
                      className="p-6"
                      onClick={() => setSelectedCategory(isExpanded ? null : category.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`text-4xl p-3 bg-gradient-to-r ${getCategoryColor(category.id)} rounded-xl`}>
                            {category.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                            <div className="text-neutral-400 text-sm">
                              {progress.verified}/{progress.total} credentials
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <ChevronRight className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${
                            isExpanded ? 'rotate-90' : ''
                          }`} />
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-400">Verification Progress</span>
                          <span className="text-white font-semibold">
                            {progress.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${getCategoryColor(category.id)} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Credentials */}
                    {isExpanded && (
                      <div className="border-t border-neutral-800 bg-neutral-900/50 animate-slide-up">
                        <div className="p-6 space-y-4">
                          <h4 className="text-lg font-bold text-white mb-4">Your Credentials</h4>
                          {categoryCredentials.length > 0 ? (
                            categoryCredentials.map((credential, credIndex) => {
                              const isVerified = verifiedCredentials.includes(credential.id);
                              const credType = credentialTypes.find(type => type.id === credential.type);

                              return (
                                <div
                                  key={credential.id}
                                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                                    isVerified 
                                      ? 'bg-green-950/50 border-green-800' 
                                      : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700 cursor-pointer'
                                  }`}
                                  onClick={() => !isVerified && onCredentialSelect(credential.id)}
                                >
                                  <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                      isVerified 
                                        ? 'bg-green-600' 
                                        : 'bg-neutral-700'
                                    }`}>
                                      {isVerified ? (
                                        <CheckCircle className="w-6 h-6 text-white" />
                                      ) : (
                                        <div className="text-2xl">{credType?.icon || '📜'}</div>
                                      )}
                                    </div>
                                    
                                    <div className="flex-1">
                                      <h5 className="text-white font-semibold">{credential.title}</h5>
                                      <div className="flex items-center space-x-3 text-sm text-neutral-400">
                                        <span>🏛️ {credential.issuer.name}</span>
                                        <span className={`px-2 py-1 rounded-full border text-xs font-bold ${getStatusColor(credential.status)}`}>
                                          {credential.status.toUpperCase()}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-3 text-sm text-neutral-400 mt-1">
                                        <span>📅 {credential.issuedAt.toLocaleDateString()}</span>
                                        <span>🔍 {credential.verificationCount} verifications</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    {isVerified && (
                                      <div className="flex items-center space-x-2">
                                        <button className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors">
                                          <Eye className="w-4 h-4 text-white" />
                                        </button>
                                        <button className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors">
                                          <Share2 className="w-4 h-4 text-white" />
                                        </button>
                                      </div>
                                    )}
                                    {!isVerified && (
                                      <ChevronRight className="w-5 h-5 text-neutral-400" />
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-8">
                              <div className="text-4xl mb-2">{category.icon}</div>
                              <p className="text-neutral-400">No {category.name.toLowerCase()} credentials yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="mt-16 animate-slide-up" style={{ animationDelay: '600ms' }}>
          <h2 className="text-2xl text-sharp text-white mb-6">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.length === 0 ? (
              <div className="text-neutral-400 col-span-3">No achievements earned yet.</div>
            ) : (
              achievements
                .sort((a, b) => (b.unlockedAt ? b.unlockedAt.getTime() : 0) - (a.unlockedAt ? a.unlockedAt.getTime() : 0))
                .map((achievement, index) => (
                  <div
                    key={achievement.id}
                    className="bg-gradient-to-r from-yellow-950 to-orange-950 border border-yellow-800 rounded-xl p-4 flex items-center space-x-4"
                  >
                    <div className="text-3xl">{achievement.icon}</div>
                    <div>
                      <h4 className="text-white font-bold">{achievement.name}</h4>
                      <p className="text-yellow-300 text-sm">{achievement.description}</p>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold mt-1 ${
                        achievement.rarity === 'legendary' ? 'bg-purple-900 text-purple-300' :
                        achievement.rarity === 'epic' ? 'bg-orange-900 text-orange-300' :
                        achievement.rarity === 'rare' ? 'bg-blue-900 text-blue-300' :
                        'bg-gray-900 text-gray-300'
                      }`}>
                        {achievement.rarity.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};