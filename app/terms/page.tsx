"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, FileText, Clock, Calculator, PenTool } from "lucide-react"

export default function TermsPage() {
  const router = useRouter()
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false)
  const [candidateDetails, setCandidateDetails] = useState<any>(null)

  useEffect(() => {
    // Check if candidate details exist
    const storedDetails = sessionStorage.getItem("candidateDetails")
    if (!storedDetails) {
      router.push("/register")
      return
    }
    setCandidateDetails(JSON.parse(storedDetails))
  }, [router])

  const handleProceedToExam = () => {
    if (!hasAcceptedTerms) return

    // Store acceptance in session storage
    sessionStorage.setItem("termsAccepted", "true")
    router.push("/exam")
  }

  if (!candidateDetails) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <FileText className="h-6 w-6" />
            Examination Terms & Conditions
          </CardTitle>
          <CardDescription>
            Please read and accept the following terms before proceeding to the examination
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Candidate Information */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">Candidate Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <strong>Name:</strong> {candidateDetails.name}
              </div>
              <div>
                <strong>Candidate ID:</strong> {candidateDetails.candidateId}
              </div>
              <div>
                <strong>Email:</strong> {candidateDetails.email}
              </div>
              <div>
                <strong>Mobile:</strong> {candidateDetails.mobile}
              </div>
            </div>
          </div>

          {/* Important Warnings */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Critical Exam Rules</AlertTitle>
            <AlertDescription className="mt-2">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>
                    The exam will be automatically submitted if you leave the page or minimize the screen.
                  </strong>
                </li>
                <li>Once submitted, you cannot retake the examination.</li>
                <li>Ensure you have a stable internet connection throughout the exam.</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Exam Instructions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Examination Instructions</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium">Time Limit</h4>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Total duration: 30 minutes</li>
                  <li>• Timer will be displayed during the exam</li>
                  <li>• Exam auto-submits when time expires</li>
                </ul>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium">Question Format</h4>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 10 accounting journal entry questions</li>
                  <li>• Select accounts and enter amounts</li>
                  <li>• Navigate between questions freely</li>
                </ul>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-5 w-5 text-purple-500" />
                  <h4 className="font-medium">Calculator & Materials</h4>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• If you need a calculator, request it at the front desk</li>
                  <li>• Writing materials (pen/pencil) available at front desk</li>
                  <li>• No external devices allowed during exam</li>
                </ul>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <PenTool className="h-5 w-5 text-orange-500" />
                  <h4 className="font-medium">Submission Rules</h4>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Review answers before final submission</li>
                  <li>• Partial answers will be saved automatically</li>
                  <li>• Results available immediately after submission</li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Technical Requirements */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Technical Requirements</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Keep this browser tab active throughout the exam</li>
              <li>• Do not refresh the page during the exam</li>
              <li>• Ensure your device has sufficient battery</li>
              <li>• Close unnecessary applications to ensure smooth performance</li>
            </ul>
          </div>

          {/* Academic Integrity */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Academic Integrity</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• This is an individual assessment</li>
              <li>• No collaboration or external assistance allowed</li>
              <li>• Use only your own knowledge and approved materials</li>
              <li>• Any form of cheating will result in disqualification</li>
            </ul>
          </div>

          {/* Acceptance Checkbox */}
          <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
            <Checkbox
              id="accept-terms"
              checked={hasAcceptedTerms}
              onCheckedChange={(checked) => setHasAcceptedTerms(checked as boolean)}
              className="mt-1"
            />
            <div className="space-y-1">
              <label
                htmlFor="accept-terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                I acknowledge and accept all terms and conditions
              </label>
              <p className="text-xs text-muted-foreground">
                By checking this box, I confirm that I have read, understood, and agree to abide by all the examination
                rules and conditions stated above. I understand that violation of these terms may result in
                disqualification from the examination.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/register")}>
            Back to Registration
          </Button>
          <Button onClick={handleProceedToExam} disabled={!hasAcceptedTerms} className="min-w-[200px]">
            {hasAcceptedTerms ? "Proceed to Examination" : "Please Accept Terms"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
