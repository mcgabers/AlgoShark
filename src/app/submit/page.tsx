'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@/contexts/WalletContext'
import { ProjectLaunchService } from '@/services/project/launch'

interface FormData {
  name: string
  description: string
  githubUrl: string
  tokenSymbol: string
  initialSupply: number
  decimals: number
  vestingSchedule: {
    initialUnlock: number
    cliffPeriod: number
    vestingPeriod: number
  }
  initialLiquidity: number
  startingPrice: number
  team: {
    name: string
    role: string
    linkedIn: string
  }[]
}

export default function SubmitProjectPage() {
  const router = useRouter()
  const { isConnected, walletAddress } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    githubUrl: '',
    tokenSymbol: '',
    initialSupply: 0,
    decimals: 6,
    vestingSchedule: {
      initialUnlock: 10,
      cliffPeriod: 0,
      vestingPeriod: 365 * 24 * 60 * 60, // 1 year in seconds
    },
    initialLiquidity: 0,
    startingPrice: 0,
    team: [{ name: '', role: '', linkedIn: '' }],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create project
      const project = await ProjectLaunchService.createProject(
        walletAddress!,
        formData,
        formData.team
      )

      // Submit for review
      await ProjectLaunchService.submitForReview(project.id)

      // Redirect to project status page
      router.push(`/projects/${project.id}`)
    } catch (error) {
      console.error('Error submitting project:', error)
      alert('Error submitting project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Submit Your Project</h1>
        <p className="text-gray-600">
          Please connect your Algorand wallet to submit a project.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Submit Your Project</h1>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`w-1/3 py-2 text-center rounded-lg ${
                currentStep === step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Step {step}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                GitHub URL
              </label>
              <input
                type="url"
                required
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData({ ...formData, githubUrl: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Token Symbol
              </label>
              <input
                type="text"
                required
                value={formData.tokenSymbol}
                onChange={(e) =>
                  setFormData({ ...formData, tokenSymbol: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Initial Supply
              </label>
              <input
                type="number"
                required
                value={formData.initialSupply}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    initialSupply: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Initial Unlock (%)
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={formData.vestingSchedule.initialUnlock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vestingSchedule: {
                      ...formData.vestingSchedule,
                      initialUnlock: parseInt(e.target.value),
                    },
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Initial Liquidity
              </label>
              <input
                type="number"
                required
                value={formData.initialLiquidity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    initialLiquidity: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Starting Price
              </label>
              <input
                type="number"
                required
                step="0.000001"
                value={formData.startingPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startingPrice: parseFloat(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            {formData.team.map((member, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Team Member Name
                  </label>
                  <input
                    type="text"
                    required
                    value={member.name}
                    onChange={(e) => {
                      const newTeam = [...formData.team]
                      newTeam[index].name = e.target.value
                      setFormData({ ...formData, team: newTeam })
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <input
                    type="text"
                    required
                    value={member.role}
                    onChange={(e) => {
                      const newTeam = [...formData.team]
                      newTeam[index].role = e.target.value
                      setFormData({ ...formData, team: newTeam })
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    required
                    value={member.linkedIn}
                    onChange={(e) => {
                      const newTeam = [...formData.team]
                      newTeam[index].linkedIn = e.target.value
                      setFormData({ ...formData, team: newTeam })
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newTeam = formData.team.filter((_, i) => i !== index)
                      setFormData({ ...formData, team: newTeam })
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove Team Member
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  team: [...formData.team, { name: '', role: '', linkedIn: '' }],
                })
              }
              className="text-blue-600 hover:text-blue-700"
            >
              Add Team Member
            </button>
          </div>
        )}

        <div className="flex justify-between pt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Previous
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Project'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
} 