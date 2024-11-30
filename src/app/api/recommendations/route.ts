import { NextResponse } from 'next/server'

// Mock recommendations data for development
const mockRecommendations = [
  {
    id: '1',
    title: 'AI Trading Bot',
    description: 'Automated trading system using advanced machine learning algorithms',
    category: 'Finance',
    fundingGoal: 500000,
    currentFunding: 350000,
    tags: ['AI', 'Trading', 'Finance'],
    relevanceScore: 0.95
  },
  {
    id: '2',
    title: 'ML Content Generator',
    description: 'AI-powered content creation platform for marketers',
    category: 'Content Creation',
    fundingGoal: 300000,
    currentFunding: 150000,
    tags: ['AI', 'Content', 'Marketing'],
    relevanceScore: 0.85
  },
  {
    id: '3',
    title: 'AI Image Generator',
    description: 'Create stunning images using state-of-the-art AI models',
    category: 'Art & Design',
    fundingGoal: 200000,
    currentFunding: 180000,
    tags: ['AI', 'Art', 'Design'],
    relevanceScore: 0.80
  },
  {
    id: '4',
    title: 'Smart Contract Analyzer',
    description: 'AI-powered security analysis for smart contracts',
    category: 'Security',
    fundingGoal: 400000,
    currentFunding: 200000,
    tags: ['AI', 'Security', 'Blockchain'],
    relevanceScore: 0.75
  }
]

export async function GET() {
  return NextResponse.json(mockRecommendations)
} 