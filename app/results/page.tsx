"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { examQuestions } from "@/lib/exam-data"

type ExamResults = {
  candidateDetails: {
    name: string
    candidateId: string
    email: string
    institution: string
  }
  answers: Array<{ account: string; amount: string }>
  score: number
  submittedAt: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<ExamResults | null>(null)

  useEffect(() => {
    // Get results from sessionStorage
    const storedResults = sessionStorage.getItem("examResults")

    if (!storedResults) {
      router.push("/")
      return
    }

    setResults(JSON.parse(storedResults))
  }, [router])

  if (!results) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>Loading results...</p>
      </div>
    )
  }

  const scorePercentage = (results.score / examQuestions.length) * 100
  const formattedDate = new Date(results.submittedAt).toLocaleString()

  return (
    <div className="container py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Examination Results</CardTitle>
          <CardDescription className="text-center">Completed on {formattedDate}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 border rounded-lg bg-muted/50">
            <h3 className="text-xl font-semibold mb-4">Candidate Information</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Name:</div>
              <div className="text-sm">{results.candidateDetails.name}</div>

              <div className="text-sm font-medium">Candidate ID:</div>
              <div className="text-sm">{results.candidateDetails.candidateId}</div>

              <div className="text-sm font-medium">Email:</div>
              <div className="text-sm">{results.candidateDetails.email}</div>

              <div className="text-sm font-medium">Institution:</div>
              <div className="text-sm">{results.candidateDetails.institution}</div>
            </div>
          </div>

          <div className="p-6 border rounded-lg bg-muted/50">
            <h3 className="text-xl font-semibold mb-4">Score Summary</h3>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold mb-2">
                {results.score} / {examQuestions.length}
              </div>
              <div
                className={`text-xl font-medium ${
                  scorePercentage >= 70 ? "text-green-600" : scorePercentage >= 50 ? "text-amber-600" : "text-red-600"
                }`}
              >
                {scorePercentage.toFixed(1)}%
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {scorePercentage >= 70
                  ? "Excellent work! You have a strong understanding of accounting principles."
                  : scorePercentage >= 50
                    ? "Good effort. There's room for improvement in some areas."
                    : "You may need additional study to strengthen your accounting knowledge."}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/")}>Return to Home</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
