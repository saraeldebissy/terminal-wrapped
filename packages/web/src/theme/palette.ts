/** Wrapped editorial palette. Each background pairs with a locked AA-contrast text color. */
export const PALETTE = {
  lime:    { bg: '#C9F23C', text: '#0A0A0A' },
  magenta: { bg: '#FF2E93', text: '#FFFFFF' },
  blue:    { bg: '#2D6DF6', text: '#FFFFFF' },
  violet:  { bg: '#8B5CF6', text: '#FFFFFF' },
  ink:     { bg: '#0A0A0A', text: '#FFFFFF' },
} as const;

export type ColorToken = keyof typeof PALETTE;

