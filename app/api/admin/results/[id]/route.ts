import { createServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ success: false, message: "Result ID is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Fetch the exam result
    const { data: resultData, error: resultError } = await supabase
      .from("exam_results")
      .select("*")
      .eq("id", id)
      .single()

    if (resultError) {
      console.error("Error fetching result:", resultError)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch exam result",
          error: resultError.message,
        },
        { status: 500 },
      )
    }

    // Fetch the detailed answers
    const { data: answersData, error: answersError } = await supabase
      .from("exam_answers")
      .select("*")
      .eq("result_id", id)
      .order("question_number", { ascending: true })

    if (answersError) {
      console.error("Error fetching answers:", answersError)
      // We still return the result even if answers fetch fails
    }

    return NextResponse.json({
      success: true,
      result: resultData,
      answers: answersData || [],
    })
  } catch (error) {
    console.error("Error in result detail API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error fetching result details",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
