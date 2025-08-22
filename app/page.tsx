import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Accounting Examination Platform</CardTitle>
          <CardDescription>Complete 10 journal entry questions to test your accounting knowledge</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This examination will test your knowledge of accounting principles through journal entry questions. You will
            need to select the appropriate account and enter the correct amount for each scenario.
          </p>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm font-medium text-amber-800 mb-2">Important Reminders:</p>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• The test will automatically submit if you minimize the browser or navigate away</li>
              <li>• You have 30 minutes to complete all questions</li>
              <li>• Calculator and writing materials available at the front desk</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/register" className="w-full">
            <Button className="w-full">Start Registration</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
