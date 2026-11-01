/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        'bg-base': 'var(--bg-base)',
        'bg-surface': 'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-glass': 'var(--bg-glass)',
        'border-subtle': 'var(--border-subtle)',
        'border-focus': 'var(--border-focus)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
        'status-ok': 'var(--status-ok)',
        'status-warn': 'var(--status-warn)',
        'status-err': 'var(--status-err)',
      },
      fontFamily: {
        'mono-code': "'JetBrains Mono', monospace",
      },
      spacing: {
        'space-1': '0.25rem',
        'space-2': '0.5rem',
        'space-3': '0.75rem',
        'space-4': '1rem',
        'space-5': '1.5rem',
        'space-6': '2rem',
        'space-7': '3rem',
        'space-8': '4rem',
      },
    },
  },
  plugins: [],
}
