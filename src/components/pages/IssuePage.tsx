import React, { useState } from 'react';
import { Plus, Upload, CheckCircle, AlertCircle, Shield, Users, Award } from 'lucide-react';
import { credentialTypes } from '../../data/credentialData';
import { CustomSelect } from '../ui/CustomSelect';

export const IssuePage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [notarizationDetails, setNotarizationDetails] = useState<any>(null);

  const selectedCredentialType = credentialTypes.find(type => type.id === selectedType);

  const handleSubmit = async () => {
    if (!selectedType || !selectedCredentialType) return;
    
    setIsSubmitting(true);
    setResult(null);
    setNotarizationDetails(null);

    try {
      // Validate required fields
      const requiredFields = selectedCredentialType.fields.filter(field => field.required);
      const hasAllRequired = requiredFields.every(field => 
        formData[field.id] && formData[field.id].toString().trim() !== ''
      );
      
      if (!hasAllRequired || !formData.recipientName || !formData.recipientName.trim()) {
        console.error('Validation failed:', {
          hasAllRequired,
          recipientName: formData.recipientName,
          formData,
          requiredFields: requiredFields.map(f => ({ id: f.id, value: formData[f.id] }))
        });
        setResult('error');
        setIsSubmitting(false);
        return;
      }

      // Prepare notarization payload based on credential type
      let notarizationPayload;
      let apiEndpoint;

      if (selectedType === 'university-degree') {
        notarizationPayload = {
          studentName: formData.recipientName,
          degree: formData.degree,
          university: 'Demo University', // Using the hardcoded issuer name
          graduationDate: formData.graduationDate
        };
        apiEndpoint = 'http://localhost:3000/api/notarize/degree';
      } else {
        // For other credential types, use a generic structure
        notarizationPayload = {
          recipientName: formData.recipientName,
          credentialType: selectedCredentialType.name,
          issuer: 'Demo University',
          ...formData
        };
        apiEndpoint = 'http://localhost:3000/api/notarize/credential';
      }

      console.log('Sending notarization request:', {
        endpoint: apiEndpoint,
        payload: notarizationPayload
      });
      // Make API call to notarization service
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notarizationPayload),
      });

      if (response.ok) {
        const notarizationResult = await response.json();
        console.log('Notarization successful:', notarizationResult);
        setNotarizationDetails(notarizationResult);
        setResult('success');
      } else {
        const errorText = await response.text();
        console.error('Notarization failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        setResult('error');
      }
    } catch (error) {
      console.error('Error during notarization:', error);
      
      // Check if it's a network/fetch error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('Backend service not available. Please ensure the notarization service is running on http://localhost:3000');
      }
      
      setResult('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const resetForm = () => {
    setSelectedType('');
    setFormData({});
    setResult(null);
    setNotarizationDetails(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'from-blue-500/20 to-indigo-500/20 border-blue-500/30';
      case 'professional': return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'governmental': return 'from-red-500/20 to-pink-500/20 border-red-500/30';
      case 'event': return 'from-purple-500/20 to-violet-500/20 border-purple-500/30';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl text-sharp text-white">ISSUE CREDENTIALS</h1>
          </div>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Create and issue verifiable credentials to recipients using IOTA's decentralized infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Credential Type Selection */}
          <div className="space-y-6">
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 animate-slide-up">
              <h2 className="text-xl font-bold text-white mb-4">Select Credential Type</h2>
              <div className="space-y-3">
                {credentialTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                      selectedType === type.id
                        ? 'bg-cyan-900/50 border-cyan-700 text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{type.icon}</div>
                      <div>
                        <div className="font-semibold">{type.name}</div>
                        <div className="text-xs opacity-80">{type.category}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Issuer Info */}
            <div className="bg-gradient-to-r from-cyan-950 to-teal-950 border border-cyan-800 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Issuer Information</span>
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-cyan-300">Organization:</span>
                  <span className="text-white font-semibold">University of KL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-300">DID:</span>
                  <span className="text-white font-mono text-xs">did:iota:0xe...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-300">Verification:</span>
                  <span className="text-green-400 font-semibold">✓ Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-300">Reputation:</span>
                  <span className="text-white font-semibold">98%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Credential Form */}
          <div className="lg:col-span-2 space-y-6">
            {selectedCredentialType ? (
              <>
                {/* Form Header */}
                <div className={`bg-gradient-to-r ${getCategoryColor(selectedCredentialType.category)} rounded-2xl p-6 animate-slide-up`}>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{selectedCredentialType.icon}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedCredentialType.name}</h2>
                      <p className="text-white/80">{selectedCredentialType.description}</p>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
                  <h3 className="text-lg font-bold text-white mb-6">Credential Details</h3>
                  
                  <div className="space-y-6">
                    {/* Recipient Information */}
                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Recipient Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-neutral-300 mb-2">
                            Recipient Name *
                          </label>
                          <input
                            type="text"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20 transition-all duration-200"
                            placeholder="Enter recipient name"
                            value={formData.recipientName || ''}
                            onChange={(e) => handleFieldChange('recipientName', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-neutral-300 mb-2">
                            Recipient DID *
                          </label>
                          <input
                            type="text"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20 transition-all duration-200"
                            placeholder="did:iota:recipient:..."
                            value={formData.recipientDid || ''}
                            onChange={(e) => handleFieldChange('recipientDid', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Fields */}
                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Credential Fields</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCredentialType.fields.map((field) => (
                          <div key={field.id}>
                            <label className="block text-sm font-semibold text-neutral-300 mb-2">
                              {field.name} {field.required && '*'}
                            </label>
                            {field.type === 'select' ? (
                              <CustomSelect
                                value={formData[field.id] || ''}
                                onChange={(value: string) => handleFieldChange(field.id, value)}
                                options={field.options?.map(option => ({ value: option, label: option })) || []}
                                placeholder={`Select ${field.name}`}
                                className="w-full"
                                required={field.required}
                              />
                            ) : field.type === 'date' ? (
                              <input
                                type="date"
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20 transition-all duration-200"
                                value={formData[field.id] || ''}
                                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                              />
                            ) : field.type === 'number' ? (
                              <input
                                type="number"
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20 transition-all duration-200"
                                placeholder={`Enter ${field.name.toLowerCase()}`}
                                value={formData[field.id] || ''}
                                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                              />
                            ) : (
                              <input
                                type="text"
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20 transition-all duration-200"
                                placeholder={`Enter ${field.name.toLowerCase()}`}
                                value={formData[field.id] || ''}
                                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Result Display */}
                {result && (
                  <div className={`bg-gradient-to-r rounded-2xl p-6 animate-scale-in ${
                    result === 'success' 
                      ? 'from-green-950 to-emerald-950 border border-green-800' 
                      : 'from-red-950 to-pink-950 border border-red-800'
                  }`}>
                    <div className="flex items-center space-x-3 mb-4">
                      {result === 'success' ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red-400" />
                      )}
                      <h3 className={`text-lg font-bold ${
                        result === 'success' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {result === 'success' ? 'Credential Issued Successfully! 🎉' : 'Issuance Failed 💥'}
                      </h3>
                    </div>
                    <p className={`${
                      result === 'success' ? 'text-green-300' : 'text-red-300' 
                    } font-medium mb-4`}>
                      {result === 'success' 
                        ? 'The credential has been created and anchored to the IOTA Tangle. The recipient will receive it in their wallet.'
                        : 'Unable to connect to the notarization service. Please ensure the backend service is running on http://localhost:3000 and try again.'
                      }
                    </p>
                    {result === 'success' && (
                      <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                        <div className="text-green-300 text-sm space-y-2">
                          {notarizationDetails && (
                            <>
                              <div><strong>Notarization ID:</strong> <span className="font-mono text-xs">{notarizationDetails.notarizationId}</span></div>
                              <div><strong>Document Type:</strong> {notarizationDetails.documentType}</div>
                              <div><strong>Transaction Digest:</strong> <span className="font-mono text-xs">{notarizationDetails.transactionDigest}</span></div>
                              <div><strong>Created:</strong> {new Date(notarizationDetails.creationDate).toLocaleString()}</div>
                              <div><strong>Delete Lock Expires:</strong> {new Date(notarizationDetails.deleteLockExpires).toLocaleString()}</div>
                              <div className="pt-2 border-t border-green-600">
                                <strong>Verification URL:</strong>
                                <br />
                                <a 
                                  href={notarizationDetails.verificationUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-green-200 hover:text-green-100 underline font-mono text-xs break-all"
                                >
                                  {notarizationDetails.verificationUrl}
                                </a>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !selectedType}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-neutral-800 disabled:to-neutral-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Issuing Credential...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Issue Credential</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-semibold"
                  >
                    Reset
                  </button>
                </div>
              </>
            ) : (
              /* No Type Selected */
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-12 text-center animate-slide-up">
                <div className="text-6xl mb-4">📜</div>
                <h3 className="text-xl font-bold text-white mb-2">Select a Credential Type</h3>
                <p className="text-neutral-400">
                  Choose a credential type from the left panel to start issuing
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-neutral-950 to-neutral-900 border border-green-900/30 rounded-2xl p-8 text-center animate-slide-up">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl text-sharp text-white">Need Help with Issuance?</h2>
            <p className="text-xl text-neutral-300 leading-relaxed font-medium">
              Learn more about becoming a trusted issuer and setting up your organization 
              for credential issuance on the IOTA network.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
              <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide">
                <Shield className="w-4 h-4" />
                <span>BECOME AN ISSUER</span>
              </button>
              <button className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 border border-green-900/30 hover:border-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide">
                <Users className="w-4 h-4" />
                <span>VIEW DOCUMENTATION</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};