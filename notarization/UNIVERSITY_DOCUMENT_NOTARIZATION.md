# University Document Notarization Guide

This guide explains how to notarize university documents like degrees, transcripts, and certificates using IOTA Notarization for permanent, tamper-proof verification.

## 🎓 Overview

University document notarization creates immutable, blockchain-verified records of academic credentials that can be:
- **Verified instantly** by anyone worldwide
- **Never altered** or tampered with
- **Permanently stored** on the IOTA blockchain
- **Trusted** without requiring third-party verification

## 📋 Types of University Documents

### 1. **University Degrees** 🎓
- Bachelor's, Master's, Doctoral degrees
- Professional degrees (MD, JD, MBA)
- Honorary degrees
- Postgraduate diplomas

### 2. **Academic Transcripts** 📚
- Complete course records
- Grade point averages
- Credit hours completed
- Course descriptions and grades

### 3. **Certificates** 🏆
- Professional development certificates
- Continuing education certificates
- Specialized training certificates
- Workshop completion certificates

## 🚀 How to Notarize University Documents

### Step 1: Prepare Your Document Data

Create a structured JSON object with all relevant information:

```typescript
const degreeData = {
    studentName: "John Doe",
    studentId: "STU123456",
    degree: "Bachelor of Science in Computer Science",
    university: "Example University",
    graduationDate: "2024-05-15",
    gpa: "3.8",
    honors: "Magna Cum Laude",
    major: "Computer Science",
    minor: "Mathematics",
    academicYear: "2020-2024",
    registrarSignature: "Dr. Jane Smith, Registrar",
    universitySeal: "Example University Official Seal"
};
```

### Step 2: Run the Notarization

Use your private key to create the notarization:

```bash
# Switch to your key
iota client switch --address busy-crocidolite

# Run the university degree notarization
cd ../../bindings/wasm/notarization_wasm
IOTA_NOTARIZATION_PKG_ID=0xcca53c982c85a12e7d77638c4ed43e4c11a7c9e4fce4e85f4a45919eee879fb0 NETWORK_URL=http://127.0.0.1:58129 NETWORK_NAME_FAUCET=localnet npm run example:node -- university_degree
```

### Step 3: Get Your Notarization ID

After successful notarization, you'll receive:
- **Notarization ID**: Unique identifier for verification
- **Creation timestamp**: When the document was notarized
- **Verification information**: Complete details for verification

## 📊 Document Structure Examples

### University Degree
```json
{
    "studentName": "John Doe",
    "studentId": "STU123456",
    "degree": "Bachelor of Science in Computer Science",
    "university": "Example University",
    "graduationDate": "2024-05-15",
    "gpa": "3.8",
    "honors": "Magna Cum Laude",
    "major": "Computer Science",
    "minor": "Mathematics",
    "academicYear": "2020-2024",
    "registrarSignature": "Dr. Jane Smith, Registrar",
    "universitySeal": "Example University Official Seal"
}
```

### Academic Transcript
```json
{
    "studentName": "Jane Smith",
    "studentId": "STU789012",
    "university": "Example University",
    "academicYear": "2020-2024",
    "totalCredits": 120,
    "gpa": "3.9",
    "courses": [
        {
            "courseCode": "CS101",
            "courseName": "Introduction to Computer Science",
            "credits": 3,
            "grade": "A",
            "semester": "Fall 2020"
        }
    ],
    "registrarSignature": "Dr. John Doe, Registrar",
    "issueDate": "2024-05-15"
}
```

### Professional Certificate
```json
{
    "recipientName": "Alice Johnson",
    "certificateType": "Professional Development Certificate",
    "program": "Advanced Software Engineering",
    "university": "Example University",
    "department": "Computer Science",
    "completionDate": "2024-03-15",
    "duration": "6 months",
    "instructor": "Dr. Robert Wilson",
    "programDirector": "Prof. Sarah Brown",
    "certificateNumber": "CERT-2024-001",
    "skills": ["Software Architecture", "Design Patterns", "Agile Development", "DevOps"],
    "grade": "Distinction"
}
```

## 🔍 Verification Process

### For Students/Graduates
1. **Save your Notarization ID** from the creation process
2. **Share the ID** with employers, institutions, or verification services
3. **Provide verification instructions** to anyone who needs to verify your credentials

### For Employers/Institutions
1. **Use the Notarization ID** to query the IOTA blockchain
2. **Verify the document content** matches what was presented
3. **Check the creation timestamp** and university signatures
4. **Confirm the document is locked** and cannot be altered

## 🛡️ Security Features

### Immutable Records
- **Locked notarizations** cannot be modified after creation
- **Permanent storage** on the IOTA blockchain
- **Tamper-proof** verification through cryptographic signatures

### Long-term Preservation
- **10-year delete locks** ensure documents are preserved
- **Multiple verification methods** available
- **Global accessibility** for verification

### Privacy Protection
- **No personal data** stored in plain text on the blockchain
- **Encrypted content** with controlled access
- **Verification without exposure** of sensitive information

## 📱 Available Examples

Run these examples to see different types of university document notarization:

```bash
# University Degree
npm run example:node -- university_degree

# Academic Transcript
npm run example:node -- university_transcript

# Professional Certificate
npm run example:node -- university_certificate
```

## 🎯 Best Practices

### For Universities
1. **Standardize document formats** across all departments
2. **Include official signatures** and university seals
3. **Use consistent metadata** for easy verification
4. **Maintain backup records** of all notarized documents

### For Students
1. **Keep your Notarization ID safe** - it's your proof of credentials
2. **Share verification instructions** with employers
3. **Verify your own documents** periodically
4. **Backup your verification information**

### For Employers
1. **Always verify credentials** using the Notarization ID
2. **Check creation timestamps** for authenticity
3. **Verify university signatures** and seals
4. **Use official verification channels** when available

## 🔧 Technical Requirements

### Prerequisites
- IOTA CLI installed and configured
- Local IOTA node running
- Notarization package deployed
- Your private key in the keytool

### Environment Variables
```bash
IOTA_NOTARIZATION_PKG_ID=0xcca53c982c85a12e7d77638c4ed43e4c11a7c9e4fce4e85f4a45919eee879fb0
NETWORK_URL=http://127.0.0.1:58129
NETWORK_NAME_FAUCET=localnet
```

## 📞 Support

For technical support or questions about university document notarization:
- Check the IOTA Notarization documentation
- Review the example code in the repository
- Contact your university's IT department for integration support

---

**Note**: This guide assumes you have a local IOTA node running with the notarization package deployed. For production use, consider using the IOTA testnet or mainnet with appropriate security measures. 