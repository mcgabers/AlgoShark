import { NextResponse } from 'next/server'
import { DividendService } from '@/services/dividend'

export async function POST(request: Request) {
  try {
    const { projectId, amount, metadata } = await request.json()

    if (!projectId || !amount) {
      return NextResponse.json(
        { error: 'Project ID and amount are required' },
        { status: 400 }
      )
    }

    const distribution = await DividendService.createDistribution(
      projectId,
      amount,
      metadata
    )

    return NextResponse.json(distribution)
  } catch (error) {
    console.error('Error creating dividend distribution:', error)
    return NextResponse.json(
      { error: 'Failed to create dividend distribution' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')
  const holderAddress = searchParams.get('holderAddress')
  const distributionId = searchParams.get('distributionId')
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    if (distributionId) {
      const distribution = await DividendService.getDistribution(distributionId)
      return NextResponse.json(distribution)
    }

    if (projectId) {
      const distributions = await DividendService.getProjectDistributions(
        projectId,
        limit,
        offset
      )
      return NextResponse.json(distributions)
    }

    if (holderAddress) {
      const payments = await DividendService.getHolderPayments(
        holderAddress,
        limit,
        offset
      )
      return NextResponse.json(payments)
    }

    return NextResponse.json(
      { error: 'Project ID, holder address, or distribution ID is required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error fetching dividend data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dividend data' },
      { status: 500 }
    )
  }
} 