"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { accountOptions } from "@/lib/exam-data"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ResultDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [result, setResult] = useState<any>(null)
  const [answers, setAnswers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchResultDetail = async () => {
      try {
        // Use API endpoint instead of direct Supabase client
        const response = await fetch(`/api/admin/results/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch result details")
        }

        const data = await response.json()
        if (!data.success) {
          throw new Error(data.message || "Unknown error")
        }

        setResult(data.result)
        setAnswers(data.answers || [])
      } catch (error) {
        console.error("Error fetching result details:", error)
        setError("Failed to load exam result details")
      } finally {
        setLoading(false)
      }
    }

    fetchResultDetail()
  }, [params.id])

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/results/${params.id}/delete`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete result")
      }

      toast({
        title: "Success",
        description: "Exam result deleted successfully",
      })

      // Navigate back to admin page after successful deletion
      setTimeout(() => {
        router.push("/admin")
      }, 1500)
    } catch (error) {
      console.error("Error deleting result:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete result",
        variant: "destructive",
      })
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const getAccountLabel = (accountValue: string) => {
    return accountOptions.find((a) => a.value === accountValue)?.label || accountValue
  }

  if (loading) {
    return (
      <div className="container py-10">
        <p>Loading result details...</p>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="container py-10">
        <p className="text-red-500">{error || "Result not found"}</p>
        <Button className="mt-4" onClick={() => router.push("/admin")}>
          Back to Admin
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Exam Result Details</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push("/admin")}>
            Back to Results
          </Button>
          <Button
            variant="outline"
            className="text-red-500 hover:text-red-700 bg-transparent"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Result
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Candidate Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Name:</p>
              <p>{result.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Candidate ID:</p>
              <p>{result.candidate_id}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email:</p>
              <p>{result.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Mobile:</p>
              <p>{result.mobile}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Institution:</p>
              <p>{result.institution || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Score Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center space-x-6">
            <div className="text-center">
              <p className="text-sm font-medium">Total Score</p>
              <p className="text-3xl font-bold">
                {result.score} / {result.total_questions}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Percentage</p>
              <p className="text-3xl font-bold">{result.percentage.toFixed(1)}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Submitted At</p>
              <p className="text-lg">{new Date(result.submitted_at).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Question Responses</CardTitle>
        </CardHeader>
        <CardContent>
          {answers.map((answer) => (
            <div key={answer.id} className="mb-8 border-b pb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Question {answer.question_number}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    answer.is_correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {answer.is_correct ? "Correct" : "Incorrect"}
                </span>
              </div>
              <p className="mb-4">{answer.question_text}</p>

              <div>
                <h4 className="text-sm font-medium mb-2">Candidate's Answer:</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {answer.entries.map((entry: any, entryIndex: number) => (
                      <TableRow key={entryIndex}>
                        <TableCell>{getAccountLabel(entry.account)}</TableCell>
                        <TableCell>{entry.entryType}</TableCell>
                        <TableCell>₹{entry.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this result?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the exam result and all associated answers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
