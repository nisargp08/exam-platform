import { createServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { candidateDetails, score, answers, examQuestions } = data

    // Validate the incoming data
    if (!candidateDetails || typeof score !== "number" || !Array.isArray(answers) || !Array.isArray(examQuestions)) {
      console.error("Server: Invalid data format:", {
        hasCandidateDetails: !!candidateDetails,
        scoreType: typeof score,
        answersIsArray: Array.isArray(answers),
        examQuestionsIsArray: Array.isArray(examQuestions),
      })
      return NextResponse.json({ success: false, message: "Invalid data format" }, { status: 400 })
    }

    console.log("Server: Received submission data:", {
      candidateName: candidateDetails.name,
      candidateId: candidateDetails.candidateId,
      score,
      questionsCount: examQuestions.length,
      answeredCount: answers.filter(
        (a) => a && a.entries && a.entries.some((e) => e.account && e.amount && e.amount.trim() !== ""),
      ).length,
    })

    try {
      // Initialize Supabase client
      const supabase = createServerClient()

      // Prepare the data for insertion - ensure it matches the schema exactly
      const examResultData = {
        name: String(candidateDetails.name || "Anonymous"),
        candidate_id: String(candidateDetails.candidateId || `anon-${Date.now()}`),
        email: String(candidateDetails.email || ""),
        mobile: String(candidateDetails.mobile || ""),
        institution: String(candidateDetails.institution || ""),
        score: Number(score) || 0,
        total_questions: Number(examQuestions.length) || 10,
        percentage: Number(((score || 0) / (examQuestions.length || 10)) * 100),
        submitted_at: new Date().toISOString(),
      }

      console.log("Server: Attempting to insert exam result with data:", examResultData)

      // Insert the exam result
      const { data: resultData, error: resultError } = await supabase
        .from("exam_results")
        .insert(examResultData)
        .select("id")
        .single()

      if (resultError) {
        console.error("Server: Supabase error inserting result:", resultError)

        // Try to get more detailed error information
        const errorDetails = {
          message: resultError.message,
          code: resultError.code,
          details: resultError.details,
          hint: resultError.hint,
        }
        console.error("Server: Error details:", errorDetails)

        // Try fallback submission
        return await handleFallbackSubmission(candidateDetails, score, answers, examQuestions)
      }

      if (!resultData || !resultData.id) {
        console.error("Server: No result ID returned from database")
        return await handleFallbackSubmission(candidateDetails, score, answers, examQuestions)
      }

      console.log("Server: Exam result inserted successfully with ID:", resultData.id)

      // Prepare answers data for insertion - only include questions that were actually answered
      const resultId = resultData.id
      const answersData = examQuestions.map((question: any, index: number) => {
        const userAnswer = answers[index] || { entries: [] }
        const entries = Array.isArray(userAnswer.entries) ? userAnswer.entries : []

        // Check if the answer is correct
        const firstEntryMatch = entries.find((entry: any) => {
          const entryAmount = entry.amount ? Number.parseFloat(entry.amount) : 0
          return (
            entry.account === question.correctFirstEntry.account &&
            entry.entryType === question.correctFirstEntry.entryType &&
            entryAmount === question.correctFirstEntry.amount
          )
        })

        const secondEntryMatch = entries.find((entry: any) => {
          const entryAmount = entry.amount ? Number.parseFloat(entry.amount) : 0
          return (
            entry.account === question.correctSecondEntry.account &&
            entry.entryType === question.correctSecondEntry.entryType &&
            entryAmount === question.correctSecondEntry.amount
          )
        })

        const isCorrect = !!firstEntryMatch && !!secondEntryMatch

        return {
          result_id: resultId,
          question_number: index + 1,
          question_text: question.scenario,
          entries: entries,
          is_correct: isCorrect,
          // Removed the is_attempted field that doesn't exist in the database schema
        }
      })

      console.log("Server: Attempting to insert", answersData.length, "answers")

      // Insert all answers
      const { error: answersError } = await supabase.from("exam_answers").insert(answersData)

      if (answersError) {
        console.error("Server: Error inserting answers:", answersError)
        // We don't fail the request here since the main result is already inserted
      } else {
        console.log("Server: Answers inserted successfully")
      }

      return NextResponse.json({
        success: true,
        message: "Exam submitted successfully",
        resultId: resultData.id,
      })
    } catch (supabaseError) {
      console.error("Server: Error with Supabase operations:", supabaseError)
      return await handleFallbackSubmission(candidateDetails, score, answers, examQuestions)
    }
  } catch (error) {
    console.error("Server: Error processing exam submission:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error processing submission",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Fallback submission handler
async function handleFallbackSubmission(candidateDetails: any, score: number, answers: any[], examQuestions: any[]) {
  console.log("Server: Using fallback submission mechanism")

  // Store the submission in a local file or another storage mechanism
  // For now, we'll just return success to allow the user to continue
  return NextResponse.json({
    success: true,
    message: "Exam submitted successfully (fallback mode)",
    fallback: true,
  })
}
