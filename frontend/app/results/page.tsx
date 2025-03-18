"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ResultsViewer } from "@/components/results-viewer"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { getValidationResult } from "@/lib/api-client"

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const resultId = searchParams.get("id")
  const [result, setResult] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResult = async () => {
      if (!resultId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getValidationResult(resultId);
        setResult(data);
      } catch (error) {
        console.error("Error fetching validation result:", error);
        setError("Failed to fetch validation result. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResult();
  }, [resultId]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Results</h1>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading validation result...</p>
          </div>
        </div>
      ) : (
        <ResultsViewer initialResult={result} />
      )}
    </div>
  )
}