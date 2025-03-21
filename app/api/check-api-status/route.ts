import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if OpenAI API key is configured
    const openAiKey = process.env.OPENAI_API_KEY
    const openAiAvailable = !!openAiKey && openAiKey.startsWith("sk-")

    // Check if Perplexity API key is configured
    const perplexityKey = process.env.PERPLEXITY_API_KEY
    const perplexityAvailable = !!perplexityKey && perplexityKey.length > 10

    return NextResponse.json({
      openAiAvailable,
      perplexityAvailable,
      error:
        openAiAvailable && perplexityAvailable
          ? null
          : !openAiAvailable && !perplexityAvailable
            ? "Both OpenAI and Perplexity API keys are missing or invalid"
            : !openAiAvailable
              ? "OpenAI API key is missing or invalid"
              : "Perplexity API key is missing or invalid",
    })
  } catch (error) {
    return NextResponse.json(
      {
        openAiAvailable: false,
        perplexityAvailable: false,
        error: "Failed to check API status",
      },
      { status: 500 },
    )
  }
}

