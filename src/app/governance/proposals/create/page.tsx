'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { useWallet } from '@/contexts/WalletContext'
import { AlertCircle } from 'lucide-react'

interface Project {
  id: string
  title: string
}

export default function CreateProposalPage() {
  const router = useRouter()
  const { user } = useUser()
  const { isConnected } = useWallet()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('text')
  const [projectId, setProjectId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [parameters, setParameters] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])

  // Fetch user's projects on component mount
  useState(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(`/api/projects?creatorId=${user?.id}`)
        if (!response.ok) throw new Error('Failed to fetch projects')
        const data = await response.json()
        setProjects(data)
      } catch (err) {
        console.error('Error fetching projects:', err)
      }
    }

    if (user) {
      fetchProjects()
    }
  }, [user])

  if (!isConnected || !user) {
    return (
      <main className="flex min-h-full flex-col p-6">
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Wallet Connection Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Please connect your wallet to create proposals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/governance/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          type,
          projectId,
          startDate,
          endDate,
          parameters: type === 'parameter_change' ? JSON.parse(parameters) : undefined,
          creatorId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create proposal')
      }

      router.push('/governance')
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to create proposal. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-full flex-col p-6">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Create Proposal
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
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

        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-700">
            Project
          </label>
          <select
            id="project"
            name="project"
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Proposal Type
          </label>
          <select
            id="type"
            name="type"
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="text">Text Proposal</option>
            <option value="parameter_change">Parameter Change</option>
            <option value="fund_allocation">Fund Allocation</option>
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {type === 'parameter_change' && (
          <div>
            <label htmlFor="parameters" className="block text-sm font-medium text-gray-700">
              Parameters (JSON)
            </label>
            <textarea
              id="parameters"
              name="parameters"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
              required
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="datetime-local"
              name="startDate"
              id="startDate"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="datetime-local"
              name="endDate"
              id="endDate"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="mr-3 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => router.push('/governance')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Proposal'}
          </button>
        </div>
      </form>
    </main>
  )
} 