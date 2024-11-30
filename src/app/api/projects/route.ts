import { NextResponse } from 'next/server'
import { DatabaseService } from '@/services/database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sort = searchParams.get('sort')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let projects = await DatabaseService.getProjects({ category, status, search })

    // Handle sorting
    if (sort === 'trending') {
      // Sort by a combination of recent activity and growth metrics
      projects = projects.sort((a, b) => {
        const aScore = calculateTrendingScore(a)
        const bScore = calculateTrendingScore(b)
        return bScore - aScore
      })
    }

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error in projects API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

function calculateTrendingScore(project: any) {
  // Calculate trending score based on:
  // 1. Recent investments
  // 2. Current funding progress
  // 3. Number of investors
  const fundingProgress = project.currentFunding / project.fundingGoal
  const investorCount = project.investments?.length || 0
  const recentInvestments = project.investments?.filter((inv: any) => {
    const investmentDate = new Date(inv.createdAt)
    const now = new Date()
    const daysDiff = (now.getTime() - investmentDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 7 // Consider investments in the last 7 days
  }).length || 0

  return (fundingProgress * 0.4) + (investorCount * 0.3) + (recentInvestments * 0.3)
} 