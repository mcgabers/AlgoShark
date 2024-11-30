import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectPage from '../page'
import { useFeatureFlag } from '@/lib/feature-flags'

// Mock the feature flags
jest.mock('@/lib/feature-flags', () => ({
  useFeatureFlag: jest.fn(),
  isFeatureEnabled: jest.fn(),
}))

describe('ProjectPage Integration', () => {
  beforeEach(() => {
    // Reset feature flag mocks
    (useFeatureFlag as jest.Mock).mockImplementation(() => true)
  })

  it('loads and displays project details', async () => {
    render(<ProjectPage params={{ id: '1' }} />)

    // Check loading state
    expect(screen.getByText('Loading project details...')).toBeInTheDocument()

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading project details...')).not.toBeInTheDocument()
    })

    // Check main project information
    expect(screen.getByText('AlgoShark Protocol')).toBeInTheDocument()
    expect(screen.getByText('Advanced DeFi protocol on Algorand')).toBeInTheDocument()
  })

  it('switches between tabs correctly', async () => {
    render(<ProjectPage params={{ id: '1' }} />)

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading project details...')).not.toBeInTheDocument()
    })

    // Click on financials tab
    const financialsTab = screen.getByRole('tab', { name: /financials/i })
    await userEvent.click(financialsTab)

    // Check financials content is displayed
    expect(screen.getByText('Financial Overview')).toBeInTheDocument()
    expect(screen.getByText('Risk Analysis')).toBeInTheDocument()
  })

  it('handles feature flags correctly', async () => {
    // Mock new financials tab as disabled
    (useFeatureFlag as jest.Mock).mockImplementation((flagId) => 
      flagId === 'NEW_FINANCIALS_TAB' ? false : true
    )

    render(<ProjectPage params={{ id: '1' }} />)

    await waitFor(() => {
      expect(screen.queryByText('Loading project details...')).not.toBeInTheDocument()
    })

    // Should show old financials UI
    const financialsTab = screen.getByRole('tab', { name: /financials/i })
    await userEvent.click(financialsTab)

    expect(screen.queryByText('Enhanced Risk Analysis')).not.toBeInTheDocument()
  })

  it('handles error states gracefully', async () => {
    // Mock an error response
    jest.spyOn(console, 'error').mockImplementation(() => {})
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Failed to fetch'))

    render(<ProjectPage params={{ id: '1' }} />)

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch project details')).toBeInTheDocument()
    })
  })
}) 