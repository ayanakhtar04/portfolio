import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { PortfolioProvider } from './context/PortfolioContext'
// Self-hosted fonts: Latin subset, only the weights the page uses.
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/inter/latin-800.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-700.css'
import './styles/globals.css'
import './styles/motion.css'
import './styles/chrome.css'

// The build ships the page pre-rendered inside #root (scripts/prerender.mjs);
// a fresh render replaces it, and App clears the data-prerendered flag that
// keeps that static copy hidden.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PortfolioProvider>
      <App />
    </PortfolioProvider>
  </React.StrictMode>,
)
