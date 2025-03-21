"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, FileText, HelpCircle, MessageSquare, Lightbulb, AlertTriangle, BookOpen, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Question {
  question: string
  answer: string
  tip?: string
  interviewer_looking_for?: string
}

interface InterviewPrepResultsProps {
  results: {
    companyOverview: string
    roleRequirements: string
    potentialQuestions: Question[]
    technicalPrep?: string | null
    isTechnical?: boolean
    roleCategory: string
    usingPerplexity?: boolean
  }
}

export function InterviewPrepResults({ results }: InterviewPrepResultsProps) {
  const [activeTab, setActiveTab] = useState("company")

  // Ensure potentialQuestions is an array
  const questions = Array.isArray(results.potentialQuestions) ? results.potentialQuestions : []

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-3">
          Your Interview Game Plan
        </h2>
        <p className="text-lg text-gray-600">
          Personalized preparation for your {results.roleCategory} interview
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-gray-100 p-1 rounded-full mb-8">
          <TabsTrigger 
            value="company" 
            className="rounded-full data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
          >
            <Building className="h-4 w-4 mr-2" />
            <span>Company</span>
          </TabsTrigger>
          <TabsTrigger 
            value="role" 
            className="rounded-full data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            <span>Strategy</span>
          </TabsTrigger>
          <TabsTrigger 
            value="questions" 
            className="rounded-full data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            <span>Questions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-0">
          <Card className="border-gray-200 shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Company Insights</CardTitle>
                  <CardDescription>Key information to demonstrate company knowledge</CardDescription>
                </div>
                {results.usingPerplexity !== undefined && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-white">
                    <Globe className="h-3 w-3" />
                    {results.usingPerplexity ? "Web Research Enabled" : "Basic Research"}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="prose max-w-none p-8">
              <div dangerouslySetInnerHTML={{ __html: results.companyOverview }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="role" className="mt-0">
          <Card className="border-gray-200 shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
              <CardTitle>Role Strategy Guide</CardTitle>
              <CardDescription>Your personalized playbook for interview success</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div dangerouslySetInnerHTML={{ __html: results.roleRequirements }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="mt-0">
          <Card className="border-gray-200 shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b border-gray-200">
              <CardTitle>Interview Questions & Coaching</CardTitle>
              <CardDescription>Practice questions with sample answers and tips</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 gap-8">
                {questions.length > 0 ? (
                  questions.map((item, index) => (
                    <div key={index} className="p-6 rounded-xl border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <HelpCircle className="h-4 w-4 text-indigo-600" />
                        </div>
                        <h3 className="font-medium text-gray-900 text-lg">{item.question}</h3>
                      </div>

                      <div className="ml-11 space-y-5">
                        <div className="space-y-2">
                          <div className="font-medium text-gray-900 flex items-center">
                            <MessageSquare className="h-4 w-4 text-blue-600 mr-2" />
                            Sample Answer
                          </div>
                          <div className="pl-6 border-l-2 border-blue-100 text-gray-700">
                            <p>{item.answer}</p>
                          </div>
                        </div>

                        {item.tip && (
                          <div className="space-y-2">
                            <div className="font-medium text-amber-700 flex items-center">
                              <Lightbulb className="h-4 w-4 text-amber-500 mr-2" />
                              Coaching Tip
                            </div>
                            <div className="bg-amber-50 p-4 rounded-md border border-amber-100 text-gray-700">
                              <p>{item.tip}</p>
                            </div>
                          </div>
                        )}

                        {item.interviewer_looking_for && (
                          <div className="space-y-2">
                            <div className="font-medium text-indigo-700 flex items-center">
                              <AlertTriangle className="h-4 w-4 text-indigo-600 mr-2" />
                              What They're Looking For
                            </div>
                            <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100 text-gray-700">
                              <p>{item.interviewer_looking_for}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <HelpCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No questions available. Please try regenerating the interview prep.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-sm text-gray-600">
        <div className="flex items-start gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-gray-500 mt-0.5" />
          <span className="font-medium text-base">Pro Tips</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ml-7">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
            <span>Review company updates before the interview</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-400 rounded-sm"></div>
            <span>Practice answers out loud to build confidence</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-400 rounded-sm"></div>
            <span>Prepare 2-3 questions to ask the interviewer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
            <span>Follow up with a thank you email within 24 hours</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center pt-6">
        <Button 
          onClick={() => {
            document.body.classList.remove('results-shown');
            window.location.reload();
          }} 
          variant="outline"
          className="border-gray-200 hover:bg-gray-50 text-gray-700"
        >
          Prepare for Another Interview
        </Button>
      </div>
    </div>
  )
}

