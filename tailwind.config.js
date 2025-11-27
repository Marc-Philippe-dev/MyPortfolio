/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'navy': {
          DEFAULT: '#0a192f',
          dark: '#0a192f',
        },
        'slate': {
          DEFAULT: '#112240',
          light: '#ccd6f6',
          muted: '#8892b0',
        },
        'mint': {
          DEFAULT: '#64ffda',
        },
        'orange': {
          DEFAULT: '#f57c00',
        },
        'white': {
          DEFAULT: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

