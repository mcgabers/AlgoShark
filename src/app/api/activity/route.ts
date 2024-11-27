import { NextResponse } from 'next/server'
import { DatabaseService } from '@/services/database'

export async function GET() {
  try {
    const [investments, projects, proposals] = await Promise.all([
      DatabaseService.getRecentInvestments(),
      DatabaseService.getRecentProjects(),
      DatabaseService.getRecentProposals()
    ])

    // Combine and sort activities by date
    const activities = [
      ...investments.map(inv => ({
        id: `inv-${inv.id}`,
        type: 'investment',
        user: inv.investor.name || 'Anonymous',
        project: inv.project.title,
        amount: inv.amount,
        time: inv.createdAt,
        projectId: inv.project.id
      })),
      ...projects.map(proj => ({
        id: `proj-${proj.id}`,
        type: 'project',
        user: proj.creator.name || 'Anonymous',
        project: proj.title,
        description: 'New project launched',
        time: proj.createdAt,
        projectId: proj.id
      })),
      ...proposals.map(prop => ({
        id: `prop-${prop.id}`,
        type: 'proposal',
        user: prop.creator.name || 'Anonymous',
        project: prop.project.title,
        description: prop.title,
        time: prop.createdAt,
        proposalId: prop.id
      }))
    ].sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 10) // Get only the 10 most recent activities

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    )
  }
} 