'use client'

import { BarChart2, TrendingUp, DollarSign, Users } from 'lucide-react'

export function FinancialsView({ project }) {
  const metrics = project.metadata.metrics
  const stage = project.metadata.stage
  const round = project.metadata.round

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <BarChart2 className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Financial Overview</h2>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${metrics.revenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {metrics.users.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(metrics.growth * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Retention</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(metrics.retention * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Details */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Details</h3>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Development Stage</dt>
            <dd className="mt-1 text-sm text-gray-900">{stage}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Investment Round</dt>
            <dd className="mt-1 text-sm text-gray-900">{round}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Token Price</dt>
            <dd className="mt-1 text-sm text-gray-900">{project.tokenPrice} ALGO</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Available Tokens</dt>
            <dd className="mt-1 text-sm text-gray-900">{project.tokensAvailable.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Funding Goal</dt>
            <dd className="mt-1 text-sm text-gray-900">${project.fundingGoal.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Current Funding</dt>
            <dd className="mt-1 text-sm text-gray-900">${project.currentFunding.toLocaleString()}</dd>
          </div>
        </dl>
      </div>

      {/* Funding Progress */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Funding Progress</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round((project.currentFunding / project.fundingGoal) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${Math.min(100, (project.currentFunding / project.fundingGoal) * 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            ${project.currentFunding.toLocaleString()} raised of ${project.fundingGoal.toLocaleString()} goal
          </p>
        </div>
      </div>
    </div>
  )
} 