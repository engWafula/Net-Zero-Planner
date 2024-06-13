import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import PlanCard from '@/app/components/PlanCard'; 

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('PlanCard', () => {
  const mockProps = {
    emission: 100,
    targetYear: 2025,
    index: 'plan-1',
  };

  it('renders PlanCard component with correct props', () => {
    render(<PlanCard {...mockProps} />);


    expect(screen.getByText('Target Year: 2025')).toBeInTheDocument();
  });

  it('renders Link with correct href', () => {
    render(<PlanCard {...mockProps} />);

    const link = screen.getByRole('link', { name: /View Projections/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('/plan-1');
  });
});
