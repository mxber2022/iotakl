# Issue Credentials with IOTA Notarization

This page explains how to use IOTA Notarization to issue verifiable credentials on the IOTA blockchain.

## Overview

IOTA Notarization provides a robust foundation for credential issuance by creating immutable, timestamped records on the blockchain. Credentials can be issued as either **Locked** (immutable) or **Dynamic** (updatable) notarizations, depending on your use case.

## Credential Types

### 1. Locked Credentials (Immutable)
- **Use Case**: Academic degrees, professional certifications, birth certificates
- **Characteristics**: Cannot be modified after issuance
- **Benefits**: Maximum security and trust

### 2. Dynamic Credentials (Updatable)
- **Use Case**: Employment records, membership status, skill certifications
- **Characteristics**: Can be updated over time
- **Benefits**: Flexibility for evolving credential data

## Required Fields for Credential Issuance

### Essential Fields (Required)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **Credential Type** | `'dynamic' \| 'locked'` | Type of notarization | `'locked'` |
| **Credential Data** | `string \| Uint8Array` | The actual credential content | `"Bachelor of Science in Computer Science"` |
| **State Metadata** | `string` (optional) | Description of the credential data | `"Academic degree credential"` |

### Recommended Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **Immutable Description** | `string` | Permanent description of the credential | `"University of Example - Computer Science Degree"` |
| **Updatable Metadata** | `string` | Metadata that can be updated | `"Status: Active"` |

### Locking Configuration

#### For Locked Credentials:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **Delete Lock** | `{ type: 'unlockAt', timestamp: number }` | When credential can be destroyed | `{ type: 'unlockAt', timestamp: 1735689600 }` |

#### For Dynamic Credentials:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **Transfer Lock** | `{ type: 'none' \| 'unlockAt' \| 'untilDestroyed' }` | Transfer restrictions | `{ type: 'none' }` |

## UI Form Structure

```typescript
interface CredentialIssuanceForm {
  // Required
  credentialType: 'dynamic' | 'locked';
  credentialData: string | Uint8Array;
  stateMetadata?: string;
  
  // Recommended
  immutableDescription?: string;
  updatableMetadata?: string;
  
  // Locking configuration
  deleteLock?: {
    type: 'unlockAt';
    timestamp: number; // Unix timestamp
  };
  
  transferLock?: {
    type: 'none' | 'unlockAt' | 'untilDestroyed';
    timestamp?: number; // Required if type is 'unlockAt'
  };
}
```

## Implementation Examples

### Issuing a Locked Academic Credential

```typescript
import { NotarizationClient, TimeLock } from "@iota/notarization/node";

async function issueAcademicCredential() {
  const client = await getNotarizationClient();
  
  // Calculate deletion date (e.g., 50 years from now)
  const deleteUnlockAt = Math.round(Date.now() / 1000 + (50 * 365 * 24 * 60 * 60));
  
  const { output: credential } = await client
    .createLocked()
    .withStringState(
      JSON.stringify({
        degree: "Bachelor of Science",
        major: "Computer Science",
        university: "University of Example",
        graduationDate: "2024-05-15",
        studentId: "12345",
        gpa: "3.8"
      }),
      "Academic degree credential"
    )
    .withImmutableDescription("University of Example - Computer Science Degree")
    .withUpdatableMetadata("Status: Active")
    .withDeleteLock(TimeLock.withUnlockAt(deleteUnlockAt))
    .finish()
    .buildAndExecute(client);
    
  console.log("Academic credential issued:", credential.id);
  return credential;
}
```

### Issuing a Dynamic Employment Credential

```typescript
async function issueEmploymentCredential() {
  const client = await getNotarizationClient();
  
  const { output: credential } = await client
    .createDynamic()
    .withStringState(
      JSON.stringify({
        position: "Senior Software Engineer",
        company: "Tech Corp",
        startDate: "2023-01-15",
        department: "Engineering",
        employeeId: "EMP789"
      }),
      "Employment credential"
    )
    .withImmutableDescription("Tech Corp - Employment Record")
    .withUpdatableMetadata("Status: Active")
    .withTransferLock(TimeLock.none()) // Can be transferred freely
    .finish()
    .buildAndExecute(client);
    
  console.log("Employment credential issued:", credential.id);
  return credential;
}
```

