import React, { useState } from 'react';
import { ArrowLeft, Shield, CheckCircle, AlertCircle, Trophy, Share2, Download, Eye, Clock, Copy, QrCode, Link, Mail, MessageSquare } from 'lucide-react';
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
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

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

  const generateShareUrl = () => {
    // Generate a shareable URL for the credential
    const baseUrl = window.location.origin;
    return `${baseUrl}/credential/${credential.id}?share=true`;
  };

  const generateVerificationUrl = () => {
    // Generate a verification URL that can be used to verify the credential
    const baseUrl = window.location.origin;
    return `${baseUrl}/verify/${credential.hash}`;
  };

  const handleShare = async (method: 'copy' | 'qr' | 'link' | 'email' | 'message') => {
    const shareUrl = generateShareUrl();
    const verificationUrl = generateVerificationUrl();
    
    switch (method) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          setShareCopied(true);
          setTimeout(() => setShareCopied(false), 2000);
        } catch (err) {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = shareUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setShareCopied(true);
          setTimeout(() => setShareCopied(false), 2000);
        }
        break;
      
      case 'qr':
        // Generate QR code for sharing
        const qrData = JSON.stringify({
          type: 'credential',
          id: credential.id,
          hash: credential.hash,
          verificationUrl: verificationUrl,
          title: credential.title,
          issuer: credential.issuer.name
        });
        // You can implement QR code generation here
        console.log('QR Code Data:', qrData);
        break;
      
      case 'link':
        // Open verification URL in new tab
        window.open(verificationUrl, '_blank');
        break;
      
      case 'email':
        // Open email client with credential details
        const subject = encodeURIComponent(`Credential Verification: ${credential.title}`);
        const body = encodeURIComponent(`
Credential Details:
- Title: ${credential.title}
- Issuer: ${credential.issuer.name}
- Verification URL: ${verificationUrl}
- Credential Hash: ${credential.hash}
        `);
        window.open(`mailto:?subject=${subject}&body=${body}`);
        break;
      
      case 'message':
        // For mobile devices, this could open SMS or messaging apps
        if (navigator.share) {
          try {
            await navigator.share({
              title: credential.title,
              text: `Check out my verified credential: ${credential.title} from ${credential.issuer.name}`,
              url: verificationUrl
            });
          } catch (err) {
            console.log('Share cancelled or failed');
          }
        } else {
          // Fallback to copy
          handleShare('copy');
        }
        break;
    }
  };

  const handleDownload = () => {
    // Generate a downloadable version of the credential
    const credentialData = {
      ...credential,
      shareUrl: generateShareUrl(),
      verificationUrl: generateVerificationUrl(),
      downloadedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(credentialData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${credential.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_credential.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            <button
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="p-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <Share2 className="w-5 h-5 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Share Options Dropdown */}
        {showShareOptions && (
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 mb-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Share Credential</h3>
              <button
                onClick={() => setShowShareOptions(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <button
                onClick={() => handleShare('copy')}
                className="flex flex-col items-center space-y-2 p-4 bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Copy className="w-6 h-6 text-cyan-400" />
                <span className="text-sm text-neutral-300">
                  {shareCopied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
              
              <button
                onClick={() => handleShare('qr')}
                className="flex flex-col items-center space-y-2 p-4 bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <QrCode className="w-6 h-6 text-purple-400" />
                <span className="text-sm text-neutral-300">QR Code</span>
              </button>
              
              <button
                onClick={() => handleShare('link')}
                className="flex flex-col items-center space-y-2 p-4 bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Link className="w-6 h-6 text-green-400" />
                <span className="text-sm text-neutral-300">Open Link</span>
              </button>
              
              <button
                onClick={() => handleShare('email')}
                className="flex flex-col items-center space-y-2 p-4 bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Mail className="w-6 h-6 text-blue-400" />
                <span className="text-sm text-neutral-300">Email</span>
              </button>
              
              <button
                onClick={() => handleShare('message')}
                className="flex flex-col items-center space-y-2 p-4 bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <MessageSquare className="w-6 h-6 text-pink-400" />
                <span className="text-sm text-neutral-300">Message</span>
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-neutral-900 rounded-lg">
              <div className="text-xs text-neutral-400 mb-2">Verification URL:</div>
              <div className="text-sm text-white font-mono break-all">
                {generateVerificationUrl()}
              </div>
            </div>
          </div>
        )}

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
                    <span className="text-neutral-400 mr-4">Organization:</span>
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
              
              <div className="flex items-center justify-center space-x-4 mt-6">
                <button
                  onClick={() => setShowShareOptions(true)}
                  className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Credential</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </button>
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
                <button
                  onClick={() => setShowShareOptions(true)}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Credential</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
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
                  
                  <div className="flex items-center justify-center space-x-4 mt-6">
                    <button
                      onClick={() => setShowShareOptions(true)}
                      className="inline-flex items-center space-x-2 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share Credential</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};