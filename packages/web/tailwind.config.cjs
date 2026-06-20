module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lime: '#C9F23C',
        magenta: '#FF2E93',
        blue: '#2D6DF6',
        violet: '#8B5CF6',
        ink: '#0A0A0A',
        yellow: '#FFD23F',
        coral: '#FF4B2B'
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      }
    }
  },
  plugins: []
};
