import { NextResponse } from 'next/server'
import { TokenManagementService } from '@/services/token'

export async function POST(request: Request) {
  try {
    const {
      projectId,
      supply,
      decimals,
      unitName,
      assetName,
      metadata
    } = await request.json()

    if (!projectId || !supply || !unitName || !assetName) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    const token = await TokenManagementService.createToken(
      projectId,
      supply,
      decimals,
      unitName,
      assetName,
      metadata || {}
    )

    return NextResponse.json(token)
  } catch (error) {
    console.error('Error creating token:', error)
    return NextResponse.json(
      { error: 'Failed to create token' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const assetId = searchParams.get('assetId')
  const view = searchParams.get('view')

  if (!assetId) {
    return NextResponse.json(
      { error: 'Asset ID is required' },
      { status: 400 }
    )
  }

  try {
    switch (view) {
      case 'holders': {
        const holders = await TokenManagementService.getTokenHolders(parseInt(assetId))
        return NextResponse.json(holders)
      }

      case 'transactions': {
        const limit = parseInt(searchParams.get('limit') || '10')
        const offset = parseInt(searchParams.get('offset') || '0')
        const transactions = await TokenManagementService.getTokenTransactions(
          parseInt(assetId),
          limit,
          offset
        )
        return NextResponse.json(transactions)
      }

      case 'metrics': {
        const metrics = await TokenManagementService.getTokenMetrics(parseInt(assetId))
        return NextResponse.json(metrics)
      }

      default:
        return NextResponse.json(
          { error: 'Invalid view parameter' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error fetching token data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch token data' },
      { status: 500 }
    )
  }
} 