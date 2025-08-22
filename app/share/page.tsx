"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Share2, Users, Shield } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function SharePage() {
  const [baseUrl, setBaseUrl] = useState("")
  const [copied, setCopied] = useState("")

  // Get the current URL or use a placeholder
  const currentUrl = typeof window !== "undefined" ? window.location.origin : "https://your-exam-platform.vercel.app"

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      toast({
        title: "Copied!",
        description: `${type} link copied to clipboard`,
      })
      setTimeout(() => setCopied(""), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const examUrl = baseUrl || currentUrl
  const adminUrl = `${examUrl}/admin`

  const candidateMessage = `🎓 Accounting Examination Platform
📝 Complete your accounting exam here: ${examUrl}
⏰ Duration: 30 minutes
📋 10 journal entry questions

Important: 
- Have calculator/pen ready (or request at front desk)
- Exam auto-submits if you leave the page
- Ensure stable internet connection`

  const adminMessage = `👨‍💼 Admin Access: ${adminUrl}
🔐 Username: admin
🔑 Password: admin123

Features:
- View all exam results
- Export to CSV
- Delete results
- View answer key`

  return (
    <div className="container py-10">
      <Toaster />
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share Examination Platform
            </CardTitle>
            <CardDescription>Get links to share the exam platform with candidates and administrators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="base-url">Platform URL (leave empty to use current domain)</Label>
              <Input
                id="base-url"
                placeholder={currentUrl}
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                If you've deployed to a custom domain, enter it here. Otherwise, the current URL will be used.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Candidate Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Users className="h-5 w-5" />
                For Candidates
              </CardTitle>
              <CardDescription>Share this link with students taking the exam</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Exam URL</Label>
                <div className="flex gap-2">
                  <Input value={examUrl} readOnly className="font-mono text-sm" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(examUrl, "Exam")}
                    className={copied === "Exam" ? "bg-green-100" : ""}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Complete Message to Share</Label>
                <textarea
                  className="w-full p-3 border rounded-md text-sm font-mono resize-none"
                  rows={8}
                  value={candidateMessage}
                  readOnly
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(candidateMessage, "Candidate message")}
                  className={`w-full ${copied === "Candidate message" ? "bg-green-100" : ""}`}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Complete Message
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Shield className="h-5 w-5" />
                For Administrators
              </CardTitle>
              <CardDescription>Admin access to view results and manage the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Admin URL</Label>
                <div className="flex gap-2">
                  <Input value={adminUrl} readOnly className="font-mono text-sm" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(adminUrl, "Admin")}
                    className={copied === "Admin" ? "bg-green-100" : ""}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm font-medium text-red-800 mb-1">Admin Credentials:</p>
                <p className="text-sm text-red-700">Username: admin</p>
                <p className="text-sm text-red-700">Password: admin123</p>
              </div>

              <div className="space-y-2">
                <Label>Complete Admin Message</Label>
                <textarea
                  className="w-full p-3 border rounded-md text-sm font-mono resize-none"
                  rows={6}
                  value={adminMessage}
                  readOnly
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(adminMessage, "Admin message")}
                  className={`w-full ${copied === "Admin message" ? "bg-green-100" : ""}`}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Admin Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" onClick={() => window.open(examUrl, "_blank")}>
                Test Exam
              </Button>
              <Button variant="outline" onClick={() => window.open(adminUrl, "_blank")}>
                Open Admin
              </Button>
              <Button variant="outline" onClick={() => window.open(`${examUrl}/admin/answer-key`, "_blank")}>
                View Answer Key
              </Button>
              <Button variant="outline" onClick={() => window.open("/", "_blank")}>
                Home Page
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Deployment Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Deployment Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Option 1: Deploy to Vercel (Recommended)</h4>
              <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
                <li>Click the "Deploy" button in the top-right corner of the code editor</li>
                <li>Connect your GitHub account if prompted</li>
                <li>Your app will be deployed and you'll get a public URL</li>
                <li>Share the URL with your candidates</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Option 2: Download and Deploy Manually</h4>
              <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
                <li>Click "Download Code" in the top-right corner</li>
                <li>Extract the files and run `npm install`</li>
                <li>Set up your Supabase database (optional)</li>
                <li>Run `npm run dev` for local testing or deploy to your preferred hosting service</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
