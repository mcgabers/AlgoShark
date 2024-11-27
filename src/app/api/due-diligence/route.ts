import { NextResponse } from 'next/server'
import { DueDiligenceService } from '@/services/duediligence'

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const dueDiligence = await DueDiligenceService.initiateDueDiligence(projectId)
    
    // Start automated checks in the background
    Promise.all([
      DueDiligenceService.runCodeAnalysis(projectId),
      DueDiligenceService.performLegalChecks(projectId),
      DueDiligenceService.conductSecurityAudit(projectId)
    ]).catch(error => {
      console.error('Error running automated checks:', error)
    })

    return NextResponse.json(dueDiligence)
  } catch (error) {
    console.error('Error initiating due diligence:', error)
    return NextResponse.json(
      { error: 'Failed to initiate due diligence' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')

  if (!projectId) {
    return NextResponse.json(
      { error: 'Project ID is required' },
      { status: 400 }
    )
  }

  try {
    const dueDiligence = await prisma.dueDiligence.findUnique({
      where: { projectId },
      include: {
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!dueDiligence) {
      return NextResponse.json(
        { error: 'Due diligence not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(dueDiligence)
  } catch (error) {
    console.error('Error fetching due diligence:', error)
    return NextResponse.json(
      { error: 'Failed to fetch due diligence' },
      { status: 500 }
    )
  }
} 