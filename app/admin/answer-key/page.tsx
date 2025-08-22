"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { examQuestions, accountOptions } from "@/lib/exam-data"

export default function AnswerKeyPage() {
  // Function to get account label from value
  const getAccountLabel = (value: string) => {
    const account = accountOptions.find((acc) => acc.value === value)
    return account ? account.label : value
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Exam Answer Key</h1>
      <p className="mb-6 text-muted-foreground">
        This page provides the correct answers for all exam questions for reference purposes.
      </p>

      {examQuestions.map((question) => (
        <Card key={question.id} className="mb-6">
          <CardHeader>
            <CardTitle>Question {question.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 whitespace-pre-line">{question.scenario}</div>

            <h3 className="font-medium mb-2">Correct Journal Entries:</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Debit (Rs.)</TableHead>
                  <TableHead>Credit (Rs.)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{getAccountLabel(question.correctFirstEntry.account)}</TableCell>
                  <TableCell>
                    {question.correctFirstEntry.entryType === "debit" ? question.correctFirstEntry.amount : ""}
                  </TableCell>
                  <TableCell>
                    {question.correctFirstEntry.entryType === "credit" ? question.correctFirstEntry.amount : ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{getAccountLabel(question.correctSecondEntry.account)}</TableCell>
                  <TableCell>
                    {question.correctSecondEntry.entryType === "debit" ? question.correctSecondEntry.amount : ""}
                  </TableCell>
                  <TableCell>
                    {question.correctSecondEntry.entryType === "credit" ? question.correctSecondEntry.amount : ""}
                  </TableCell>
                </TableRow>

                {/* For questions with additional entries */}
                {question.id === 2 && (
                  <>
                    <TableRow>
                      <TableCell>Professional Tax</TableCell>
                      <TableCell>200</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>TDS Payable</TableCell>
                      <TableCell></TableCell>
                      <TableCell>1500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PF - Contribution Payable</TableCell>
                      <TableCell></TableCell>
                      <TableCell>900</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PF Expense</TableCell>
                      <TableCell>400</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </>
                )}

                {question.id === 3 && (
                  <TableRow>
                    <TableCell>Accumulated Depreciation - Computers</TableCell>
                    <TableCell></TableCell>
                    <TableCell>16500</TableCell>
                  </TableRow>
                )}

                {question.id === 4 && (
                  <>
                    <TableRow>
                      <TableCell>Bank Loan</TableCell>
                      <TableCell></TableCell>
                      <TableCell>480000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Unexpired Interest</TableCell>
                      <TableCell>80000</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </>
                )}

                {question.id === 5 && (
                  <>
                    <TableRow>
                      <TableCell>Equipment</TableCell>
                      <TableCell></TableCell>
                      <TableCell>15000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Gain on Sale of Assets</TableCell>
                      <TableCell></TableCell>
                      <TableCell>1500</TableCell>
                    </TableRow>
                  </>
                )}

                {question.id === 6 && (
                  <TableRow>
                    <TableCell>ABC Pvt Ltd</TableCell>
                    <TableCell>5000</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}

                {question.id === 7 && (
                  <>
                    <TableRow className="border-t-2 mt-2">
                      <TableCell colSpan={3} className="font-medium pt-4">
                        Sales Return Entry:
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sales Return</TableCell>
                      <TableCell>6250</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Debtors</TableCell>
                      <TableCell></TableCell>
                      <TableCell>6250</TableCell>
                    </TableRow>
                    <TableRow className="border-t-2 mt-2">
                      <TableCell colSpan={3} className="font-medium pt-4">
                        Payment Entry:
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cash</TableCell>
                      <TableCell>6200</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Discount Allowed</TableCell>
                      <TableCell>50</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Debtors</TableCell>
                      <TableCell></TableCell>
                      <TableCell>6250</TableCell>
                    </TableRow>
                  </>
                )}

                {question.id === 9 && (
                  <>
                    <TableRow>
                      <TableCell>TDS Receivable</TableCell>
                      <TableCell>600</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Interest Income</TableCell>
                      <TableCell></TableCell>
                      <TableCell>6000</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>

            {question.id === 3 && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <h4 className="font-medium mb-2">Calculation:</h4>
                <p>Motor Vehicle: Rs. 80,000 × 25% × 9/12 = Rs. 15,000</p>
                <p>Computer: Rs. 55,000 × 60% × 6/12 = Rs. 16,500</p>
                <p>Total Depreciation: Rs. 15,000 + Rs. 16,500 = Rs. 31,500</p>
              </div>
            )}

            {question.id === 8 && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <h4 className="font-medium mb-2">Bank Reconciliation Calculation:</h4>
                <p>Balance as per passbook: Rs. 58,965.20</p>
                <p>Less: Cheque deposited but not cleared: Rs. 15,526.00</p>
                <p>Add: Cheque issued but not presented: Rs. 7,800.00</p>
                <p>Balance as per cash book: Rs. 51,239.20</p>
                <p className="mt-2 font-medium">
                  Note: For this question, only the final balance amount (51,239.20) is required as the answer.
                </p>
              </div>
            )}

            {question.id === 10 && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <h4 className="font-medium mb-2">Accrual Calculation:</h4>
                <p>Total bill period: 01/03/2019 to 15/04/2019 = 46 days</p>
                <p>Period in current financial year: 01/03/2019 to 31/03/2019 = 31 days</p>
                <p>Expense for current year: Rs. 6,300 × (31/46) = Rs. 4,725</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
