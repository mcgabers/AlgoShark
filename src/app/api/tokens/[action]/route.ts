import { NextResponse } from 'next/server'
import { TokenManagementService } from '@/services/token'

export async function POST(
  request: Request,
  { params }: { params: { action: string } }
) {
  const { action } = params

  try {
    switch (action) {
      case 'transfer': {
        const { fromAddress, toAddress, assetId, amount } = await request.json()
        
        if (!fromAddress || !toAddress || !assetId || !amount) {
          return NextResponse.json(
            { error: 'From address, to address, asset ID, and amount are required' },
            { status: 400 }
          )
        }

        const result = await TokenManagementService.transferTokens(
          fromAddress,
          toAddress,
          assetId,
          amount
        )

        return NextResponse.json(result)
      }

      case 'freeze': {
        const { assetId, address } = await request.json()
        
        if (!assetId || !address) {
          return NextResponse.json(
            { error: 'Asset ID and address are required' },
            { status: 400 }
          )
        }

        const result = await TokenManagementService.freezeTokens(assetId, address)
        return NextResponse.json(result)
      }

      case 'unfreeze': {
        const { assetId, address } = await request.json()
        
        if (!assetId || !address) {
          return NextResponse.json(
            { error: 'Asset ID and address are required' },
            { status: 400 }
          )
        }

        const result = await TokenManagementService.unfreezeTokens(assetId, address)
        return NextResponse.json(result)
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