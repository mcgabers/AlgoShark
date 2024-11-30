import { NextResponse } from 'next/server'

// Mock platform stats for development
const mockStats = {
  totalProjects: 156,
  totalInvestors: 2843,
  totalFunding: 12500000,
  activeProposals: 24
}

export async function GET() {
  return NextResponse.json(mockStats)
} 