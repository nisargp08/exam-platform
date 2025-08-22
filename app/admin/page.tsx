"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { Download, Search, SortAsc, SortDesc, Trash2 } from "lucide-react"
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

// Simple admin credentials - in a real app, use Supabase Auth
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin123"

type ExamResult = {
  id: string
  name: string
  candidate_id: string
  email: string
  mobile: string
  institution?: string
  score: number
  total_questions: number
  percentage: number
  submitted_at: string
  questions_answered?: number
  correct_answers?: number
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [examResults, setExamResults] = useState<ExamResult[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof ExamResult>("submitted_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resultToDelete, setResultToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleLogin = () => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      fetchResults()
    } else {
      setError("Invalid credentials")
    }
  }

  const fetchResults = async () => {
    setLoading(true)
    try {
      // Use API endpoint instead of direct Supabase client
      const response = await fetch("/api/admin/results")
      if (!response.ok) {
        throw new Error("Failed to fetch results")
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || "Unknown error")
      }

      setExamResults(data.results || [])
    } catch (error) {
      console.error("Error fetching results:", error)
      setError("Failed to load exam results")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchResults()
    }
  }, [isAuthenticated])

  const handleSort = (field: keyof ExamResult) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }

    // Sort the results locally
    const sortedResults = [...examResults].sort((a, b) => {
      if (a[field] < b[field]) return sortDirection === "asc" ? -1 : 1
      if (a[field] > b[field]) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    setExamResults(sortedResults)
  }

  const exportToCSV = () => {
    // Filter results if search term is present
    const resultsToExport = searchTerm
      ? examResults.filter(
          (result) =>
            result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.candidate_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.email.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : examResults

    // Create CSV content
    const headers = [
      "Name",
      "Candidate ID",
      "Email",
      "Mobile",
      "Institution",
      "Score",
      "Total Questions",
      "Percentage",
      "Submitted At",
    ]
    const csvContent = [
      headers.join(","),
      ...resultsToExport.map((result) =>
        [
          `"${result.name}"`,
          `"${result.candidate_id}"`,
          `"${result.email}"`,
          `"${result.mobile}"`,
          `"${result.institution || "N/A"}"`,
          result.score,
          result.total_questions,
          `${result.percentage.toFixed(1)}%`,
          new Date(result.submitted_at).toLocaleString(),
        ].join(","),
      ),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `exam_results_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDeleteClick = (id: string) => {
    setResultToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!resultToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/results/${resultToDelete}/delete`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete result")
      }

      // Remove the deleted result from the state
      setExamResults(examResults.filter((result) => result.id !== resultToDelete))
      toast({
        title: "Success",
        description: "Exam result deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting result:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete result",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setResultToDelete(null)
    }
  }

  // Filter results based on search term
  const filteredResults = searchTerm
    ? examResults.filter(
        (result) =>
          result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.candidate_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : examResults

  if (!isAuthenticated) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your credentials to view exam results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Exam Results</h1>
        <Button variant="outline" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      {loading ? (
        <p>Loading results...</p>
      ) : filteredResults.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p>No exam results found.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                    <div className="flex items-center">
                      Candidate Name
                      {sortField === "name" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="ml-1 h-4 w-4" />
                        ) : (
                          <SortDesc className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("candidate_id")}>
                    <div className="flex items-center">
                      Candidate ID
                      {sortField === "candidate_id" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="ml-1 h-4 w-4" />
                        ) : (
                          <SortDesc className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("score")}>
                    <div className="flex items-center">
                      Score
                      {sortField === "score" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="ml-1 h-4 w-4" />
                        ) : (
                          <SortDesc className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("percentage")}>
                    <div className="flex items-center">
                      Percentage
                      {sortField === "percentage" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="ml-1 h-4 w-4" />
                        ) : (
                          <SortDesc className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("submitted_at")}>
                    <div className="flex items-center">
                      Submitted At
                      {sortField === "submitted_at" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="ml-1 h-4 w-4" />
                        ) : (
                          <SortDesc className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{result.name}</TableCell>
                    <TableCell>{result.candidate_id}</TableCell>
                    <TableCell>{result.email}</TableCell>
                    <TableCell>{result.mobile}</TableCell>
                    <TableCell>{result.institution || "N/A"}</TableCell>
                    <TableCell>
                      {result.score} / {result.total_questions}
                    </TableCell>
                    <TableCell>{result.percentage.toFixed(1)}%</TableCell>
                    <TableCell>{new Date(result.submitted_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/admin/results/${result.id}`)}>
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 bg-transparent"
                          onClick={() => handleDeleteClick(result.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

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
