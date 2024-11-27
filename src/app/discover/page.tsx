'use client'

import { useState, useEffect } from 'react'
import { Search, AlertCircle } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
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
}

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isInvesting, setIsInvesting] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { investInProject, isConnected } = useWallet()

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects')
        if (!response.ok) throw new Error('Failed to fetch projects')
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = !selectedCategory || project.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleInvest = async (amount: number) => {
    if (!selectedProject) return

    setIsInvesting(true)
    try {
      await investInProject(selectedProject.assetId, amount)
      // Refresh projects after successful investment
      const response = await fetch('/api/projects')
      if (!response.ok) throw new Error('Failed to fetch projects')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Investment failed:', error)
      throw error
    } finally {
      setIsInvesting(false)
      setSelectedProject(null)
    }
  }

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Discover Projects
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Browse innovative AI-powered projects seeking funding
            </p>
          </div>
        </div>

        {!isConnected && (
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Connect Your Wallet
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Connect your Algorand wallet to invest in projects.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Search projects..."
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
          >
            <option value="">All Categories</option>
            <option value="Content Creation">Content Creation</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
          </select>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-pulse space-y-4">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="rounded-md bg-gray-50 p-4">
              <p className="text-sm text-gray-700">No projects found matching your criteria.</p>
            </div>
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onInvest={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}

        {/* Investment Modal */}
        {selectedProject && (
          <InvestModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onInvest={handleInvest}
            isInvesting={isInvesting}
          />
        )}
      </div>
    </main>
  )
}

function ProjectCard({ project, onInvest }: { project: Project; onInvest: () => void }) {
  const progress = (project.currentFunding / project.fundingGoal) * 100
  const { isConnected } = useWallet()

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <Link href={`/projects/${project.id}`} className="block">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">{project.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{project.description}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
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
            <span>${project.currentFunding.toLocaleString()} of ${project.fundingGoal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Token Price</span>
            <span>{project.tokenPrice} ALGO</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Available Tokens</span>
            <span>{project.tokensAvailable.toLocaleString()}</span>
          </div>
        </div>
      </Link>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onInvest}
          disabled={!isConnected}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnected ? 'Invest Now' : 'Connect Wallet to Invest'}
        </button>
      </div>
    </div>
  )
} 