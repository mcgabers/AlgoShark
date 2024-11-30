'use client'

import { Cpu, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react'

interface AIAnalysis {
  summary?: string;
  strengths?: string[];
  risks?: string[];
  opportunities?: string[];
  sentiment?: {
    score: number;
    label: string;
  };
}

const DEFAULT_ANALYSIS: AIAnalysis = {
  summary: 'AI analysis has not been generated for this project yet.',
  strengths: ['Strong market potential', 'Experienced team', 'Innovative technology'],
  risks: ['Market competition', 'Regulatory considerations', 'Technology implementation challenges'],
  opportunities: ['Market expansion', 'Product development', 'Strategic partnerships']
};

export function AIAnalysisView({ project }) {
  const aiAnalysis: AIAnalysis = project?.metadata?.aiAnalysis || DEFAULT_ANALYSIS;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Cpu className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">AI Analysis</h2>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Executive Summary</h3>
        <p className="text-sm text-gray-600">{aiAnalysis.summary}</p>
      </div>

      {/* Strengths */}
      {aiAnalysis.strengths && aiAnalysis.strengths.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Key Strengths</h3>
          <div className="space-y-4">
            {aiAnalysis.strengths.map((strength, index) => (
              <div key={index} className="flex items-start">
                <div className="p-1">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">{strength}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risks */}
      {aiAnalysis.risks && aiAnalysis.risks.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Potential Risks</h3>
          <div className="space-y-4">
            {aiAnalysis.risks.map((risk, index) => (
              <div key={index} className="flex items-start">
                <div className="p-1">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">{risk}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opportunities */}
      {aiAnalysis.opportunities && aiAnalysis.opportunities.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Growth Opportunities</h3>
          <div className="space-y-4">
            {aiAnalysis.opportunities.map((opportunity, index) => (
              <div key={index} className="flex items-start">
                <div className="p-1">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">{opportunity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sentiment Score */}
      {aiAnalysis.sentiment && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">AI Sentiment Analysis</h3>
          <div className="flex items-center space-x-4">
            <div className={`text-2xl font-bold ${
              aiAnalysis.sentiment.score > 0.7 ? 'text-green-600' :
              aiAnalysis.sentiment.score > 0.4 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {Math.round(aiAnalysis.sentiment.score * 100)}%
            </div>
            <div className="text-sm text-gray-600">
              {aiAnalysis.sentiment.label}
            </div>
          </div>
        </div>
      )}

      {/* AI Disclaimer */}
      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Cpu className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              AI-Generated Analysis
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                This analysis is generated by our AI system based on available project data. 
                While comprehensive, it should be used as one of many tools in your due diligence process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 