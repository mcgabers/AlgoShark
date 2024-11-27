'use client'

import { Scale, FileText, Shield, AlertCircle } from 'lucide-react'

export function LegalView({ project }) {
  const { documentation } = project.metadata

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
          {documentation.legal.map((doc, index) => (
            <div key={index} className="flex items-start">
              <div className="p-1">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">{doc}</p>
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
            <p className="text-sm text-gray-600">{documentation.governance}</p>
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