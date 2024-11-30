'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/contexts/WalletContext'
import { TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  fundingGoal: number
  currentFunding: number
  category: string
  tags: string[]
  assetId: number
  tokenPrice: number
  tokensAvailable: number
  trendingScore: number
}

export default function TrendingPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isConnected } = useWallet()

  useEffect(() => {
    async function fetchTrendingProjects() {
      try {
        const response = await fetch('/api/projects?sort=trending')
        if (!response.ok) throw new Error('Failed to fetch trending projects')
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error('Error fetching trending projects:', error)
        setError('Failed to load trending projects')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrendingProjects()
  }, [])

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Trending Projects
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Discover the most active and fastest-growing projects
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-pulse space-y-4">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="rounded-md bg-gray-50 p-4">
              <p className="text-sm text-gray-700">No trending projects found.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">{project.description}</p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-5 w-5" />
                    <span className="ml-1 text-sm font-medium">
                      {Math.round(project.trendingScore)}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>
                      {Math.round((project.currentFunding / project.fundingGoal) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (project.currentFunding / project.fundingGoal) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Current Funding</span>
                    <span>
                      ${project.currentFunding.toLocaleString()} of $
                      {project.fundingGoal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Token Price</span>
                    <span>{project.tokenPrice} ALGO</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
} 