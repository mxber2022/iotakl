// Copyright 2025 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import { TimeLock } from "@iota/notarization/node";
import { strict as assert } from "assert";
import { getFundedClient } from "./util";

/** Demonstrate how to notarize university documents like degrees, transcripts, and certificates. */
export async function notarizeUniversityDocument(): Promise<void> {
    console.log("🎓 Creating a university document notarization example");

    // create a new client that offers notarization related functions
    const notarizationClient = await getFundedClient();

    // Calculate an unlock time (10 years from now) for university documents
    // University documents should be preserved for a very long time
    const delete_unlock_at = Math.round(Date.now() / 1000 + (10 * 365 * 24 * 60 * 60)); // 10 years

    const utf8Encode = new TextEncoder();

    // Example university degree document data
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

    // Convert to JSON string for storage
    const degreeJson = JSON.stringify(degreeData, null, 2);
    const degreeBytes = utf8Encode.encode(degreeJson);

    // create a new Locked Notarization for university document
    console.log("Building a university degree notarization and publishing it to the IOTA network");
    const { output: notarization } = await notarizationClient
        .createLocked()
        .withBytesState(
            degreeBytes,
            "University Degree Document - Bachelor of Science in Computer Science"
        )
        .withDeleteLock(TimeLock.withUnlockAt(delete_unlock_at))
        .withImmutableDescription("Official University Degree Certificate - This document certifies the completion of academic requirements and cannot be altered")
        .withUpdatableMetadata("Status: Active | Last Verified: 2024-05-15 | Verification Count: 1")
        .finish()
        .buildAndExecute(notarizationClient);

    console.log("\n✅ University document notarization created successfully!");

    // Display important properties
    console.log("\n----------------------------------------------------");
    console.log("----- University Document Notarization ------------");
    console.log("----------------------------------------------------");
    console.log("🎓 Document Type: University Degree Certificate");
    console.log("📄 Notarization ID: ", notarization.id);
    console.log("🔒 Notarization Method: ", notarization.method);
    console.log("📅 Creation Date: ", new Date().toISOString());
    console.log("🗓️ Delete Lock Expires: ", new Date(delete_unlock_at * 1000).toISOString());
    
    // Parse and display the degree data
    const storedData = JSON.parse(notarization.state.data.toString());
    console.log("\n📋 Document Content:");
    console.log("   Student: ", storedData.studentName);
    console.log("   Student ID: ", storedData.studentId);
    console.log("   Degree: ", storedData.degree);
    console.log("   University: ", storedData.university);
    console.log("   Graduation Date: ", storedData.graduationDate);
    console.log("   GPA: ", storedData.gpa);
    console.log("   Honors: ", storedData.honors);

    console.log("\n📝 Metadata:");
    console.log("   State Metadata: ", notarization.state.metadata);
    console.log("   Immutable Description: ", notarization.immutableMetadata.description);
    console.log("   Updatable Metadata: ", notarization.updatableMetadata);
    console.log("   State Version Count: ", notarization.stateVersionCount);

    // Verify the notarization properties
    assert(notarization.method === "Locked");
    assert(notarization.immutableMetadata.locking !== undefined);
    assert(notarization.immutableMetadata.locking.updateLock.type === "UntilDestroyed");
    assert(notarization.immutableMetadata.locking.transferLock.type === "UntilDestroyed");

    console.log("\n🔒 The university document is permanently locked and cannot be modified");
    console.log("🎯 This ensures the authenticity and integrity of the academic credential");
    console.log("📊 The document can be verified by anyone using the Notarization ID");
    
    // Save the notarization details to a file for reference
    const verificationInfo = {
        notarizationId: notarization.id,
        documentType: "University Degree Certificate",
        studentName: storedData.studentName,
        degree: storedData.degree,
        university: storedData.university,
        graduationDate: storedData.graduationDate,
        creationDate: new Date().toISOString(),
        deleteLockExpires: new Date(delete_unlock_at * 1000).toISOString(),
        verificationInstructions: "Use the Notarization ID to verify this document on the IOTA blockchain"
    };

    console.log("\n📄 Verification Information:");
    console.log(JSON.stringify(verificationInfo, null, 2));
}

