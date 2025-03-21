"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { searchCompanyInfo } from "./perplexity"

// Helper function to extract JSON from a string that might contain markdown code blocks
function extractJsonFromString(str: string) {
  // First try to parse the string directly
  try {
    return JSON.parse(str)
  } catch (e: any) {
    // If direct parsing fails, try to extract JSON from markdown code blocks
    const jsonMatch = str.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1])
      } catch (extractError: any) {
        throw new Error(`Failed to parse JSON from markdown: ${extractError.message}`)
      }
    }
    throw new Error(`Failed to extract JSON from response: ${e.message}`)
  }
}

// Add a new function to clean AI model responses
function cleanAIResponse(text: string): string {
  if (!text) return "";
  
  // Remove common AI preambles like "Sure," "Certainly!", "I'd be happy to", etc.
  let cleaned = text.replace(/^(Sure!|Certainly!|I'd be happy to|Here's|Let's|I'll|Absolutely!|Great!|Of course!)[,\s]+(.*?\n|.*?create|.*?provide|.*?generate|.*?help)/i, "");
  
  // Remove markdown code block indicators
  cleaned = cleaned.replace(/```(?:html|json|markdown|md|)[\s]*/g, "");
  cleaned = cleaned.replace(/```[\s]*$/g, "");
  
  // Remove markdown heading indicators that might appear in the text
  cleaned = cleaned.replace(/^###\s+(.*)$/gm, "<h3>$1</h3>");
  cleaned = cleaned.replace(/^##\s+(.*)$/gm, "<h2>$1</h2>");
  cleaned = cleaned.replace(/^#\s+(.*)$/gm, "<h1>$1</h1>");
  
  // Remove lines that only contain dashes (often used as separators in AI responses)
  cleaned = cleaned.replace(/^---+$/gm, "");
  
  // Remove any trailing/leading whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
}

export async function generateInterviewPrep(jobDescription: string, companyUrl: string) {
  // Verify that we have the OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured. Please check your environment variables.")
  }

  try {
    console.log("Starting interview prep generation")

    // First, analyze if the role is technical
    const { text: roleAnalysis } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analyze this job description and determine if it's a technical role (like software engineering, data science, IT) or a non-technical role (like marketing, sales, HR).
      
      Job description:
      ${jobDescription}
      
      Return ONLY a JSON object with this structure, with NO markdown formatting, NO code blocks, and NO additional text:
      {
        "isTechnical": true/false,
        "roleCategory": "software engineering"/"marketing"/etc.,
        "keySkills": ["skill1", "skill2", "skill3"]
      }`,
      temperature: 0.3,
    })

    console.log("Role analysis raw response:", roleAnalysis)

    let roleInfo
    try {
      roleInfo = extractJsonFromString(roleAnalysis)
      console.log("Successfully parsed role info:", roleInfo)
    } catch (e) {
      console.error("Error parsing role analysis:", e)
      // Default to technical if we can't parse
      roleInfo = { isTechnical: true, roleCategory: "unknown", keySkills: [] }
    }

    console.log("Role analysis:", roleInfo)

    // Get company information using Perplexity API
    let companyResearchData
    let usingPerplexity = true

    try {
      console.log("Fetching company information with Perplexity API")
      companyResearchData = await searchCompanyInfo(companyUrl)
      console.log("Successfully retrieved company information from Perplexity")
    } catch (perplexityError) {
      console.error("Error with Perplexity API, falling back to OpenAI:", perplexityError)
      usingPerplexity = false

      // Fallback to OpenAI if Perplexity fails
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `You are an expert researcher. Research information about the company with this website: ${companyUrl}
        
        Provide comprehensive information about:
        1. What they do - core business and mission
        2. Their main products/services in detail
        3. Company culture and values
        4. Recent projects or initiatives - be very specific with names and details
        5. Technology stack they likely use
        6. Market position and competitors
        
        Be very specific and detailed. Include names of actual projects, clients, technologies, and initiatives. Do NOT say "information isn't available" without thoroughly searching.`,
        temperature: 0.7,
        maxTokens: 1500,
      })

      companyResearchData = text
    }

    // Now use the company research data to create personalized notes
    const { text: companyOverview } = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are an expert career coach helping a student prepare for a job interview.
      
      Here is detailed research about the company:
      ${companyResearchData}
      
      Create a personalized research notebook about this company based on the above information. Include:
      
      1. What the company does - their core business and mission
      2. Their main products/services in detail
      3. Company culture and values
      4. Recent projects or initiatives (be specific about actual projects mentioned in the research)
      5. Technology stack they use (be specific based on the research)
      6. Market position and competitors
      
      IMPORTANT: 
      - This should feel like personalized notes, not a generic report
      - NEVER say "specific projects aren't publicly detailed" or similar phrases if the research contains project information
      - ALWAYS include specific project names, clients, and initiatives that were found in the research
      - If the research mentions specific projects, technologies, or clients, include those exact details
      - Do not generalize or make assumptions - use the specific information provided
      
      Throughout your response:
      - Add personal notes like "Pay attention to this!" or "This is really important to mention in your interview"
      - Include specific tips on how to connect their experience to this company's values
      - Highlight key information that would impress the interviewer
      - Reference specific details from the research, not generic statements
      
      Format your response in HTML with:
      - Use <div class="tip">...</div> for tips and advice
      - Use <div class="highlight">...</div> for important information to highlight
      - Use <div class="note">...</div> for personal notes and reminders
      - Use <div class="action">...</div> for specific actions to take before the interview
      - Use appropriate headings, paragraphs, and bullet points
      `,
      temperature: 0.7,
      maxTokens: 1500,
    })

    // Run remaining API calls concurrently to reduce total time
    const [roleRequirementsResult, questionsAndAnswersResult] = await Promise.all([
      // Generate role requirements analysis
      generateText({
        model: openai("gpt-4o"),
        prompt: `You are creating an INTERACTIVE INTERVIEW PLAYBOOK for a job candidate. This is NOT a generic analysis - it's a practical, visual guide with specific actions and insights.

        Job description:
        ${jobDescription}
        
        This is a ${roleInfo.isTechnical ? "technical" : "non-technical"} role in the field of ${roleInfo.roleCategory}.
        
        Create a highly visual, engaging playbook that feels like a personalized coaching session. Focus on PRACTICAL ADVICE and SPECIFIC ACTIONS the candidate should take.
        
        IMPORTANT GUIDELINES:
        1. Make it EXTREMELY VISUAL with clear sections and minimal text
        2. Use a direct, conversational tone ("you should..." not "candidates should...")
        3. Focus on ACTIONABLE insights, not just analysis
        4. Include specific examples and talking points
        5. Make it feel like a personal coach is speaking directly to them
        
        STRUCTURE YOUR RESPONSE WITH THESE SECTIONS:
        
        1. "KEY SKILLS CHECKLIST" - Create a visual checklist of the 4-5 most important skills with specific examples of how to demonstrate each:
        
        <div class="skills-checklist">
          <h3 class="section-title">Key Skills Checklist</h3>
          
          <div class="skill-card">
            <div class="skill-header">
              <div class="skill-name">JavaScript Expertise</div>
              <div class="skill-importance">Critical</div>
            </div>
            <div class="skill-examples">
              <p><strong>How to demonstrate:</strong> Mention your React project that processed 10,000+ records, your optimization that improved performance by 40%</p>
            </div>
            <div class="skill-prep">
              <p><strong>Prepare to discuss:</strong> Complex state management, async operations, performance optimization</p>
            </div>
          </div>
          
          <!-- Repeat for other skills -->
        </div>
        
        2. "TALKING POINTS" - Create 3-4 specific talking points that connect the candidate's background to the role:
        
        <div class="talking-points">
          <h3 class="section-title">Your Talking Points</h3>
          
          <div class="talking-point">
            <div class="point-number">1</div>
            <div class="point-content">
              <div class="point-title">Connect your [specific project/experience] to their need for [specific requirement]</div>
              <div class="point-script">
                "In my role at [Previous Company], I led a team that [specific achievement]. This experience directly relates to your need for [specific requirement] because..."
              </div>
            </div>
          </div>
          
          <!-- Repeat for other talking points -->
        </div>
        
        3. "INTERVIEW STRATEGY" - Create a visual game plan with specific do's and don'ts:
        
        <div class="interview-strategy">
          <h3 class="section-title">Your Interview Strategy</h3>
          
          <div class="strategy-columns">
            <div class="do-column">
              <h4 class="column-title">DO</h4>
              <ul class="strategy-list">
                <li>Emphasize your experience with [specific skill] - they mentioned this 3 times in the job description</li>
                <li>Ask about their recent project [specific project from research]</li>
                <li>Highlight your leadership experience with cross-functional teams</li>
              </ul>
            </div>
            
            <div class="dont-column">
              <h4 class="column-title">DON'T</h4>
              <ul class="strategy-list">
                <li>Focus too much on your [irrelevant skill] experience</li>
                <li>Forget to address potential concerns about your [potential weakness]</li>
                <li>Miss the opportunity to ask about [specific company initiative]</li>
              </ul>
            </div>
          </div>
        </div>
        
        4. "PREPARE FOR THESE QUESTIONS" - List 3-4 specific questions they're likely to ask with brief guidance:
        
        <div class="likely-questions">
          <h3 class="section-title">Prepare For These Questions</h3>
          
          <div class="question-card">
            <div class="question-text">"Tell me about your experience with [specific requirement]."</div>
            <div class="question-strategy">
              <p><strong>Strategy:</strong> Start with your most impressive project using this skill, quantify your impact, then connect to their specific needs.</p>
            </div>
          </div>
          
          <!-- Repeat for other questions -->
        </div>
        
        5. "YOUR ADVANTAGE" - Highlight 2-3 specific ways the candidate can stand out:
        
        <div class="your-advantage">
          <h3 class="section-title">Your Competitive Edge</h3>
          
          <div class="advantage-card">
            <div class="advantage-icon">★</div>
            <div class="advantage-content">
              <div class="advantage-title">Your [specific experience] gives you an edge</div>
              <div class="advantage-description">They're looking for someone who can [specific requirement] - your experience with [specific project] is a perfect match. Emphasize how you [specific achievement].</div>
            </div>
          </div>
          
          <!-- Repeat for other advantages -->
        </div>
        
        IMPORTANT: Make this EXTREMELY SPECIFIC to the job description. Use phrases like:
        - "They mentioned [specific skill] 3 times - this is clearly a priority"
        - "Based on the language they use about [topic], they're looking for someone who can..."
        - "The fact that they highlight [specific requirement] suggests that..."
        
        Focus on making this a PRACTICAL GUIDE with SPECIFIC ACTIONS, not just an analysis.
        `,
        temperature: 0.7,
        maxTokens: 1500,
      }),

      // Generate potential interview questions and answers
      generateText({
        model: openai("gpt-4o"),
        prompt: `You are an expert career coach helping a student prepare for a job interview.
        
        Job description:
        ${jobDescription}
        
        Company website: ${companyUrl}
        
        This is a ${roleInfo.isTechnical ? "technical" : "non-technical"} role in the field of ${roleInfo.roleCategory}.
        
        Generate 5 likely interview questions for this role and provide strong sample answers.
        ${roleInfo.isTechnical ? "Include both technical and behavioral questions." : "Focus on behavioral, situational, and role-specific questions."}
        
        IMPORTANT: Return a JSON array with NO markdown formatting, NO code blocks, and NO additional text.
        The response should start with [ and end with ] and be valid JSON.
        
        For each question and answer, include:
        1. The question text
        2. A strong sample answer
        3. A coaching tip on how to deliver this answer effectively
        4. A note on what the interviewer is really looking for with this question
        
        Use this exact structure:
        [
          {
            "question": "Question text here",
            "answer": "Sample answer here",
            "tip": "Coaching tip on delivery",
            "interviewer_looking_for": "What the interviewer wants to hear"
          }
        ]`,
        temperature: 0.7,
        maxTokens: 1500,
      }),
    ])

    console.log("Main API calls completed successfully")

    // Extract the text from each result
    const roleRequirements = roleRequirementsResult.text
    const questionsAndAnswersRaw = questionsAndAnswersResult.text

    console.log("Questions and answers raw response:", questionsAndAnswersRaw)

    // Parse the questions and answers JSON, handling potential formatting issues
    let potentialQuestions
    try {
      potentialQuestions = extractJsonFromString(questionsAndAnswersRaw)
      console.log("Successfully parsed questions and answers")
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError)
      // Fallback to a default structure
      potentialQuestions = [
        {
          question: "Tell me about your experience with the skills mentioned in the job description.",
          answer:
            "I would highlight my relevant experience with these skills, focusing on specific projects and achievements.",
          tip: "Be specific about projects where you used these skills and quantify your impact.",
          interviewer_looking_for:
            "They want to see if you have practical experience with their requirements and can hit the ground running.",
        },
        {
          question: "How do you approach problem-solving in your work?",
          answer:
            "I would describe my systematic approach to problem-solving, emphasizing analytical thinking and persistence.",
          tip: "Share a specific example that demonstrates your problem-solving process from start to finish.",
          interviewer_looking_for:
            "They're evaluating your analytical thinking and how methodical you are in approaching complex problems.",
        },
        {
          question: "Can you describe a challenging project you worked on and how you overcame obstacles?",
          answer:
            "I would share a specific example that demonstrates my skills, teamwork, and ability to overcome challenges.",
          tip: "Use the STAR method (Situation, Task, Action, Result) to structure your response clearly.",
          interviewer_looking_for: "They want to assess your resilience, adaptability, and how you handle pressure.",
        },
      ]
    }

    // After all the generation is complete, clean the responses before returning them
    const finalResults = {
      companyOverview: cleanAIResponse(companyOverview),
      roleRequirements: cleanAIResponse(roleRequirements),
      potentialQuestions: potentialQuestions,
      roleCategory: roleInfo.roleCategory,
      usingPerplexity,
    }

    return finalResults
  } catch (error) {
    console.error("Error generating interview prep:", error)
    throw new Error("Failed to generate interview preparation materials. Please check your API keys and try again.")
  }
}

