'use client'

import { Shield, Check, AlertTriangle, XCircle } from 'lucide-react'

interface DueDiligenceSection {
  title: string
  items: {
    name: string
    status: 'passed' | 'warning' | 'failed'
    description: string
  }[]
}

const StatusIcon = {
  passed: Check,
  warning: AlertTriangle,
  failed: XCircle,
}

const StatusColor = {
  passed: 'text-green-600',
  warning: 'text-yellow-600',
  failed: 'text-red-600',
}

export function DueDiligenceView({ dueDiligence }) {
  if (!dueDiligence) {
    return (
      <div className="text-center py-8">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Due Diligence Data</h3>
        <p className="mt-1 text-sm text-gray-500">
          Due diligence process has not been initiated for this project yet.
        </p>
      </div>
    )
  }

  const sections: DueDiligenceSection[] = [
    {
      title: 'Code Analysis',
      items: (dueDiligence.codeAnalysis || []).map(item => ({
        name: item.check,
        status: item.result,
        description: item.details
      }))
    },
    {
      title: 'Legal Compliance',
      items: (dueDiligence.legalChecks || []).map(item => ({
        name: item.requirement,
        status: item.status,
        description: item.details
      }))
    },
    {
      title: 'Security Audit',
      items: (dueDiligence.securityAudit || []).map(item => ({
        name: item.check,
        status: item.result,
        description: item.findings
      }))
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Due Diligence Report</h2>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {sections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
            {section.items.length > 0 ? (
              <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                {section.items.map((item) => {
                  const Icon = StatusIcon[item.status]
                  return (
                    <div key={item.name} className="p-4">
                      <div className="flex items-start">
                        <div className={`p-1 ${StatusColor[item.status]}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">
                            {item.name}
                          </h4>
                          <p className="mt-1 text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data available for this section.</p>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Due Diligence Status
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Last updated: {dueDiligence.updatedAt ? new Date(dueDiligence.updatedAt).toLocaleDateString() : 'Not available'}
              </p>
              <p className="mt-1">
                Status: {dueDiligence.status || 'Pending'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 