import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { SiteDock } from '../SiteDock';

describe('SiteDock', () => {
  it('renders primary navigation items and active state', () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <SiteDock />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation', { name: /primary navigation/i });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /adrian medina/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  it('renders external LinkedIn link with security attributes', () => {
    render(
      <MemoryRouter>
        <SiteDock />
      </MemoryRouter>
    );
    const linkedin = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedin).toHaveAttribute('target', '_blank');
    expect(linkedin).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });
});
