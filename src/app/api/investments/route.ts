import { NextResponse } from 'next/server'
import { DatabaseService } from '@/services/database'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    )
  }

  try {
    const investments = await DatabaseService.getUserInvestments(userId)
    return NextResponse.json(investments)
  } catch (error) {
    console.error('Error fetching investments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch investments' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const investment = await DatabaseService.createInvestment(data)
    return NextResponse.json(investment)
  } catch (error) {
    console.error('Error creating investment:', error)
    return NextResponse.json(
      { error: 'Failed to create investment' },
      { status: 500 }
    )
  }
} 