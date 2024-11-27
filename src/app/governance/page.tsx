'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useWallet } from '@/contexts/WalletContext'
import { PlusCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Proposal {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: string
  type: string
  creator: {
    name: string
    walletAddress: string
  }
  project: {
    title: string
  }
  votes: Array<{
    choice: string
    power: number
  }>
}

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const totalVotes = proposal.votes.reduce((sum, vote) => sum + vote.power, 0)
  const yesVotes = proposal.votes
    .filter(vote => vote.choice === 'yes')
    .reduce((sum, vote) => sum + vote.power, 0)
  const progress = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0

  const startDate = new Date(proposal.startDate)
  const endDate = new Date(proposal.endDate)
  const now = new Date()
  const timeLeft = endDate.getTime() - now.getTime()
  const daysLeft = Math.max(0, Math.ceil(timeLeft / (1000 * 60 * 60 * 24)))

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{proposal.title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            by {proposal.creator.name || proposal.creator.walletAddress.slice(0, 8)}
          </p>
        </div>
        <span className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          proposal.status === 'active'
            ? 'bg-green-100 text-green-800'
            : proposal.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        )}>
          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
        </span>
      </div>

      <p className="mt-3 text-sm text-gray-600 line-clamp-2">
        {proposal.description}
      </p>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Votes</span>
          <span>{Math.round(progress)}% Yes</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {daysLeft} days left
        </span>
        <Link
          href={`/governance/proposals/${proposal.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

function CreateProposalButton() {
  const { isConnected } = useWallet()
  const { user } = useUser()

  if (!isConnected || !user) {
    return (
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
                Connect your wallet to create and vote on proposals.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Link
      href="/governance/proposals/create"
      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
      Create Proposal
    </Link>
  )
}

export default function GovernancePage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProposals() {
      try {
        const response = await fetch('/api/governance/proposals?status=active')
        if (!response.ok) throw new Error('Failed to fetch proposals')
        const data = await response.json()
        setProposals(data)
      } catch (err) {
        setError('Failed to load proposals')
        console.error('Error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProposals()
  }, [])

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Active Proposals
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Vote on active proposals or create a new one
            </p>
          </div>
          <CreateProposalButton />
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

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white shadow rounded-lg p-6"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-2 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {proposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        )}

        {!isLoading && proposals.length === 0 && !error && (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No active proposals
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new proposal.
            </p>
          </div>
        )}
      </div>
    </main>
  )
} 