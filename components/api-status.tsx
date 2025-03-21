"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

export function ApiStatus() {
  const [openAiStatus, setOpenAiStatus] = useState<"loading" | "available" | "unavailable">("loading")
  const [perplexityStatus, setPerplexityStatus] = useState<"loading" | "available" | "unavailable">("loading")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkApiStatus() {
      try {
        const response = await fetch("/api/check-api-status")
        const data = await response.json()

        if (data.openAiAvailable) {
          setOpenAiStatus("available")
        } else {
          setOpenAiStatus("unavailable")
        }

        if (data.perplexityAvailable) {
          setPerplexityStatus("available")
        } else {
          setPerplexityStatus("unavailable")
        }

        if (!data.openAiAvailable || !data.perplexityAvailable) {
          setError(data.error || "API keys not configured properly")
        }
      } catch (err) {
        setOpenAiStatus("unavailable")
        setPerplexityStatus("unavailable")
        setError("Failed to check API status")
      }
    }

    checkApiStatus()
  }, [])

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>API Status</CardTitle>
        <CardDescription>Check if the required APIs are configured correctly</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>OpenAI API:</span>
              {openAiStatus === "loading" && <Badge variant="outline">Checking...</Badge>}
              {openAiStatus === "available" && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" /> Available
                </Badge>
              )}
              {openAiStatus === "unavailable" && (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" /> Unavailable
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Perplexity API:</span>
              {perplexityStatus === "loading" && <Badge variant="outline">Checking...</Badge>}
              {perplexityStatus === "available" && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" /> Available
                </Badge>
              )}
              {perplexityStatus === "unavailable" && (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" /> Unavailable
                </Badge>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

