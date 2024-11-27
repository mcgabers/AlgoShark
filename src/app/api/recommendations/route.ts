import { NextResponse } from 'next/server'
import { DatabaseService } from '@/services/database'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    )
  }

  try {
    // Get user's investment history
    const userInvestments = await DatabaseService.getUserInvestments(userId)
    
    // Extract categories and tags from user's investments
    const userInterests = userInvestments.reduce((acc, inv) => {
      acc.categories.add(inv.project.category)
      inv.project.tags.forEach(tag => acc.tags.add(tag))
      return acc
    }, { categories: new Set<string>(), tags: new Set<string>() })

    // Find similar projects based on user interests
    const recommendations = await DatabaseService.getProjects({
      category: Array.from(userInterests.categories)[0], // Use most recent category
      status: 'active'
    })

    // Sort by relevance (matching tags)
    const scoredRecommendations = recommendations
      .filter(proj => !userInvestments.some(inv => inv.projectId === proj.id)) // Exclude already invested
      .map(proj => ({
        ...proj,
        relevanceScore: proj.tags.filter(tag => userInterests.tags.has(tag)).length
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3) // Get top 3 recommendations

    return NextResponse.json(scoredRecommendations)
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
} 