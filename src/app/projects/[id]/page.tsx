'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ProjectLaunchService, type LaunchStatus, type LaunchMetrics } from '@/services/project/launch'

interface ProjectDetails {
  id: string
  name: string
  description: string
  status: LaunchStatus
  tokenSymbol: string
  assetId?: number
  vestingContractId?: number
  poolId?: number
  createdAt: Date
  launchedAt?: Date
}

export default function ProjectStatusPage() {
  const { id } = useParams()
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [metrics, setMetrics] = useState<LaunchMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch project details')
        }
        const data = await response.json()
        setProject(data)

        if (data.status === 'live') {
          const metrics = await ProjectLaunchService.getLaunchMetrics(id as string)
          setMetrics(metrics)
        }
      } catch (error) {
        console.error('Error fetching project:', error)
        setError('Failed to load project details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjectDetails()
  }, [id])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h2 className="text-red-800 font-semibold">Error</h2>
          <p className="text-red-600 mt-1">{error || 'Project not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="mt-2 text-gray-600">{project.description}</p>
      </div>

      {/* Launch Status */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Launch Status</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Current Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                project.status === 'live'
                  ? 'bg-green-100 text-green-800'
                  : project.status === 'failed'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {project.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {project.assetId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Asset ID</span>
                <span className="font-mono">{project.assetId}</span>
              </div>
            )}

            {project.vestingContractId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Vesting Contract</span>
                <span className="font-mono">{project.vestingContractId}</span>
              </div>
            )}

            {project.poolId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Liquidity Pool</span>
                <span className="font-mono">{project.poolId}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Created</span>
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>

            {project.launchedAt && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Launched</span>
                <span>{new Date(project.launchedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Launch Progress */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Launch Progress</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            {[
              { step: 'Project Submission', status: project.status !== 'draft' },
              { step: 'KYC Verification', status: ['kyc_approved', 'contract_deployment_pending', 'contract_deployed', 'launch_preparation', 'launching', 'live'].includes(project.status) },
              { step: 'Contract Deployment', status: ['contract_deployed', 'launch_preparation', 'launching', 'live'].includes(project.status) },
              { step: 'Launch Preparation', status: ['launch_preparation', 'launching', 'live'].includes(project.status) },
              { step: 'Project Launch', status: project.status === 'live' },
            ].map((step, index) => (
              <div key={step.step} className="flex items-center">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  step.status ? 'bg-green-500' : 'bg-gray-200'
                }`}>
                  {step.status ? (
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-gray-600">{index + 1}</span>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className={`text-lg font-medium ${
                    step.status ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.step}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Launch Metrics */}
      {metrics && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Launch Metrics</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Market Cap</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  ${metrics.marketCap.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Liquidity</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  ${metrics.liquidity.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Holders</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {metrics.holders.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Price</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  ${metrics.price.toFixed(6)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">24h Volume</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  ${metrics.volume24h.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 