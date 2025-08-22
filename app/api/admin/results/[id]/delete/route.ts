import { createServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ success: false, message: "Result ID is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // First delete the related answers
    const { error: answersError } = await supabase.from("exam_answers").delete().eq("result_id", id)

    if (answersError) {
      console.error("Error deleting answers:", answersError)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete exam answers",
          error: answersError.message,
        },
        { status: 500 },
      )
    }

    // Then delete the exam result
    const { error: resultError } = await supabase.from("exam_results").delete().eq("id", id)

    if (resultError) {
      console.error("Error deleting result:", resultError)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete exam result",
          error: resultError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Exam result and related answers deleted successfully",
    })
  } catch (error) {
    console.error("Error in delete result API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error deleting result",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
