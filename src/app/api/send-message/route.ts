// src/app/api/send-message/route.ts

import { NextResponse } from "next/server";
import { sendMessage } from "@/lib/sendmessage";

export async function POST(request: Request) {
  const { to, message, from } = await request.json();
  console.log("Request received:", { to, message, from }); // Debug log
  try {
    const response = await sendMessage(to, message, from);
    console.log("Termii response:", response); // Debug log
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in sendMessage:", error); // Detailed error log
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
