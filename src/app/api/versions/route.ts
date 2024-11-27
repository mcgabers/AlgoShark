import { NextResponse } from 'next/server'
import { VersioningService } from '@/services/versioning'

export async function POST(request: Request) {
  try {
    const { contractId, sourceCode, bytecode, changes, metadata, createdBy } = await request.json()

    if (!contractId || !sourceCode || !bytecode) {
      return NextResponse.json(
        { error: 'Contract ID, source code, and bytecode are required' },
        { status: 400 }
      )
    }

    const version = await VersioningService.createVersion(
      contractId,
      sourceCode,
      bytecode,
      changes || [],
      metadata || {},
      createdBy
    )

    return NextResponse.json(version)
  } catch (error) {
    console.error('Error creating version:', error)
    return NextResponse.json(
      { error: 'Failed to create version' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const contractId = searchParams.get('contractId')

  if (!contractId) {
    return NextResponse.json(
      { error: 'Contract ID is required' },
      { status: 400 }
    )
  }

  try {
    const versions = await VersioningService.getVersionHistory(contractId)
    return NextResponse.json(versions)
  } catch (error) {
    console.error('Error fetching versions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch versions' },
      { status: 500 }
    )
  }
} 