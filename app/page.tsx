import { InterviewPrepForm } from "@/components/interview-prep-form"
import { useState } from "react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative Elements - Repositioned more to the left */}
        <div className="hidden md:block absolute top-24 left-1/6 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="hidden md:block absolute top-36 left-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="hidden md:block absolute bottom-24 left-1/6 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="container max-w-6xl mx-auto px-4 py-20 md:py-28">
          {/* Header */}
          <div className="flex flex-col items-center mb-16 header-section">
            <div className="flex items-center mb-4 relative">
              <div className="mr-2 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                  <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.196 7.616.573a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Prepyfy</h1>
              <div className="absolute -right-16 -top-6">
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold py-1 px-3 rounded-full rotate-12 inline-block transform">100% Free</span>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto text-center">
              Your AI-powered interview notes generator for landing your dream tech role
            </p>
          </div>
          
          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-10 items-center results-layout">
            <div className="hero-intro-section">
              <div className="space-y-6 max-w-lg bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-indigo-100 shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800">
                  Ace your next tech interview
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start transform transition-all duration-300 hover:translate-x-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3 mt-1 shadow-md">
                      <span className="text-white text-sm font-semibold">1</span>
                    </div>
                    <p className="text-gray-700 font-medium">Paste your job description and company URL</p>
                  </div>
                  <div className="flex items-start transform transition-all duration-300 hover:translate-x-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3 mt-1 shadow-md">
                      <span className="text-white text-sm font-semibold">2</span>
                    </div>
                    <p className="text-gray-700 font-medium">Our AI analyzes the company and role requirements</p>
                  </div>
                  <div className="flex items-start transform transition-all duration-300 hover:translate-x-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center mr-3 mt-1 shadow-md">
                      <span className="text-white text-sm font-semibold">3</span>
                    </div>
                    <p className="text-gray-700 font-medium">Get personalized interview notes in seconds</p>
                  </div>
                </div>
                
                <div className="pt-4 flex flex-wrap gap-3">
                  <div className="flex items-center px-3 py-2 bg-gray-50 rounded-full shadow-sm text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-indigo-500">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    <span>Role-specific questions</span>
                  </div>
                  <div className="flex items-center px-3 py-2 bg-gray-50 rounded-full shadow-sm text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-indigo-500">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    <span>Company insights</span>
                  </div>
                  <div className="flex items-center px-3 py-2 bg-gray-50 rounded-full shadow-sm text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-indigo-500">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    <span>Strategic playbook</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-container md:col-span-1 md:results-full-width">
              <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 relative z-10">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Generate your interview prep</h3>
                  <p className="text-sm text-gray-500">Paste a job description and company URL to get started</p>
                </div>
                <InterviewPrepForm />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section with Example */}
      <div className="bg-white py-20 features-section">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How Prepyfy helps you succeed</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">Our AI-powered platform creates customized interview materials tailored to your target role and company</p>
            <p className="text-indigo-600 font-medium">100% free - no credit card or login required!</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Company Intelligence</h3>
              <p className="text-gray-600 mb-4">Get detailed insights on company culture, recent projects, and key focus areas to help you connect with interviewers.</p>
              <div className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-700 mt-auto">
                "Their recent partnership with Microsoft shows a focus on AI integration. Mention your experience with similar collaborations."
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Practice Questions</h3>
              <p className="text-gray-600 mb-4">Prepare with role-specific questions, sample answers, and insights into what the interviewer is really looking for.</p>
              <div className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-700 mt-auto">
                "Describe how you've handled a challenging technical problem. Include your approach and the impact of your solution."
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Strategic Guidance</h3>
              <p className="text-gray-600 mb-4">Get a personalized playbook with key talking points and strategies to highlight your strengths for the specific role.</p>
              <div className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-700 mt-auto">
                "Emphasize your experience with data visualization tools - mentioned 3 times in the job description."
              </div>
            </div>
          </div>
          
          {/* Example of interview notes preview */}
          <div className="mt-16 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold">Example Interview Notes Preview</h3>
              <span className="text-xs bg-white text-indigo-600 px-2 py-1 rounded-full font-medium">Generated in seconds</span>
            </div>
            <div className="grid md:grid-cols-3 divide-x divide-gray-200">
              <div className="p-4">
                <div className="font-semibold text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-indigo-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                  Company Research
                </div>
                <p className="text-sm text-gray-600 mb-2"><strong>Acme Inc.</strong> is a leader in cloud infrastructure with a focus on security.</p>
                <div className="text-xs text-gray-500 p-2 bg-blue-50 rounded border border-blue-100">
                  <strong>Key Insight:</strong> Their recent Series D funding was specifically for expanding their AI capabilities.
                </div>
              </div>
              <div className="p-4">
                <div className="font-semibold text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-purple-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                  </svg>
                  Role Strategy
                </div>
                <p className="text-sm text-gray-600 mb-2">For the <strong>Senior Developer</strong> role, emphasize your experience with:</p>
                <div className="flex items-center text-xs text-gray-600 mb-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Containerization & Kubernetes
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  CI/CD pipeline optimization
                </div>
              </div>
              <div className="p-4">
                <div className="font-semibold text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-amber-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                  Sample Question
                </div>
                <p className="text-sm text-gray-600 italic mb-1">"How would you approach refactoring our legacy authentication system?"</p>
                <div className="text-xs text-gray-500 p-2 bg-amber-50 rounded border border-amber-100">
                  <strong>Coaching Tip:</strong> Focus on security considerations and how you'd ensure minimal disruption during the transition.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

