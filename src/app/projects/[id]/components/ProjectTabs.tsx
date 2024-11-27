'use client'

import { useState } from 'react'
import { FileText, BarChart2, Scale, History, Cpu } from 'lucide-react'
import { DueDiligenceView } from './DueDiligenceView'
import { FinancialsView } from './FinancialsView'
import { LegalView } from './LegalView'
import { TransactionsView } from './TransactionsView'
import { AIAnalysisView } from './AIAnalysisView'

const TABS = [
  { name: 'Due Diligence', icon: FileText, component: DueDiligenceView },
  { name: 'Financials', icon: BarChart2, component: FinancialsView },
  { name: 'Legal', icon: Scale, component: LegalView },
  { name: 'Transactions', icon: History, component: TransactionsView },
  { name: 'AI Analysis', icon: Cpu, component: AIAnalysisView },
]

export function ProjectTabs({ project, dueDiligence = null, transactions = [] }) {
  const [activeTab, setActiveTab] = useState(TABS[0].name)

  const ActiveComponent = TABS.find(tab => tab.name === activeTab)?.component

  // Handle missing data states
  const renderTabContent = () => {
    if (!ActiveComponent) return null

    // Show placeholder for missing data
    if (activeTab === 'Due Diligence' && !dueDiligence) {
      return (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Due Diligence Data</h3>
          <p className="mt-1 text-sm text-gray-500">
            Due diligence process has not been initiated for this project yet.
          </p>
        </div>
      )
    }

    if (activeTab === 'Transactions' && (!transactions || transactions.length === 0)) {
      return (
        <div className="text-center py-8">
          <History className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Transactions</h3>
          <p className="mt-1 text-sm text-gray-500">
            This project has no transactions yet.
          </p>
        </div>
      )
    }

    return (
      <ActiveComponent
        project={project}
        dueDiligence={dueDiligence}
        transactions={transactions}
      />
    )
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Project details tabs">
          {TABS.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setActiveTab(name)}
              className={`${
                activeTab === name
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <Icon className="h-5 w-5 mr-2" aria-hidden="true" />
              {name}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  )
} 