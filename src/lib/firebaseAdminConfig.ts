import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

try {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is not set in environment variables."
    );
  }

  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
  );

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
} catch (error: any) {
  console.error("Error initializing Firebase Admin SDK:", {
    message: error.message,
    stack: error.stack,
  });
  throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
