# University Document Notarization API Examples

This guide shows you how to use the API to notarize university documents via HTTP requests instead of command line.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd bindings/wasm/notarization_wasm
npm install express cors
```

### 2. Start the API Server
```bash
# Set environment variables
export IOTA_NOTARIZATION_PKG_ID=0x44b3af0c59d4f5fbbf2251787cacb2a5f6b8b4144f285b3a849e1cbe8ecef860
export NETWORK_URL=http://127.0.0.1:9000
export NETWORK_NAME_FAUCET=localnet

# Start the server
node api-server.js
```

The server will start on `http://localhost:3000`

## 📋 API Endpoints

### Health Check
```bash
curl http://localhost:3000/health
```

### Notarize University Degree
```bash
curl -X POST http://localhost:3000/api/notarize/degree \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### Notarize University Transcript
```bash
curl -X POST http://localhost:3000/api/notarize/transcript \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### Notarize University Certificate
```bash
curl -X POST http://localhost:3000/api/notarize/certificate \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### Verify Notarization
```bash
curl http://localhost:3000/api/verify/0x7fc36a3da1575abc96f13c8e7b295b1eac5f7b0b376b3916359365b3f73ba539
```

## 🔧 JavaScript/Node.js Examples

### Using fetch() (Browser/Node.js)
```javascript
// Notarize a degree
async function notarizeDegree() {
  const response = await fetch('http://localhost:3000/api/notarize/degree', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      studentName: "John Doe",
      studentId: "STU123456",
      degree: "Bachelor of Science in Computer Science",
      university: "Example University",
      graduationDate: "2024-05-15",
      gpa: "3.8",
      honors: "Magna Cum Laude"
    })
  });
  
  const result = await response.json();
  console.log('Notarization ID:', result.notarizationId);
  return result;
}

// Verify a notarization
async function verifyNotarization(notarizationId) {
  const response = await fetch(`http://localhost:3000/api/verify/${notarizationId}`);
  const result = await response.json();
  console.log('Verification result:', result);
  return result;
}
```

### Using axios
```javascript
const axios = require('axios');

// Notarize a transcript
async function notarizeTranscript() {
  try {
    const response = await axios.post('http://localhost:3000/api/notarize/transcript', {
      studentName: "Jane Smith",
      studentId: "STU789012",
      university: "Example University",
      totalCredits: 120,
      gpa: "3.9",
      academicYear: "2020-2024"
    });
    
    console.log('Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}
```

## 🌐 Python Examples

### Using requests
```python
import requests
import json

# Notarize a certificate
def notarize_certificate():
    url = "http://localhost:3000/api/notarize/certificate"
    data = {
        "recipientName": "Alice Johnson",
        "certificateType": "Professional Development Certificate",
        "program": "Advanced Software Engineering",
        "university": "Example University",
        "department": "Computer Science",
        "completionDate": "2024-03-15",
        "duration": "6 months",
        "grade": "Distinction"
    }
    
    response = requests.post(url, json=data)
    result = response.json()
    print(f"Notarization ID: {result['notarizationId']}")
    return result

# Verify a notarization
def verify_notarization(notarization_id):
    url = f"http://localhost:3000/api/verify/{notarization_id}"
    response = requests.get(url)
    result = response.json()
    print(f"Verification result: {result}")
    return result
```

## 🔄 Response Format

### Successful Notarization Response
```json
{
  "success": true,
  "notarizationId": "0x7fc36a3da1575abc96f13c8e7b295b1eac5f7b0b376b3916359365b3f73ba539",
  "documentType": "University Degree",
  "studentName": "John Doe",
  "degree": "Bachelor of Science in Computer Science",
  "university": "Example University",
  "graduationDate": "2024-05-15",
  "gpa": "3.8",
  "honors": "Magna Cum Laude",
  "creationDate": "2024-01-19T16:30:00.000Z",
  "deleteLockExpires": "2034-01-19T16:30:00.000Z",
  "verificationUrl": "http://localhost:3000/api/verify/0x7fc36a3da1575abc96f13c8e7b295b1eac5f7b0b376b3916359365b3f73ba539"
}
```

### Error Response
```json
{
  "error": "Missing required fields: studentName, degree, university, graduationDate",
  "details": "Validation failed"
}
```

## 🛡️ Security Considerations

### Environment Variables
Set these environment variables for production:
```bash
export IOTA_NOTARIZATION_PKG_ID=your_package_id
export NETWORK_URL=your_network_url
export NETWORK_NAME_FAUCET=your_faucet_name
export PORT=3000
```

### Authentication
For production use, add authentication:
```javascript
// Add middleware for API key authentication
app.use('/api', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

## 📱 Frontend Integration

### React Example
```jsx
import React, { useState } from 'react';

function NotarizationForm() {
  const [formData, setFormData] = useState({
    studentName: '',
    degree: '',
    university: '',
    graduationDate: ''
  });
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/api/notarize/degree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Student Name"
          value={formData.studentName}
          onChange={(e) => setFormData({...formData, studentName: e.target.value})}
        />
        {/* Add other form fields */}
        <button type="submit">Notarize Degree</button>
      </form>
      
      {result && (
        <div>
          <h3>Notarization Successful!</h3>
          <p>ID: {result.notarizationId}</p>
          <a href={result.verificationUrl}>Verify Document</a>
        </div>
      )}
    </div>
  );
}
```

## 🔍 Testing the API

### Test with curl
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test degree notarization
curl -X POST http://localhost:3000/api/notarize/degree \
  -H "Content-Type: application/json" \
  -d '{"studentName":"Test Student","degree":"BS CS","university":"Test University","graduationDate":"2024-01-01"}'
```

### Test with Postman
1. Import the collection
2. Set the base URL to `http://localhost:3000`
3. Send requests to test each endpoint

## 📊 Monitoring and Logs

The API server logs all requests and responses. Check the console output for:
- Command execution logs
- Error messages
- Notarization IDs
- Verification results

## 🚀 Production Deployment

For production deployment:
1. Use a process manager like PM2
2. Set up reverse proxy with nginx
3. Add SSL/TLS certificates
4. Implement rate limiting
5. Add comprehensive logging
6. Set up monitoring and alerting

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start api-server.js --name "university-notarization-api"

# Monitor
pm2 monit
``` 