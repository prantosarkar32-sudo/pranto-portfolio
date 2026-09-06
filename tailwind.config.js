/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
