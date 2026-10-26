import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { RightNow } from '../RightNow';

describe('RightNow', () => {
  it('displays active availability, location, and education', () => {
    render(
      <MemoryRouter>
        <RightNow />
      </MemoryRouter>
    );
    expect(screen.getByText(/open to software engineering internships/i)).toBeInTheDocument();
    expect(screen.getByText(/pampanga, ph/i)).toBeInTheDocument();
    expect(screen.getByText(/bs computer science/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /magilas gym pos/i })).toHaveAttribute('href', '/projects/magilas');
  });

  it('renders a pulsing availability indicator dot', () => {
    const { container } = render(
      <MemoryRouter>
        <RightNow />
      </MemoryRouter>
    );
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
