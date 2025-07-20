import React, { useState, useEffect } from 'react';
import { Key, Plus, Shield, Copy, Eye, EyeOff, Download, Upload, CheckCircle, AlertCircle, Trash2, Settings } from 'lucide-react';
import { didMethods, keyTypes, didPurposes, mockDIDWallet } from '../../data/didData';
import { DIDCreationRequest, DIDDocument } from '../../types';
// Import IOTA Identity WASM for browser
import * as identity from '@iota/identity-wasm/web';
import initSdk, { Client } from '@iota/sdk-wasm/web';
import init from "@iota/sdk-wasm/web";
import { init as initIdentityWasm, IotaDocument, VerificationMethod, Service, Jwk, MethodScope, MethodRelationship, IotaIdentityClient } from "@iota/identity-wasm/web";
import { Client as IotaClientInit } from "@iota/sdk-wasm/web";
import { CustomSelect } from '../ui/CustomSelect';

interface ProfileCreationComponentProps {
  did: string | null;
  onComplete: () => void;
}

function ProfileCreationComponent({ did, onComplete }: ProfileCreationComponentProps) {
  const [profileType, setProfileType] = useState<'individual' | 'organization' | 'government'>('individual');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    website: '',
    description: '',
    organizationType: '',
    governmentLevel: ''
  });
  const [step, setStep] = useState(1);
  const [profileCreated, setProfileCreated] = useState(false);

  const handleProfileSubmit = async () => {
    // Here you would typically save the profile data to your backend or local storage
    console.log('Profile created:', { did, profileType, profileData });
    
    // Show the final step with DID and profile info
    setProfileCreated(true);
    setStep(3);
  };

  const getProfileFields = () => {
    switch (profileType) {
      case 'individual':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all duration-200"
                placeholder="Enter your full name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all duration-200"
                placeholder="Enter your email address"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Bio/Description
              </label>
              <textarea
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all duration-200"
                placeholder="Tell us about yourself"
                rows={3}
                value={profileData.description}
                onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
        );
      
      case 'organization':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Organization Name *
              </label>
              <input
                type="text"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all duration-200"
                placeholder="Enter organization name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Organization Type
              </label>
              <CustomSelect
                value={profileData.organizationType}
                onChange={(value: string) => setProfileData(prev => ({ ...prev, organizationType: value }))}
                options={[
                  { value: 'university', label: 'University' },
                  { value: 'company', label: 'Company' },
                  { value: 'nonprofit', label: 'Non-profit' },
                  { value: 'research', label: 'Research Institute' },
                  { value: 'other', label: 'Other' }
                ]}
                placeholder="Select organization type"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Website
              </label>
              <input
                type="url"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all duration-200"
                placeholder="https://your-organization.com"
                value={profileData.website}
                onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Description
              </label>
              <textarea
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all duration-200"
                placeholder="Describe your organization"
                rows={3}
                value={profileData.description}
                onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
        );
      
      case 'government':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Government Entity Name *
              </label>
              <input
                type="text"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all duration-200"
                placeholder="Enter government entity name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Government Level
              </label>
              <CustomSelect
                value={profileData.governmentLevel}
                onChange={(value: string) => setProfileData(prev => ({ ...prev, governmentLevel: value }))}
                options={[
                  { value: 'federal', label: 'Federal' },
                  { value: 'state', label: 'State/Province' },
                  { value: 'local', label: 'Local/Municipal' },
                  { value: 'international', label: 'International' }
                ]}
                placeholder="Select government level"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Website
              </label>
              <input
                type="url"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all duration-200"
                placeholder="https://government-website.gov"
                value={profileData.website}
                onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Description
              </label>
              <textarea
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all duration-200"
                placeholder="Describe the government entity"
                rows={3}
                value={profileData.description}
                onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-neutral-950 border border-purple-800 rounded-2xl p-8">
      {step !== 3 && (
              <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <div className="text-3xl">👤</div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Create Your Profile</h2>
        <p className="text-neutral-400">Your DID has been created successfully! Now let's set up your profile.</p>
      </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Select Profile Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { type: 'individual', label: 'Individual', icon: '👤', description: 'Personal profile for individuals' },
                { type: 'organization', label: 'Organization', icon: '🏢', description: 'Business or institutional profile' },
                { type: 'government', label: 'Government', icon: '🏛️', description: 'Government entity profile' }
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => setProfileType(option.type as any)}
                  className={`p-6 rounded-xl border transition-all duration-200 text-left ${
                    profileType === option.type
                      ? 'bg-purple-900/50 border-purple-700 text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <div className="text-3xl mb-3">{option.icon}</div>
                  <h4 className="font-semibold mb-2">{option.label}</h4>
                  <p className="text-sm opacity-80">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
            {getProfileFields()}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="bg-neutral-800 text-white font-semibold py-3 px-6 rounded-xl hover:bg-neutral-700 transition-all duration-200"
            >
              Back
            </button>
            <button
              onClick={handleProfileSubmit}
              disabled={!profileData.name.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Create Profile
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Profile Created Successfully!</h3>
            <p className="text-neutral-400">Your DID and profile are now ready to use.</p>
          </div>

          <div className="bg-neutral-900 border border-green-800 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Your Identity Information</h4>
            
            <div className="space-y-4">
              <div>
                <span className="text-neutral-400 text-sm">DID:</span>
                <div className="text-white font-mono break-all text-sm bg-neutral-800 p-3 rounded-lg mt-1">
                  {did}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-neutral-400 text-sm">Profile Type:</span>
                  <div className="text-white font-semibold capitalize">
                    {profileType === 'individual' && '👤 Individual'}
                    {profileType === 'organization' && '🏢 Organization'}
                    {profileType === 'government' && '🏛️ Government'}
                  </div>
                </div>
                
                <div>
                  <span className="text-neutral-400 text-sm">Name:</span>
                  <div className="text-white font-semibold">{profileData.name}</div>
                </div>
                
                {profileData.email && (
                  <div>
                    <span className="text-neutral-400 text-sm">Email:</span>
                    <div className="text-white">{profileData.email}</div>
                  </div>
                )}
                
                {profileData.website && (
                  <div>
                    <span className="text-neutral-400 text-sm">Website:</span>
                    <div className="text-white">
                      <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">
                        {profileData.website}
                      </a>
                    </div>
                  </div>
                )}
                
                {profileData.organizationType && (
                  <div>
                    <span className="text-neutral-400 text-sm">Organization Type:</span>
                    <div className="text-white capitalize">{profileData.organizationType}</div>
                  </div>
                )}
                
                {profileData.governmentLevel && (
                  <div>
                    <span className="text-neutral-400 text-sm">Government Level:</span>
                    <div className="text-white capitalize">{profileData.governmentLevel}</div>
                  </div>
                )}
              </div>
              
              {profileData.description && (
                <div>
                  <span className="text-neutral-400 text-sm">Description:</span>
                  <div className="text-white mt-1 bg-neutral-800 p-3 rounded-lg">
                    {profileData.description}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            {/* <button
              onClick={() => {
                setStep(1);
                setProfileCreated(false);
                setProfileData({
                  name: '',
                  email: '',
                  website: '',
                  description: '',
                  organizationType: '',
                  governmentLevel: ''
                });
              }}
              className="bg-neutral-800 text-white font-semibold py-3 px-6 rounded-xl hover:bg-neutral-700 transition-all duration-200"
            >
              Create Another Profile
            </button>
            <button
              onClick={onComplete}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300"
            >
              Complete Setup
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
}

function CreateDIDComponent() {
  const [loading, setLoading] = useState(false);
  const [did, setDid] = useState<string | null>(null);
  const [jwk, setJwk] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [wasmReady, setWasmReady] = useState(false);
  const [showProfileCreation, setShowProfileCreation] = useState(false);

  useEffect(() => {
    identity.init('/identity_wasm_bg.wasm').then(() => setWasmReady(true));
  }, []);

  const handleCreateDID = async () => {
    setLoading(true);
    setError(null);
    setDid(null);
    setJwk(null);
    try {
      if (!wasmReady) {
        setError('WASM not loaded yet. Please try again in a moment.');
        setLoading(false);
        return;
      }
      // Create JWK only after WASM is ready
      
      const EXAMPLE_JWK = new identity.Jwk({
        kty: identity.JwkType.Okp,
        crv: identity.EdCurve.Ed25519,
        x: "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo",
      });
      // Use 'rms' as the network HRP (Shimmer testnet)
      const networkHrp = 'rms';
      // Create a new DID document
      const document = new identity.IotaDocument(networkHrp);
      // Add a verification method using the hardcoded JWK
      const method = identity.VerificationMethod.newFromJwk(
        document.id(),
        EXAMPLE_JWK,
        '#key-1'
      );
      document.insertMethod(method, identity.MethodScope.VerificationMethod());
      // Optionally, attach a method relationship
      document.attachMethodRelationship(
        document.id().join('#key-1'),
        identity.MethodRelationship.Authentication
      );
      const service = new identity.Service({
        id: document.id().join("#linked-domain"),
        type: "LinkedDomains",
        serviceEndpoint: "https://iota.org/",
      });
      document.insertService(service);
    
      console.log(`Created document `, JSON.stringify(document.toJSON(), null, 2));

      setDid(document.id().toString());
      setJwk(EXAMPLE_JWK.toJSON());
      setShowProfileCreation(true);
     // await initSdk();
      // const iotaClient = new Client({
      //   primaryNode: "https://api.testnet.iota.cafe",
      //   localPow: true,
      // });
  

    } catch (e: any) {
      setError(e.message || 'Failed to create DID');
    } finally {
      setLoading(false);
    }
  };


  const handleDownloadKeys = () => {
    if (!jwk) return;
    const blob = new Blob([JSON.stringify(jwk, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'iota-did-jwk.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {!showProfileCreation ? (
        <>
          <button
            onClick={handleCreateDID}
            disabled={loading || !wasmReady}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 disabled:opacity-60"
          >
            {loading ? 'Creating DID...' : 'Create New DID'}
          </button>
          {did && (
            <div className="bg-neutral-900 border border-purple-800 rounded-xl p-6 mt-4">
              <div className="mb-2 text-purple-300 font-semibold">Your new DID:</div>
              <div className="text-white font-mono break-all mb-2">{did}</div>
              <a
                href={`https://explorer.iota.org/testnet/identity-resolver/${did}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 underline"
              >
                View on IOTA Explorer
              </a>
              {jwk && (
                <div className="mt-4">
                  <button
                    onClick={handleDownloadKeys}
                    className="bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                  >
                    Download JWK (JSON)
                  </button>
                </div>
              )}
            </div>
          )}
          {error && <div className="text-red-400 font-semibold">{error}</div>}
        </>
      ) : (
        <ProfileCreationComponent did={did} onComplete={() => setShowProfileCreation(false)} />
      )}
    </div>
  );
}

