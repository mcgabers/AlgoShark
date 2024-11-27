import { NextResponse } from 'next/server'
import { DatabaseService } from '@/services/database'
import { AlgorandService } from '@/services/blockchain/algorand'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const type = searchParams.get('type') // 'delegators' or 'delegate'

  try {
    if (!userId) {
      // Get all available delegates with their voting power
      const delegates = await DatabaseService.getAllDelegates()
      const delegatesWithPower = await Promise.all(
        delegates.map(async (delegate) => {
          try {
            const votingPower = await AlgorandService.getUserVotingPower(
              delegate.walletAddress,
              delegate.projectId
            )
            return {
              ...delegate,
              votingPower,
            }
          } catch (error) {
            console.error(`Error fetching voting power for delegate ${delegate.id}:`, error)
            return delegate
          }
        })
      )
      return NextResponse.json(delegatesWithPower)
    }

    if (type === 'delegators') {
      const delegators = await DatabaseService.getDelegators(userId)
      const delegatorsWithPower = await Promise.all(
        delegators.map(async (delegator) => {
          try {
            const votingPower = await AlgorandService.getUserVotingPower(
              delegator.walletAddress,
              delegator.projectId
            )
            return {
              ...delegator,
              votingPower,
            }
          } catch (error) {
            console.error(`Error fetching voting power for delegator ${delegator.id}:`, error)
            return delegator
          }
        })
      )
      return NextResponse.json(delegatorsWithPower)
    } else if (type === 'delegate') {
      const delegate = await DatabaseService.getDelegate(userId)
      if (delegate) {
        try {
          const votingPower = await AlgorandService.getUserVotingPower(
            delegate.walletAddress,
            delegate.projectId
          )
          return NextResponse.json({
            ...delegate,
            votingPower,
          })
        } catch (error) {
          console.error(`Error fetching voting power for delegate ${delegate.id}:`, error)
          return NextResponse.json(delegate)
        }
      }
      return NextResponse.json(null)
    } else {
      return NextResponse.json(
        { error: 'Invalid type parameter' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error fetching delegation info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch delegation info' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId, delegateId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user and delegate information
    const user = await DatabaseService.getUserById(userId)
    const delegate = delegateId ? await DatabaseService.getUserById(delegateId) : null

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (delegateId && !delegate) {
      return NextResponse.json(
        { error: 'Delegate not found' },
        { status: 404 }
      )
    }

    // Update delegation on-chain
    const txResult = await AlgorandService.delegateVotingPower(
      user.walletAddress,
      delegate ? delegate.walletAddress : null,
      user.projectId
    )

    // Update delegation in database
    const result = await DatabaseService.setDelegate(userId, delegateId)

    return NextResponse.json({
      ...result,
      txId: txResult.txId,
    })
  } catch (error) {
    console.error('Error setting delegate:', error)
    return NextResponse.json(
      { error: 'Failed to set delegate' },
      { status: 500 }
    )
  }
} 