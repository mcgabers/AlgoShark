import { NextResponse } from 'next/server'
import { DatabaseService } from '@/services/database'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const walletAddress = searchParams.get('walletAddress')

  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Wallet address is required' },
      { status: 400 }
    )
  }

  try {
    const user = await DatabaseService.getUserByWallet(walletAddress)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { email, walletAddress, name } = await request.json()
    
    if (!email || !walletAddress) {
      return NextResponse.json(
        { error: 'Email and wallet address are required' },
        { status: 400 }
      )
    }

    const user = await DatabaseService.createUser(email, walletAddress, name)
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
} 