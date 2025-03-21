"use server"

import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"

// Function to save user email to Google Sheets
export async function saveEmailToSheet(email: string, jobRole: string) {
  try {
    // Create a JWT client using the service account credentials
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    // Create a new document instance
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SPREADSHEET_ID!, serviceAccountAuth)

    // Load the document properties and sheets
    await doc.loadInfo()

    // Get the first sheet
    const sheet = doc.sheetsByIndex[0]

    // Add a new row with the email and timestamp
    await sheet.addRow({
      email: email,
      role: jobRole,
      timestamp: new Date().toISOString(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error saving email to Google Sheets:", error)
    return { success: false, error: "Failed to save email" }
  }
}

