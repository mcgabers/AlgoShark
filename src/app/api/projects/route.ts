import { NextResponse } from 'next/server'
import { DatabaseService } from '@/services/database'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  try {
    const projects = await DatabaseService.getProjects({
      category: category || undefined,
      status: status || undefined,
      search: search || undefined,
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const project = await DatabaseService.createProject(data)
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
} 