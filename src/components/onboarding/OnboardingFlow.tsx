'use client'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'

interface OnboardingStep {
  title: string
  description: string
}

const STEPS: OnboardingStep[] = [
  {
    title: 'Profile Setup',
    description: 'Tell us a bit about yourself'
  },
  {
    title: 'Investment Preferences',
    description: 'Choose your investment style'
  },
  {
    title: 'Risk Assessment',
    description: 'Help us understand your risk tolerance'
  }
]

export function OnboardingFlow() {
  const { updateUser } = useUser()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    displayName: '',
    investmentStyle: '',
    riskTolerance: ''
  })

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    try {
      await updateUser({
        ...formData,
        onboardingComplete: true
      })
      localStorage.setItem('onboardingComplete', 'true')
      window.location.reload()
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to AlgoShark</h1>
        <p className="mt-2 text-sm text-gray-600">
          Let's get you set up in just a few steps
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className={`flex-1 ${
                index < STEPS.length - 1 ? 'border-t-2 border-gray-200' : ''
              } ${index <= currentStep ? 'border-blue-600' : ''}`}
            >
              <div
                className={`relative flex items-center justify-center -mt-2 ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              </div>
              <div className="text-xs text-center mt-2">{step.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {currentStep === 0 && (
          <>
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {currentStep === 1 && (
          <>
            <div>
              <label htmlFor="investmentStyle" className="block text-sm font-medium text-gray-700">
                Investment Style
              </label>
              <select
                id="investmentStyle"
                value={formData.investmentStyle}
                onChange={(e) => setFormData({ ...formData, investmentStyle: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select style...</option>
                <option value="growth">Growth</option>
                <option value="balanced">Balanced</option>
                <option value="conservative">Conservative</option>
              </select>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div>
              <label htmlFor="riskTolerance" className="block text-sm font-medium text-gray-700">
                Risk Tolerance
              </label>
              <select
                id="riskTolerance"
                value={formData.riskTolerance}
                onChange={(e) => setFormData({ ...formData, riskTolerance: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select tolerance...</option>
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
          </>
        )}

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleNext}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {currentStep === STEPS.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
} 