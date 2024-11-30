import { NextResponse } from 'next/server'

// Mock user data for development
let mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  walletAddress: '0x123...abc',
  onboardingComplete: false,
  displayName: '',
  investmentStyle: '',
  riskTolerance: ''
}

export async function GET() {
  return NextResponse.json(mockUser)
}

export async function PATCH(request: Request) {
  const data = await request.json()
  mockUser = { ...mockUser, ...data }
  return NextResponse.json(mockUser)
} 