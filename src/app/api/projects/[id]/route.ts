import { NextResponse } from 'next/server'

// Mock project data for development
const mockProjects = {
  '1': {
    id: '1',
    name: 'AI Trading Bot',
    description: 'Automated trading system using advanced machine learning algorithms',
    status: 'live',
    tokenSymbol: 'ATB',
    assetId: 123456,
    vestingContractId: 789012,
    poolId: 345678,
    createdAt: new Date('2024-01-01'),
    launchedAt: new Date('2024-02-01'),
    metrics: {
      price: 1.25,
      marketCap: 1250000,
      volume24h: 50000,
      holders: 156,
      tvl: 750000
    }
  },
  '2': {
    id: '2',
    name: 'ML Content Generator',
    description: 'AI-powered content creation platform for marketers',
    status: 'launch_preparation',
    tokenSymbol: 'MCG',
    assetId: 234567,
    createdAt: new Date('2024-02-15'),
    metrics: null
  },
  '3': {
    id: '3',
    name: 'AI Image Generator',
    description: 'Create stunning images using state-of-the-art AI models',
    status: 'contract_deployment_pending',
    tokenSymbol: 'AIG',
    createdAt: new Date('2024-03-01'),
    metrics: null
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const project = mockProjects[params.id]
  
  if (!project) {
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(project)
} 