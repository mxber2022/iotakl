import { Credential, CredentialType, Achievement, Issuer } from '../types';

export const credentialTypes: CredentialType[] = [
  {
    id: 'university-degree',
    name: 'University Degree',
    description: 'Bachelor\'s, Master\'s, or Doctoral degree certificates',
    icon: '🎓',
    category: 'academic',
    fields: [
      { id: 'degree', name: 'Degree Type', type: 'select', required: true, options: ['Bachelor', 'Master', 'Doctorate'] },
      { id: 'major', name: 'Major/Field of Study', type: 'text', required: true },
      { id: 'gpa', name: 'GPA', type: 'number', required: false },
      { id: 'graduationDate', name: 'Graduation Date', type: 'date', required: true }
    ],
    template: 'academic-standard',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'professional-certification',
    name: 'Professional Certification',
    description: 'Industry certifications and professional qualifications',
    icon: '📜',
    category: 'professional',
    fields: [
      { id: 'certification', name: 'Certification Name', type: 'text', required: true },
      { id: 'level', name: 'Level', type: 'select', required: false, options: ['Basic', 'Intermediate', 'Advanced', 'Expert'] },
      { id: 'score', name: 'Score', type: 'number', required: false },
      { id: 'validUntil', name: 'Valid Until', type: 'date', required: false }
    ],
    template: 'professional-standard',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'government-id',
    name: 'Government ID',
    description: 'Official government-issued identification documents',
    icon: '🆔',
    category: 'governmental',
    fields: [
      { id: 'idType', name: 'ID Type', type: 'select', required: true, options: ['Passport', 'Driver License', 'National ID'] },
      { id: 'idNumber', name: 'ID Number', type: 'text', required: true },
      { id: 'issuedDate', name: 'Issued Date', type: 'date', required: true },
      { id: 'expiryDate', name: 'Expiry Date', type: 'date', required: true }
    ],
    template: 'government-standard',
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'event-attendance',
    name: 'Event Attendance',
    description: 'Proof of attendance for conferences, workshops, and events',
    icon: '🎫',
    category: 'event',
    fields: [
      { id: 'eventName', name: 'Event Name', type: 'text', required: true },
      { id: 'role', name: 'Role', type: 'select', required: true, options: ['Attendee', 'Speaker', 'Organizer', 'Sponsor'] },
      { id: 'eventDate', name: 'Event Date', type: 'date', required: true },
      { id: 'location', name: 'Location', type: 'text', required: false }
    ],
    template: 'event-standard',
    color: 'from-purple-500 to-pink-500'
  }
];

export const issuers: Issuer[] = [
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    type: 'university',
    did: 'did:iota:mit:12345',
    publicKey: '0x1234567890abcdef',
    verified: true,
    reputation: 98,
    logo: '🏛️',
    website: 'https://mit.edu',
    description: 'Leading research university'
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    type: 'company',
    did: 'did:iota:aws:67890',
    publicKey: '0xabcdef1234567890',
    verified: true,
    reputation: 95,
    logo: '☁️',
    website: 'https://aws.amazon.com',
    description: 'Cloud computing platform'
  },
  {
    id: 'us-gov',
    name: 'United States Government',
    type: 'government',
    did: 'did:iota:usgov:54321',
    publicKey: '0x567890abcdef1234',
    verified: true,
    reputation: 99,
    logo: '🏛️',
    website: 'https://usa.gov',
    description: 'Federal government of the United States'
  }
];

export const credentials: Credential[] = [
  {
    id: 'degree-cs-mit',
    type: 'university-degree',
    title: 'Bachelor of Science in Computer Science',
    description: 'Undergraduate degree in Computer Science from MIT',
    issuer: issuers[0],
    recipient: {
      id: 'user-1',
      did: 'did:iota:user:alice',
      name: 'Alice Johnson',
      email: 'alice@example.com'
    },
    issuedAt: new Date('2023-06-15'),
    expiresAt: undefined,
    status: 'active',
    data: {
      degree: 'Bachelor',
      major: 'Computer Science',
      gpa: 3.8,
      graduationDate: '2023-06-15'
    },
    hash: '0xabc123def456',
    signature: '0x789xyz012',
    tangleHash: 'tangle:abc123',
    verificationCount: 15,
    points: 500,
    achievement: 'Academic Excellence'
  },
  {
    id: 'aws-cert-solutions-architect',
    type: 'professional-certification',
    title: 'AWS Certified Solutions Architect',
    description: 'Professional certification for cloud architecture',
    issuer: issuers[1],
    recipient: {
      id: 'user-1',
      did: 'did:iota:user:alice',
      name: 'Alice Johnson',
      email: 'alice@example.com'
    },
    issuedAt: new Date('2024-01-20'),
    expiresAt: new Date('2027-01-20'),
    status: 'active',
    data: {
      certification: 'AWS Certified Solutions Architect - Associate',
      level: 'Associate',
      score: 850,
      validUntil: '2027-01-20'
    },
    hash: '0xdef456ghi789',
    signature: '0x345abc678',
    tangleHash: 'tangle:def456',
    verificationCount: 8,
    points: 300,
    achievement: 'Cloud Expert'
  },
  {
    id: 'passport-us',
    type: 'government-id',
    title: 'US Passport',
    description: 'United States passport for international travel',
    issuer: issuers[2],
    recipient: {
      id: 'user-1',
      did: 'did:iota:user:alice',
      name: 'Alice Johnson',
      email: 'alice@example.com'
    },
    issuedAt: new Date('2022-03-10'),
    expiresAt: new Date('2032-03-10'),
    status: 'active',
    data: {
      idType: 'Passport',
      idNumber: 'US123456789',
      issuedDate: '2022-03-10',
      expiryDate: '2032-03-10'
    },
    hash: '0xghi789jkl012',
    signature: '0x901def234',
    tangleHash: 'tangle:ghi789',
    verificationCount: 25,
    points: 200,
    achievement: 'Identity Verified'
  }
];

export const achievements: Achievement[] = [
  {
    id: 'academic-excellence',
    name: 'Academic Excellence',
    description: 'Earned a degree with high academic performance',
    icon: '🎓',
    rarity: 'rare',
    category: 'Academic'
  },
  {
    id: 'cloud-expert',
    name: 'Cloud Expert',
    description: 'Achieved professional cloud certification',
    icon: '☁️',
    rarity: 'epic',
    category: 'Professional'
  },
  {
    id: 'identity-verified',
    name: 'Identity Verified',
    description: 'Successfully verified government-issued identity',
    icon: '✅',
    rarity: 'common',
    category: 'Verification'
  },
  {
    id: 'credential-collector',
    name: 'Credential Collector',
    description: 'Collected 10 or more verified credentials',
    icon: '📚',
    rarity: 'rare',
    category: 'Achievement'
  },
  {
    id: 'trust-builder',
    name: 'Trust Builder',
    description: 'Maintained 100% verification success rate',
    icon: '🛡️',
    rarity: 'legendary',
    category: 'Trust'
  }
];

export const mockUserData = {
  userId: 'user-1',
  credentials: [
    'degree-cs-mit',
    'aws-cert-solutions-architect',
    'passport-us'
  ],
  verificationHistory: [],
  achievements: [achievements[0]],
  totalPoints: 1000,
  currentStreak: 5,
  longestStreak: 12,
  lastActiveDate: new Date(),
  privacySettings: {
    autoApproveVerifications: false,
    shareMinimalData: true,
    logVerifications: true,
    allowAnalytics: false
  }
};