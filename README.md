# IOTA Passport

## Introduction

**IOTA Passport** is a decentralized solution for issuing, managing, and verifying all types of digital credentials—academic, professional, governmental, event-based, and more—using IOTA. The platform empowers individuals to control and share their verifiable credentials across institutions, employers, and organizations, without relying on centralized databases.

## Features

- **Multi-Issuer Support:** Universities, companies, government agencies, event organizers, and other trusted entities can issue credentials.
- **Universal Credential Types:** Supports degrees, certifications, licenses, permits, event badges, memberships, awards, IoT device credentials, and more.
- **User-Centric Wallet:** Individuals manage all their credentials in a secure digital wallet, with selective disclosure for privacy.
- **Instant, Trustless Verification:** Any verifier can instantly check the authenticity and integrity of credentials using IOTA’s Tangle and Trust Framework.
- **Move Smart Contracts:** Modular contracts manage credential issuance, revocation, and verification for security and extensibility.
- **Privacy & Security:** Credentials are stored off-chain; only hashes and minimal metadata are anchored on-chain for notarization.
- **Credential Revocation & Expiry:** Issuers can revoke or set expiration for credentials, with events notarized on the Tangle.

## Use Cases

- **Academic:** Degrees, transcripts, course completions
- **Professional:** Certifications, licenses, work experience, references
- **Governmental:** IDs, permits, health/vaccination certificates
- **Event-based:** Proof of attendance (POAP), conference badges, hackathon participation
- **Memberships:** Club, DAO, or community memberships
- **Awards & Achievements:** Prizes, honors, skill badges
- **IoT/Device Credentials:** Device authenticity, maintenance logs, compliance certificates

## How It Works

1. **Credential Issuance:**
   - An authorized issuer (university, company, government, etc.) creates and signs a verifiable credential (VC) for a recipient.
   - The hash of the VC is anchored to the IOTA Tangle for tamper-proof, timestamped proof (notarization).
   - The signed VC is delivered to the recipient’s digital wallet.

2. **Credential Presentation:**
   - Recipients present credentials to verifiers (employers, agencies, event organizers) via QR code or secure link.
   - Selective disclosure allows sharing only necessary information.

3. **Credential Verification:**
   - Verifiers hash the presented credential and check for its existence and timestamp on the IOTA Tangle.
   - The issuer’s signature is verified using the IOTA Trust Framework.

4. **Credential Revocation & Expiry:**
   - Issuers can anchor revocation or expiration events to the Tangle.
   - Verifiers check for both issuance and revocation/expiry hashes.

## Technical Architecture

- **Frontend:** Web/mobile app for individuals, issuers, and verifiers.
- **Move Smart Contracts:** Modular contracts for credential logic (issuance, revocation, verification).
- **IOTA Identity:** Handles DIDs and verifiable credentials.
- **IOTA Tangle:** Anchors credential and revocation hashes for notarization.
- **Trust Framework:** Verifies the authenticity of issuers and credentials.

## IOTA Notarization Flow

1. **Hashing:** The issuer hashes the credential data.
2. **Anchoring:** The hash is sent as a message to the IOTA Tangle, providing a timestamped, immutable record.
3. **Verification:** Anyone can hash the credential and check the Tangle for proof of existence and integrity.
4. **Revocation/Expiry:** Revocation or expiration events are also hashed and anchored for transparent invalidation.

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-org/iota-passport.git
   cd iota-passport
   ```
2. **Install Dependencies:**
   ```bash
   # For backend and smart contracts
   cargo build
   # For frontend
   npm install
   ```
3. **Run the Demo:**
   ```bash
   # Start backend
   cargo run
   # Start frontend
   npm start
   ```
4. **Try the Flow:**
   - Register as an issuer, individual, or verifier.
   - Issue, present, and verify credentials using the UI.
   - Check the IOTA Tangle for credential hashes.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

