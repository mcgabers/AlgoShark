import { NextResponse } from 'next/server'
import { DueDiligenceService } from '@/services/duediligence'

export async function POST(
  request: Request,
  { params }: { params: { action: string } }
) {
  const { action } = params

  try {
    switch (action) {
      case 'comment': {
        const { dueDiligenceId, authorId, content, parentId } = await request.json()
        
        if (!dueDiligenceId || !authorId || !content) {
          return NextResponse.json(
            { error: 'Due diligence ID, author ID, and content are required' },
            { status: 400 }
          )
        }

        const comment = await DueDiligenceService.addComment(
          dueDiligenceId,
          authorId,
          content,
          parentId
        )

        return NextResponse.json(comment)
      }

      case 'review': {
        const { dueDiligenceId, reviewerId, category, status, findings } = await request.json()
        
        if (!dueDiligenceId || !reviewerId || !category || !status) {
          return NextResponse.json(
            { error: 'Due diligence ID, reviewer ID, category, and status are required' },
            { status: 400 }
          )
        }

        const review = await DueDiligenceService.submitReview(
          dueDiligenceId,
          reviewerId,
          category,
          status,
          findings || {}
        )

        return NextResponse.json(review)
      }

      case 'complete': {
        const { dueDiligenceId, status } = await request.json()
        
        if (!dueDiligenceId || !status || !['approved', 'rejected'].includes(status)) {
          return NextResponse.json(
            { error: 'Due diligence ID and valid status are required' },
            { status: 400 }
          )
        }

        const result = await DueDiligenceService.completeDueDiligence(
          dueDiligenceId,
          status as 'approved' | 'rejected'
        )

        return NextResponse.json(result)
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error(`Error performing ${action}:`, error)
    return NextResponse.json(
      { error: `Failed to perform ${action}` },
      { status: 500 }
    )
  }
} 