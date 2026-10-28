import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CopyEmail } from '../CopyEmail';

describe('CopyEmail', () => {
  it('copies email to clipboard and displays confirmation toast', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    render(<CopyEmail email="medinaadrianpanlilio@gmail.com" />);
    const copyButton = screen.getByRole('button', { name: /copy email/i });
    expect(copyButton).toBeInTheDocument();

    await userEvent.click(copyButton);
    expect(writeTextMock).toHaveBeenCalledWith('medinaadrianpanlilio@gmail.com');
    expect(screen.getByText(/copied to clipboard/i)).toBeInTheDocument();
  });
});
