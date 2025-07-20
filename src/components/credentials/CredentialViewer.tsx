import React, { useState } from 'react';
import { ArrowLeft, Shield, CheckCircle, AlertCircle, Trophy, Share2, Download, Eye, Clock } from 'lucide-react';
import { Credential } from '../../types';

interface CredentialViewerProps {
  credential: Credential;
  onVerify: (credentialId: string) => void;
  onBack: () => void;
  verifiedCredentials: string[];
}

export const CredentialViewer: React.FC<CredentialViewerProps> = ({ 
  credential, 
  onVerify, 
  onBack, 
  verifiedCredentials 
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'error' | null>(null);

  const isVerified = verifiedCredentials.includes(credential.id);

  const handleVerify = async () => {
    if (isVerified) return;
    
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      setVerificationResult('success');
      setIsVerifying(false);
      setTimeout(() => {
        onVerify(credential.id);
      }, 2000);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-950 border-green-800';
      case 'revoked': return 'text-red-400 bg-red-950 border-red-800';
      case 'expired': return 'text-yellow-400 bg-yellow-950 border-yellow-800';
      default: return 'text-gray-400 bg-gray-950 border-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8 animate-slide-up">
          <button
            onClick={onBack}
            className="p-2 hover:bg-neutral-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-neutral-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl text-sharp text-white">{credential.title}</h1>
            <p className="text-neutral-400 font-medium">{credential.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-white font-bold">🏆 {credential.points} points</div>
              {credential.achievement && (
                <div className="text-yellow-400 text-sm">🎖️ {credential.achievement}</div>
              )}
            </div>
          </div>
        </div>

        {/* Credential Card */}
        <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {/* Card Header */}
          <div className="bg-gradient-to-r from-cyan-900 to-teal-900 p-6 border-b border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                  🎓
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{credential.title}</h2>
                  <p className="text-cyan-200">Issued by {credential.issuer.name}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full border text-sm font-bold ${getStatusColor(credential.status)}`}>
                {credential.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Credential Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Credential Details</h3>
                {Object.entries(credential.data).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-neutral-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-white font-semibold">{value}</span>
                  </div>
                ))}
              </div>

              {/* Issuer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Issuer Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Organization:</span>
                    <span className="text-white font-semibold">{credential.issuer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Type:</span>
                    <span className="text-white font-semibold capitalize">{credential.issuer.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Verification:</span>
                    <span className={credential.issuer.verified ? 'text-green-400' : 'text-red-400'}>
                      {credential.issuer.verified ? '✓ Verified' : '✗ Unverified'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Reputation:</span>
                    <span className="text-white font-semibold">{credential.issuer.reputation}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">DID:</span>
                    <span className="text-white font-mono text-xs">{credential.issuer.did}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="mt-6 pt-6 border-t border-neutral-800">
              <h3 className="text-lg font-bold text-white mb-4">Blockchain Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-neutral-400">Issued Date:</span>
                  <div className="text-white font-semibold">{credential.issuedAt.toLocaleDateString()}</div>
                </div>
                {credential.expiresAt && (
                  <div>
                    <span className="text-neutral-400">Expires:</span>
                    <div className="text-white font-semibold">{credential.expiresAt.toLocaleDateString()}</div>
                  </div>
                )}
                <div>
                  <span className="text-neutral-400">Verifications:</span>
                  <div className="text-white font-semibold">{credential.verificationCount}</div>
                </div>
                <div>
                  <span className="text-neutral-400">Credential Hash:</span>
                  <div className="text-white font-mono text-xs">{credential.hash}</div>
                </div>
                <div>
                  <span className="text-neutral-400">Signature:</span>
                  <div className="text-white font-mono text-xs">{credential.signature}</div>
                </div>
                {credential.tangleHash && (
                  <div>
                    <span className="text-neutral-400">Tangle Hash:</span>
                    <div className="text-white font-mono text-xs">{credential.tangleHash}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Section */}
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          {verificationResult === 'success' ? (
            /* Success State */
            <div className="bg-gradient-to-r from-green-950 to-emerald-950 border border-green-800 rounded-2xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">🎉 Verification Successful!</h2>
              <p className="text-green-300 mb-6">
                This credential has been successfully verified on the IOTA Tangle. All signatures and metadata are valid.
              </p>
              <div className="bg-green-900/30 border border-green-700 rounded-xl p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-green-400 font-bold">✓</div>
                    <div className="text-green-300">Signature Valid</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-bold">✓</div>
                    <div className="text-green-300">Issuer Verified</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-bold">✓</div>
                    <div className="text-green-300">Not Revoked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-bold">✓</div>
                    <div className="text-green-300">Tangle Confirmed</div>
                  </div>
                </div>
              </div>
            </div>
          ) : isVerified ? (
            /* Already Verified */
            <div className="bg-gradient-to-r from-blue-950 to-indigo-950 border border-blue-800 rounded-2xl p-8 text-center">
              <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Credential Verified</h2>
              <p className="text-blue-300 mb-6">
                This credential has already been verified and is ready to use.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  <Share2 className="w-5 h-5" />
                  <span>Share Credential</span>
                </button>
                <button className="inline-flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ) : (
            /* Verification Needed */
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Verify Credential</h2>
                <p className="text-neutral-400 leading-relaxed">
                  Verify this credential against the IOTA Tangle to confirm its authenticity and integrity.
                </p>
              </div>

              {isVerifying ? (
                <div className="text-center">
                  <div className="inline-flex items-center space-x-3 bg-cyan-950 border border-cyan-800 rounded-xl p-6 mb-6">
                    <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <div className="text-cyan-400 font-bold">Verifying Credential...</div>
                      <div className="text-cyan-300 text-sm">Checking IOTA Tangle</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-neutral-400">
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Validating signature...</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Checking issuer authenticity...</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Confirming Tangle anchoring...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={handleVerify}
                    className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2 mx-auto"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Verify on IOTA Tangle</span>
                  </button>
                  <p className="text-neutral-500 text-sm mt-4">
                    This will check the credential against the IOTA Tangle for authenticity
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};