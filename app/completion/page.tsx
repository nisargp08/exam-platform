"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function CompletionPage() {
  const router = useRouter()
  const [examData, setExamData] = useState<any>(null)
  const [isFallbackMode, setIsFallbackMode] = useState(false)

  useEffect(() => {
    // Check if exam was actually completed
    const examResults = sessionStorage.getItem("examResults")
    if (!examResults) {
      router.push("/")
      return
    }

    const parsedResults = JSON.parse(examResults)
    setExamData(parsedResults)

    // Check if we're in fallback mode
    const fallbackMode = sessionStorage.getItem("examSubmitFallback") === "true"
    if (fallbackMode) {
      setIsFallbackMode(true)
    }
  }, [router])

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Examination Completed</CardTitle>
          <CardDescription>Thank you for completing the accounting examination</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Your responses have been submitted successfully.</p>
          {examData && (
            <div className="p-4 bg-muted rounded-md">
              <p className="font-medium">Submission Details:</p>
              <p className="text-sm mt-2">Name: {examData.candidateDetails.name}</p>
              <p className="text-sm">Candidate ID: {examData.candidateDetails.candidateId}</p>
              <p className="text-sm">Submitted: {new Date(examData.submittedAt).toLocaleString()}</p>
            </div>
          )}
          {isFallbackMode && (
            <Alert variant="warning" className="mt-4">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Local Storage Mode</AlertTitle>
              <AlertDescription>
                Your exam was saved locally due to a temporary connection issue. Your instructor will be able to access
                your results.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/")}>Return to Home</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
