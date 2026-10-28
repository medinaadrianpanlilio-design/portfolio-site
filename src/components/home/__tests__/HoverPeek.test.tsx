import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HoverPeek } from '../HoverPeek';

describe('HoverPeek', () => {
  it('renders image when active project is provided and visible', () => {
    render(
      <HoverPeek
        activeImage="/images/magilas-landing-800.webp"
        activeTitle="Magilas Gym"
        x={100}
        y={200}
        isVisible={true}
      />
    );
    const img = screen.getByRole('img', { name: /preview of magilas gym/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/magilas-landing-800.webp');
  });

  it('remains hidden when isVisible is false', () => {
    const { container } = render(
      <HoverPeek
        activeImage=""
        activeTitle=""
        x={0}
        y={0}
        isVisible={false}
      />
    );
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});
