'use client'

import { Scale, FileText, Shield, AlertCircle } from 'lucide-react'

const DEFAULT_LEGAL_DOCS = [
  'Terms of Service',
  'Privacy Policy',
  'Token Agreement',
  'Investment Disclaimer'
]

export function LegalView({ project }) {
  const documentation = project?.metadata?.documentation || {};
  const legalDocs = documentation.legal || DEFAULT_LEGAL_DOCS;
  const governance = documentation.governance || 'Standard governance framework applies to this project.';

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Scale className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Legal Documentation</h2>
      </div>

      {/* Legal Documents */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Legal Framework</h3>
        <div className="space-y-6">
          {legalDocs.map((doc, index) => (
            <div key={index} className="flex items-start">
              <div className="p-1">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-900">{doc}</p>
                  <p className="text-xs text-gray-500">
                    {typeof doc === 'object' ? doc.description : 'Standard legal documentation required for project operation'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Governance Framework */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Governance Framework</h3>
        <div className="flex items-start">
          <div className="p-1">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-600">{governance}</p>
          </div>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Compliance Information
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                This documentation is provided for informational purposes only. 
                Please consult with legal professionals for advice specific to your situation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 