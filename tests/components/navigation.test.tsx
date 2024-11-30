import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IconNav } from '@/components/ui/icon-nav';
import { SecondaryNav } from '@/components/ui/secondary-nav';

// Mock usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: () => '/discover',
}));

describe('Navigation Components', () => {
  it('renders icon navigation', () => {
    render(<IconNav />);
    
    // Check for main navigation items
    expect(screen.getByLabelText('Main Navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Discover')).toBeInTheDocument();
    expect(screen.getByLabelText('Projects')).toBeInTheDocument();
  });

  it('renders secondary navigation for discover section', () => {
    render(<SecondaryNav />);
    
    // Secondary nav should show Discover section
    const nav = screen.getByRole('complementary');
    expect(nav).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
  });
}); 