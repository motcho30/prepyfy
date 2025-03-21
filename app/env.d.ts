declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY: string
      PERPLEXITY_API_KEY: string
      GOOGLE_SHEETS_CLIENT_EMAIL: string
      GOOGLE_SHEETS_PRIVATE_KEY: string
      GOOGLE_SHEETS_SPREADSHEET_ID: string
    }
  }
}

export {}

