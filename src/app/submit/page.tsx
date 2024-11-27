'use client'

import { useState } from 'react'
import { Github } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { useRouter } from 'next/navigation'

interface FormData {
  title: string
  description: string
  fundingGoal: string
  category: string
  githubUrl: string
  tags: string
  tokenSupply: string
}

const initialFormData: FormData = {
  title: '',
  description: '',
  fundingGoal: '',
  category: '',
  githubUrl: '',
  tags: '',
  tokenSupply: ''
}

export default function SubmitProjectPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isConnected, createProjectToken } = useWallet()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    setIsSubmitting(true)
    try {
      // Create project token
      const tokenResult = await createProjectToken(
        formData.title,
        parseInt(formData.tokenSupply)
      )

      // TODO: Save project data to database
      console.log('Project submitted:', {
        ...formData,
        tokenId: tokenResult?.assetId
      })

      // Redirect to project page
      router.push('/portfolio')
    } catch (error) {
      console.error('Error submitting project:', error)
      alert('Error submitting project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-full flex-col p-6">
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Submit Your Project
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            List your AI-powered project and start raising funds
          </p>
        </div>

        {!isConnected && (
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Wallet Connection Required
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Please connect your Algorand wallet to submit a project.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= i
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {i}
              </div>
              {i < 3 && (
                <div
                  className={`h-1 w-24 ${
                    step > i ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Project Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="content">Content Creation</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                </select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">
                  GitHub Repository URL
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                    <Github className="h-4 w-4" />
                  </span>
                  <input
                    type="url"
                    name="githubUrl"
                    id="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    className="block w-full rounded-none rounded-r-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                    placeholder="https://github.com/username/repository"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                  placeholder="AI, Machine Learning, NLP"
                  required
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label htmlFor="fundingGoal" className="block text-sm font-medium text-gray-700">
                  Funding Goal (ALGO)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    name="fundingGoal"
                    id="fundingGoal"
                    value={formData.fundingGoal}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tokenSupply" className="block text-sm font-medium text-gray-700">
                  Token Supply
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    name="tokenSupply"
                    id="tokenSupply"
                    value={formData.tokenSupply}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                    placeholder="1000000"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Total number of tokens to create for your project
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900">Project Summary</h3>
                <dl className="mt-4 space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Title</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formData.title}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formData.description}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formData.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">GitHub URL</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formData.githubUrl}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tags</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formData.tags}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Funding Goal</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formData.fundingGoal} ALGO</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Token Supply</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formData.tokenSupply} tokens</dd>
                  </div>
                </dl>
              </div>
            </>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !isConnected}
                className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Project'}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  )
} 