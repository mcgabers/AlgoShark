import { NextResponse } from 'next/server'
import { GitService } from '@/services/git'

export async function POST(
  request: Request,
  { params }: { params: { action: string } }
) {
  const { action } = params

  try {
    switch (action) {
      case 'init': {
        const result = await GitService.init()
        return NextResponse.json({ result })
      }

      case 'commit': {
        const { message } = await request.json()
        if (!message) {
          return NextResponse.json(
            { error: 'Commit message is required' },
            { status: 400 }
          )
        }
        const result = await GitService.commit(message)
        return NextResponse.json({ result })
      }

      case 'branch': {
        const { name } = await request.json()
        if (!name) {
          return NextResponse.json(
            { error: 'Branch name is required' },
            { status: 400 }
          )
        }
        const result = await GitService.createBranch(name)
        return NextResponse.json({ result })
      }

      case 'switch': {
        const { branch } = await request.json()
        if (!branch) {
          return NextResponse.json(
            { error: 'Branch name is required' },
            { status: 400 }
          )
        }
        const result = await GitService.switchBranch(branch)
        return NextResponse.json({ result })
      }

      case 'revert': {
        const { commitHash } = await request.json()
        if (!commitHash) {
          return NextResponse.json(
            { error: 'Commit hash is required' },
            { status: 400 }
          )
        }
        const result = await GitService.revertToCommit(commitHash)
        return NextResponse.json({ result })
      }

      case 'tag': {
        const { version, message } = await request.json()
        if (!version || !message) {
          return NextResponse.json(
            { error: 'Version and message are required' },
            { status: 400 }
          )
        }
        const result = await GitService.tag(version, message)
        return NextResponse.json({ result })
      }

      case 'diff': {
        const { fromCommit, toCommit } = await request.json()
        if (!fromCommit || !toCommit) {
          return NextResponse.json(
            { error: 'From and to commits are required' },
            { status: 400 }
          )
        }
        const result = await GitService.getDiff(fromCommit, toCommit)
        return NextResponse.json({ result })
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