"use server"

export async function searchCompanyInfoFallback(companyUrl: string) {
  if (!process.env.PERPLEXITY_API_KEY) {
    throw new Error("Perplexity API key is not configured")
  }

  try {
    console.log("Searching company info with Perplexity API fallback for:", companyUrl)

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

    // Create a single query that combines both website and general search
    const combinedQuery = `Research the company ${domain} thoroughly. Visit their website ${companyUrl} and search online for:
    
    1. What they do - core business and mission
    2. Their main products/services in detail
    3. Company culture and values
    4. Recent projects, news, or initiatives (last 1-2 years) - be very specific with names and details
    5. Technology stack they use
    6. Market position and competitors
    
    Be very specific and detailed. Include names of actual projects, clients, technologies, and initiatives you find on their website and online. Do NOT say "information isn't available" without thoroughly checking their website, including their blog, case studies, about page, and careers sections.`

    // Try with a simpler approach using a single API call
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sonar-pro", // Use the officially supported model
        messages: [
          {
            role: "system",
            content:
              "You are a thorough research assistant that explores websites and online sources in detail to find specific information about companies. You always provide concrete details and examples, never generic statements.",
          },
          {
            role: "user",
            content: combinedQuery,
          },
        ],
        options: {
          web_search: true,
        },
      }),
    })

    // Process the response
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const errorText = errorData ? JSON.stringify(errorData) : await response.text()
      console.error("Perplexity API fallback error:", errorText)
      throw new Error(`Perplexity API fallback error: ${errorText}`)
    }

    const data = await response.json()

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from Perplexity API")
    }

    return data.choices[0].message.content
  } catch (error) {
    console.error("Error using Perplexity API fallback:", error)
    throw error
  }
}

