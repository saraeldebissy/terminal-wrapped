import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FlagSlide } from './FlagSlide';
import { fullStats } from '../test/fixtures';

describe('FlagSlide', () => {
  it('renders the top flag in monospace', () => {
    render(<FlagSlide stats={fullStats} />);
    expect(screen.getByText('-la')).toBeInTheDocument();
  });
});
