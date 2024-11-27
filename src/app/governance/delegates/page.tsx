'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useWallet } from '@/contexts/WalletContext'
import { AlertCircle, UserCheck, UserX } from 'lucide-react'

interface Delegate {
  id: string
  name: string
  walletAddress: string
  delegators: Array<{
    id: string
    name: string
    walletAddress: string
  }>
}

export default function DelegatesPage() {
  const { user } = useUser()
  const { isConnected } = useWallet()

  const [delegates, setDelegates] = useState<Delegate[]>([])
  const [userDelegate, setUserDelegate] = useState<Delegate | null>(null)
  const [userDelegators, setUserDelegators] = useState<Array<{ id: string; name: string; walletAddress: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDelegate, setSelectedDelegate] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchDelegationData() {
      if (!user) return

      try {
        // Fetch user's current delegate
        const delegateResponse = await fetch(`/api/governance/delegates?userId=${user.id}&type=delegate`)
        if (delegateResponse.ok) {
          const delegateData = await delegateResponse.json()
          setUserDelegate(delegateData)
        }

        // Fetch user's delegators
        const delegatorsResponse = await fetch(`/api/governance/delegates?userId=${user.id}&type=delegators`)
        if (delegatorsResponse.ok) {
          const delegatorsData = await delegatorsResponse.json()
          setUserDelegators(delegatorsData)
        }

        // Fetch all available delegates
        const allDelegatesResponse = await fetch('/api/governance/delegates')
        if (allDelegatesResponse.ok) {
          const allDelegatesData = await allDelegatesResponse.json()
          setDelegates(allDelegatesData)
        }
      } catch (err) {
        console.error('Error:', err)
        setError('Failed to load delegation data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDelegationData()
  }, [user])

  const handleDelegate = async () => {
    if (!user || !isConnected) {
      setError('Please connect your wallet to delegate voting power')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/governance/delegates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          delegateId: selectedDelegate || null, // null to remove delegation
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update delegation')
      }

      // Refresh delegation data
      const delegateResponse = await fetch(`/api/governance/delegates?userId=${user.id}&type=delegate`)
      const delegateData = await delegateResponse.json()
      setUserDelegate(delegateData)
      setSelectedDelegate('')
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to update delegation. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
                  Please connect your wallet to manage voting power delegation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-full flex-col p-6">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Voting Power Delegation
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Delegate your voting power to another user or manage your delegators
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Current Delegation Status */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Your Delegation Status
          </h3>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {userDelegate ? (
                <div className="flex items-start space-x-3">
                  <UserCheck className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Currently delegating to:
                    </p>
                    <p className="text-sm text-gray-500">
                      {userDelegate.name || userDelegate.walletAddress.slice(0, 8)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-3">
                  <UserX className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Not currently delegating
                    </p>
                    <p className="text-sm text-gray-500">
                      You can delegate your voting power to another user
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <label htmlFor="delegate" className="block text-sm font-medium text-gray-700">
                  {userDelegate ? 'Change Delegate' : 'Select Delegate'}
                </label>
                <select
                  id="delegate"
                  name="delegate"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  value={selectedDelegate}
                  onChange={(e) => setSelectedDelegate(e.target.value)}
                >
                  <option value="">Select a delegate</option>
                  {delegates.map((delegate) => (
                    <option key={delegate.id} value={delegate.id}>
                      {delegate.name || delegate.walletAddress.slice(0, 8)}
                    </option>
                  ))}
                </select>

                <div className="mt-4 flex justify-end space-x-3">
                  {userDelegate && (
                    <button
                      type="button"
                      onClick={() => setSelectedDelegate('')}
                      disabled={isSubmitting}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Remove Delegation
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleDelegate}
                    disabled={!selectedDelegate || isSubmitting}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Delegation'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Your Delegators */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Your Delegators
          </h3>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ) : userDelegators.length > 0 ? (
            <div className="space-y-4">
              {userDelegators.map((delegator) => (
                <div key={delegator.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">
                    {delegator.name || delegator.walletAddress.slice(0, 8)}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Active Delegator
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No users are currently delegating their voting power to you
            </p>
          )}
        </div>
      </div>
    </main>
  )
} 