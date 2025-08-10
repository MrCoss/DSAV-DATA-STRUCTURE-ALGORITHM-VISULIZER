/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1a1a2e', // Deep navy blue
        primary: '#e94560',     // Vibrant pink/red
        secondary: '#0f3460',   // Darker blue
        surface: '#16213e',     // A slightly lighter navy for cards/surfaces
        text: '#dcdcdc',        // Light grey for text
        highlight: '#53a9ff',   // Bright blue for highlights
        success: '#3ddc97',     // Green for success states
        error: '#ff465d',       // Red for error states
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px 0px rgba(233, 69, 96, 0.6)' },
          '50%': { boxShadow: '0 0 16px 4px rgba(233, 69, 96, 0.8)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      }
    },
  },
  plugins: [],
}
