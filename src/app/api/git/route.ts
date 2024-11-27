import { NextResponse } from 'next/server'
import { GitService } from '@/services/git'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    switch (action) {
      case 'status':
        return NextResponse.json({ status: await GitService.getStatus() })
      
      case 'history':
        return NextResponse.json({ commits: await GitService.getCommitHistory() })
      
      case 'branches':
        return NextResponse.json({ branches: await GitService.getBranches() })
      
      case 'current-branch':
        return NextResponse.json({ branch: await GitService.getCurrentBranch() })
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error performing git operation:', error)
    return NextResponse.json(
      { error: 'Failed to perform git operation' },
      { status: 500 }
    )
  }
} 