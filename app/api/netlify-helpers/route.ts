import { NextResponse } from "next/server";

// This is a simple API route that helps diagnose Netlify-specific issues
export async function GET() {
  try {
    // Get environment status - return masked values to check if they're set
    const envStatus = {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "Set (starts with: " + process.env.OPENAI_API_KEY.substring(0, 5) + "...)" : "Not set",
      PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY ? "Set (starts with: " + process.env.PERPLEXITY_API_KEY.substring(0, 5) + "...)" : "Not set",
      GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ? "Set" : "Not set",
      GOOGLE_SHEETS_PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY ? "Set (length: " + process.env.GOOGLE_SHEETS_PRIVATE_KEY.length + ")" : "Not set",
      GOOGLE_SHEETS_SPREADSHEET_ID: process.env.GOOGLE_SHEETS_SPREADSHEET_ID ? "Set" : "Not set",
      NODE_ENV: process.env.NODE_ENV || "Not set",
      NETLIFY: process.env.NETLIFY || "Not set"
    };

    return NextResponse.json({
      status: "ok",
      message: "Netlify helper API is running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      isNetlify: !!process.env.NETLIFY,
      envStatus
    });
  } catch (error) {
    console.error("Error in netlify-helpers API:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "An error occurred in the netlify-helpers API",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 