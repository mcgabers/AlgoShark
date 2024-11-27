import { NextResponse } from 'next/server'
import { DatabaseService } from '@/services/database'
import { AlgorandService } from '@/services/blockchain/algorand'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const proposalId = searchParams.get('proposalId')

  try {
    if (userId) {
      const votes = await DatabaseService.getUserVotes(userId)
      return NextResponse.json(votes)
    } else if (proposalId) {
      const votes = await DatabaseService.getProposalVotes(proposalId)
      
      // Fetch on-chain voting power for each vote
      const votesWithPower = await Promise.all(
        votes.map(async (vote) => {
          try {
            const votingPower = await AlgorandService.getUserVotingPower(
              vote.voter.walletAddress,
              vote.proposal.projectId
            )
            return {
              ...vote,
              votingPower,
            }
          } catch (error) {
            console.error(`Error fetching voting power for vote ${vote.id}:`, error)
            return vote
          }
        })
      )
      
      return NextResponse.json(votesWithPower)
    } else {
      return NextResponse.json(
        { error: 'Either userId or proposalId is required' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error fetching votes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { voter, proposalId, choice } = data

    // Get user's voting power
    const votingPower = await AlgorandService.getUserVotingPower(
      voter.walletAddress,
      data.proposal.projectId
    )

    // Cast vote on-chain
    const txResult = await AlgorandService.castVote(
      voter,
      proposalId,
      choice,
      votingPower
    )

    // Create vote in database with transaction ID
    const vote = await DatabaseService.createVote({
      ...data,
      txId: txResult.txId,
      power: votingPower,
    })

    return NextResponse.json(vote)
  } catch (error) {
    console.error('Error creating vote:', error)
    return NextResponse.json(
      { error: 'Failed to create vote' },
      { status: 500 }
    )
  }
} 