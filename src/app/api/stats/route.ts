import { NextResponse } from 'next/server'
import { DatabaseService } from '@/services/database'

export async function GET() {
  try {
    const [projects, investments, proposals] = await Promise.all([
      DatabaseService.getProjects(),
      DatabaseService.getAllInvestments(),
      DatabaseService.getProposals({ status: 'active' })
    ])

    // Get unique investors
    const uniqueInvestors = new Set(investments.map(inv => inv.investorId))

    const totalFunding = projects.reduce((sum, project) => sum + (project.currentFunding || 0), 0)

    return NextResponse.json({
      totalProjects: projects.length,
      totalInvestors: uniqueInvestors.size,
      totalFunding,
      activeProposals: proposals.length
    })
  } catch (error) {
    console.error('Error fetching platform stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platform statistics' },
      { status: 500 }
    )
  }
} 