# IOTA Passport

## Introduction

**IOTA Passport** is a decentralized solution for issuing, managing, and verifying all types of digital credentials—academic, professional, governmental, event-based, and more—using IOTA. The platform empowers individuals to control and share their verifiable credentials across institutions, employers, and organizations, without relying on centralized databases.

## Features

- **Multi-Issuer Support:** Universities, companies, government agencies, event organizers, and other trusted entities can issue credentials.
- **Universal Credential Types:** Supports degrees, certifications, licenses, permits, event badges, memberships, awards, IoT device credentials, and more.
- **User-Centric Wallet:** Individuals manage all their credentials in a secure digital wallet, with selective disclosure for privacy.
- **Instant, Trustless Verification:** Any verifier can instantly check the authenticity and integrity of credentials using IOTA's Tangle and Trust Framework.
- **Move Smart Contracts:** Modular contracts manage credential issuance, revocation, and verification for security and extensibility.
- **Privacy & Security:** Credentials are stored off-chain; only hashes and minimal metadata are anchored on-chain for notarization.
- **Credential Revocation & Expiry:** Issuers can revoke or set expiration for credentials, with events notarized on the Tangle.
- **IOTA dApp Kit Integration:** Seamless wallet connection and blockchain interaction using IOTA's official dApp Kit.
- **DID Management:** Create and manage Decentralized Identifiers (DIDs) with IOTA Identity WASM.
- **Profile Creation:** Set up individual, organization, or government profiles after DID creation.
- **Custom UI Components:** Modern, responsive interface with custom dropdowns and form components.

## Use Cases

- **Academic:** Degrees, transcripts, course completions
- **Professional:** Certifications, licenses, work experience, references
- **Governmental:** IDs, permits, health/vaccination certificates
- **Event-based:** Proof of attendance (POAP), conference badges, hackathon participation
- **Memberships:** Club, DAO, or community memberships
- **Awards & Achievements:** Prizes, honors, skill badges
- **IoT/Device Credentials:** Device authenticity, maintenance logs, compliance certificates

## How It Works

1. **DID Creation & Profile Setup:**
   - Users create Decentralized Identifiers (DIDs) using IOTA Identity WASM
   - Profile creation flow allows users to set up as individual, organization, or government entity
   - DIDs are published to the IOTA Tangle for global resolvability

2. **Credential Issuance:**
   - An authorized issuer (university, company, government, etc.) creates and signs a verifiable credential (VC) for a recipient.
   - The hash of the VC is anchored to the IOTA Tangle for tamper-proof, timestamped proof (notarization).
   - The signed VC is delivered to the recipient's digital wallet.

3. **Credential Presentation:**
   - Recipients present credentials to verifiers (employers, agencies, event organizers) via QR code or secure link.
   - Selective disclosure allows sharing only necessary information.

4. **Credential Verification:**
   - Verifiers hash the presented credential and check for its existence and timestamp on the IOTA Tangle.
   - The issuer's signature is verified using the IOTA Trust Framework.

5. **Credential Revocation & Expiry:**
   - Issuers can anchor revocation or expiration events to the Tangle.
   - Verifiers check for both issuance and revocation/expiry hashes.

## Technical Architecture

- **Frontend:** React-based web application with TypeScript
- **Wallet Integration:** IOTA dApp Kit for wallet connection and blockchain interaction
- **DID Management:** IOTA Identity WASM for DID creation and management
- **Move Smart Contracts:** Modular contracts for credential logic (issuance, revocation, verification).
- **IOTA Identity:** Handles DIDs and verifiable credentials.
- **IOTA Tangle:** Anchors credential and revocation hashes for notarization.
- **Trust Framework:** Verifies the authenticity of issuers and credentials.
- **UI Components:** Custom React components for consistent, modern interface

## Project Structure

```
src/
├── components/
│   ├── pages/           # Main page components
│   │   ├── HomePage.tsx
│   │   ├── DIDPage.tsx  # DID creation and management
│   │   ├── IssuePage.tsx # Credential issuance
│   │   └── CredentialsPage.tsx
│   ├── ui/              # Reusable UI components
│   │   ├── CustomSelect.tsx
│   │   └── ...
│   └── layout/          # Layout components
├── data/                # Mock data and configurations
├── types/               # TypeScript type definitions
└── hooks/               # Custom React hooks
```

## Key Components

### DID Management
- **DID Creation:** Uses IOTA Identity WASM to create DIDs on Shimmer testnet
- **Profile Setup:** Three-step flow for individual, organization, or government profiles
- **Custom UI:** Modern interface with custom dropdowns and form validation

### Credential Issuance
- **Multiple Credential Types:** University degrees, professional certifications, government IDs, event attendance
- **Dynamic Forms:** Form fields adapt based on credential type
- **Custom Select Components:** Enhanced dropdown experience

### Wallet Integration
- **IOTA dApp Kit:** Official wallet connection and blockchain interaction
- **Auto-connect:** Persistent wallet connections
- **Multiple Wallet Support:** Compatible with various IOTA wallets

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-org/iota-passport.git
   cd iota-passport
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set up WASM Files:**
   ```bash
   # Copy IOTA Identity WASM file to public directory
   cp node_modules/@iota/identity-wasm/web/identity_wasm_bg.wasm public/
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Try the Features:**
   - **DID Creation:** Navigate to DID Management and create a new DID
   - **Profile Setup:** Complete the profile creation flow after DID creation
   - **Wallet Connection:** Connect your IOTA wallet using the header
   - **Credential Issuance:** Issue different types of credentials
   - **Custom UI:** Experience the enhanced dropdown and form components

## Dependencies

- **React 18** with TypeScript
- **IOTA dApp Kit** for wallet integration
- **IOTA Identity WASM** for DID management
- **IOTA SDK WASM** for blockchain interaction
- **Lucide React** for icons
- **Tailwind CSS** for styling

## Development

### Key Features Implemented
- ✅ IOTA dApp Kit wallet integration
- ✅ DID creation with IOTA Identity WASM
- ✅ Profile creation flow (Individual/Organization/Government)
- ✅ Custom UI components (CustomSelect, etc.)
- ✅ Responsive design with dark theme
- ✅ TypeScript support throughout

### Next Steps
- [ ] Backend API integration for credential management
- [ ] Move smart contract deployment
- [ ] Credential verification flow
- [ ] Advanced wallet features
- [ ] Mobile app development

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

