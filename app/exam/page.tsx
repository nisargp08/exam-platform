"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { QuestionComponent } from "@/components/question-component"
import { examQuestions } from "@/lib/exam-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type EntryData = {
  account: string
  entryType: string
  amount: string
}

type AnswerData = {
  entries: EntryData[]
}

export default function ExamPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<AnswerData[]>(() => {
    // Initialize with proper structure to avoid reference issues
    return Array(examQuestions.length)
      .fill(null)
      .map(() => ({
        entries: [
          { account: "", entryType: "debit", amount: "" },
          { account: "", entryType: "credit", amount: "" },
        ],
      }))
  })
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3
  const [isSubmitted, setIsSubmitted] = useState(false) // Track if exam has been submitted

  // Check if candidate details exist and terms were accepted
  useEffect(() => {
    const candidateDetails = sessionStorage.getItem("candidateDetails")
    const termsAccepted = sessionStorage.getItem("termsAccepted")

    if (!candidateDetails) {
      router.push("/register")
      return
    }

    if (!termsAccepted) {
      router.push("/terms")
      return
    }
  }, [router])

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Handle window/tab visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !isSubmitted) {
        handleSubmitExam()
      }
    }

    const handleBlur = () => {
      if (!isSubmitted) {
        handleSubmitExam()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleBlur)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleBlur)
    }
  }, [answers, isSubmitted])

  const handleAnswerChange = (entries: EntryData[]) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = { entries }
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < examQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = (userAnswers: AnswerData[]) => {
    let score = 0
    let questionsAnswered = 0

    examQuestions.forEach((question, index) => {
      const userAnswer = userAnswers[index]

      // Skip if no answer provided
      if (!userAnswer || !userAnswer.entries || userAnswer.entries.length < 1) {
        return
      }

      // Check if the user has attempted this question (any entry with account and amount)
      const hasAttempted = userAnswer.entries.some(
        (entry) => entry.account && entry.amount && entry.amount.trim() !== "",
      )

      if (!hasAttempted) {
        return
      }

      questionsAnswered++

      // Find entries that match the correct first and second entries
      const firstEntryMatch = userAnswer.entries.find((entry) => {
        // Ensure amount is properly parsed as a number for comparison
        const entryAmount = entry.amount ? Number.parseFloat(entry.amount) : 0

        return (
          entry.account === question.correctFirstEntry.account &&
          entry.entryType === question.correctFirstEntry.entryType &&
          entryAmount === question.correctFirstEntry.amount
        )
      })

      const secondEntryMatch = userAnswer.entries.find((entry) => {
        // Ensure amount is properly parsed as a number for comparison
        const entryAmount = entry.amount ? Number.parseFloat(entry.amount) : 0

        return (
          entry.account === question.correctSecondEntry.account &&
          entry.entryType === question.correctSecondEntry.entryType &&
          entryAmount === question.correctSecondEntry.amount
        )
      })

      // Both entries must be found to get a point
      if (firstEntryMatch && secondEntryMatch) {
        score += 1
      }
    })

    console.log(
      `Score calculation: ${score} points from ${questionsAnswered} answered questions out of ${examQuestions.length} total questions`,
    )
    return score
  }

  const handleSubmitExam = async () => {
    if (isSubmitting || isSubmitted) return

    setIsSubmitting(true)
    setIsSubmitted(true) // Mark as submitted to prevent duplicate submissions
    setSubmitError(null)

    try {
      // Calculate score - ensure all answered questions are graded
      const score = calculateScore(answers)

      // Get candidate details
      const candidateDetails = JSON.parse(sessionStorage.getItem("candidateDetails") || "{}")

      // Prepare submission data
      const submissionData = {
        candidateDetails,
        answers,
        score,
        submittedAt: new Date().toISOString(),
      }

      // Store in session storage for reference (do this first as a backup)
      sessionStorage.setItem("examResults", JSON.stringify(submissionData))

      try {
        console.log("Client: Submitting exam to API endpoint")

        // Submit to server API endpoint
        const response = await fetch("/api/submit-exam", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            candidateDetails,
            score,
            answers,
            examQuestions,
          }),
        })

        const result = await response.json()

        if (!response.ok && !result.fallback) {
          console.error("Client: API submission error:", result)

          // Try again if we haven't reached max retries
          if (retryCount < maxRetries) {
            setRetryCount(retryCount + 1)
            setIsSubmitting(false)
            setIsSubmitted(false) // Allow resubmission on retry
            setSubmitError(`Submission attempt ${retryCount + 1} failed. Retrying...`)
            setTimeout(() => handleSubmitExam(), 2000) // Wait 2 seconds before retrying
            return
          }

          throw new Error(result.message || "Failed to submit exam")
        }

        console.log("Client: Successfully submitted exam:", result)

        // If this was a fallback submission, mark it
        if (result.fallback) {
          sessionStorage.setItem("examSubmitFallback", "true")
        }

        // Navigate to completion page
        router.push("/completion")
      } catch (apiError) {
        console.error("Client: API submission error:", apiError)

        // We'll continue anyway since we've already saved to sessionStorage
        console.log("Client: Continuing with local storage backup")
        sessionStorage.setItem("examSubmitFallback", "true")
        router.push("/completion")
      }
    } catch (error) {
      console.error("Client: Error submitting exam:", error)
      setSubmitError("There was an error submitting your exam. Your answers have been saved locally.")

      // Even on error, we'll continue to completion page after a delay
      setTimeout(() => {
        sessionStorage.setItem("examSubmitFallback", "true")
        router.push("/completion")
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const progress = ((currentQuestion + 1) / examQuestions.length) * 100

  return (
    <div className="container py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Accounting Examination</CardTitle>
            <div className="text-lg font-medium">
              Time Remaining: <span className={timeLeft < 300 ? "text-red-500" : ""}>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <CardDescription>
            Question {currentQuestion + 1} of {examQuestions.length}
          </CardDescription>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent>
          {submitError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {examQuestions[currentQuestion] && answers[currentQuestion] && (
            <QuestionComponent
              question={examQuestions[currentQuestion]}
              answer={answers[currentQuestion]}
              onAnswerChange={handleAnswerChange}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0 || isSubmitting}>
            Previous
          </Button>
          <div className="flex gap-2">
            {currentQuestion < examQuestions.length - 1 ? (
              <Button onClick={handleNext} disabled={isSubmitting}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmitExam} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Exam"}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
