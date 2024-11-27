'use client'

import { useState } from 'react'
import { BarChart2, TrendingUp, DollarSign } from 'lucide-react'

interface Investment {
  id: string
  projectTitle: string
  investmentAmount: number
  tokenAmount: number
  currentValue: number
  returnPercentage: number
}

interface Project {
  id: string
  title: string
  fundingRaised: number
  fundingGoal: number
  investors: number
  status: 'active' | 'completed' | 'pending'
}

// Mock data - will be replaced with real data from API
const investments: Investment[] = [
  {
    id: '1',
    projectTitle: 'AI Content Generator',
    investmentAmount: 5000,
    tokenAmount: 5000,
    currentValue: 6500,
    returnPercentage: 30
  },
  {
    id: '2',
    projectTitle: 'Trading Algorithm',
    investmentAmount: 7500,
    tokenAmount: 7500,
    currentValue: 8250,
    returnPercentage: 10
  }
]

const projects: Project[] = [
  {
    id: '1',
    title: 'AI Content Generator',
    fundingRaised: 50000,
    fundingGoal: 75000,
    investors: 25,
    status: 'active'
  },
  {
    id: '2',
    title: 'Healthcare Assistant',
    fundingRaised: 100000,
    fundingGoal: 100000,
    investors: 50,
    status: 'completed'
  }
]

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string
  value: string
  icon: typeof BarChart2
  trend?: string
}) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <p className="mt-2 text-sm text-green-600">
              <span className="font-medium">{trend}</span>
            </p>
          )}
        </div>
        <div className="rounded-full bg-blue-50 p-3">
          <Icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

function InvestmentRow({ investment }: { investment: Investment }) {
  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        {investment.projectTitle}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        ${investment.investmentAmount.toLocaleString()}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {investment.tokenAmount.toLocaleString()}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        ${investment.currentValue.toLocaleString()}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-green-600">
        +{investment.returnPercentage}%
      </td>
    </tr>
  )
}

function ProjectRow({ project }: { project: Project }) {
  const progress = (project.fundingRaised / project.fundingGoal) * 100

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        {project.title}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        ${project.fundingRaised.toLocaleString()} of ${project.fundingGoal.toLocaleString()}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{Math.round(progress)}%</span>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {project.investors}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
          project.status === 'active'
            ? 'bg-green-100 text-green-800'
            : project.status === 'completed'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      </td>
    </tr>
  )
}

export default function PortfolioPage() {
  const [view, setView] = useState<'investments' | 'projects'>('investments')

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.investmentAmount, 0)
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalReturn = ((totalValue - totalInvestment) / totalInvestment) * 100

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Portfolio Overview
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Track your investments and manage your projects
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Investment"
            value={`$${totalInvestment.toLocaleString()}`}
            icon={DollarSign}
          />
          <StatCard
            title="Current Value"
            value={`$${totalValue.toLocaleString()}`}
            icon={BarChart2}
            trend={`+${totalReturn.toFixed(1)}%`}
          />
          <StatCard
            title="Active Projects"
            value={projects.filter(p => p.status === 'active').length.toString()}
            icon={TrendingUp}
          />
        </div>

        {/* View Toggle */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setView('investments')}
              className={`${
                view === 'investments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Investments
            </button>
            <button
              onClick={() => setView('projects')}
              className={`${
                view === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              My Projects
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="mt-4">
          {view === 'investments' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Project
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Investment
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Tokens
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Current Value
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Return
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {investments.map((investment) => (
                    <InvestmentRow key={investment.id} investment={investment} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Project
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Funding
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Progress
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Investors
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {projects.map((project) => (
                    <ProjectRow key={project.id} project={project} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 