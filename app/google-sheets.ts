"use server"

import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"

// Function to save user email to Google Sheets
export async function saveEmailToSheet(email: string, jobRole: string) {
  try {
    // Check if the required environment variables are set
    if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
      console.error("Missing GOOGLE_SHEETS_CLIENT_EMAIL environment variable");
      return { success: false, error: "Missing Google Sheets configuration" };
    }
    
    if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
      console.error("Missing GOOGLE_SHEETS_PRIVATE_KEY environment variable");
      return { success: false, error: "Missing Google Sheets configuration" };
    }
    
    if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
      console.error("Missing GOOGLE_SHEETS_SPREADSHEET_ID environment variable");
      return { success: false, error: "Missing Google Sheets configuration" };
    }
    
    // Format the private key properly - Render may require different handling
    // Try different formats of the private key to handle different environment configurations
    let privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
    
    // If the key doesn't include the BEGIN PRIVATE KEY part, it might be missing proper formatting
    if (!privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
      // Try to fix common formatting issues
      privateKey = privateKey
        .replace(/\\n/g, "\n") // Replace literal \n with actual newlines
        .replace(/"/g, "");    // Remove any quotes
        
      // If it still doesn't have the header, add it
      if (!privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
        console.error("Private key appears to be malformed");
        return { success: false, error: "Invalid Google Sheets configuration" };
      }
    }
    
    console.log("Attempting to initialize JWT client");
    
    // Create a JWT client using the service account credentials
    try {
      const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        key: privateKey,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
      
      console.log("JWT client initialized successfully");
      
      // Create a new document instance
      const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SPREADSHEET_ID, serviceAccountAuth);
      
      console.log("Attempting to load spreadsheet");
      // Load the document properties and sheets
      await doc.loadInfo();
      console.log("Spreadsheet loaded successfully");
      
      // Get the first sheet
      const sheet = doc.sheetsByIndex[0];
      if (!sheet) {
        console.error("No sheet found in the spreadsheet");
        return { success: false, error: "Spreadsheet configuration error" };
      }
      
      console.log("Adding row to sheet");
      // Add a new row with the email and timestamp
      await sheet.addRow({
        email: email,
        role: jobRole,
        timestamp: new Date().toISOString(),
      });
      console.log("Row added successfully");
      
      return { success: true };
    } catch (jwtError) {
      console.error("Error initializing JWT client:", jwtError);
      return { success: false, error: "Authentication error with Google Sheets" };
    }
  } catch (error) {
    console.error("Error saving email to Google Sheets:", error);
    // Return more specific error information
    if (error instanceof Error) {
      return { success: false, error: `Failed to save email: ${error.message}` };
    }
    return { success: false, error: "Failed to save email" };
  }
}

