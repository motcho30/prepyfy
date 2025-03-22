"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveEmailToSheet } from "@/app/google-sheets"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface EmailCollectionModalProps {
  onComplete: () => void
  onCancel: () => void
  roleCategory: string
}

export function EmailCollectionModal({ onComplete, onCancel, roleCategory }: EmailCollectionModalProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [debugMode, setDebugMode] = useState(false) // For development/troubleshooting

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic email validation
    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    setError(null)
    setErrorDetails(null)

    try {
      // Add a timestamp to avoid caching issues
      const timestamp = new Date().getTime();
      // First check if Google Sheets is properly configured
      const checkResponse = await fetch(`/api/test-sheets-connection?t=${timestamp}`);
      const checkResult = await checkResponse.json();
      
      if (!checkResult.stages.sheetAccess) {
        console.error("Google Sheets connection test failed:", checkResult);
        throw new Error(`Google Sheets connection issue: ${checkResult.errors?.join(', ') || 'Unknown error'}`);
      }

      const result = await saveEmailToSheet(email, roleCategory)

      if (result.success) {
        setIsSuccess(true)
        // Wait a moment to show success message before closing
        setTimeout(() => {
          onComplete()
        }, 1000)
      } else {
        throw new Error(result.error || "Failed to save email")
      }
    } catch (err: any) {
      console.error("Error saving email:", err)
      setError("Unable to save your email at this time")
      setErrorDetails(err.message || "Unknown error")
      
      // Show detailed errors only in debug mode
      if (process.env.NODE_ENV === "development") {
        setDebugMode(true)
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Function to skip email collection with debug info
  const handleSkipWithDebug = () => {
    // If in debug mode and there's an error, log it in the console
    if (debugMode && errorDetails) {
      console.log("Skipping with error details:", errorDetails);
    }
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 animate-in fade-in duration-300 border border-gray-100">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-indigo-600">
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Prep is Ready!</h3>
          <p className="text-gray-600">
            Enter your email to access your personalized interview materials
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-gray-700 font-medium">Thank you! Redirecting to your results...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md"
              />
              {error && (
                <div className="flex items-start text-red-500 text-sm mt-1">
                  <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                  <div>
                    {error}
                    {debugMode && errorDetails && (
                      <div className="mt-1 p-2 bg-red-50 rounded text-xs text-red-800 font-mono overflow-auto max-h-20">
                        {errorDetails}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">We'll send you interview tips tailored to this role.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                className="border-gray-200 hover:bg-gray-50 text-gray-700" 
                onClick={handleSkipWithDebug}
                disabled={isSubmitting}
              >
                Skip
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                <button
                  type="button"
                  className="text-left underline"
                  onClick={() => setDebugMode(!debugMode)}
                >
                  {debugMode ? "Hide Debug Info" : "Show Debug Info"}
                </button>
                {debugMode && (
                  <div className="mt-2">
                    <div>Environment: {process.env.NODE_ENV}</div>
                    {errorDetails && <div className="mt-1">Last Error: {errorDetails}</div>}
                  </div>
                )}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

