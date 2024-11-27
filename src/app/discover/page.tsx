'use client'

import { useState } from 'react'
import { Search, AlertCircle } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'

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

// Mock data - will be replaced with real data from API
const projects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Content Generator',
    description: 'An advanced AI system that generates high-quality, original content across multiple formats.',
    fundingGoal: 50000,
    currentFunding: 35000,
    category: 'Content Creation',
    tags: ['AI', 'Content', 'Machine Learning'],
    assetId: 123456,
    tokenPrice: 1,
    tokensAvailable: 15000
  },
  {
    id: '2',
    title: 'Automated Trading Algorithm',
    description: 'Smart trading system using AI to analyze market patterns and execute trades.',
    fundingGoal: 75000,
    currentFunding: 45000,
    category: 'Finance',
    tags: ['Trading', 'AI', 'Finance'],
    assetId: 123457,
    tokenPrice: 1.5,
    tokensAvailable: 20000
  },
  {
    id: '3',
    title: 'AI Healthcare Assistant',
    description: 'Virtual healthcare assistant powered by AI for patient monitoring and support.',
    fundingGoal: 100000,
    currentFunding: 60000,
    category: 'Healthcare',
    tags: ['Healthcare', 'AI', 'Assistant'],
    assetId: 123458,
    tokenPrice: 2,
    tokensAvailable: 20000
  }
]

interface InvestModalProps {
  project: Project
  onClose: () => void
  onInvest: (amount: number) => Promise<void>
  isInvesting: boolean
}

function InvestModal({ project, onClose, onInvest, isInvesting }: InvestModalProps) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const investmentAmount = parseInt(amount)
    
    if (isNaN(investmentAmount) || investmentAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (investmentAmount > project.tokensAvailable) {
      setError('Amount exceeds available tokens')
      return
    }

    try {
      await onInvest(investmentAmount)
      onClose()
    } catch (error) {
      setError('Investment failed. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Invest in {project.title}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Number of Tokens
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="amount"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="0"
                min="1"
                max={project.tokensAvailable}
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Price per token: {project.tokenPrice} ALGO
            </p>
            {amount && !isNaN(parseInt(amount)) && (
              <p className="mt-1 text-sm text-gray-500">
                Total cost: {(parseInt(amount) * project.tokenPrice).toFixed(2)} ALGO
              </p>
            )}
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

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isInvesting}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isInvesting ? 'Investing...' : 'Invest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ProjectCard({ project, onInvest }: { project: Project; onInvest: () => void }) {
  const progress = (project.currentFunding / project.fundingGoal) * 100
  const { isConnected } = useWallet()

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
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

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isInvesting, setIsInvesting] = useState(false)
  const { investInProject, isConnected } = useWallet()

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
      // TODO: Update project data after successful investment
    } catch (error) {
      console.error('Investment failed:', error)
      throw error
    } finally {
      setIsInvesting(false)
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onInvest={() => setSelectedProject(project)}
            />
          ))}
        </div>

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