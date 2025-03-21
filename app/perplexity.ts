"use server"

import { searchCompanyInfoFallback } from "./perplexity-fallback"

export async function searchCompanyInfo(companyUrl: string) {
  if (!process.env.PERPLEXITY_API_KEY) {
    throw new Error("Perplexity API key is not configured")
  }

  try {
    console.log("Searching company info with Perplexity API for:", companyUrl)

    // Extract the domain name for better search results
    let domain = companyUrl
    try {
      const url = new URL(companyUrl)
      domain = url.hostname.replace("www.", "")
    } catch (e) {
      // If parsing fails, try to add https:// and parse again
      try {
        const url = new URL(`https://${companyUrl}`)
        domain = url.hostname.replace("www.", "")
      } catch (e2) {
        console.warn("Could not parse URL, using as-is:", companyUrl)
      }
    }

    // First, let's do a direct search of the company website for projects and detailed information
    const websiteSearchQuery = `Visit the website ${companyUrl} and explore it thoroughly. Find and report on:
    1. Detailed information about specific projects, case studies, or client work they showcase
    2. Recent news, blog posts, or press releases about their work (from the last 1-2 years)
    3. Information about their products or services with specific details
    4. Any technical information about their technology stack or methodologies
    
    Be very specific and detailed. Include names of actual projects, clients, technologies, and initiatives you find on their website. Do NOT say "information isn't available" without thoroughly checking their website, including their blog, case studies, about page, and careers sections.`

    // Then, let's do a broader web search about the company
    const companySearchQuery = `Research the company ${domain} online. Find and report on:
    1. What they do - core business and mission
    2. Their main products/services in detail
    3. Company culture and values
    4. Recent projects, news, or initiatives (last 1-2 years) - be very specific with names and details
    5. Technology stack they use
    6. Market position and competitors
    
    Be very specific and detailed. Include names of actual projects, clients, technologies, and initiatives. Do NOT say "information isn't available" without thoroughly searching.`

    // Use the officially supported models
    const models = ["sonar-reasoning-pro", "sonar-pro"]

    // Try each model in sequence until one works
    let websiteSearchData, companySearchData
    let currentModel
    let success = false

    for (const model of models) {
      currentModel = model
      console.log(`Trying Perplexity API with model: ${model}`)

      try {
        // Execute both searches in parallel
        const [websiteSearchResponse, companySearchResponse] = await Promise.all([
          fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
            },
            body: JSON.stringify({
              model: model,
              messages: [
                {
                  role: "system",
                  content:
                    "You are a thorough research assistant that explores websites in detail to find specific information. You always provide concrete details and examples, never generic statements.",
                },
                {
                  role: "user",
                  content: websiteSearchQuery,
                },
              ],
              options: {
                web_search: true,
              },
            }),
          }),

          fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
            },
            body: JSON.stringify({
              model: model,
              messages: [
                {
                  role: "system",
                  content:
                    "You are a thorough research assistant that provides detailed, specific information about companies based on the latest available information online. You always provide concrete details and examples, never generic statements.",
                },
                {
                  role: "user",
                  content: companySearchQuery,
                },
              ],
              options: {
                web_search: true,
              },
            }),
          }),
        ])

        // Check if both responses are OK
        if (websiteSearchResponse.ok && companySearchResponse.ok) {
          websiteSearchData = await websiteSearchResponse.json()
          companySearchData = await companySearchResponse.json()

          if (websiteSearchData.choices?.[0]?.message?.content && companySearchData.choices?.[0]?.message?.content) {
            success = true
            break // We found a working model
          }
        } else {
          // Log the error response
          const websiteErrorText = websiteSearchResponse.ok ? "" : await websiteSearchResponse.text()
          const companyErrorText = companySearchResponse.ok ? "" : await companySearchResponse.text()
          console.error(`Model ${model} failed:`, { websiteError: websiteErrorText, companyError: companyErrorText })
        }

        // If we get here, this model didn't work, try the next one
        console.log(`Model ${model} failed, trying next model...`)
      } catch (error) {
        console.error(`Error with model ${model}:`, error)
        // Continue to the next model
      }
    }

    // If none of the models worked, try the fallback approach
    if (!success) {
      console.log("All models failed, trying fallback approach")
      return await searchCompanyInfoFallback(companyUrl)
    }

    // If we get here, one of the models worked
    console.log(`Successfully used model: ${currentModel}`)

    const websiteInfo = websiteSearchData.choices[0].message.content
    const companyInfo = companySearchData.choices[0].message.content

    // Combine the information from both searches
    return `
    # Website-specific information:
    ${websiteInfo}
    
    # General company information:
    ${companyInfo}
    `
  } catch (error) {
    console.error("Error using Perplexity API:", error)

    // Try the fallback approach
    console.log("Main approach failed, trying fallback approach")
    try {
      return await searchCompanyInfoFallback(companyUrl)
    } catch (fallbackError) {
      console.error("Fallback approach also failed:", fallbackError)
      throw error // Throw the original error
    }
  }
}

