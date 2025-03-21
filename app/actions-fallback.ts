"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function generateInterviewPrepFallback(jobDescription: string, companyUrl: string) {
  try {
    // Generate company overview using OpenAI as fallback
    const { text: companyOverview } = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are an expert career coach helping a CS student prepare for a job interview.
      
      The company website is: ${companyUrl}
      
      Based on this URL, provide a comprehensive overview of the company including:
      1. What the company does - their core business and mission
      2. Their main products/services in detail
      3. Company culture and values
      4. Any information you can infer about recent projects or initiatives
      5. Likely technology stack based on the company's industry and products
      6. Market position and likely competitors
      
      Format your response in HTML paragraphs with appropriate headings.`,
    })

    // Generate role requirements analysis using OpenAI
    const { text: roleRequirements } = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are an expert career coach helping a CS student prepare for a job interview.
      
      Here is the job description:
      ${jobDescription}
      
      Analyze this job description and provide:
      1. Key technical skills required
      2. Soft skills emphasized
      3. Experience level expected
      4. Main responsibilities of the role
      5. How the student should position their experience for this role
      
      Format your response in HTML with appropriate headings and bullet points.`,
    })

    // Generate potential interview questions and answers using OpenAI
    const { text: questionsAndAnswersRaw } = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are an expert career coach helping a CS student prepare for a job interview.
      
      Job description:
      ${jobDescription}
      
      Company website: ${companyUrl}
      
      Generate 5 likely interview questions for this role and provide strong sample answers.
      Include both technical and behavioral questions.
      
      Format your response as a JSON array with this structure:
      [
        {
          "question": "Question text here",
          "answer": "Sample answer here"
        }
      ]
      
      Return ONLY the JSON array with no additional text.`,
    })

    // Parse the questions and answers JSON
    const potentialQuestions = JSON.parse(questionsAndAnswersRaw)

    // Generate technical preparation guidance using OpenAI
    const { text: technicalPrep } = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are an expert career coach helping a CS student prepare for a job interview.
      
      Job description:
      ${jobDescription}
      
      Based on this job description, provide specific technical topics the student should review before the interview:
      1. Programming concepts
      2. Data structures and algorithms
      3. System design concepts
      4. Specific technologies mentioned
      5. Recommended practice exercises
      
      Format your response in HTML with appropriate headings and bullet points.`,
    })

    return {
      companyOverview,
      roleRequirements,
      potentialQuestions,
      technicalPrep,
    }
  } catch (error) {
    console.error("Error generating interview prep:", error)
    throw new Error("Failed to generate interview preparation materials")
  }
}

