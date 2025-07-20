import { DIDDocument, DIDCreationRequest, KeyPair, DIDWallet } from '../types';

export const sampleDIDs: DIDDocument[] = [
  {
    id: 'did:iota:main:0x1234567890abcdef',
    controller: 'did:iota:main:0x1234567890abcdef',
    verificationMethod: [
      {
        id: 'did:iota:main:0x1234567890abcdef#key-1',
        type: 'Ed25519VerificationKey2020',
        controller: 'did:iota:main:0x1234567890abcdef',
        publicKeyMultibase: 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
      }
    ],
    authentication: ['did:iota:main:0x1234567890abcdef#key-1'],
    assertionMethod: ['did:iota:main:0x1234567890abcdef#key-1'],
    keyAgreement: [],
    capabilityInvocation: ['did:iota:main:0x1234567890abcdef#key-1'],
    capabilityDelegation: [],
    service: [
      {
        id: 'did:iota:main:0x1234567890abcdef#credential-service',
        type: 'CredentialService',
        serviceEndpoint: 'https://credentials.example.com'
      }
    ],
    created: new Date('2024-01-15'),
    updated: new Date('2024-01-15'),
    deactivated: false
  }
];

export const mockKeyPairs: KeyPair[] = [
  {
    publicKey: 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK',
    privateKey: '***ENCRYPTED***',
    keyType: 'Ed25519',
    keyId: 'did:iota:main:0x1234567890abcdef#key-1'
  }
];

export const mockDIDWallet: DIDWallet = {
  dids: sampleDIDs,
  keyPairs: mockKeyPairs,
  defaultDid: 'did:iota:main:0x1234567890abcdef',
  backupPhrase: '***ENCRYPTED***'
};

export const didMethods = [
  {
    id: 'iota',
    name: 'IOTA DID',
    description: 'Decentralized identifiers on the IOTA Tangle',
    icon: '🌐',
    features: ['Fee-less', 'Scalable', 'Quantum-resistant'],
    recommended: true
  },
  {
    id: 'key',
    name: 'Key DID',
    description: 'Simple cryptographic key-based identifiers',
    icon: '🔑',
    features: ['Offline', 'Simple', 'Portable'],
    recommended: false
  },
  {
    id: 'web',
    name: 'Web DID',
    description: 'Domain-based decentralized identifiers',
    icon: '🌍',
    features: ['Domain-based', 'HTTP resolution', 'Familiar'],
    recommended: false
  }
];

export const keyTypes = [
  {
    id: 'Ed25519',
    name: 'Ed25519',
    description: 'High-performance elliptic curve signature scheme',
    icon: '🔐',
    features: ['Fast', 'Secure', 'Compact signatures'],
    recommended: true
  },
  {
    id: 'secp256k1',
    name: 'secp256k1',
    description: 'Bitcoin and Ethereum compatible curve',
    icon: '₿',
    features: ['Bitcoin compatible', 'Ethereum compatible', 'Widely supported'],
    recommended: false
  },
  {
    id: 'X25519',
    name: 'X25519',
    description: 'Elliptic curve for key agreement',
    icon: '🤝',
    features: ['Key agreement', 'Encryption', 'High performance'],
    recommended: false
  }
];

export const didPurposes = [
  {
    id: 'individual',
    name: 'Individual',
    description: 'Personal identity for individuals',
    icon: '👤',
    examples: ['Students', 'Professionals', 'Citizens']
  },
  {
    id: 'organization',
    name: 'Organization',
    description: 'Institutional identity for organizations',
    icon: '🏢',
    examples: ['Universities', 'Companies', 'Government agencies']
  },
  {
    id: 'service',
    name: 'Service',
    description: 'Identity for digital services and applications',
    icon: '⚙️',
    examples: ['APIs', 'Microservices', 'Applications']
  },
  {
    id: 'device',
    name: 'Device/IoT',
    description: 'Identity for IoT devices and hardware',
    icon: '📱',
    examples: ['Smart devices', 'Sensors', 'Hardware wallets']
  }
];