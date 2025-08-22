import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <nav className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost">Results</Button>
            </Link>
            <Link href="/admin/answer-key">
              <Button variant="ghost">Answer Key</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  )
}
