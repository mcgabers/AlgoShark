import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DollarSign, Users, Activity } from 'lucide-react'
import { ProjectTabs } from './components/ProjectTabs'
import { DatabaseService } from '@/services/database'
import { DueDiligenceService } from '@/services/duediligence'

// SEO Metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const project = await DatabaseService.getProject(params.id)
  if (!project) return { title: 'Project Not Found' }
  
  return {
    title: `${project.title} - AlgoShark Investment Details`,
    description: project.description,
    openGraph: {
      title: `${project.title} - AlgoShark Investment Details`,
      description: project.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} - AlgoShark Investment Details`,
      description: project.description,
    },
    other: {
      'application-name': 'AlgoShark',
      'og:site_name': 'AlgoShark',
    }
  }
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await DatabaseService.getProject(params.id)
  if (!project) notFound()

  // Get related data with default empty values if not found
  const dueDiligence = await DueDiligenceService.getDueDiligence(params.id).catch(() => null)
  const transactions = await DatabaseService.getProjectTransactions(params.id).catch(() => [])

  // Calculate total investors from investments
  const totalInvestors = new Set(project.investments.map(inv => inv.investorId)).size

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {project.title}
              </h1>
              <p className="mt-2 text-lg text-gray-600">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Invest Now
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Token Price</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {project.tokenPrice} ALGO
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
                <p className="text-sm font-medium text-gray-600">Total Investors</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalInvestors}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Funding Progress</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round((project.currentFunding / project.fundingGoal) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Tabs */}
        <ProjectTabs
          project={project}
          dueDiligence={dueDiligence}
          transactions={transactions}
        />
      </div>
    </main>
  )
} 