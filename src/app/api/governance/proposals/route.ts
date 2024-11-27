import { NextResponse } from 'next/server'
import { DatabaseService } from '@/services/database'
import { AlgorandService } from '@/services/blockchain/algorand'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const projectId = searchParams.get('projectId')
  const type = searchParams.get('type')

  try {
    const proposals = await DatabaseService.getProposals({
      status: status || undefined,
      projectId: projectId || undefined,
      type: type || undefined,
    })

    // Fetch on-chain state for each proposal
    const proposalsWithState = await Promise.all(
      proposals.map(async (proposal) => {
        try {
          const state = await AlgorandService.getProposalState(proposal.id)
          return {
            ...proposal,
            onChainState: state,
          }
        } catch (error) {
          console.error(`Error fetching state for proposal ${proposal.id}:`, error)
          return proposal
        }
      })
    )

    return NextResponse.json(proposalsWithState)
  } catch (error) {
    console.error('Error fetching proposals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // First create the proposal in the database
    const proposal = await DatabaseService.createProposal(data)

    // Then create the proposal on-chain
    const { creator, projectId, title, description, startDate, endDate, type, parameters } = data
    const txResult = await AlgorandService.createProposal(
      creator,
      projectId,
      title,
      description,
      new Date(startDate),
      new Date(endDate),
      type,
      parameters
    )

    // Update the proposal with the transaction ID
    const updatedProposal = await DatabaseService.updateProposal(proposal.id, {
      txId: txResult.txId,
    })

    return NextResponse.json(updatedProposal)
  } catch (error) {
    console.error('Error creating proposal:', error)
    return NextResponse.json(
      { error: 'Failed to create proposal' },
      { status: 500 }
    )
  }
} 