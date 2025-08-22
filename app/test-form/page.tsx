"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TestFormPage() {
  const [name, setName] = useState("Test User")
  const [email, setEmail] = useState("test@example.com")
  const [mobile, setMobile] = useState("1234567890")
  const [candidateId, setCandidateId] = useState("TEST123")
  const [score, setScore] = useState("8")
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  // Method 1: Direct form submission (will open in new tab)
  const testDirectSubmission = () => {
    const baseUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSf5Wp_xFc6Fpzln57zgfutLpRuT0PABsl1xqTscIuh684ecRw/viewform"
    const params = new URLSearchParams({
      "entry.1630202096": name,
      "entry.195795580": email,
      "entry.883613147": mobile,
      "entry.633536776": candidateId,
      "entry.1966125882": score,
    })

    window.open(`${baseUrl}?${params.toString()}`, "_blank")
  }

  // Method 2: Server-side submission
  const testServerSubmission = async () => {
    setSubmitting(true)
    setResult(null)

    try {
      const response = await fetch("/api/submit-to-google-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateDetails: {
            name,
            email,
            mobile,
            candidateId,
          },
          score: Number.parseInt(score),
        }),
      })

      const data = await response.json()
      setResult(`Server response: ${JSON.stringify(data)}`)
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Google Form Submission</CardTitle>
          <CardDescription>Use this page to test different methods of submitting to Google Forms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile</Label>
            <Input id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="candidateId">Candidate ID</Label>
            <Input id="candidateId" value={candidateId} onChange={(e) => setCandidateId(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="score">Score</Label>
            <Input id="score" value={score} onChange={(e) => setScore(e.target.value)} />
          </div>

          {result && (
            <div className="p-3 bg-muted rounded-md text-sm">
              <pre className="whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={testDirectSubmission} className="w-full">
            Test Direct Submission (Opens Form)
          </Button>
          <Button onClick={testServerSubmission} disabled={submitting} className="w-full">
            {submitting ? "Submitting..." : "Test Server-Side Submission"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
