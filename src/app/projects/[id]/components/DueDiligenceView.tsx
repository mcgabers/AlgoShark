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

function formatMetricValue(value: any): string {
  if (value === undefined || value === null) return 'N/A';
  if (typeof value === 'number') {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
  }
  if (typeof value === 'string') return value;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

function getMetricStatus(key: string, value: any): 'passed' | 'warning' | 'failed' {
  if (value === undefined || value === null) return 'failed';
  
  // Financial metrics
  if (key.includes('revenue') || key.includes('profit')) {
    return value > 0 ? 'passed' : value === 0 ? 'warning' : 'failed';
  }
  
  // Growth metrics
  if (key.includes('growth') || key.includes('rate')) {
    return value > 0.1 ? 'passed' : value > 0 ? 'warning' : 'failed';
  }
  
  // Percentage metrics
  if (typeof value === 'number' && (key.includes('percentage') || key.includes('ratio'))) {
    return value > 0.7 ? 'passed' : value > 0.4 ? 'warning' : 'failed';
  }
  
  // Boolean metrics
  if (typeof value === 'boolean') {
    return value ? 'passed' : 'failed';
  }
  
  // Default case
  return 'passed';
}

function transformToArray(data: any) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object') return Object.entries(data).map(([key, value]) => ({
    ...value,
    category: key,
  }));
  return [];
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
      items: transformToArray(dueDiligence.codeAnalysis?.issues).map(item => ({
        name: item.type || 'Unknown Issue',
        status: item.severity === 'critical' || item.severity === 'high' ? 'failed' :
               item.severity === 'medium' ? 'warning' : 'passed',
        description: item.description || 'No description available'
      }))
    },
    {
      title: 'Legal Compliance',
      items: transformToArray(dueDiligence.legalChecks?.compliance).map(item => ({
        name: item.category || 'Unknown Category',
        status: item.status === 'pass' ? 'passed' :
               item.status === 'warning' ? 'warning' : 'failed',
        description: item.details || 'No details available'
      }))
    },
    {
      title: 'Security Audit',
      items: transformToArray(dueDiligence.securityAudit?.vulnerabilities).map(item => ({
        name: item.type || 'Unknown Vulnerability',
        status: item.severity === 'critical' || item.severity === 'high' ? 'failed' :
               item.severity === 'medium' ? 'warning' : 'passed',
        description: item.description || item.recommendation || 'No description available'
      }))
    }
  ]

  // Add metrics section if available
  const metrics = dueDiligence.metrics || dueDiligence.codeAnalysis?.metrics || {};
  if (Object.keys(metrics).length > 0) {
    sections.push({
      title: 'Project Metrics',
      items: Object.entries(metrics).map(([key, value]) => ({
        name: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        status: getMetricStatus(key, value),
        description: `Current Value: ${formatMetricValue(value)}`
      }))
    });
  }

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
                {section.items.map((item, index) => {
                  const Icon = StatusIcon[item.status]
                  return (
                    <div key={`${item.name}-${index}`} className="p-4">
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