export const DIDPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [creationStep, setCreationStep] = useState(1);
  const [creationData, setCreationData] = useState<Partial<DIDCreationRequest>>({
    method: 'iota',
    keyType: 'Ed25519',
    purpose: 'individual',
    metadata: {}
  });
  const [isCreating, setIsCreating] = useState(false);
  const [creationResult, setCreationResult] = useState<DIDDocument | null>(null);

  const handleCreateDID = async () => {
    setIsCreating(true);
    
    // Simulate DID creation process
    setTimeout(() => {
      const newDID: DIDDocument = {
        id: `did:${creationData.method}:main:0x${Math.random().toString(16).substr(2, 16)}`,
        controller: `did:${creationData.method}:main:0x${Math.random().toString(16).substr(2, 16)}`,
        verificationMethod: [
          {
            id: `did:${creationData.method}:main:0x${Math.random().toString(16).substr(2, 16)}#key-1`,
            type: `${creationData.keyType}VerificationKey2020`,
            controller: `did:${creationData.method}:main:0x${Math.random().toString(16).substr(2, 16)}`,
            publicKeyMultibase: `z${Math.random().toString(36).substr(2, 43)}`
          }
        ],
        authentication: [`did:${creationData.method}:main:0x${Math.random().toString(16).substr(2, 16)}#key-1`],
        assertionMethod: [`did:${creationData.method}:main:0x${Math.random().toString(16).substr(2, 16)}#key-1`],
        keyAgreement: [],
        capabilityInvocation: [`did:${creationData.method}:main:0x${Math.random().toString(16).substr(2, 16)}#key-1`],
        capabilityDelegation: [],
        service: [],
        created: new Date(),
        updated: new Date(),
        deactivated: false
      };
      
      setCreationResult(newDID);
      setIsCreating(false);
    }, 3000);
  };

  const resetCreation = () => {
    setCreationStep(1);
    setCreationData({
      method: 'iota',
      keyType: 'Ed25519',
      purpose: 'individual',
      metadata: {}
    });
    setCreationResult(null);
  };

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl text-sharp text-white">DID MANAGEMENT</h1>
          </div>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Create and manage your decentralized identifiers for secure credential interactions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 bg-neutral-950 border border-purple-900/30 rounded-xl p-1 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {[
            { key: 'create', label: 'Create DID', icon: Plus },
            { key: 'manage', label: 'Manage DIDs', icon: Settings }
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-purple-900/50 text-white shadow-lg'
                    : 'text-neutral-400 hover:text-white hover:bg-purple-900/20'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          {activeTab === 'create' && (
            <CreateDIDComponent />
          )}

          {activeTab === 'manage' && (
            <div className="space-y-8">
              {/* DID List */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl text-sharp text-white">Your DIDs</h3>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New DID</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {mockDIDWallet.dids.map((did, index) => (
                    <div
                      key={did.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            did.id === mockDIDWallet.defaultDid 
                              ? 'bg-purple-600' 
                              : 'bg-neutral-700'
                          }`}>
                            <Key className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">
                              {did.id === mockDIDWallet.defaultDid ? 'Default DID' : `DID ${index + 1}`}
                            </h4>
                            <p className="text-neutral-400 text-sm font-mono">{did.id}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors">
                            <Copy className="w-4 h-4 text-white" />
                          </button>
                          <button className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-white" />
                          </button>
                          <button className="p-2 bg-red-900 hover:bg-red-800 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-neutral-400">Created:</span>
                          <div className="text-white">{did.created.toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-neutral-400">Keys:</span>
                          <div className="text-white">{did.verificationMethod.length}</div>
                        </div>
                        <div>
                          <span className="text-neutral-400">Status:</span>
                          <div className={did.deactivated ? 'text-red-400' : 'text-green-400'}>
                            {did.deactivated ? 'Deactivated' : 'Active'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Management */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8">
                <h3 className="text-2xl text-sharp text-white mb-6">Key Management</h3>
                
                <div className="space-y-4">
                  {mockDIDWallet.keyPairs.map((keyPair, index) => (
                    <div
                      key={keyPair.keyId}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-white font-semibold">Key Pair {index + 1}</h4>
                          <p className="text-neutral-400 text-sm">{keyPair.keyType} Key</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                            className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
                          >
                            {showPrivateKey ? (
                              <EyeOff className="w-4 h-4 text-white" />
                            ) : (
                              <Eye className="w-4 h-4 text-white" />
                            )}
                          </button>
                          <button className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors">
                            <Copy className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-neutral-400">Public Key:</span>
                          <div className="text-white font-mono break-all">{keyPair.publicKey}</div>
                        </div>
                        <div>
                          <span className="text-neutral-400">Private Key:</span>
                          <div className="text-white font-mono">
                            {showPrivateKey ? keyPair.privateKey : '••••••••••••••••••••••••••••••••'}
                          </div>
                        </div>
                        <div>
                          <span className="text-neutral-400">Key ID:</span>
                          <div className="text-white font-mono text-xs break-all">{keyPair.keyId}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Backup & Recovery */}
              <div className="bg-gradient-to-r from-yellow-950 to-orange-950 border border-yellow-800 rounded-2xl p-8">
                <h3 className="text-2xl text-sharp text-white mb-6">Backup & Recovery</h3>
                <p className="text-yellow-200 mb-6">
                  Secure your DIDs and keys with encrypted backups. Store your recovery phrase safely.
                </p>
                
                <div className="flex items-center space-x-4">
                  <button className="inline-flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                    <Download className="w-5 h-5" />
                    <span>Export Backup</span>
                  </button>
                  <button className="inline-flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                    <Upload className="w-5 h-5" />
                    <span>Import Backup</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};