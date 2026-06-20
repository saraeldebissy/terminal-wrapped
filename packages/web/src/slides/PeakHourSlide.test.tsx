import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PeakHourSlide } from './PeakHourSlide';
import { fullStats } from '../test/fixtures';

describe('PeakHourSlide', () => {
  it('renders the busiest hour as a 12-hour label', () => {
    render(<PeakHourSlide stats={fullStats} />);
    expect(screen.getByText('2AM')).toBeInTheDocument();
  });
});
