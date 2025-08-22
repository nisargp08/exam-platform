"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { accountOptions } from "@/lib/exam-data"

type EntryData = {
  account: string
  entryType: string
  amount: string
}

type QuestionProps = {
  question: {
    id: number
    scenario: string
    correctFirstEntry: {
      account: string
      entryType: string
      amount: number
    }
    correctSecondEntry: {
      account: string
      entryType: string
      amount: number
    }
  }
  answer: {
    entries: EntryData[]
  }
  onAnswerChange: (entries: EntryData[]) => void
}

export function QuestionComponent({ question, answer, onAnswerChange }: QuestionProps) {
  // Add default empty objects with optional chaining
  const safeAnswer = answer || {
    entries: [
      { account: "", entryType: "debit", amount: "" },
      { account: "", entryType: "credit", amount: "" },
    ],
  }

  const [entries, setEntries] = useState<EntryData[]>(safeAnswer.entries)
  const [singleAmount, setSingleAmount] = useState<string>("")

  // Special handling for question 8 which only needs a single number answer
  const isQuestion8 = question.id === 8

  // Update local state when answer prop changes
  useEffect(() => {
    if (answer && answer.entries) {
      setEntries(answer.entries)

      // For question 8, extract the amount from the first entry if it exists
      if (isQuestion8 && answer.entries.length > 0 && answer.entries[0].amount) {
        setSingleAmount(answer.entries[0].amount)
      }
    }
  }, [answer, isQuestion8])

  const updateEntries = (updatedEntries: EntryData[]) => {
    setEntries(updatedEntries)
    onAnswerChange(updatedEntries)
  }

  const handleAccountChange = (index: number, value: string) => {
    const updatedEntries = [...entries]
    updatedEntries[index] = { ...updatedEntries[index], account: value }
    updateEntries(updatedEntries)
  }

  const handleAmountChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      const updatedEntries = [...entries]
      updatedEntries[index] = { ...updatedEntries[index], amount: value }
      updateEntries(updatedEntries)
    }
  }

  const handleSingleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setSingleAmount(value)

      // Update the entries array with this single value
      const updatedEntries = [
        { account: "bank_account", entryType: "debit", amount: value },
        { account: "bank_account", entryType: "credit", amount: value },
      ]
      updateEntries(updatedEntries)
    }
  }

  const handleEntryTypeChange = (index: number, value: string) => {
    const updatedEntries = [...entries]
    updatedEntries[index] = { ...updatedEntries[index], entryType: value }
    updateEntries(updatedEntries)
  }

  const addEntry = () => {
    const updatedEntries = [...entries, { account: "", entryType: "credit", amount: "" }]
    updateEntries(updatedEntries)
  }

  const removeEntry = (index: number) => {
    if (entries.length <= 2) {
      return // Don't allow removing if only 2 entries remain
    }
    const updatedEntries = entries.filter((_, i) => i !== index)
    updateEntries(updatedEntries)
  }

  // Calculate totals for debits and credits
  const debitTotal = entries
    .filter((entry) => entry.entryType === "debit" && entry.amount)
    .reduce((sum, entry) => sum + Number(entry.amount), 0)

  const creditTotal = entries
    .filter((entry) => entry.entryType === "credit" && entry.amount)
    .reduce((sum, entry) => sum + Number(entry.amount), 0)

  // Check if debits equal credits
  const isBalanced = debitTotal === creditTotal && debitTotal > 0

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-muted/50">
        <h3 className="text-lg font-medium mb-2">Scenario:</h3>
        <p className="text-base whitespace-pre-line">{question.scenario}</p>
      </Card>

      {isQuestion8 ? (
        // Special input for question 8
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Your Answer:</h3>
          <div className="space-y-2 max-w-xs mx-auto">
            <Label htmlFor="bank-balance">Bank Balance as per Cash Book (Rs.):</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
              <Input
                id="bank-balance"
                type="text"
                value={singleAmount}
                onChange={handleSingleAmountChange}
                placeholder="0.00"
                className="pl-8"
              />
            </div>
          </div>
        </div>
      ) : (
        // Normal journal entry interface for other questions
        <div className="space-y-8">
          {entries.map((entry, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Entry {index + 1}</h3>
                {entries.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`account-${index}`}>Account:</Label>
                  <Select value={entry.account} onValueChange={(value) => handleAccountChange(index, value)}>
                    <SelectTrigger id={`account-${index}`}>
                      <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountOptions.map((account) => (
                        <SelectItem key={account.value} value={account.value}>
                          {account.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Entry Type:</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div
                      className={`flex items-center justify-center p-2 border rounded-md cursor-pointer ${
                        entry.entryType === "debit" ? "bg-primary text-primary-foreground" : "bg-background"
                      }`}
                      onClick={() => handleEntryTypeChange(index, "debit")}
                    >
                      Debit
                    </div>
                    <div
                      className={`flex items-center justify-center p-2 border rounded-md cursor-pointer ${
                        entry.entryType === "credit" ? "bg-primary text-primary-foreground" : "bg-background"
                      }`}
                      onClick={() => handleEntryTypeChange(index, "credit")}
                    >
                      Credit
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`amount-${index}`}>Amount:</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                    <Input
                      id={`amount-${index}`}
                      type="text"
                      value={entry.amount}
                      onChange={(e) => handleAmountChange(index, e)}
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <Button onClick={addEntry} variant="outline" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>

          {/* Journal Entry Preview */}
          <div className="p-4 bg-muted/30 rounded-md">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Journal Entry Preview:</h4>
              <div
                className={`px-3 py-1 text-sm rounded-full ${
                  isBalanced
                    ? "bg-green-100 text-green-800"
                    : entries.some((e) => e.amount && e.account)
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {isBalanced ? "Balanced" : entries.some((e) => e.amount && e.account) ? "Not Balanced" : "No Entries"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 font-medium text-sm border-b pb-2">
              <div>Account</div>
              <div className="text-center">Debit</div>
              <div className="text-center">Credit</div>
            </div>

            {entries.map(
              (entry, index) =>
                entry.account && (
                  <div key={index} className="grid grid-cols-3 gap-4 py-2 border-b">
                    <div>{accountOptions.find((a) => a.value === entry.account)?.label || entry.account}</div>
                    <div className="text-center">{entry.entryType === "debit" ? `₹${entry.amount || "0.00"}` : ""}</div>
                    <div className="text-center">
                      {entry.entryType === "credit" ? `₹${entry.amount || "0.00"}` : ""}
                    </div>
                  </div>
                ),
            )}

            {/* Totals row */}
            {entries.some((e) => e.amount && e.account) && (
              <div className="grid grid-cols-3 gap-4 py-2 font-medium">
                <div>Total</div>
                <div className="text-center">₹{debitTotal.toFixed(2)}</div>
                <div className="text-center">₹{creditTotal.toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
