'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useWallet } from '@/contexts/WalletContext'
import { BarChart2, TrendingUp, Users, Activity, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { formatTimeAgo, formatAmount } from '@/lib/utils'

interface PlatformStats {
  totalProjects: number
  totalInvestors: number
  totalFunding: number
  activeProposals: number
}

interface Activity {
  id: string
  type: 'investment' | 'project' | 'proposal'
  user: string
  project: string
  amount?: number
  time: string
  projectId?: string
  proposalId?: string
}

interface Recommendation {
  id: string
  title: string
  description: string
  category: string
  fundingGoal: number
  currentFunding: number
  tags: string[]
  relevanceScore: number
}

export default function Home() {
  const { user } = useUser()
  const { isConnected } = useWallet()
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch platform stats
        const statsRes = await fetch('/api/stats')
        if (!statsRes.ok) throw new Error('Failed to fetch platform stats')
        const statsData = await statsRes.json()
        setStats(statsData)

        // Fetch recent activity
        const activityRes = await fetch('/api/activity')
        if (!activityRes.ok) throw new Error('Failed to fetch recent activity')
        const activityData = await activityRes.json()
        setActivities(activityData)

        // Fetch recommendations if user is logged in
        if (user) {
          const recsRes = await fetch(`/api/recommendations?userId=${user.id}`)
          if (!recsRes.ok) throw new Error('Failed to fetch recommendations')
          const recsData = await recsRes.json()
          setRecommendations(recsData)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load some data. Please try refreshing the page.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="flex flex-col items-start gap-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="w-full">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {user ? `Welcome back, ${user.name || 'Investor'}` : 'Welcome to AlgoShark'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Your platform for funding and managing AI-generated software businesses on Algorand
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Get Started Section - Show only when not connected */}
        {!isConnected && (
          <div className="w-full rounded-lg border-2 border-blue-100 bg-blue-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Get Started with AlgoShark</h2>
            <p className="text-sm text-gray-600 mb-4">
              Connect your wallet to start investing in AI-powered projects or submit your own project for funding.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/discover"
                className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Browse Projects
              </Link>
              <Link
                href="/submit"
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Submit Project
              </Link>
            </div>
          </div>
        )}

        {/* Platform Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
          {isLoading ? (
            // Loading skeleton for stats
            [...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg border bg-white p-6 shadow-sm animate-pulse">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="mt-2 h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="rounded-full bg-gray-200 p-3 h-12 w-12"></div>
                </div>
              </div>
            ))
          ) : stats ? (
            <>
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalProjects}</p>
                  </div>
                  <div className="rounded-full bg-blue-50 p-3">
                    <BarChart2 className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Investors</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalInvestors}</p>
                  </div>
                  <div className="rounded-full bg-green-50 p-3">
                    <Users className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Funding</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">${stats.totalFunding.toLocaleString()}</p>
                  </div>
                  <div className="rounded-full bg-purple-50 p-3">
                    <TrendingUp className="h-6 w-6 text-purple-600" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Proposals</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.activeProposals}</p>
                  </div>
                  <div className="rounded-full bg-yellow-50 p-3">
                    <Activity className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Recommended Projects - Show only when user is logged in */}
        {user && recommendations.length > 0 && (
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </div>
              <Link 
                href="/discover"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 inline-flex items-center"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((project) => (
                <Link
                  key={project.id}
                  href={`/discover/${project.id}`}
                  className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900">{project.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{project.description}</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{project.category}</span>
                      <span>{Math.round((project.currentFunding / project.fundingGoal) * 100)}% Funded</span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${Math.min(100, (project.currentFunding / project.fundingGoal) * 100)}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Link 
              href="/discover"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 inline-flex items-center"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-lg border bg-white shadow">
            {isLoading ? (
              // Loading skeleton for activity
              <ul className="divide-y divide-gray-200">
                {[...Array(5)].map((_, i) => (
                  <li key={i} className="px-6 py-4">
                    <div className="flex items-center justify-between animate-pulse">
                      <div className="flex flex-col gap-2">
                        <div className="h-4 w-48 bg-gray-200 rounded"></div>
                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : activities.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-200">
                {activities.map((item) => (
                  <li key={item.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-900">
                          {item.user} {item.type === 'investment' ? 'invested' : item.type === 'project' ? 'launched' : 'created'} {item.type === 'investment' ? `$${item.amount?.toLocaleString()} in` : ''} {item.project}
                        </p>
                        <p className="text-sm text-gray-500">{formatTimeAgo(new Date(item.time))}</p>
                      </div>
                      <Link
                        href={`/${item.type === 'proposal' ? 'governance' : 'projects'}/${item.type === 'proposal' ? item.proposalId : item.projectId}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        View details
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No recent activity to show</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
} 