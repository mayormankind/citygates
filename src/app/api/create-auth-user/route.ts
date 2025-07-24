import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdminConfig";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    try {
      // Verify admin token
      await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { phoneNumber, displayName, email, userId } = await request.json();

    if (!phoneNumber || !userId) {
      return NextResponse.json(
        { error: "Phone number and userId are required" },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^\+234\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        {
          error:
            "Invalid phone number format. Must be +234 followed by 10 digits.",
        },
        { status: 400 }
      );
    }

    // Check if a user with this phone number already exists
    try {
      await adminAuth.getUserByPhoneNumber(phoneNumber);
      return NextResponse.json(
        { error: "Phone number already in use" },
        { status: 400 }
      );
    } catch (error: any) {
      if (error.code !== "auth/user-not-found") {
        console.error("Error checking existing user:", error);
        throw error;
      }
    }

    // Create Firebase Auth user
    const userRecord = await adminAuth.createUser({
      uid: userId,
      phoneNumber,
      displayName,
      email,
    });

    return NextResponse.json({ uid: userRecord.uid }, { status: 200 });
  } catch (error: any) {
    console.error("Error in /api/create-auth-user:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: error.message || "Failed to create auth user" },
      { status: 500 }
    );
  }
}
