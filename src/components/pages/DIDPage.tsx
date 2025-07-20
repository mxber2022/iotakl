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

function CreateDIDComponent() {
  const [loading, setLoading] = useState(false);
  const [did, setDid] = useState<string | null>(null);
  const [jwk, setJwk] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [wasmReady, setWasmReady] = useState(false);

  useEffect(() => {
    identity.init('/identity_wasm_bg.wasm').then(() => setWasmReady(true));
  }, []);

  // const handleCreateDID = async () => {
  //   setLoading(true);
  //   setError(null);
  //   setDid(null);
  //   setJwk(null);
  //   try {
  //     if (!wasmReady) {
  //       setError('WASM not loaded yet. Please try again in a moment.');
  //       setLoading(false);
  //       return;
  //     }
  //     // Create JWK only after WASM is ready
      
  //     const EXAMPLE_JWK = new identity.Jwk({
  //       kty: identity.JwkType.Okp,
  //       crv: identity.EdCurve.Ed25519,
  //       x: "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo",
  //     });
  //     // Use 'rms' as the network HRP (Shimmer testnet)
  //     const networkHrp = 'rms';
  //     // Create a new DID document
  //     const document = new identity.IotaDocument(networkHrp);
  //     // Add a verification method using the hardcoded JWK
  //     const method = identity.VerificationMethod.newFromJwk(
  //       document.id(),
  //       EXAMPLE_JWK,
  //       '#key-1'
  //     );
  //     document.insertMethod(method, identity.MethodScope.VerificationMethod());
  //     // Optionally, attach a method relationship
  //     document.attachMethodRelationship(
  //       document.id().join('#key-1'),
  //       identity.MethodRelationship.Authentication
  //     );
  //     const service = new identity.Service({
  //       id: document.id().join("#linked-domain"),
  //       type: "LinkedDomains",
  //       serviceEndpoint: "https://iota.org/",
  //     });
  //     document.insertService(service);
    
  //     console.log(`Created document `, JSON.stringify(document.toJSON(), null, 2));

  //     setDid(document.id().toString());
  //     setJwk(EXAMPLE_JWK.toJSON());
  //     await initSdk();
  //     const iotaClient = new Client({
  //       primaryNode: "https://api.testnet.iota.cafe",
  //       localPow: true,
  //     });
  

  //   } catch (e: any) {
  //     setError(e.message || 'Failed to create DID');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCreateDID = async () => {
    try {
      // Load the WASM binary
      await initIdentityWasm();
      await identity.init(); // if identity namespace still needs init
      
      const EXAMPLE_JWK = new identity.Jwk({
        kty: identity.JwkType.Okp,
        crv: identity.EdCurve.Ed25519,
        x: "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo",
      });
      
      const networkHrp = "rms";
      const document = new IotaDocument(networkHrp);
  
      const method = VerificationMethod.newFromJwk(
        document.id(),
        EXAMPLE_JWK,
        "#key-1"
      );
      document.insertMethod(method, MethodScope.VerificationMethod());
      document.attachMethodRelationship(
        document.id().join("#key-1"),
        MethodRelationship.Authentication
      );
      const service = new Service({
        id: document.id().join("#linked-domain"),
        type: "LinkedDomains",
        serviceEndpoint: "https://iota.org/"
      });
      document.insertService(service);
  
      console.log("Prepared DID document:", document.toJSON());
  
       const iotaClient = new IotaClientInit({ primaryNode: "http://localhost", localPow: true });
       console.log("iotaClient: ", iotaClient)
       const didClient = new IotaIdentityClient(iotaClient);
  
      const { document: publishedDoc } = await didClient.publishDid(document);
      setDid(publishedDoc.id().toString());
      setJwk(EXAMPLE_JWK.toJSON());
    } catch (err: any) {
      setError(err.message);
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