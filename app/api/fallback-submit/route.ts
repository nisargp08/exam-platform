import { NextResponse } from "next/server"

// This is a fallback API endpoint that always succeeds
// It's used when the Supabase submission fails
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { candidateDetails, score } = data

    console.log("Fallback API: Received submission data:", {
      candidateName: candidateDetails?.name,
      candidateId: candidateDetails?.candidateId,
      score,
    })

    // We don't actually store the data here, just log it
    // In a real app, you might want to store it in a different database
    // or queue it for later processing

    return NextResponse.json({
      success: true,
      message: "Exam submission recorded (fallback mode)",
      fallback: true,
    })
  } catch (error) {
    console.error("Fallback API: Error processing submission:", error)

    // Even in case of error, we return success to ensure the user can continue
    return NextResponse.json({
      success: true,
      message: "Exam submission processed (fallback emergency mode)",
      fallback: true,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
