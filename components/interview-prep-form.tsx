"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { generateInterviewPrep } from "@/app/actions"
import { InterviewPrepResults } from "@/components/interview-prep-results"
import { EmailCollectionModal } from "@/components/email-collection-modal"
import { Loader2, AlertCircle, RefreshCcw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ApiErrorBoundary } from "@/components/api-error-boundary"

// Maximum number of retries for API calls
const MAX_RETRIES = 3;
// Timeout for API calls (ms)
const API_TIMEOUT = 85000;

export function InterviewPrepForm() {
  const [jobDescription, setJobDescription] = useState("")
  const [companyUrl, setCompanyUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [generatedResults, setGeneratedResults] = useState<any>(null)
  const [displayedResults, setDisplayedResults] = useState<any>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingStage, setLoadingStage] = useState("")
  const [retryCount, setRetryCount] = useState(0)

  // Function to simulate progress for better UX during long operations
  const simulateProgress = () => {
    setLoadingProgress(0)
    setLoadingStage("Analyzing job description...")

    const stages = [
      "Analyzing job description...",
      "Researching company information...",
      "Generating interview questions...",
      "Creating your personalized playbook...",
      "Finalizing your interview materials...",
    ]

    let currentStage = 0
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + (100 - prev) * 0.1
        if (newProgress > 95) {
          clearInterval(interval)
          return 95
        }

        // Update loading stage at certain progress points
        if (prev < 20 && newProgress >= 20) {
          currentStage = 1
          setLoadingStage(stages[currentStage])
        } else if (prev < 40 && newProgress >= 40) {
          currentStage = 2
          setLoadingStage(stages[currentStage])
        } else if (prev < 60 && newProgress >= 60) {
          currentStage = 3
          setLoadingStage(stages[currentStage])
        } else if (prev < 80 && newProgress >= 80) {
          currentStage = 4
          setLoadingStage(stages[currentStage])
        }

        return newProgress
      })
    }, 1000)

    return () => clearInterval(interval)
  }

  // Function to generate interview prep with timeout and retry logic
  const generateInterviewPrepWithRetry = useCallback(async (jobDesc: string, compUrl: string, retries = 0) => {
    // Create a promise that rejects after timeout
    const timeoutPromise = new Promise((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        reject(new Error("API request timed out. The server might be busy."));
      }, API_TIMEOUT);
    });

    try {
      // Race between the actual API call and the timeout
      const result = await Promise.race([
        generateInterviewPrep(jobDesc, compUrl),
        timeoutPromise
      ]) as any;

      return result;
    } catch (error: any) {
      console.error(`API call failed (attempt ${retries + 1} of ${MAX_RETRIES + 1}):`, error);
      
      // If we have retries left and it's a server error (502, timeout, etc.)
      if (
        retries < MAX_RETRIES && 
        (error.message?.includes("timeout") || 
         error.message?.includes("502") ||
         error.message?.includes("unexpected response"))
      ) {
        setLoadingStage(`Retrying... (attempt ${retries + 2} of ${MAX_RETRIES + 1})`);
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Retry the API call
        return generateInterviewPrepWithRetry(jobDesc, compUrl, retries + 1);
      }
      
      // If we're out of retries or it's another type of error, throw it
      throw error;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!jobDescription.trim() || !companyUrl.trim()) {
      setError("Please provide both a job description and company URL")
      return
    }

    // Validate URL format
    let url
    try {
      url = new URL(companyUrl)
      // Add https:// if protocol is missing
      if (!url.protocol || !["http:", "https:"].includes(url.protocol)) {
        setCompanyUrl(`https://${companyUrl}`)
      }
    } catch (e) {
      // If URL is invalid, try adding https:// and see if that works
      try {
        url = new URL(`https://${companyUrl}`)
        setCompanyUrl(`https://${companyUrl}`)
      } catch (e2) {
        setError("Please enter a valid URL (e.g., company.com or https://company.com)")
        return
      }
    }

    try {
      setIsLoading(true)
      setError(null)
      setRetryCount(0);

      // Start progress simulation
      const stopProgress = simulateProgress()

      console.log("Submitting form with:", {
        jobDescriptionLength: jobDescription.length,
        companyUrl: companyUrl,
      })

      // Use the retry-enabled function
      const prepResults = await generateInterviewPrepWithRetry(jobDescription, companyUrl);

      // Stop progress simulation
      stopProgress()
      setLoadingProgress(100)

      // Validate the results to ensure they're complete
      if (
        !prepResults ||
        !prepResults.companyOverview ||
        !prepResults.roleRequirements ||
        !prepResults.potentialQuestions
      ) {
        throw new Error("Incomplete results received. Please try again.")
      }

      // Store the results but don't display them yet
      setGeneratedResults(prepResults)

      // Show the email collection modal
      setShowEmailModal(true)
    } catch (err: any) {
      console.error("Error in form submission:", err)
      
      // Specific error message for 502 errors
      if (err.message?.includes("502") || err.message?.includes("unexpected response")) {
        setError(
          "The server is experiencing high load or timeout issues. Please try a shorter job description or try again in a few moments."
        );
      } else {
        setError(
          err.message ||
            "An unexpected error occurred. This might be due to high demand. Please try again in a few moments.",
        );
      }
      
      // Increment retry count
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSubmitted = () => {
    // After email is collected, display the results
    setShowEmailModal(false)
    setDisplayedResults(generatedResults)
    
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Hide the intro section by adding a class to the body
    document.body.classList.add('results-shown');
  }

  const handleEmailModalCancelled = () => {
    // If user cancels, still show the results but note that we didn't collect email
    setShowEmailModal(false)
    setDisplayedResults(generatedResults)
    
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Hide the intro section by adding a class to the body
    document.body.classList.add('results-shown');
  }

  const resetForm = () => {
    setDisplayedResults(null)
    setGeneratedResults(null)
    setJobDescription("")
    setCompanyUrl("")
    setLoadingProgress(0)
    setRetryCount(0)
    
    // Remove the class to show the intro section again
    document.body.classList.remove('results-shown');
  }

  if (displayedResults) {
    // Add class to body when results are shown
    if (typeof document !== 'undefined') {
      document.body.classList.add('results-shown')
      // Scroll to top for better user experience
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        <InterviewPrepResults results={displayedResults} />
        <div className="text-center">
          <Button variant="outline" onClick={resetForm}>
            Prepare for another interview
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ApiErrorBoundary>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            {retryCount > 0 && (
              <div className="mt-2">
                <p className="text-sm">Suggestions:</p>
                <ul className="text-sm list-disc pl-5 mt-1">
                  <li>Try a shorter job description</li>
                  <li>Check that your company URL is correct</li>
                  <li>Wait a few minutes and try again</li>
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="jobDescription" className="text-gray-700 font-medium">Job Description</Label>
            <span className="text-xs text-gray-400">(required)</span>
          </div>
          <Textarea
            id="jobDescription"
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            className="resize-none bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md"
          />
          {retryCount > 0 && (
            <p className="text-xs text-amber-600">
              Tip: If experiencing timeouts, try using a shorter job description (250-500 words).
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="companyUrl" className="text-gray-700 font-medium">Company Website</Label>
            <span className="text-xs text-gray-400">(required)</span>
          </div>
          <Input
            id="companyUrl"
            type="text"
            placeholder="company.com or https://company.com"
            value={companyUrl}
            onChange={(e) => setCompanyUrl(e.target.value)}
            className="bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md"
          />
          <p className="text-xs text-gray-500">
            Enter company domain (https:// will be added if needed)
          </p>
        </div>

        {isLoading && (
          <div className="space-y-2 py-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{loadingStage}</span>
              <span className="text-gray-500">{Math.round(loadingProgress)}%</span>
            </div>
            <Progress value={loadingProgress} className="h-2 bg-gray-100" />
            <p className="text-xs text-gray-500 text-center mt-2">
              This may take up to a minute as we analyze and prepare your materials
            </p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating your interview prep...
            </>
          ) : retryCount > 0 ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Again
            </>
          ) : (
            "Generate Interview Prep"
          )}
        </Button>
        
        {retryCount > 1 && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Still having issues? You might want to try again later when our servers are less busy.
            </p>
          </div>
        )}
      </form>

      {showEmailModal && generatedResults && (
        <EmailCollectionModal
          onComplete={handleEmailSubmitted}
          onCancel={handleEmailModalCancelled}
          roleCategory={generatedResults.roleCategory}
        />
      )}
    </ApiErrorBoundary>
  )
}

