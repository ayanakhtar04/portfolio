import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { PortfolioProvider } from './context/PortfolioContext'
import './styles/fonts.css'
import './styles/globals.css'
import './styles/motion.css'
import './styles/chrome.css'

const container = document.getElementById('root')
const app = (
  <React.StrictMode>
    <PortfolioProvider>
      <App />
    </PortfolioProvider>
  </React.StrictMode>
)

// The production build ships the page pre-rendered (scripts/prerender.mjs):
// hydrate it in place, so the intro already on screen is kept. The dev server
// has no pre-rendered copy and renders from scratch.
if (container.hasChildNodes()) ReactDOM.hydrateRoot(container, app)
else ReactDOM.createRoot(container).render(app)
