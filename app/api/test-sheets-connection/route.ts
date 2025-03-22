import { NextResponse } from "next/server"
import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"

export async function GET() {
  try {
    // Check if the required environment variables are set
    const results = {
      variables: {
        GOOGLE_SHEETS_CLIENT_EMAIL: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        GOOGLE_SHEETS_PRIVATE_KEY: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
        GOOGLE_SHEETS_SPREADSHEET_ID: !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      },
      stages: {
        privateKeyFormatting: false,
        jwtClientCreation: false,
        spreadsheetConnection: false,
        sheetAccess: false,
      },
      errors: [] as string[],
    }

    // Format the private key properly
    let privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY || '';

    try {
      // If the key doesn't include the BEGIN PRIVATE KEY part, it might be missing proper formatting
      if (!privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
        // Try to fix common formatting issues
        privateKey = privateKey
          .replace(/\\n/g, "\n") // Replace literal \n with actual newlines
          .replace(/"/g, "");    // Remove any quotes
      }
      
      // Check if key is properly formatted now
      if (privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
        results.stages.privateKeyFormatting = true;
      } else {
        results.errors.push("Private key is malformed");
      }
    } catch (keyError) {
      results.errors.push(`Error formatting private key: ${keyError instanceof Error ? keyError.message : String(keyError)}`);
    }

    // Only proceed if we have a properly formatted key
    if (results.stages.privateKeyFormatting) {
      try {
        // Create a JWT client
        const serviceAccountAuth = new JWT({
          email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
          key: privateKey,
          scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
        
        results.stages.jwtClientCreation = true;
        
        // Create a new document instance
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '', serviceAccountAuth);
        
        // Try to load the document
        await doc.loadInfo();
        results.stages.spreadsheetConnection = true;
        
        // Check if we can access a sheet
        const sheet = doc.sheetsByIndex[0];
        if (sheet) {
          results.stages.sheetAccess = true;
        } else {
          results.errors.push("No sheets found in the spreadsheet");
        }
      } catch (authError) {
        results.errors.push(`Authentication error: ${authError instanceof Error ? authError.message : String(authError)}`);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
} 