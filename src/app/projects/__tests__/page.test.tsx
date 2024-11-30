import { render, screen, fireEvent } from '@testing-library/react'
import ProjectsPage from '../page'

describe('ProjectsPage', () => {
  it('renders the page title and description', () => {
    render(<ProjectsPage />)
    
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(
      screen.getByText('Discover, track, and manage blockchain projects')
    ).toBeInTheDocument()
  })

  it('renders all project categories with correct links', () => {
    render(<ProjectsPage />)
    
    expect(screen.getByText('Featured Projects')).toHaveAttribute(
      'href',
      '/projects/featured'
    )
    expect(screen.getByText('My Projects')).toHaveAttribute(
      'href',
      '/projects/my-projects'
    )
    expect(screen.getByText('Trending')).toHaveAttribute(
      'href',
      '/discover/trending'
    )
  })

  it('handles search input changes', () => {
    render(<ProjectsPage />)
    
    const searchInput = screen.getByPlaceholderText('Search projects...')
    fireEvent.change(searchInput, { target: { value: 'test search' } })
    
    expect(searchInput).toHaveValue('test search')
  })

  it('renders quick stats section', () => {
    render(<ProjectsPage />)
    
    expect(screen.getByText('Total Projects')).toBeInTheDocument()
    expect(screen.getByText('Active Investments')).toBeInTheDocument()
    expect(screen.getByText('Total Value Locked')).toBeInTheDocument()
    expect(screen.getByText('Average ROI')).toBeInTheDocument()
  })
}) 