### Updating a Dynamic Credential

```typescript
async function updateEmploymentCredential(credentialId: string) {
  const client = await getNotarizationClient();
  
  const { output: updatedCredential } = await client
    .updateState(credentialId)
    .withStringState(
      JSON.stringify({
        position: "Lead Software Engineer", // Updated position
        company: "Tech Corp",
        startDate: "2023-01-15",
        promotionDate: "2024-06-01", // New field
        department: "Engineering",
        employeeId: "EMP789"
      }),
      "Updated employment credential"
    )
    .buildAndExecute(client);
    
  console.log("Employment credential updated:", updatedCredential.id);
  return updatedCredential;
}
```

## Credential Verification

### Reading Credential Data

```typescript
import { NotarizationClientReadOnly } from "@iota/notarization/node";

async function verifyCredential(credentialId: string) {
  const readOnlyClient = await getReadOnlyClient();
  
  const credential = await readOnlyClient.getNotarization(credentialId);
  
  console.log("Credential ID:", credential.id);
  console.log("Credential Type:", credential.method);
  console.log("Credential Data:", credential.state.data.toString());
  console.log("State Metadata:", credential.state.metadata);
  console.log("Immutable Description:", credential.immutableMetadata.description);
  console.log("Updatable Metadata:", credential.updatableMetadata);
  console.log("Version Count:", credential.stateVersionCount);
  console.log("Last Updated:", new Date(credential.lastStateChangeAt));
  
  return credential;
}
```

## Best Practices

### 1. Data Structure
- Use JSON format for structured credential data
- Include essential fields like issuer, subject, issuance date
- Add version information for schema compatibility

### 2. Security Considerations
- Choose appropriate locking strategies
- Use meaningful immutable descriptions
- Consider data privacy and GDPR compliance

### 3. Credential Lifecycle
- Plan for credential revocation scenarios
- Consider credential expiration policies
- Implement proper access controls

### 4. UI/UX Guidelines
- Provide clear field descriptions
- Use appropriate input validation
- Show credential preview before issuance
- Display credential status and history

## Error Handling

```typescript
async function issueCredentialSafely(formData: CredentialIssuanceForm) {
  try {
    const client = await getNotarizationClient();
    
    // Validate required fields
    if (!formData.credentialData) {
      throw new Error("Credential data is required");
    }
    
    if (formData.credentialType === 'locked' && !formData.deleteLock) {
      throw new Error("Delete lock is required for locked credentials");
    }
    
    // Issue credential based on type
    if (formData.credentialType === 'locked') {
      return await issueLockedCredential(client, formData);
    } else {
      return await issueDynamicCredential(client, formData);
    }
    
  } catch (error) {
    console.error("Failed to issue credential:", error);
    throw new Error(`Credential issuance failed: ${error.message}`);
  }
}
```

## Integration with Existing Systems

### Web Application Integration

```typescript
// React component example
function CredentialIssuanceForm() {
  const [formData, setFormData] = useState<CredentialIssuanceForm>({
    credentialType: 'locked',
    credentialData: '',
    stateMetadata: '',
    immutableDescription: '',
    updatableMetadata: ''
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const credential = await issueCredentialSafely(formData);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Next Steps

1. **Set up your development environment** with IOTA Notarization
2. **Choose your credential type** based on your use case
3. **Design your credential schema** and data structure
4. **Implement the issuance flow** using the examples above
5. **Add verification capabilities** for credential validation
6. **Test thoroughly** with different credential scenarios

For more information, see the [IOTA Notarization Documentation](https://docs.iota.org/developer/iota-notarization) and [Examples](../examples/README.md). 