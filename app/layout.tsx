import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prepyfy | AI-Powered Interview Preparation",
  description: "Generate personalized interview preparation materials for your next job interview",
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: '/apple-touch-icon.png',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          forcedTheme="light"
        >
          {children}
        </ThemeProvider>
        
        {/* Add Netlify script for enhanced function capabilities */}
        <script 
          dangerouslySetInnerHTML={{ 
            __html: `
              // Helper function to detect and report Netlify function errors
              window.addEventListener('error', function(e) {
                if (e.message && (
                  e.message.includes('unexpected response') || 
                  e.message.includes('502') ||
                  e.message.includes('function invocation failed')
                )) {
                  console.warn('Detected likely Netlify function error:', e);
                  // Can add custom error reporting or UI handling here
                }
              });
            `
          }}
        />
      </body>
    </html>
  )
}