# IOTA Passport - Move Smart Contracts

This directory contains Move smart contracts for the IOTA Passport platform, designed to run on IOTA ISC (IOTA Smart Contracts).

## Contracts

### Profile Contract (`profile_contract.move`)

The Profile Contract manages decentralized identity profiles on the IOTA blockchain. It allows users to create, update, and manage their profiles associated with their DIDs.

#### Features

- **Profile Creation**: Create profiles for individuals, organizations, or government entities
- **Profile Management**: Update profile information and manage profile status
- **DID Association**: Link profiles to Decentralized Identifiers (DIDs)
- **Access Control**: Only profile owners can modify their profiles
- **Event Emission**: Emit events for profile lifecycle changes
- **Validation**: Comprehensive input validation for all profile fields

#### Profile Types

1. **Individual** (`PROFILE_TYPE_INDIVIDUAL = 1`)
   - Personal profiles for individuals
   - Fields: name, email, website, description

2. **Organization** (`PROFILE_TYPE_ORGANIZATION = 2`)
   - Business or institutional profiles
   - Fields: name, email, website, description, organization_type
   - Organization Types: University, Company, Non-profit, Research Institute, Other

3. **Government** (`PROFILE_TYPE_GOVERNMENT = 3`)
   - Government entity profiles
   - Fields: name, email, website, description, government_level
   - Government Levels: Federal, State/Province, Local/Municipal, International

#### Functions

##### Public Entry Functions

- `create_profile()` - Create a new profile
- `update_profile()` - Update an existing profile
- `deactivate_profile()` - Deactivate a profile
- `reactivate_profile()` - Reactivate a deactivated profile

##### Public View Functions

- `get_profile_by_did()` - Get profile by DID
- `get_profiles_by_owner()` - Get all profiles owned by an address
- `get_total_profiles()` - Get total number of profiles

#### Data Structures

```move
struct Profile {
    did: String,
    profile_type: u8,
    name: String,
    email: String,
    website: String,
    description: String,
    organization_type: u8,
    government_level: u8,
    created_at: u64,
    updated_at: u64,
    is_active: bool,
    owner: address,
}
```

#### Events

- `ProfileCreated` - Emitted when a new profile is created
- `ProfileUpdated` - Emitted when a profile is updated
- `ProfileDeactivated` - Emitted when a profile is deactivated

#### Error Codes

- `E_PROFILE_ALREADY_EXISTS = 1` - Profile already exists for this DID
- `E_PROFILE_NOT_FOUND = 2` - Profile not found
- `E_INVALID_PROFILE_TYPE = 3` - Invalid profile type
- `E_INVALID_DID = 4` - Invalid DID format
- `E_UNAUTHORIZED = 5` - Unauthorized access
- `E_INVALID_NAME = 6` - Invalid name
- `E_INVALID_EMAIL = 7` - Invalid email format
- `E_INVALID_WEBSITE = 8` - Invalid website URL

## Building and Deploying

### Prerequisites

- [Wasp CLI](https://wasp-lang.dev/docs/getting-started/installation)
- [Move CLI](https://github.com/move-language/move)

### Build

```bash
# From the contracts directory
move build
```

### Test

```bash
# Run tests
move test
```

### Deploy

```bash
# Deploy to IOTA ISC testnet
wasp-cli chain deploy-contract profile_contract
```

## Integration with Frontend

The frontend can interact with this contract through:

1. **IOTA dApp Kit** - For wallet connection and transaction signing
2. **Wasp API** - For reading contract state and events
3. **Move SDK** - For direct contract interaction

### Example Usage

```typescript
// Create a profile
const createProfileTx = await client.callView({
    chainId: chainId,
    contractHName: profileContractHName,
    functionName: "create_profile",
    args: [
        didBytes,
        profileType,
        nameBytes,
        emailBytes,
        websiteBytes,
        descriptionBytes,
        organizationType,
        governmentLevel
    ]
});

// Get profile by DID
const profile = await client.callView({
    chainId: chainId,
    contractHName: profileContractHName,
    functionName: "get_profile_by_did",
    args: [didBytes]
});
```

## Security Considerations

- **Access Control**: Only profile owners can modify their profiles
- **Input Validation**: All inputs are validated before processing
- **Event Logging**: All profile changes are logged as events
- **State Management**: Profiles can be deactivated without deletion
- **DID Verification**: DIDs are validated before profile creation

## Future Enhancements

- [ ] Profile verification system
- [ ] Profile reputation scoring
- [ ] Profile linking and relationships
- [ ] Advanced access control (delegation)
- [ ] Profile templates and schemas
- [ ] Integration with credential issuance 