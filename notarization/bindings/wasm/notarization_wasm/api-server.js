// Copyright 2025 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration
const NOTARIZATION_PKG_ID = process.env.IOTA_NOTARIZATION_PKG_ID || "0x07c91ae86e3d0fe11a46a69847308819f4d9e77a4f3d57a01d449a7951cea756";
const NETWORK_URL = process.env.NETWORK_URL || "http://127.0.0.1:9000";
const NETWORK_NAME_FAUCET = process.env.NETWORK_NAME_FAUCET || "localnet";

// Helper function to execute shell commands
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd: path.join(__dirname, '../../../notarization-move/scripts') }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.warn(`Command stderr: ${stderr}`);
            }
            resolve(stdout);
        });
    });
}

// Helper function to extract notarization ID from output
function extractNotarizationId(output) {
    // Try multiple patterns to extract the notarization ID
    const patterns = [
        /notarization_id.*?0x[a-fA-F0-9]{64}/,
        /0x[a-fA-F0-9]{64}.*?notarization_id/,
        /ObjectID: (0x[a-fA-F0-9]{64})/,
        /ID: (0x[a-fA-F0-9]{64})/
    ];
    
    for (const pattern of patterns) {
        const match = output.match(pattern);
        if (match) {
            // Extract the hex ID from the match
            const hexMatch = match[0].match(/0x[a-fA-F0-9]{64}/);
            if (hexMatch) {
                return hexMatch[0];
            }
        }
    }
    return null;
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        config: {
            packageId: NOTARIZATION_PKG_ID,
            networkUrl: NETWORK_URL,
            networkFaucet: NETWORK_NAME_FAUCET
        }
    });
});

// Notarize university degree
app.post('/api/notarize/degree', async (req, res) => {
    try {
        const {
            studentName,
            studentId,
            degree,
            university,
            graduationDate,
            gpa,
            honors,
            major,
            minor,
            academicYear,
            registrarSignature,
            universitySeal
        } = req.body;

        // Validate required fields
        if (!studentName || !degree || !university || !graduationDate) {
            return res.status(400).json({
                error: 'Missing required fields: studentName, degree, university, graduationDate'
            });
        }

        // Create document data
        const documentData = `University Degree Certificate for ${studentName} - ${degree} from ${university}`;
        const metadata = `Degree: ${degree} | GPA: ${gpa || 'N/A'} | Honors: ${honors || 'N/A'}`;
        const updatableMetadata = `Status: Active | Last Verified: ${new Date().toISOString().split('T')[0]}`;
        const immutableDescription = `Official University Degree Certificate - This document certifies the completion of academic requirements and cannot be altered`;
        
        // Calculate delete lock (10 years from now)
        const deleteLock = Math.round(Date.now() / 1000 + (10 * 365 * 24 * 60 * 60));

        // Execute notarization command
        const command = `./notarize.sh create-locked "${documentData}" "${metadata}" "${updatableMetadata}" "${immutableDescription}" ${deleteLock}`;
        
        console.log(`Executing: ${command}`);
        const output = await executeCommand(command);
        
        // Extract notarization ID
        const notarizationId = extractNotarizationId(output);
        
        if (!notarizationId) {
            throw new Error('Failed to extract notarization ID from output');
        }

        // Create response
        const response = {
            success: true,
            notarizationId,
            documentType: 'University Degree',
            studentName,
            degree,
            university,
            graduationDate,
            gpa,
            honors,
            creationDate: new Date().toISOString(),
            deleteLockExpires: new Date(deleteLock * 1000).toISOString(),
            verificationUrl: `${req.protocol}://${req.get('host')}/api/verify/${notarizationId}`,
            transactionDigest: output.match(/Transaction Digest: ([a-zA-Z0-9]+)/)?.[1] || 'Unknown'
        };

        res.json(response);

    } catch (error) {
        console.error('Error notarizing degree:', error);
        res.status(500).json({
            error: 'Failed to notarize degree',
            details: error.message
        });
    }
});

