import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StackTiles } from '../StackTiles';

describe('StackTiles', () => {
  it('renders all core technology tiles with accessible labels', () => {
    render(<StackTiles />);
    expect(screen.getByRole('region', { name: /technology stack/i })).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('renders SVG logos with aria-hidden true on decorative icons', () => {
    const { container } = render(<StackTiles />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(10);
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
