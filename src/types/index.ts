// IOTA Passport Types
export interface CredentialType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'academic' | 'professional' | 'governmental' | 'event' | 'membership' | 'award' | 'iot';
  fields: CredentialField[];
  template: string;
  color: string;
}

export interface CredentialField {
  id: string;
  name: string;
  type: 'text' | 'date' | 'number' | 'boolean' | 'select' | 'file';
  required: boolean;
  options?: string[];
  validation?: string;
}

export interface Credential {
  id: string;
  type: string;
  title: string;
  description: string;
  issuer: Issuer;
  recipient: Recipient;
  issuedAt: Date;
  expiresAt?: Date;
  status: 'active' | 'revoked' | 'expired';
  data: Record<string, any>;
  hash: string;
  signature: string;
  tangleHash?: string;
  verificationCount: number;
  points: number;
  achievement?: string;
}

export interface Issuer {
  id: string;
  name: string;
  type: 'university' | 'company' | 'government' | 'organization' | 'event' | 'individual';
  did: string;
  publicKey: string;
  verified: boolean;
  reputation: number;
  logo?: string;
  website?: string;
  description?: string;
}

export interface Recipient {
  id: string;
  did: string;
  name?: string;
  email?: string;
}

export interface VerificationRequest {
  id: string;
  credentialId: string;
  verifierId: string;
  requestedFields: string[];
  purpose: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'denied';
}

export interface VerificationResult {
  valid: boolean;
  issuerValid: boolean;
  signatureValid: boolean;
  notRevoked: boolean;
  notExpired: boolean;
  tangleVerified: boolean;
  timestamp: Date;
  verifierId: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  category: string;
}

export interface UserWallet {
  userId: string;
  credentials: string[];
  verificationHistory: VerificationResult[];
  achievements: Achievement[];
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  privacySettings: PrivacySettings;
}

export interface PrivacySettings {
  autoApproveVerifications: boolean;
  shareMinimalData: boolean;
  logVerifications: boolean;
  allowAnalytics: boolean;
}

export interface IssuanceTemplate {
  id: string;
  name: string;
  description: string;
  credentialType: string;
  fields: TemplateField[];
  design: TemplateDesign;
  issuerId: string;
}

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'select' | 'file';
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max';
  value?: any;
  message: string;
}

export interface TemplateDesign {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  logo?: string;
  layout: 'standard' | 'compact' | 'detailed';
}

export interface TangleAnchor {
  hash: string;
  timestamp: Date;
  blockId: string;
  messageId: string;
  confirmed: boolean;
}

export interface RevocationEntry {
  credentialId: string;
  reason: string;
  timestamp: Date;
  tangleHash: string;
  issuerId: string;
}

// DID Management Types
export interface DIDDocument {
  id: string;
  controller: string;
  verificationMethod: VerificationMethod[];
  authentication: string[];
  assertionMethod: string[];
  keyAgreement: string[];
  capabilityInvocation: string[];
  capabilityDelegation: string[];
  service: ServiceEndpoint[];
  created: Date;
  updated: Date;
  deactivated?: boolean;
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyMultibase?: string;
  publicKeyJwk?: any;
}

export interface ServiceEndpoint {
  id: string;
  type: string;
  serviceEndpoint: string;
}

export interface DIDCreationRequest {
  method: 'iota' | 'key' | 'web';
  keyType: 'Ed25519' | 'secp256k1' | 'X25519';
  purpose: 'individual' | 'organization' | 'service' | 'device';
  metadata: {
    name?: string;
    description?: string;
    website?: string;
    email?: string;
  };
}

export interface DIDResolutionResult {
  didDocument: DIDDocument | null;
  didResolutionMetadata: {
    contentType: string;
    retrieved: Date;
    error?: string;
  };
  didDocumentMetadata: {
    created: Date;
    updated: Date;
    deactivated?: boolean;
    versionId?: string;
  };
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  keyType: string;
  keyId: string;
}

export interface DIDWallet {
  dids: DIDDocument[];
  keyPairs: KeyPair[];
  defaultDid?: string;
  backupPhrase?: string;
}