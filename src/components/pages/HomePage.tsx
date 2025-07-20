import React from 'react';
import { Shield, Search, TrendingUp, Users, Brain, ArrowRight, Zap, Star, Award, Wallet, CheckCircle, Trophy, Target, Key } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'home' | 'issue' | 'wallet' | 'did') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-teal-900/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8 animate-slide-up">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-5xl md:text-6xl text-sharp text-white leading-tight">
                Decentralized Credential Management
                <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text">
                  Powered by IOTA
                </span>
              </h1>
              <p className="text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed font-medium">
                Empowering individuals to control and share their verifiable credentials 
                across institutions, employers, and organizations without centralized databases.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
              {[
                { icon: Shield, text: 'Verifiable Credentials', color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30' },
                { icon: Target, text: 'Instant Verification', color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30' },
                { icon: Trophy, text: 'Privacy-First', color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30' },
                { icon: Wallet, text: 'User-Controlled', color: 'from-green-500/20 to-emerald-500/20 border-green-500/30' },
                { icon: Key, text: 'DID Management', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30' }
              ].map((feature, index) => (
                <div
                  key={feature.text}
                  className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${feature.color} rounded-full border backdrop-blur-sm animate-scale-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <feature.icon className="w-4 h-4 text-white" />
                  <span className="text-white font-semibold text-sm">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => onNavigate('wallet')}
                className="relative inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 focus:outline-none"
              >
                <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-cyan-400/30 via-teal-400/30 to-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-full bg-gradient-to-r from-cyan-600 to-teal-600 group-hover:from-cyan-500 group-hover:to-teal-500 rounded-[10px] transition-all duration-300"></div>
                </div>
                
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-teal-500/5 to-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <Wallet className="w-5 h-5 relative z-10" />
                <span className="relative z-10">OPEN WALLET</span>
              </button>
              
              <button
                onClick={() => onNavigate('credentials')}
                className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 border border-cyan-900/30 hover:border-cyan-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide"
              >
                <Shield className="w-5 h-5" />
                <span>VIEW CREDENTIALS</span>
              </button>
              
              <button
                onClick={() => onNavigate('did')}
                className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 border border-purple-900/30 hover:border-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide"
              >
                <Key className="w-5 h-5" />
                <span>MANAGE DID</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl text-sharp text-white mb-4">How It Works</h2>
          <p className="text-neutral-400 font-medium max-w-2xl mx-auto">
            Four simple steps to manage your digital credentials securely
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              icon: Shield,
              title: 'Receive Credentials',
              description: 'Get verifiable credentials from trusted issuers like universities, employers, and government agencies.',
              color: 'from-blue-900 to-indigo-900 border-blue-800'
            },
            {
              step: '02',
              icon: Wallet,
              title: 'Store Securely',
              description: 'Manage all your credentials in a secure digital wallet with full control and privacy.',
              color: 'from-cyan-900 to-teal-900 border-cyan-800'
            },
            {
              step: '03',
              icon: Target,
              title: 'Share Selectively',
              description: 'Present only necessary information to verifiers using privacy-preserving selective disclosure.',
              color: 'from-green-900 to-emerald-900 border-green-800'
            },
            {
              step: '04',
              icon: Key,
              title: 'Manage Identity',
              description: 'Create and manage decentralized identifiers (DIDs) for secure, self-sovereign identity.',
              color: 'from-purple-900 to-pink-900 border-purple-800'
            },
            {
              step: '05',
              icon: Trophy,
              title: 'Verify Instantly',
              description: 'Enable instant, cryptographic verification using IOTA Tangle for tamper-proof authenticity.',
              color: 'from-yellow-900 to-orange-900 border-yellow-800'
            }
          ].map((step, index) => (
            <div
              key={step.step}
              className={`bg-gradient-to-br ${step.color} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 animate-slide-up relative overflow-hidden`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-4 right-4 text-6xl font-black text-white/10">
                {step.step}
              </div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/80 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Stats */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <h2 className="text-3xl text-sharp text-white">Platform Statistics</h2>
            <div className="flex items-center space-x-2 px-3 py-1 bg-purple-950 border border-purple-800 rounded-full">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-cyan-400 font-bold tracking-wide">LIVE</span>
            </div>
          </div>
          <p className="text-neutral-400 font-medium max-w-2xl mx-auto">
            Real-time insights from our decentralized credential platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: Shield,
              title: 'Credential Types',
              value: '12+',
              subtitle: 'Academic to professional',
              color: 'from-blue-900 to-indigo-900 border-blue-800',
              iconColor: 'text-blue-300',
              valueColor: 'text-blue-400'
            },
            {
              icon: CheckCircle,
              title: 'Verified Credentials',
              value: '50K+',
              subtitle: 'Issued and verified',
              color: 'from-cyan-900 to-teal-900 border-cyan-800',
              iconColor: 'text-cyan-300',
              valueColor: 'text-cyan-400'
            },
            {
              icon: Trophy,
              title: 'Trusted Issuers',
              value: '500+',
              subtitle: 'Universities & organizations',
              color: 'from-orange-900 to-red-900 border-orange-800',
              iconColor: 'text-orange-300',
              valueColor: 'text-orange-400'
            },
            {
              icon: Users,
              title: 'Active Users',
              value: '25K+',
              subtitle: 'Managing credentials',
              color: 'from-green-900 to-emerald-900 border-green-800',
              iconColor: 'text-green-300',
              valueColor: 'text-green-400'
            }
          ].map((stat, index) => (
            <div
              key={stat.title}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 animate-slide-up relative overflow-hidden`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                <div className={`text-3xl font-mono font-bold ${stat.valueColor} transition-all duration-500`}>
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
      </div>

      {/* Featured Predictions */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-12 animate-slide-up">
          <div>
            <h2 className="text-3xl text-sharp text-white mb-4">Featured Credential Types</h2>
            <p className="text-neutral-400 font-medium">
              Popular credentials being issued and verified
            </p>
          </div>
          
          <button
            onClick={() => onNavigate('credentials')}
            className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors font-semibold text-sm tracking-wide hover:scale-105 active:scale-95"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            {
              topic: 'University Degrees',
              difficulty: 'Academic',
              description: 'Digital diplomas and transcripts from accredited universities worldwide',
              progress: 'Academic Credentials',
              time: '2h ago',
              issuers: 1542,
              verified: 87
            },
            {
              topic: 'Professional Certifications',
              difficulty: 'Professional',
              description: 'Industry certifications and professional qualifications from leading organizations',
              progress: 'Professional Credentials',
              time: '4h ago',
              issuers: 893,
              verified: 85
            },
            {
              topic: 'Government IDs',
              difficulty: 'Governmental',
              description: 'Official government-issued identification and permits with full legal validity',
              progress: 'Government Credentials',
              time: '6h ago',
              issuers: 1265,
              verified: 89
            }
          ].map((credential, index) => (
            <div
              key={credential.topic}
              className="bg-neutral-950 border border-cyan-900/30 rounded-2xl p-6 hover:bg-neutral-900 hover:border-cyan-700 transition-all duration-300 animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onNavigate('credentials')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {credential.topic.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{credential.topic}</div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-3 h-3 text-cyan-400" />
                      <span className="text-cyan-400 text-xs font-bold">{credential.difficulty}</span>
                    </div>
                  </div>
                </div>
                <div className="text-neutral-400 text-sm">{credential.time}</div>
              </div>

              <div className="mb-4">
                <div className="text-neutral-400 text-sm mb-2">{credential.progress}</div>
                <p className="text-white leading-relaxed">{credential.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-cyan-900/30">
                <div className="flex items-center space-x-4 text-sm text-neutral-400">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>{credential.issuers.toLocaleString()} issuers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4 text-green-400" />
                    <span>{credential.verified}% verified</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-neutral-950 to-neutral-900 border border-cyan-900/30 rounded-2xl p-8 text-center animate-slide-up">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-2xl">
               <Wallet className="w-8 h-8 text-white" />
              </div>
             <h2 className="text-3xl text-sharp text-white">Start Your Credential Journey</h2>
            </div>
            
            <p className="text-xl text-neutral-300 leading-relaxed font-medium">
             Take control of your digital identity with decentralized credentials. 
             Store, manage, and share your verifiable credentials securely using IOTA.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
              <button
               onClick={() => onNavigate('wallet')}
                className="relative inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 focus:outline-none"
              >
                <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-cyan-400/30 via-teal-400/30 to-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-full bg-gradient-to-r from-cyan-600 to-teal-600 group-hover:from-cyan-500 group-hover:to-teal-500 rounded-[10px] transition-all duration-300"></div>
                </div>
                
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-teal-500/5 to-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
               <Wallet className="w-4 h-4 relative z-10" />
               <span className="relative z-10">OPEN WALLET</span>
              </button>
              
              <button
               onClick={() => onNavigate('credentials')}
                className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 border border-cyan-900/30 hover:border-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide"
              >
               <Shield className="w-4 h-4" />
               <span>VIEW CREDENTIALS</span>
              </button>
            </div>

            <div className="flex items-center justify-center space-x-4 text-xs text-neutral-500">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
               <span className="font-semibold tracking-wide">DECENTRALIZED</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
               <span className="font-semibold tracking-wide">PRIVACY-FIRST</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
               <span className="font-semibold tracking-wide">INSTANT VERIFICATION</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};