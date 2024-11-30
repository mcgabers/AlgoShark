import { NextResponse } from 'next/server'

// Mock activity data for development
const mockActivities = [
  {
    id: '1',
    type: 'investment',
    user: 'Alice',
    project: 'AI Trading Bot',
    amount: 25000,
    time: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    projectId: '1'
  },
  {
    id: '2',
    type: 'project',
    user: 'Bob',
    project: 'ML Content Generator',
    time: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    projectId: '2'
  },
  {
    id: '3',
    type: 'proposal',
    user: 'Charlie',
    project: 'Platform Upgrade',
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    proposalId: '1'
  },
  {
    id: '4',
    type: 'investment',
    user: 'David',
    project: 'AI Trading Bot',
    amount: 15000,
    time: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    projectId: '1'
  },
  {
    id: '5',
    type: 'project',
    user: 'Eve',
    project: 'AI Image Generator',
    time: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    projectId: '3'
  }
]

export async function GET() {
  return NextResponse.json(mockActivities)
} 