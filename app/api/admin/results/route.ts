import { createServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Query the exam_results table directly with all fields
    const { data, error } = await supabase
      .from("exam_results")
      .select(`
        id,
        name,
        candidate_id,
        email,
        mobile,
        institution,
        score,
        total_questions,
        percentage,
        submitted_at
      `)
      .order("submitted_at", { ascending: false })

    if (error) {
      console.error("Error fetching results:", error)

      // Return empty results instead of failing
      return NextResponse.json({
        success: true,
        results: [],
        warning: "Could not fetch results from database",
        error: error.message,
      })
    }

    // Ensure all numeric fields are properly typed
    const processedResults = (data || []).map((result) => ({
      ...result,
      score: Number(result.score) || 0,
      total_questions: Number(result.total_questions) || 10,
      percentage: Number(result.percentage) || 0,
    }))

    return NextResponse.json({
      success: true,
      results: processedResults,
    })
  } catch (error) {
    console.error("Error in results API:", error)

    // Return empty results instead of failing
    return NextResponse.json({
      success: true,
      results: [],
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
