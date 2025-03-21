"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ApiErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ApiErrorBoundary({
  children,
  fallback,
}: ApiErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>("");

  useEffect(() => {
    // Capture global fetch errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Only handle API routes in our app
        if (
          typeof args[0] === "string" &&
          args[0].startsWith("/api/") &&
          !response.ok
        ) {
          if (response.status === 502) {
            console.error("API Gateway error (502) occurred");
            setHasError(true);
            setErrorDetails(
              "A server timeout occurred. This might be due to high demand or complex processing. Please try again with a simpler request."
            );
          }
        }
        return response;
      } catch (error) {
        console.error("Fetch error:", error);
        if (
          typeof args[0] === "string" &&
          args[0].startsWith("/api/")
        ) {
          setHasError(true);
          setErrorDetails(
            "A network error occurred. Please check your connection and try again."
          );
        }
        throw error;
      }
    };

    // Clean up
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const resetError = () => {
    setHasError(false);
    setErrorDetails("");
  };

  if (hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="p-4 max-w-md mx-auto">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Error</AlertTitle>
          <AlertDescription>
            {errorDetails ||
              "We're having trouble with our API services right now. This might be due to high demand or complex processing."}
          </AlertDescription>
        </Alert>
        <div className="flex justify-between">
          <Button variant="outline" onClick={resetError}>
            Dismiss
          </Button>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 