/** Demonstrate how to notarize a university transcript. */
export async function notarizeUniversityTranscript(): Promise<void> {
    console.log("📚 Creating a university transcript notarization example");

    const notarizationClient = await getFundedClient();
    const delete_unlock_at = Math.round(Date.now() / 1000 + (10 * 365 * 24 * 60 * 60)); // 10 years

    // Example transcript data
    const transcriptData = {
        studentName: "Jane Smith",
        studentId: "STU789012",
        university: "Example University",
        academicYear: "2020-2024",
        totalCredits: 120,
        gpa: "3.9",
        courses: [
            {
                courseCode: "CS101",
                courseName: "Introduction to Computer Science",
                credits: 3,
                grade: "A",
                semester: "Fall 2020"
            },
            {
                courseCode: "MATH201",
                courseName: "Calculus I",
                credits: 4,
                grade: "A-",
                semester: "Fall 2020"
            },
            {
                courseCode: "CS201",
                courseName: "Data Structures and Algorithms",
                credits: 3,
                grade: "A",
                semester: "Spring 2021"
            }
        ],
        registrarSignature: "Dr. John Doe, Registrar",
        issueDate: "2024-05-15"
    };

    const transcriptJson = JSON.stringify(transcriptData, null, 2);
    const transcriptBytes = new TextEncoder().encode(transcriptJson);

    const { output: notarization } = await notarizationClient
        .createLocked()
        .withBytesState(
            transcriptBytes,
            "University Academic Transcript - Complete Course Record"
        )
        .withDeleteLock(TimeLock.withUnlockAt(delete_unlock_at))
        .withImmutableDescription("Official University Academic Transcript - Complete record of academic performance and course completion")
        .withUpdatableMetadata("Status: Active | Last Verified: 2024-05-15 | Verification Count: 1")
        .finish()
        .buildAndExecute(notarizationClient);

    console.log("\n✅ University transcript notarization created successfully!");
    console.log("📄 Transcript Notarization ID: ", notarization.id);
    
    const storedData = JSON.parse(notarization.state.data.toString());
    console.log("📋 Student: ", storedData.studentName);
    console.log("🎓 Total Credits: ", storedData.totalCredits);
    console.log("📊 GPA: ", storedData.gpa);
    console.log("📚 Number of Courses: ", storedData.courses.length);
}

/** Demonstrate how to notarize a university certificate. */
export async function notarizeUniversityCertificate(): Promise<void> {
    console.log("🏆 Creating a university certificate notarization example");

    const notarizationClient = await getFundedClient();
    const delete_unlock_at = Math.round(Date.now() / 1000 + (10 * 365 * 24 * 60 * 60)); // 10 years

    // Example certificate data
    const certificateData = {
        recipientName: "Alice Johnson",
        certificateType: "Professional Development Certificate",
        program: "Advanced Software Engineering",
        university: "Example University",
        department: "Computer Science",
        completionDate: "2024-03-15",
        duration: "6 months",
        instructor: "Dr. Robert Wilson",
        programDirector: "Prof. Sarah Brown",
        certificateNumber: "CERT-2024-001",
        skills: ["Software Architecture", "Design Patterns", "Agile Development", "DevOps"],
        grade: "Distinction"
    };

    const certificateJson = JSON.stringify(certificateData, null, 2);
    const certificateBytes = new TextEncoder().encode(certificateJson);

    const { output: notarization } = await notarizationClient
        .createLocked()
        .withBytesState(
            certificateBytes,
            "University Professional Development Certificate"
        )
        .withDeleteLock(TimeLock.withUnlockAt(delete_unlock_at))
        .withImmutableDescription("Official University Professional Development Certificate - Completion of specialized training program")
        .withUpdatableMetadata("Status: Active | Last Verified: 2024-03-15 | Verification Count: 1")
        .finish()
        .buildAndExecute(notarizationClient);

    console.log("\n✅ University certificate notarization created successfully!");
    console.log("🏆 Certificate Notarization ID: ", notarization.id);
    
    const storedData = JSON.parse(notarization.state.data.toString());
    console.log("📋 Recipient: ", storedData.recipientName);
    console.log("🎓 Program: ", storedData.program);
    console.log("📅 Completion Date: ", storedData.completionDate);
    console.log("⭐ Grade: ", storedData.grade);
} 