'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { useWallet } from '@/contexts/WalletContext'
import { AlertCircle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface Vote {
  id: string
  choice: string
  power: number
  voter: {
    name: string
    walletAddress: string
  }
  createdAt: string
}

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
  parameters?: Record<string, any>
  votes: Vote[]
}

export default function ProposalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const { isConnected } = useWallet()

  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [selectedChoice, setSelectedChoice] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userVote, setUserVote] = useState<Vote | null>(null)

  useEffect(() => {
    async function fetchProposal() {
      try {
        const response = await fetch(`/api/governance/proposals/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch proposal')
        const data = await response.json()
        setProposal(data)

        if (user) {
          const userVote = data.votes.find(
            (vote: Vote) => vote.voter.walletAddress === user.walletAddress
          )
          if (userVote) {
            setUserVote(userVote)
            setSelectedChoice(userVote.choice)
          }
        }
      } catch (err) {
        console.error('Error:', err)
        setError('Failed to load proposal')
      }
    }

    if (params.id) {
      fetchProposal()
    }
  }, [params.id, user])

  const handleVote = async () => {
    if (!user || !isConnected) {
      setError('Please connect your wallet to vote')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/governance/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposalId: proposal?.id,
          voterId: user.id,
          choice: selectedChoice,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit vote')
      }

      const vote = await response.json()
      setUserVote(vote)
      
      // Refresh proposal data to update vote counts
      const updatedProposal = await fetch(`/api/governance/proposals/${params.id}`).then(res => res.json())
      setProposal(updatedProposal)
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to submit vote. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!proposal) {
    return (
      <main className="flex min-h-full flex-col p-6">
        <div className="flex items-center mb-6">
          <Link
            href="/governance"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Proposals
          </Link>
        </div>
        {error ? (
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
        ) : (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        )}
      </main>
    )
  }

  const totalVotes = proposal.votes.reduce((sum, vote) => sum + vote.power, 0)
  const yesVotes = proposal.votes
    .filter(vote => vote.choice === 'yes')
    .reduce((sum, vote) => sum + vote.power, 0)
  const noVotes = proposal.votes
    .filter(vote => vote.choice === 'no')
    .reduce((sum, vote) => sum + vote.power, 0)
  const abstainVotes = proposal.votes
    .filter(vote => vote.choice === 'abstain')
    .reduce((sum, vote) => sum + vote.power, 0)

  const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0
  const noPercentage = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0
  const abstainPercentage = totalVotes > 0 ? (abstainVotes / totalVotes) * 100 : 0

  const startDate = new Date(proposal.startDate)
  const endDate = new Date(proposal.endDate)
  const now = new Date()
  const isActive = now >= startDate && now <= endDate

  return (
    <main className="flex min-h-full flex-col p-6">
      <div className="flex items-center mb-6">
        <Link
          href="/governance"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Proposals
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{proposal.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              by {proposal.creator.name || proposal.creator.walletAddress.slice(0, 8)}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Project: {proposal.project.title}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              proposal.status === 'active'
                ? 'bg-green-100 text-green-800'
                : proposal.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            )}
          >
            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
          </span>
        </div>

        <div className="prose max-w-none mb-8">
          <p>{proposal.description}</p>
        </div>

        {proposal.type === 'parameter_change' && proposal.parameters && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Parameters</h3>
            <pre className="bg-gray-50 rounded-md p-4 overflow-auto">
              {JSON.stringify(proposal.parameters, null, 2)}
            </pre>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Voting Results</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Yes</span>
                <span>{Math.round(yesPercentage)}% ({yesVotes} votes)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${yesPercentage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>No</span>
                <span>{Math.round(noPercentage)}% ({noVotes} votes)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${noPercentage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Abstain</span>
                <span>{Math.round(abstainPercentage)}% ({abstainVotes} votes)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-600 h-2 rounded-full"
                  style={{ width: `${abstainPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {isActive && !userVote && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cast Your Vote</h3>
            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-4">
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
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="yes"
                  name="vote"
                  type="radio"
                  value="yes"
                  checked={selectedChoice === 'yes'}
                  onChange={(e) => setSelectedChoice(e.target.value)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="yes" className="ml-3 block text-sm font-medium text-gray-700">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="no"
                  name="vote"
                  type="radio"
                  value="no"
                  checked={selectedChoice === 'no'}
                  onChange={(e) => setSelectedChoice(e.target.value)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="no" className="ml-3 block text-sm font-medium text-gray-700">
                  No
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="abstain"
                  name="vote"
                  type="radio"
                  value="abstain"
                  checked={selectedChoice === 'abstain'}
                  onChange={(e) => setSelectedChoice(e.target.value)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="abstain" className="ml-3 block text-sm font-medium text-gray-700">
                  Abstain
                </label>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleVote}
                disabled={!selectedChoice || isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Vote'}
              </button>
            </div>
          </div>
        )}

        {userVote && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your Vote</h3>
            <p className="text-sm text-gray-600">
              You voted "{userVote.choice}" with {userVote.power} voting power
            </p>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Votes</h3>
          <div className="space-y-4">
            {proposal.votes.slice(0, 5).map((vote) => (
              <div key={vote.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {vote.voter.name || vote.voter.walletAddress.slice(0, 8)}
                </span>
                <span className="text-gray-900">
                  {vote.choice} ({vote.power} votes)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
} 