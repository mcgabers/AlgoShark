import { NextResponse } from 'next/server'
import { VersioningService } from '@/services/versioning'

export async function POST(
  request: Request,
  { params }: { params: { action: string } }
) {
  const { action } = params

  try {
    switch (action) {
      case 'activate': {
        const { versionId } = await request.json()
        if (!versionId) {
          return NextResponse.json(
            { error: 'Version ID is required' },
            { status: 400 }
          )
        }
        const version = await VersioningService.activateVersion(versionId)
        return NextResponse.json(version)
      }

      case 'rollback': {
        const { contractId, targetVersionId } = await request.json()
        if (!contractId || !targetVersionId) {
          return NextResponse.json(
            { error: 'Contract ID and target version ID are required' },
            { status: 400 }
          )
        }
        const version = await VersioningService.rollbackVersion(contractId, targetVersionId)
        return NextResponse.json(version)
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