// Notarize university transcript
app.post('/api/notarize/transcript', async (req, res) => {
    try {
        const {
            studentName,
            studentId,
            university,
            academicYear,
            totalCredits,
            gpa,
            courses,
            registrarSignature,
            issueDate
        } = req.body;

        // Validate required fields
        if (!studentName || !university || !totalCredits || !gpa) {
            return res.status(400).json({
                error: 'Missing required fields: studentName, university, totalCredits, gpa'
            });
        }

        // Create document data
        const documentData = `Complete academic transcript for ${studentName} - ${totalCredits} credits, GPA ${gpa}`;
        const metadata = `Total Credits: ${totalCredits} | GPA: ${gpa} | Courses: ${courses ? courses.length : 0}`;
        const updatableMetadata = `Status: Active | Last Verified: ${new Date().toISOString().split('T')[0]}`;
        const immutableDescription = `Official University Academic Transcript - Complete record of academic performance and course completion`;
        
        // Calculate delete lock (10 years from now)
        const deleteLock = Math.round(Date.now() / 1000 + (10 * 365 * 24 * 60 * 60));

        // Execute notarization command
        const command = `./notarize.sh create-locked "${documentData}" "${metadata}" "${updatableMetadata}" "${immutableDescription}" ${deleteLock}`;
        
        console.log(`Executing: ${command}`);
        const output = await executeCommand(command);
        
        // Extract notarization ID
        const notarizationId = extractNotarizationId(output);
        
        if (!notarizationId) {
            throw new Error('Failed to extract notarization ID from output');
        }

        // Create response
        const response = {
            success: true,
            notarizationId,
            documentType: 'University Transcript',
            studentName,
            university,
            totalCredits,
            gpa,
            academicYear,
            issueDate,
            creationDate: new Date().toISOString(),
            deleteLockExpires: new Date(deleteLock * 1000).toISOString(),
            verificationUrl: `${req.protocol}://${req.get('host')}/api/verify/${notarizationId}`,
            transactionDigest: output.match(/Transaction Digest: ([a-zA-Z0-9]+)/)?.[1] || 'Unknown'
        };

        res.json(response);

    } catch (error) {
        console.error('Error notarizing transcript:', error);
        res.status(500).json({
            error: 'Failed to notarize transcript',
            details: error.message
        });
    }
});

// Notarize university certificate
app.post('/api/notarize/certificate', async (req, res) => {
    try {
        const {
            recipientName,
            certificateType,
            program,
            university,
            department,
            completionDate,
            duration,
            instructor,
            programDirector,
            certificateNumber,
            skills,
            grade
        } = req.body;

        // Validate required fields
        if (!recipientName || !certificateType || !program || !university) {
            return res.status(400).json({
                error: 'Missing required fields: recipientName, certificateType, program, university'
            });
        }

        // Create document data
        const documentData = `${certificateType} - ${program}`;
        const metadata = `Program: ${program} | Duration: ${duration || 'N/A'} | Grade: ${grade || 'N/A'}`;
        const updatableMetadata = `Status: Active | Last Verified: ${new Date().toISOString().split('T')[0]}`;
        const immutableDescription = `Official University ${certificateType} - Completion of specialized training program`;
        
        // Calculate delete lock (10 years from now)
        const deleteLock = Math.round(Date.now() / 1000 + (10 * 365 * 24 * 60 * 60));

        // Execute notarization command
        const command = `./notarize.sh create-locked "${documentData}" "${metadata}" "${updatableMetadata}" "${immutableDescription}" ${deleteLock}`;
        
        console.log(`Executing: ${command}`);
        const output = await executeCommand(command);
        
        // Extract notarization ID
        const notarizationId = extractNotarizationId(output);
        
        if (!notarizationId) {
            throw new Error('Failed to extract notarization ID from output');
        }

        // Create response
        const response = {
            success: true,
            notarizationId,
            documentType: 'University Certificate',
            recipientName,
            certificateType,
            program,
            university,
            department,
            completionDate,
            duration,
            grade,
            creationDate: new Date().toISOString(),
            deleteLockExpires: new Date(deleteLock * 1000).toISOString(),
            verificationUrl: `${req.protocol}://${req.get('host')}/api/verify/${notarizationId}`,
            transactionDigest: output.match(/Transaction Digest: ([a-zA-Z0-9]+)/)?.[1] || 'Unknown'
        };

        res.json(response);

    } catch (error) {
        console.error('Error notarizing certificate:', error);
        res.status(500).json({
            error: 'Failed to notarize certificate',
            details: error.message
        });
    }
});

// Verify notarization by ID
app.get('/api/verify/:notarizationId', async (req, res) => {
    try {
        const { notarizationId } = req.params;
        
        // Execute verification command
        const command = `iota client object ${notarizationId}`;
        
        console.log(`Executing: ${command}`);
        const output = await executeCommand(command);
        
        res.json({
            success: true,
            notarizationId,
            verificationDate: new Date().toISOString(),
            status: 'Verified',
            rawOutput: output
        });

    } catch (error) {
        console.error('Error verifying notarization:', error);
        res.status(500).json({
            error: 'Failed to verify notarization',
            details: error.message
        });
    }
});

// Get all notarizations for a student
app.get('/api/student/:studentId/notarizations', async (req, res) => {
    try {
        const { studentId } = req.params;
        
        // This would typically query a database or blockchain for all notarizations
        // For now, return a placeholder response
        res.json({
            success: true,
            studentId,
            notarizations: [],
            message: 'This endpoint would return all notarizations for the student'
        });

    } catch (error) {
        console.error('Error fetching student notarizations:', error);
        res.status(500).json({
            error: 'Failed to fetch student notarizations',
            details: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 University Document Notarization API Server running on port ${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
    console.log(`🎓 Notarize degree: POST http://localhost:${PORT}/api/notarize/degree`);
    console.log(`📚 Notarize transcript: POST http://localhost:${PORT}/api/notarize/transcript`);
    console.log(`🏆 Notarize certificate: POST http://localhost:${PORT}/api/notarize/certificate`);
    console.log(`🔍 Verify notarization: GET http://localhost:${PORT}/api/verify/:notarizationId`);
});

module.exports = app; 